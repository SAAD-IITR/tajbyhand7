import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ShoppingBag, MessageCircle, IdCard } from "lucide-react";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  hotelName: string;
}

export default function HeroSection({ hotelName }: HeroSectionProps) {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const message = `Hi, I need help with ordering handicrafts. I'm staying at ${hotelName}.`;
    const phoneNumber = '919876543210';
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  // Countdown timer for 'Today Only' offer
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    // Set timer to midnight
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);
    setTimer(Math.floor((midnight.getTime() - now.getTime()) / 1000));
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const hours = Math.floor(timer / 3600);
  const minutes = Math.floor((timer % 3600) / 60);
  const seconds = timer % 60;

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
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
              <span className="inline-flex items-center bg-green-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow animate-pulse">
                🎁 Today Only: Free Hotel Delivery
              </span>
              <span className="inline-flex items-center bg-black/80 text-white text-xs font-mono px-3 py-1 rounded-full">
                ⏰ Ends in {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="text-sm text-accent font-semibold mb-4">Trusted by 10+ Agra hotels</div>

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
                className="px-8 py-4 text-lg hover:bg-[#f48115]/90 hover:transform hover:-translate-y-1 transition-all duration-250 hover:shadow-xl rounded-full bg-[#f48115] text-[#ffffff]"
                size="lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Browse Handicrafts
              </Button>
              <Button 
                onClick={openWhatsApp}
                className="bg-accent text-white px-8 py-4 text-lg hover:bg-accent/90 hover:transform hover:-translate-y-1 transition-all duration-250 hover:shadow-xl rounded-full"
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
                src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=900&q=80" 
                alt="Taj Mahal in Agra, India" 
                className="w-full h-auto" 
                loading="lazy"
                style={{ filter: 'contrast(1.08) brightness(1.08)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
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
