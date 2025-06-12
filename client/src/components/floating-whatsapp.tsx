import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { generateWhatsAppURL } from "@/lib/whatsapp";

interface FloatingWhatsAppProps {
  hotelName: string;
}

export default function FloatingWhatsApp({ hotelName }: FloatingWhatsAppProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    const whatsappURL = generateWhatsAppURL("general inquiry", hotelName);
    window.open(whatsappURL, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Pulse ring animation */}
      <div className="absolute inset-0 w-14 h-14 bg-[#00C853] rounded-full animate-ping opacity-20"></div>
      <div className="absolute inset-1 w-12 h-12 bg-[#00C853] rounded-full animate-pulse opacity-30"></div>
      
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative w-14 h-14 bg-[#00C853] text-white rounded-full shadow-xl hover:bg-[#00C853]/90 transition-all duration-300 flex items-center justify-center group border-2 border-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <MessageCircle className="w-6 h-6" />
        
        {/* Badge indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">!</span>
        </div>
        
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-16 bg-secondary text-white px-4 py-3 rounded-lg text-sm whitespace-nowrap pointer-events-none shadow-lg"
            >
              <div className="font-semibold">Order via WhatsApp</div>
              <div className="text-xs text-gray-300">Free delivery to hotel!</div>
              <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-secondary rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
