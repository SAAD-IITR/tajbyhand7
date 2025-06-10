import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ProductCard from "./product-card";
import { Button } from "@/components/ui/button";
import type { Product } from "@shared/schema";

interface ProductGridProps {
  hotelCode: string;
  hotelName: string;
}

export default function ProductGrid({ hotelCode, hotelName }: ProductGridProps) {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    refetchOnWindowFocus: false,
  });

  if (error) {
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
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-secondary mb-4">Authentic Handicrafts Collection</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Each piece is carefully selected from skilled artisans in Agra. All items are available for immediate delivery to your hotel.
          </p>
        </motion.div>

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

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="w-full h-64 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <ProductCard 
                  product={product} 
                  hotelCode={hotelCode} 
                  hotelName={hotelName} 
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Available</h3>
              <p className="text-gray-600">
                Our product catalog is currently being updated. Please check back soon or contact us via WhatsApp for current availability.
              </p>
            </div>
          </div>
        )}

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Button 
            variant="outline" 
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3"
            size="lg"
          >
            View More Handicrafts
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
