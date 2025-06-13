const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

// Import your existing server routes
const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Mock data storage (in production, this would be a database)
let products = [
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
];

let hotels = [
  {
    id: 1,
    hotelCode: 'pearl',
    hotelName: 'Hotel Pearl Plaza',
    commissionRate: 15,
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  },
  {
    id: 2,
    hotelCode: 'grand',
    hotelName: 'Grand Hotel Agra',
    commissionRate: 12,
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  },
  {
    id: 3,
    hotelCode: 'plaza',
    hotelName: 'Plaza Inn Agra',
    commissionRate: 10,
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  }
];

let orders = [];
let nextProductId = 5;
let nextHotelId = 4;

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'TajByHand API is working!', timestamp: new Date().toISOString() });
});

// Auth endpoints
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple authentication (use proper auth in production)
  if (username === 'admin' && password === 'tajbyhand2024') {
    res.json({
      token: 'mock-jwt-token',
      user: { id: 1, username: 'admin', role: 'admin' }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Hotels API - Fixed path handling for Netlify
app.get('/hotels/:code', (req, res) => {
  const { code } = req.params;
  console.log('Hotel request for code:', code);
  
  const hotel = hotels.find(h => h.hotelCode.toLowerCase() === code.toLowerCase());
  
  if (!hotel) {
    return res.status(404).json({ 
      error: 'Hotel not found',
      message: `Hotel with code '${code}' not found`,
      availableCodes: hotels.map(h => h.hotelCode)
    });
  }
  
  res.json(hotel);
});

// Hotels management
app.get('/hotels', (req, res) => {
  res.json(hotels);
});

app.post('/hotels', (req, res) => {
  const { hotelName, hotelCode, commissionRate } = req.body;
  
  const newHotel = {
    id: nextHotelId++,
    hotelCode: hotelCode.toLowerCase(),
    hotelName,
    commissionRate: parseFloat(commissionRate),
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    createdAt: new Date().toISOString()
  };
  
  hotels.push(newHotel);
  res.status(201).json(newHotel);
});

// Products API
app.get('/products', (req, res) => {
  res.json(products);
});

app.post('/products', (req, res) => {
  const { name, description, price, category, image } = req.body;
  
  const newProduct = {
    id: nextProductId++,
    name,
    description,
    price: parseFloat(price),
    category,
    image: image || "/api/placeholder/300/300",
    createdAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, price, category, image } = req.body;
  
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  products[productIndex] = {
    ...products[productIndex],
    name,
    description,
    price: parseFloat(price),
    category,
    image: image || products[productIndex].image,
    updatedAt: new Date().toISOString()
  };
  
  res.json(products[productIndex]);
});

app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  products.splice(productIndex, 1);
  res.status(204).send();
});

// Orders API
app.get('/orders', (req, res) => {
  res.json(orders);
});

app.post('/orders', (req, res) => {
  const { productId, hotelCode, customerName, customerPhone, quantity } = req.body;
  
  const product = products.find(p => p.id === parseInt(productId));
  const hotel = hotels.find(h => h.hotelCode === hotelCode);
  
  if (!product || !hotel) {
    return res.status(400).json({ error: 'Invalid product or hotel' });
  }
  
  const newOrder = {
    id: orders.length + 1,
    productId: parseInt(productId),
    productName: product.name,
    hotelCode,
    hotelName: hotel.hotelName,
    customerName,
    customerPhone,
    quantity: parseInt(quantity),
    totalAmount: product.price * parseInt(quantity),
    commission: (product.price * parseInt(quantity) * hotel.commissionRate) / 100,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'TajByHand API Server',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: ['/test', '/hotels/:code', '/products', '/auth/login', '/orders']
  });
});

// Export the serverless function
module.exports.handler = serverless(app); 