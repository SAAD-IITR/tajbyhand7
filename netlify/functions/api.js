const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

// Import your existing server routes
const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'TajByHand API is working!', timestamp: new Date().toISOString() });
});

// Hotels API - Fixed path handling for Netlify
app.get('/hotels/:code', (req, res) => {
  const { code } = req.params;
  console.log('Hotel request for code:', code);
  
  // Mock hotel data - in production this would come from database
  const hotels = {
    'pearl': {
      id: 1,
      hotelCode: 'pearl',
      hotelName: 'Hotel Pearl Plaza',
      commissionRate: 15,
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    },
    'grand': {
      id: 2,
      hotelCode: 'grand',
      hotelName: 'Grand Hotel Agra',
      commissionRate: 12,
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    },
    'plaza': {
      id: 3,
      hotelCode: 'plaza',
      hotelName: 'Plaza Inn Agra',
      commissionRate: 10,
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    }
  };

  const hotel = hotels[code.toLowerCase()];
  
  if (!hotel) {
    return res.status(404).json({ 
      error: 'Hotel not found',
      message: `Hotel with code '${code}' not found`,
      availableCodes: Object.keys(hotels)
    });
  }
  
  res.json(hotel);
});

// Products API
app.get('/products', (req, res) => {
  res.json([
    {
      id: 1,
      name: "Marble Taj Mahal Replica",
      description: "Beautiful handcrafted marble replica of the Taj Mahal",
      price: 2500,
      image: "/api/placeholder/300/300",
      category: "Marble Crafts"
    },
    {
      id: 2,
      name: "Leather Handicraft",
      description: "Traditional Agra leather work",
      price: 1200,
      image: "/api/placeholder/300/300",
      category: "Leather Goods"
    },
    {
      id: 3,
      name: "Inlay Work Box",
      description: "Intricate marble inlay jewelry box",
      price: 800,
      image: "/api/placeholder/300/300",
      category: "Marble Crafts"
    },
    {
      id: 4,
      name: "Brass Handicraft",
      description: "Traditional brass decorative items",
      price: 650,
      image: "/api/placeholder/300/300",
      category: "Brass Work"
    }
  ]);
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'TajByHand API Server',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: ['/test', '/hotels/:code', '/products']
  });
});

// Export the serverless function
module.exports.handler = serverless(app); 