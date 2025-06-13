import type { Product } from "@shared/schema";

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Marble Taj Mahal Replica",
    description: "Exquisite handcrafted marble replica of the iconic Taj Mahal. Perfect souvenir featuring intricate inlay work and authentic Agra craftsmanship.",
    price: 2500,
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=400&fit=crop",
    category: "Marble",
    stock: 3,
    isFeatured: true,
    createdAt: new Date()
  },
  {
    id: 2,
    name: "Wooden Elephant Pair",
    description: "Beautiful hand-carved wooden elephant pair symbolizing good luck and prosperity. Made from premium rosewood with intricate detailing.",
    price: 1800,
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    category: "Wood",
    stock: 5,
    isFeatured: true,
    createdAt: new Date()
  },
  {
    id: 3,
    name: "Pure Pashmina Shawl",
    description: "Authentic Kashmiri pashmina shawl with traditional embroidery. Soft, warm, and luxurious - perfect for any occasion.",
    price: 3200,
    imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop",
    category: "Textile",
    stock: 2,
    isFeatured: true,
    createdAt: new Date()
  },
  {
    id: 4,
    name: "Marble Coaster Set",
    description: "Set of 6 marble coasters with beautiful inlay work. Functional art pieces that protect your furniture while adding elegance.",
    price: 1200,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    category: "Marble",
    stock: 8,
    isFeatured: false,
    createdAt: new Date()
  },
  {
    id: 5,
    name: "Brass Decorative Plate",
    description: "Ornate brass plate with traditional Mughal patterns. Perfect for decoration or serving special occasions.",
    price: 1500,
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop",
    category: "Brass",
    stock: 6,
    isFeatured: false,
    createdAt: new Date()
  },
  {
    id: 6,
    name: "Leather Camel Bag",
    description: "Handcrafted leather bag with traditional camel motifs. Spacious and durable, perfect for travel or daily use.",
    price: 2200,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "Leather",
    stock: 4,
    isFeatured: false,
    createdAt: new Date()
  }
]; 