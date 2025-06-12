import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ShoppingBag, MessageCircle, IdCard } from "lucide-react";

interface HeroSectionProps {
  hotelName: string;
  hotelCode: string;
}

export default function HeroSection({ hotelName, hotelCode }: HeroSectionProps) {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const message = `Hi, I need help with ordering handicrafts. I'm staying at ${hotelName}.`;
    const phoneNumber = '919876543210';
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <section className="relative bg-gradient-to-br from-primary/10 to-amber-50 py-16 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-10" 
           style={{backgroundImage: 'url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80")'}}>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <MapPin className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-secondary">{hotelName}</span>
              <Badge className="ml-2 bg-accent/20 text-accent">Exclusive</Badge>
            </motion.div>

            <motion.h2 
              className="text-4xl lg:text-6xl font-bold text-secondary mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Authentic Agra{" "}
              <span className="text-primary">Handicrafts</span>
            </motion.h2>

            <motion.p 
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              No showroom tricks. No guide cuts. Just real Agra handicrafts —{" "}
              <strong className="text-secondary">delivered to your hotel.</strong>
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Button 
                onClick={scrollToProducts}
                className="bg-primary text-white px-8 py-4 text-lg hover:bg-primary/90 shadow-lg"
                size="lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Browse Handicrafts
              </Button>
              <Button 
                onClick={openWhatsApp}
                className="bg-accent text-white px-8 py-4 text-lg hover:bg-accent/90 shadow-lg"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat with Expert
              </Button>
            </motion.div>

            {/* Social Proof Section */}
            <motion.div 
              className="text-center mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex items-center justify-center space-x-1 text-[#FFA726]">
                <span className="text-lg">★★★★★</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">500+ satisfied customers</p>
            </motion.div>

            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 italic mb-2">
                    "Got my marble elephant at half the price my guide quoted. Delivered to my room in 45 mins!"
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-secondary">Maria</span>
                    <span className="text-xl">🇪🇸</span>
                    <div className="flex text-yellow-400 text-sm">
                      ⭐⭐⭐⭐⭐
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-3 gap-6 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-gray-600">Authentic Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2-3x</div>
                <div className="text-sm text-gray-600">Cheaper than Tours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">30min</div>
                <div className="text-sm text-gray-600">Hotel Delivery</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://pixabay.com/get/gc8745debbad7a3449b142f6ebe942237e02afee4581a9f5d03a5552573b84dcae1b8cddd69c887c303040e6e0fb5f59920edf7c7f42eb3046c62c599ed98f246_1280.jpg" 
                alt="Handmade marble inlay Taj Mahal replica from Agra delivered to hotel" 
                className="w-full h-auto" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <IdCard className="w-5 h-5 text-primary" />
                  <span className="font-semibold">100% Authentic</span>
                </div>
                <p className="text-sm opacity-90">Handcrafted by local artisans in Agra</p>
              </div>
            </div>
            
            <motion.div 
              className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 max-w-xs"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-secondary">Cash on Delivery</div>
                  <div className="text-sm text-gray-600">No online payment needed</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
