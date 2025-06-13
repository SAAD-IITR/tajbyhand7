const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

// Import your existing server routes
const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple API routes for deployment
app.get('/api/test', (req, res) => {
  res.json({ message: 'TajByHand API is working!', timestamp: new Date().toISOString() });
});

// Hotels API
app.get('/api/hotels/:code', (req, res) => {
  const { code } = req.params;
  res.json({
    id: 1,
    hotelCode: code,
    hotelName: `Hotel ${code.charAt(0).toUpperCase() + code.slice(1)}`,
    commissionRate: 10,
    qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`
  });
});

app.get('/api/products', (req, res) => {
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
    }
  ]);
});

// Export the serverless function
module.exports.handler = serverless(app); 