import { 
  users, hotels, products, orders,
  type User, type InsertUser,
  type Hotel, type InsertHotel,
  type Product, type InsertProduct,
  type Order, type InsertOrder
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

// Check if DATABASE_URL is available, if not use development database
const isDevelopment = !process.env.DATABASE_URL;

let db: any;
let devDb: any;

if (isDevelopment) {
  console.log("🚀 Using development database (in-memory)");
  // Import dev database
  import("./db-dev").then(module => {
    devDb = module.devDb;
  });
} else {
  // Import real database
  import("./db").then(module => {
    db = module.db;
  });
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Hotel methods
  getAllHotels(): Promise<Hotel[]>;
  getHotelByCode(code: string): Promise<Hotel | undefined>;
  createHotel(hotel: InsertHotel): Promise<Hotel>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Order methods
  getAllOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Reports
  getCommissionReport(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    if (isDevelopment) {
      // Wait for devDb to be loaded
      await this.waitForDevDb();
      const user = await devDb.getUserById(id);
      return user || undefined;
    }
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (isDevelopment) {
      await this.waitForDevDb();
      return devDb.getUserByUsername(username);
    }
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (isDevelopment) {
      await this.waitForDevDb();
      return devDb.createUser(insertUser);
    }
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllHotels(): Promise<Hotel[]> {
    if (isDevelopment) {
      await this.waitForDevDb();
      return devDb.getAllHotels();
    }
    return await db.select().from(hotels).orderBy(hotels.hotelName);
  }

  async getHotelByCode(code: string): Promise<Hotel | undefined> {
    if (isDevelopment) {
      await this.waitForDevDb();
      const hotels = await devDb.getAllHotels();
      return hotels.find((h: any) => h.hotelCode === code) || undefined;
    }
    const [hotel] = await db.select().from(hotels).where(eq(hotels.hotelCode, code));
    return hotel || undefined;
  }

  async createHotel(insertHotel: InsertHotel): Promise<Hotel> {
    if (isDevelopment) {
      await this.waitForDevDb();
      return devDb.createHotel(insertHotel);
    }
    const [hotel] = await db
      .insert(hotels)
      .values(insertHotel)
      .returning();
    return hotel;
  }

  async getAllProducts(): Promise<Product[]> {
    if (isDevelopment) {
      await this.waitForDevDb();
      return devDb.getAllProducts();
    }
    return await db.select().from(products).orderBy(desc(products.isFeatured), products.name);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    if (isDevelopment) {
      await this.waitForDevDb();
      const products = await devDb.getAllProducts();
      return products.find((p: any) => p.id === id) || undefined;
    }
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    if (isDevelopment) {
      await this.waitForDevDb();
      return devDb.createProduct(insertProduct);
    }
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: number, insertProduct: InsertProduct): Promise<Product | undefined> {
    if (isDevelopment) {
      await this.waitForDevDb();
      return devDb.updateProduct(id, insertProduct);
    }
    const [product] = await db
      .update(products)
      .set(insertProduct)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    if (isDevelopment) {
      await this.waitForDevDb();
      return devDb.deleteProduct(id);
    }
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAllOrders(): Promise<Order[]> {
    if (isDevelopment) {
      await this.waitForDevDb();
      return devDb.getAllOrders();
    }
    return await db.select().from(orders).orderBy(desc(orders.timestamp));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    if (isDevelopment) {
      await this.waitForDevDb();
      return devDb.createOrder(insertOrder);
    }
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    if (isDevelopment) {
      await this.waitForDevDb();
      return devDb.updateOrderStatus(id, status);
    }
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }

  async getCommissionReport(): Promise<any[]> {
    if (isDevelopment) {
      await this.waitForDevDb();
      const orders = await devDb.getAllOrders();
      const allHotels = await devDb.getAllHotels();
      const allProducts = await devDb.getAllProducts();
      
      const report = orders.reduce((acc: any, order: any) => {
        if (!acc[order.hotelCode]) {
          const hotel = allHotels.find((h: any) => h.hotelCode === order.hotelCode);
          acc[order.hotelCode] = {
            hotelCode: order.hotelCode,
            hotelName: hotel?.hotelName || order.hotelCode,
            commissionRate: hotel?.commissionRate || 10,
            totalOrders: 0,
            fulfilledOrders: 0,
            totalRevenue: 0,
            commissionAmount: 0,
          };
        }
        
        acc[order.hotelCode].totalOrders++;
        
        if (order.status === 'fulfilled') {
          acc[order.hotelCode].fulfilledOrders++;
          const product = allProducts.find((p: any) => p.id === order.productId);
          if (product) {
            const revenue = product.price;
            const commission = (revenue * acc[order.hotelCode].commissionRate) / 100;
            acc[order.hotelCode].totalRevenue += revenue;
            acc[order.hotelCode].commissionAmount += commission;
          }
        }
        
        return acc;
      }, {});
      
      return Object.values(report);
    }
    
    // For production database, we would need to join orders, products, and hotels
    // For now, return basic order data grouped by hotel
    const orderData = await db.select().from(orders);
    
    const report = orderData.reduce((acc: any, order: any) => {
      if (!acc[order.hotelCode]) {
        acc[order.hotelCode] = {
          hotelCode: order.hotelCode,
          hotelName: order.hotelCode, // Would need to join with hotels table
          commissionRate: 10, // Would need to get from hotels table
          totalOrders: 0,
          fulfilledOrders: 0,
          totalRevenue: 0,
          commissionAmount: 0,
        };
      }
      acc[order.hotelCode].totalOrders++;
      if (order.status === 'fulfilled') {
        acc[order.hotelCode].fulfilledOrders++;
        // Would need to join with products table to get price
        // For now, estimate based on average product price
        const estimatedRevenue = 2000; // Average product price
        const commission = (estimatedRevenue * acc[order.hotelCode].commissionRate) / 100;
        acc[order.hotelCode].totalRevenue += estimatedRevenue;
        acc[order.hotelCode].commissionAmount += commission;
      }
      return acc;
    }, {});
    
    return Object.values(report);
  }

  private async waitForDevDb(): Promise<void> {
    if (!devDb) {
      const module = await import("./db-dev");
      devDb = module.devDb;
    }
  }
}

export const storage = new DatabaseStorage();
