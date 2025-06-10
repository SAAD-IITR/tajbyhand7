import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Truck, CheckCircle, MessageCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { generateWhatsAppURL } from "@/lib/whatsapp";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

// Product reviews data for trust building
const productReviews = {
  1: [ // Marble Taj Mahal Replica
    { name: "Sarah M.", flag: "🇺🇸", rating: 5, text: "Perfect souvenir! Delivered to my hotel in 25 minutes. Quality is amazing." },
    { name: "James K.", flag: "🇬🇧", rating: 5, text: "Bought 3 for family. Much better than tourist shop prices. Authentic work." }
  ],
  2: [ // Wooden Elephant Pair
    { name: "Lisa H.", flag: "🇩🇪", rating: 5, text: "Beautiful craftsmanship. Hotel delivery was super convenient." },
    { name: "Mike R.", flag: "🇦🇺", rating: 4, text: "Great quality wood carving. Saved time and money vs market shopping." }
  ],
  3: [ // Pure Pashmina Shawl
    { name: "Anna P.", flag: "🇫🇷", rating: 5, text: "Genuine pashmina! Vendor came to hotel, very professional service." },
    { name: "David L.", flag: "🇨🇦", rating: 5, text: "Soft and warm. Exactly as described. Quick WhatsApp ordering process." }
  ],
  4: [ // Marble Coaster Set
    { name: "Maria S.", flag: "🇪🇸", rating: 4, text: "Beautiful inlay work. Perfect for gifts. Hotel delivery was seamless." }
  ],
  5: [ // Brass Decorative Plate
    { name: "Tom W.", flag: "🇺🇸", rating: 5, text: "Authentic brass work. Much cheaper than tourist areas. Highly recommend." }
  ],
  6: [ // Leather Camel Bag
    { name: "Emma T.", flag: "🇬🇧", rating: 4, text: "Good quality leather. Unique design. WhatsApp ordering made it so easy." }
  ]
};

interface ProductCardProps {
  product: Product;
  hotelCode: string;
  hotelName: string;
}

export default function ProductCard({ product, hotelCode, hotelName }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();

  const getProductReviews = (productId: number) => {
    return productReviews[productId as keyof typeof productReviews] || [];
  };

  const orderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Logged",
        description: "Your order has been recorded. You'll be redirected to WhatsApp.",
      });
    },
    onError: () => {
      toast({
        title: "Order Failed",
        description: "Unable to log order, but you can still proceed with WhatsApp.",
        variant: "destructive",
      });
    },
  });

  const handleOrderClick = () => {
    // Log order to backend
    const orderData = {
      productId: product.id,
      hotelCode,
      status: "pending",
      messageText: `Order request for ${product.name} from ${hotelName}`,
    };
    
    orderMutation.mutate(orderData);
    
    // Generate WhatsApp URL and open
    const whatsappURL = generateWhatsAppURL(product.name, hotelName);
    window.open(whatsappURL, '_blank');
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  // Calculate original price (simulating tourist markup)
  const originalPrice = Math.round(product.price * 2.8);
  const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <motion.div 
      className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={`${product.name} - ${product.category.toLowerCase()} by local artisan delivered to hotel`}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/400x300?text=Product+Image";
          }}
        />
        <div className="absolute top-3 left-3">
          {product.isFeatured && (
            <Badge className="bg-primary text-white">Bestseller</Badge>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <button 
            onClick={toggleFavorite}
            className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-primary">
            {product.category}
          </Badge>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600">4.9 (23)</span>
          </div>
        </div>

        <h3 className="font-semibold text-secondary mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-secondary">₹{product.price.toLocaleString()}</span>
            <span className="text-sm text-gray-400 line-through ml-2">₹{originalPrice.toLocaleString()}</span>
          </div>
          <Badge variant="outline" className="text-accent border-accent">
            {discountPercentage}% off
          </Badge>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Truck className="w-4 h-4" />
            <span>30-60 min delivery</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-accent">
            <CheckCircle className="w-4 h-4" />
            <span>{product.stock} in stock</span>
          </div>
        </div>

        <Button 
          onClick={handleOrderClick}
          disabled={orderMutation.isPending || product.stock === 0}
          className="w-full bg-accent text-white hover:bg-accent/90 transition-colors"
          size="lg"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {orderMutation.isPending ? "Processing..." : "Order via WhatsApp"}
        </Button>

        {/* Product Reviews */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="space-y-3">
            {getProductReviews(product.id).map((review, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm text-secondary">{review.name}</span>
                    <span className="text-lg">{review.flag}</span>
                  </div>
                  <div className="flex text-yellow-400 text-xs">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 italic">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
