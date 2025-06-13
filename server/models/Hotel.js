const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
  },
  commissionRate: {
    type: Number,
    default: 10,
    min: 0,
    max: 100
  },
  trackingUrl: {
    type: String,
    required: true
  },
  qrCode: {
    type: String, // Base64 encoded QR code
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalCommission: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for fast lookups
hotelSchema.index({ slug: 1 });
hotelSchema.index({ isActive: 1 });

// Virtual for commission amount
hotelSchema.virtual('commissionAmount').get(function() {
  return (this.totalRevenue * this.commissionRate) / 100;
});

// Ensure virtual fields are serialized
hotelSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Hotel', hotelSchema); 