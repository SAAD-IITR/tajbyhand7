import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Truck, CheckCircle, MessageCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { generateWhatsAppURL } from "@/lib/whatsapp";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";
import clsx from "clsx";

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

  // FOMO logic for Jewellery Box
  const isJewelleryBox = /jewell?ery box/i.test(product.name);
  const isLowStock = product.stock <= 5;

  // Simulate 'people viewing' and 'recently purchased'
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 5) + 2);
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(Math.floor(Math.random() * 5) + 2);
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  const isBestseller = product.isFeatured;
  const isMostPopular = product.id % 2 === 0;

  return (
    <motion.div 
      className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-[1.015]"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={`${product.name} - ${product.category.toLowerCase()} by local artisan delivered to hotel`}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/400x300?text=Product+Image";
          }}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isBestseller && (
            <Badge className="bg-primary text-white animate-pulse">Bestseller</Badge>
          )}
          {isMostPopular && (
            <Badge className="bg-accent text-white animate-bounce">Most Popular</Badge>
          )}
        </div>
        {/* FOMO Scarcity Badge for Jewellery Box */}
        {isJewelleryBox && isLowStock && (
          <div className="absolute top-3 right-3 z-20 animate-shake">
            <div className={clsx(
              "bg-gradient-to-r from-[#FF512F] to-[#F09819] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse border-2 border-white",
              "flex items-center gap-1"
            )}>
              <span className="animate-bounce">🔥</span>
              Only {product.stock} left! Selling Fast
            </div>
            <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
              <div className="h-2 bg-red-500 rounded-full animate-pulse" style={{ width: `${100 - product.stock * 15}%` }}></div>
            </div>
          </div>
        )}
        {/* General Scarcity Badge for other low-stock products */}
        {!isJewelleryBox && isLowStock && (
          <div className="absolute top-3 right-3 z-10 animate-shake">
            <div className="bg-[#FF6B6B] text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              Only {product.stock} Left!
            </div>
            <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
              <div className="h-2 bg-orange-500 rounded-full animate-pulse" style={{ width: `${100 - product.stock * 15}%` }}></div>
            </div>
          </div>
        )}
        <div className="absolute top-12 right-3">
          <button 
            onClick={toggleFavorite}
            className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
          </button>
        </div>
        {/* People viewing now */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full animate-fadeIn">
          👀 {viewers} people are viewing this now
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

        {/* Recently purchased */}
        <div className="text-xs text-green-700 mb-1 animate-fadeIn">
          Recently purchased by guests at {hotelName}
        </div>
        {/* Trust Tagline */}
        <p className="text-sm text-[#FB8C00] mb-1 font-normal">
          100% Authentic • Handcrafted by Master Artisan
        </p>
        <h3 className="font-semibold text-secondary mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        {/* Enhanced Price Block */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-[#F44336]">₹{product.price.toLocaleString()}</span>
              <span className="text-sm text-[#999] line-through">₹{originalPrice.toLocaleString()}</span>
            </div>
            <p className="text-sm text-[#2E7D32] font-medium animate-pulse">
              💰 You Save ₹{(originalPrice - product.price).toLocaleString()}
            </p>
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

        <div className="flex flex-col gap-2 mb-2">
          <Button 
            onClick={handleOrderClick}
            disabled={orderMutation.isPending || product.stock === 0}
            className="w-full bg-[#00C853] text-white hover:bg-[#00C853]/90 hover:transform hover:-translate-y-1 transition-all duration-250 hover:shadow-xl rounded-full"
            size="lg"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {orderMutation.isPending ? "Processing..." : "Order Now"}
          </Button>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">No payment until delivery</span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">100% satisfaction</span>
          </div>
        </div>

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
