const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Hotel = require('../models/Hotel');
const DeviceDetector = require('device-detector-js');
const { auth, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();
const deviceDetector = new DeviceDetector();

// Helper function to generate device fingerprint
const generateFingerprint = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  const ip = req.ip || req.connection.remoteAddress;
  const acceptLanguage = req.headers['accept-language'] || '';
  const acceptEncoding = req.headers['accept-encoding'] || '';
  
  // Simple fingerprint generation (in production, use more sophisticated methods)
  const fingerprint = Buffer.from(`${ip}-${userAgent}-${acceptLanguage}-${acceptEncoding}`)
    .toString('base64')
    .substring(0, 32);
    
  return fingerprint;
};

// Helper function to detect device info
const getDeviceInfo = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  const deviceInfo = deviceDetector.parse(userAgent);
  const ip = req.ip || req.connection.remoteAddress;
  
  return {
    ip,
    userAgent,
    deviceType: deviceInfo.device?.type || 'unknown',
    browser: deviceInfo.client?.name || 'unknown',
    os: deviceInfo.os?.name || 'unknown',
    fingerprint: generateFingerprint(req)
  };
};

// Helper function to generate WhatsApp URL
const generateWhatsAppURL = (product, hotel, customerInfo = {}) => {
  const phoneNumber = process.env.WHATSAPP_NUMBER || '919876543210'; // Your business WhatsApp number
  
  let message = `Hello! I would like to order:\n\n`;
  message += `📦 *${product.name}*\n`;
  message += `💰 Price: ₹${product.price.toLocaleString()}\n`;
  message += `🎨 Category: ${product.category}\n`;
  
  if (hotel) {
    message += `🏨 Hotel: ${hotel.name}\n`;
    message += `📍 Location: ${hotel.location}\n`;
  }
  
  if (customerInfo.roomNumber) {
    message += `🚪 Room: ${customerInfo.roomNumber}\n`;
  }
  
  message += `\n⏰ Please deliver within 30-60 minutes.\n`;
  message += `✅ I confirm this order and will pay cash on delivery.\n\n`;
  message += `Thank you! 🙏`;
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

// @route   POST /api/orders
// @desc    Create a new order (Public - for WhatsApp redirect)
// @access  Public
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { 
      hotelSlug, 
      productId, 
      customer = {},
      analytics = {} 
    } = req.body;

    // Validate required fields
    if (!hotelSlug || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Hotel slug and product ID are required'
      });
    }

    // Get hotel and product information
    const [hotel, product] = await Promise.all([
      Hotel.findOne({ slug: hotelSlug.toLowerCase(), isActive: true }),
      Product.findById(productId)
    ]);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isActive || product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Product is currently unavailable'
      });
    }

    // Get device information for fraud protection
    const deviceInfo = getDeviceInfo(req);

    // Create product snapshot
    const productSnapshot = {
      name: product.name,
      price: product.price,
      category: product.category,
      artisan: product.artisan.name
    };

    // Generate WhatsApp message
    const whatsappMessage = `Order for ${product.name} from ${hotel.name}`;
    
    // Calculate commission
    const commission = {
      rate: hotel.commissionRate,
      amount: (product.price * hotel.commissionRate) / 100
    };

    // Create order
    const order = new Order({
      hotelSlug: hotelSlug.toLowerCase(),
      hotelId: hotel._id,
      productId: product._id,
      productSnapshot,
      customer: {
        name: customer.name || '',
        phone: customer.phone || '',
        roomNumber: customer.roomNumber || '',
        nationality: customer.nationality || ''
      },
      orderValue: product.price,
      commission,
      whatsappMessage,
      deliveryNotes: customer.deliveryNotes || '',
      deviceInfo,
      analytics: {
        source: analytics.source || 'qr_code',
        sessionDuration: analytics.sessionDuration || 0,
        pagesViewed: analytics.pagesViewed || 1,
        previousOrders: analytics.previousOrders || 0
      }
    });

    await order.save();

    // Generate WhatsApp URL
    const whatsappURL = generateWhatsAppURL(product, hotel, customer);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order._id,
        whatsappURL,
        estimatedDelivery: order.estimatedDelivery,
        hotel: {
          name: hotel.name,
          location: hotel.location
        },
        product: {
          name: product.name,
          price: product.price
        }
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
});

// @route   GET /api/orders
// @desc    Get orders with filtering and pagination
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      hotelSlug, 
      startDate, 
      endDate,
      category 
    } = req.query;

    // Build filter object
    let filter = {};

    // Role-based filtering
    if (req.user.role === 'hotel_viewer') {
      const assignedHotelSlugs = req.user.assignedHotels.map(hotel => hotel.slug);
      filter.hotelSlug = { $in: assignedHotelSlugs };
    }

    // Additional filters
    if (status) filter.status = status;
    if (hotelSlug) filter.hotelSlug = hotelSlug.toLowerCase();
    if (category) filter['productSnapshot.category'] = category;

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Execute query with pagination
    const orders = await Order.find(filter)
      .populate('hotelId', 'name location')
      .populate('productId', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('hotelId', 'name location contactPerson')
      .populate('productId', 'name description images artisan');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check permissions for hotel viewers
    if (req.user.role === 'hotel_viewer') {
      const assignedHotelIds = req.user.assignedHotels.map(hotel => hotel._id.toString());
      if (!assignedHotelIds.includes(order.hotelId._id.toString())) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this order'
        });
      }
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
});

// @route   PATCH /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin/Operator)
router.patch('/:id/status', auth, authorize(['admin', 'operator']), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status and timestamp
    order.status = status;
    order.timestamps[status] = new Date();

    // If order is delivered, update hotel revenue
    if (status === 'delivered' && order.status !== 'delivered') {
      await Hotel.findByIdAndUpdate(order.hotelId, {
        $inc: { 
          totalRevenue: order.orderValue,
          totalCommission: order.commission.amount
        }
      });
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
});

// @route   GET /api/orders/stats/summary
// @desc    Get orders summary statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build match filter
    let matchFilter = {};
    
    // Role-based filtering
    if (req.user.role === 'hotel_viewer') {
      const assignedHotelSlugs = req.user.assignedHotels.map(hotel => hotel.slug);
      matchFilter.hotelSlug = { $in: assignedHotelSlugs };
    }

    // Date range filter
    if (startDate || endDate) {
      matchFilter.createdAt = {};
      if (startDate) matchFilter.createdAt.$gte = new Date(startDate);
      if (endDate) matchFilter.createdAt.$lte = new Date(endDate);
    }

    const stats = await Order.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$orderValue' },
          totalCommission: { $sum: '$commission.amount' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          avgOrderValue: { $avg: '$orderValue' },
          topCategories: { $addToSet: '$productSnapshot.category' }
        }
      }
    ]);

    const summary = stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      totalCommission: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
      avgOrderValue: 0,
      topCategories: []
    };

    summary.conversionRate = summary.totalOrders > 0 
      ? ((summary.deliveredOrders / summary.totalOrders) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete order (Admin only)
// @access  Private (Admin)
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting order'
    });
  }
});

module.exports = router; 