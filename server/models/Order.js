const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  hotelSlug: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productSnapshot: {
    // Store product data at time of order
    name: String,
    price: Number,
    category: String,
    artisan: String
  },
  customer: {
    name: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    roomNumber: {
      type: String,
      trim: true
    },
    nationality: {
      type: String,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'],
    default: 'pending'
  },
  orderValue: {
    type: Number,
    required: true,
    min: 0
  },
  commission: {
    rate: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  whatsappMessage: {
    type: String,
    trim: true
  },
  deliveryNotes: {
    type: String,
    trim: true
  },
  // Device fingerprinting for fraud protection
  deviceInfo: {
    ip: {
      type: String,
      required: true
    },
    userAgent: {
      type: String,
      required: true
    },
    deviceType: {
      type: String, // mobile, tablet, desktop
      default: 'unknown'
    },
    browser: {
      type: String,
      default: 'unknown'
    },
    os: {
      type: String,
      default: 'unknown'
    },
    fingerprint: {
      type: String, // Unique device identifier
      required: true
    }
  },
  location: {
    country: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  // Timestamps for delivery tracking
  timestamps: {
    ordered: {
      type: Date,
      default: Date.now
    },
    confirmed: Date,
    preparing: Date,
    delivering: Date,
    delivered: Date,
    cancelled: Date
  },
  // Analytics data
  analytics: {
    source: {
      type: String, // qr_code, direct_link, referral
      default: 'qr_code'
    },
    sessionDuration: Number, // seconds spent on site before order
    pagesViewed: Number,
    previousOrders: {
      type: Number,
      default: 0
    }
  },
  isTestOrder: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for fast queries
orderSchema.index({ hotelSlug: 1, createdAt: -1 });
orderSchema.index({ hotelId: 1, status: 1 });
orderSchema.index({ productId: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'deviceInfo.fingerprint': 1 });
orderSchema.index({ 'timestamps.ordered': -1 });

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  return Date.now() - this.timestamps.ordered;
});

// Virtual for estimated delivery time
orderSchema.virtual('estimatedDelivery').get(function() {
  if (this.status === 'pending') {
    return new Date(this.timestamps.ordered.getTime() + 30 * 60 * 1000); // 30 minutes
  }
  return null;
});

// Pre-save middleware to calculate commission
orderSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('orderValue') || this.isModified('commission.rate')) {
    this.commission.amount = (this.orderValue * this.commission.rate) / 100;
  }
  next();
});

// Static method to get hotel statistics
orderSchema.statics.getHotelStats = function(hotelSlug, startDate, endDate) {
  const matchFilter = { hotelSlug };
  
  if (startDate || endDate) {
    matchFilter.createdAt = {};
    if (startDate) matchFilter.createdAt.$gte = new Date(startDate);
    if (endDate) matchFilter.createdAt.$lte = new Date(endDate);
  }

  return this.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: '$hotelSlug',
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$orderValue' },
        totalCommission: { $sum: '$commission.amount' },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        },
        avgOrderValue: { $avg: '$orderValue' },
        categories: { $addToSet: '$productSnapshot.category' }
      }
    }
  ]);
};

// Ensure virtual fields are serialized
orderSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Order', orderSchema); 