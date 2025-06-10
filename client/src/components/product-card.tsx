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

interface ProductCardProps {
  product: Product;
  hotelCode: string;
  hotelName: string;
}

export default function ProductCard({ product, hotelCode, hotelName }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();

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
      </div>
    </motion.div>
  );
}
