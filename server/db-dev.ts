// Development database - In-memory storage
import * as schema from "@shared/schema";

// Mock data for development
const mockProducts = [
  {
    id: 1,
    name: "Marble Taj Mahal Replica",
    description: "Handcrafted white marble replica of the Taj Mahal with intricate inlay work",
    price: 2500,
    imageUrl: "/api/placeholder/300/300",
    category: "Marble",
    stock: 10,
    isFeatured: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Wooden Elephant Sculpture",
    description: "Beautifully carved wooden elephant with traditional designs",
    price: 1200,
    imageUrl: "/api/placeholder/300/300",
    category: "Wood",
    stock: 15,
    isFeatured: true,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Marble Jewelry Box",
    description: "Elegant marble jewelry box with floral inlay patterns",
    price: 800,
    imageUrl: "/api/placeholder/300/300",
    category: "Marble",
    stock: 20,
    isFeatured: false,
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "Wooden Chess Set",
    description: "Hand-carved wooden chess set with Mughal-inspired pieces",
    price: 1500,
    imageUrl: "/api/placeholder/300/300",
    category: "Wood",
    stock: 8,
    isFeatured: true,
    createdAt: new Date(),
  },
];

const mockUsers = [
  {
    id: 1,
    username: "admin",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
    createdAt: new Date(),
  }
];

const mockHotels = [
  {
    id: 1,
    hotelCode: "pearl",
    hotelName: "Pearl Heritage Hotel",
    commissionRate: "10.00",
    createdAt: new Date(),
  },
  {
    id: 2,
    hotelCode: "taj",
    hotelName: "Taj Hotel & Convention Centre",
    commissionRate: "12.00",
    createdAt: new Date(),
  },
  {
    id: 3,
    hotelCode: "oberoi",
    hotelName: "The Oberoi Amarvilas",
    commissionRate: "15.00",
    createdAt: new Date(),
  },
];

let mockOrders: any[] = [];
let nextOrderId = 1;

// Mock database operations
export const devDb = {
  // Products
  getAllProducts: async () => mockProducts,
  createProduct: async (data: any) => {
    const newProduct = { 
      ...data, 
      id: Math.max(...mockProducts.map(p => p.id)) + 1,
      createdAt: new Date()
    };
    mockProducts.push(newProduct);
    return newProduct;
  },
  updateProduct: async (id: number, data: any) => {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return null;
    mockProducts[index] = { ...mockProducts[index], ...data };
    return mockProducts[index];
  },
  deleteProduct: async (id: number) => {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return false;
    mockProducts.splice(index, 1);
    return true;
  },

  // Users  
  getUserById: async (id: number) => {
    return mockUsers.find(u => u.id === id) || null;
  },
  getUserByUsername: async (username: string) => {
    return mockUsers.find(u => u.username === username) || null;
  },
  createUser: async (data: any) => {
    const newUser = {
      ...data,
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
      createdAt: new Date()
    };
    mockUsers.push(newUser);
    return newUser;
  },

  // Orders
  createOrder: async (data: any) => {
    const newOrder = {
      ...data,
      id: nextOrderId++,
      timestamp: new Date()
    };
    mockOrders.push(newOrder);
    return newOrder;
  },
  getAllOrders: async () => mockOrders,
  updateOrderStatus: async (id: number, status: string) => {
    const order = mockOrders.find(o => o.id === id);
    if (!order) return null;
    order.status = status;
    return order;
  },

  // Hotels
  getAllHotels: async () => mockHotels,
  createHotel: async (data: any) => {
    const newHotel = {
      ...data,
      id: Math.max(...mockHotels.map(h => h.id)) + 1,
      createdAt: new Date()
    };
    mockHotels.push(newHotel);
    return newHotel;
  }
}; 