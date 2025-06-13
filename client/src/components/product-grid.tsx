import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ProductCard from "./product-card";
import { Button } from "@/components/ui/button";
import type { Product } from "@shared/schema";
import { mockProducts } from "@/lib/mock-data";

interface ProductGridProps {
  hotelCode: string;
  hotelName: string;
}

export default function ProductGrid({ hotelCode, hotelName }: ProductGridProps) {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Use mock data if API fails or in development
  const displayProducts = products || mockProducts;

  if (error && !displayProducts.length) {
    return (
      <section id="products" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Unable to Load Products</h2>
            <p className="text-red-600">
              We're experiencing technical difficulties loading our product catalog. 
              Please try refreshing the page or contact us via WhatsApp for immediate assistance.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Handcrafted Treasures
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Authentic Agra handicrafts delivered directly to your hotel room. 
            Each piece tells a story of traditional craftsmanship.
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gray-100 rounded-lg p-1 flex space-x-1">
            <button className="px-6 py-2 rounded-md bg-white text-secondary font-medium shadow-sm">
              All Items
            </button>
            <button className="px-6 py-2 rounded-md text-gray-600 hover:text-secondary transition-colors">
              Marble Work
            </button>
            <button className="px-6 py-2 rounded-md text-gray-600 hover:text-secondary transition-colors">
              Wood Carvings
            </button>
            <button className="px-6 py-2 rounded-md text-gray-600 hover:text-secondary transition-colors">
              Textiles
            </button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard 
                  product={product} 
                  hotelCode={hotelCode}
                  hotelName={hotelName}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button 
            size="lg" 
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3"
            onClick={() => {
              const whatsappUrl = `https://wa.me/919876543210?text=Hi! I'm interested in your handcrafted products. I'm staying at ${hotelName}. Can you show me more items?`;
              window.open(whatsappUrl, '_blank');
            }}
          >
            View More Products on WhatsApp
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
