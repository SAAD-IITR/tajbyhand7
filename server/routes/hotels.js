const express = require('express');
const QRCode = require('qrcode');
const Hotel = require('../models/Hotel');
const Order = require('../models/Order');
const { auth, authorize } = require('../middleware/auth');
const DeviceDetector = require('device-detector-js');

const router = express.Router();

// @route   POST /api/hotels
// @desc    Create a new hotel (Admin only)
// @access  Private (Admin)
router.post('/', auth, authorize(['admin']), async (req, res) => {
  try {
    const { name, slug, location, contactPerson, commissionRate } = req.body;

    // Check if hotel slug already exists
    const existingHotel = await Hotel.findOne({ slug: slug.toLowerCase() });
    if (existingHotel) {
      return res.status(400).json({ 
        success: false, 
        message: 'Hotel with this slug already exists' 
      });
    }

    // Generate tracking URL
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
    const trackingUrl = `${baseUrl}/?hotel=${slug.toLowerCase()}`;

    // Generate QR Code as base64 string
    const qrCodeData = await QRCode.toDataURL(trackingUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    });

    // Create hotel
    const hotel = new Hotel({
      name: name.trim(),
      slug: slug.toLowerCase().trim(),
      location: location.trim(),
      contactPerson: {
        name: contactPerson.name.trim(),
        phone: contactPerson.phone.trim(),
        email: contactPerson.email.toLowerCase().trim()
      },
      commissionRate: commissionRate || 10,
      trackingUrl,
      qrCode: qrCodeData
    });

    await hotel.save();

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: hotel
    });

  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating hotel' 
    });
  }
});

// @route   GET /api/hotels
// @desc    Get all hotels (Admin/Operator) or assigned hotels (Hotel Viewer)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let hotels;

    if (req.user.role === 'admin' || req.user.role === 'operator') {
      // Admin and operators can see all hotels
      hotels = await Hotel.find({ isActive: true })
        .sort({ createdAt: -1 })
        .select('-qrCode'); // Don't send QR code in list view
    } else if (req.user.role === 'hotel_viewer') {
      // Hotel viewers can only see assigned hotels
      hotels = await Hotel.find({ 
        _id: { $in: req.user.assignedHotels },
        isActive: true 
      })
        .sort({ createdAt: -1 })
        .select('-qrCode');
    } else {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    res.json({
      success: true,
      count: hotels.length,
      data: hotels
    });

  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching hotels' 
    });
  }
});

// @route   GET /api/hotels/:slug
// @desc    Get hotel by slug (Public for website personalization)
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ 
      slug: req.params.slug.toLowerCase(),
      isActive: true 
    }).select('-qrCode');

    if (!hotel) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hotel not found' 
      });
    }

    res.json({
      success: true,
      data: hotel
    });

  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching hotel' 
    });
  }
});

// @route   GET /api/hotels/:slug/qr
// @desc    Get hotel QR code (Admin only)
// @access  Private (Admin)
router.get('/:slug/qr', auth, authorize(['admin']), async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ 
      slug: req.params.slug.toLowerCase(),
      isActive: true 
    });

    if (!hotel) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hotel not found' 
      });
    }

    res.json({
      success: true,
      data: {
        qrCode: hotel.qrCode,
        trackingUrl: hotel.trackingUrl,
        hotel: {
          name: hotel.name,
          slug: hotel.slug
        }
      }
    });

  } catch (error) {
    console.error('Get hotel QR error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching QR code' 
    });
  }
});

// @route   PUT /api/hotels/:slug
// @desc    Update hotel (Admin only)
// @access  Private (Admin)
router.put('/:slug', auth, authorize(['admin']), async (req, res) => {
  try {
    const { name, location, contactPerson, commissionRate, isActive } = req.body;

    const hotel = await Hotel.findOne({ slug: req.params.slug.toLowerCase() });
    if (!hotel) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hotel not found' 
      });
    }

    // Update fields
    if (name) hotel.name = name.trim();
    if (location) hotel.location = location.trim();
    if (contactPerson) {
      if (contactPerson.name) hotel.contactPerson.name = contactPerson.name.trim();
      if (contactPerson.phone) hotel.contactPerson.phone = contactPerson.phone.trim();
      if (contactPerson.email) hotel.contactPerson.email = contactPerson.email.toLowerCase().trim();
    }
    if (commissionRate !== undefined) hotel.commissionRate = commissionRate;
    if (isActive !== undefined) hotel.isActive = isActive;

    await hotel.save();

    res.json({
      success: true,
      message: 'Hotel updated successfully',
      data: hotel
    });

  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating hotel' 
    });
  }
});

// @route   GET /api/hotels/:slug/stats
// @desc    Get hotel statistics (Orders, Revenue, Commission)
// @access  Private
router.get('/:slug/stats', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const hotelSlug = req.params.slug.toLowerCase();

    // Check permissions
    if (req.user.role === 'hotel_viewer') {
      const hotel = await Hotel.findOne({ slug: hotelSlug });
      if (!hotel || !req.user.assignedHotels.includes(hotel._id)) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied to this hotel' 
        });
      }
    }

    // Get hotel statistics
    const stats = await Order.getHotelStats(hotelSlug, startDate, endDate);
    
    if (stats.length === 0) {
      return res.json({
        success: true,
        data: {
          hotelSlug,
          totalOrders: 0,
          totalRevenue: 0,
          totalCommission: 0,
          deliveredOrders: 0,
          avgOrderValue: 0,
          conversionRate: 0,
          categories: []
        }
      });
    }

    const hotelStats = stats[0];
    hotelStats.conversionRate = hotelStats.totalOrders > 0 
      ? ((hotelStats.deliveredOrders / hotelStats.totalOrders) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: hotelStats
    });

  } catch (error) {
    console.error('Get hotel stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching statistics' 
    });
  }
});

// @route   DELETE /api/hotels/:slug
// @desc    Soft delete hotel (Admin only)
// @access  Private (Admin)
router.delete('/:slug', auth, authorize(['admin']), async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ slug: req.params.slug.toLowerCase() });
    if (!hotel) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hotel not found' 
      });
    }

    hotel.isActive = false;
    await hotel.save();

    res.json({
      success: true,
      message: 'Hotel deactivated successfully'
    });

  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deactivating hotel' 
    });
  }
});

module.exports = router; 