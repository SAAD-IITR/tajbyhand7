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
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-14 h-14 bg-accent text-white rounded-full shadow-lg hover:bg-accent/90 transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <MessageCircle className="w-6 h-6" />
        
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-16 bg-secondary text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none"
            >
              Need help? Chat with us!
              <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-secondary rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
