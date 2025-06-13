const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['marble', 'wood', 'textiles', 'leather', 'brass', 'jewelry', 'other'],
    lowercase: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  touristPrice: {
    type: Number, // Higher price in tourist shops
    required: true,
    min: 0
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  artisan: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    experience: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: 'Agra'
    }
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  weight: {
    type: Number, // in grams
    min: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      default: 'cm'
    }
  },
  materials: [{
    type: String,
    trim: true
  }],
  craftingTime: {
    type: String, // e.g., "2-3 days"
    default: ''
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for search and filtering
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1, isFeatured: -1 });
productSchema.index({ price: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for discount percentage
productSchema.virtual('discountPercent').get(function() {
  if (this.touristPrice > this.price) {
    return Math.round(((this.touristPrice - this.price) / this.touristPrice) * 100);
  }
  return 0;
});

// Virtual for savings amount
productSchema.virtual('savings').get(function() {
  return this.touristPrice - this.price;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Product', productSchema); 