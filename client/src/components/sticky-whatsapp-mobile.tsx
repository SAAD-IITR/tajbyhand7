import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { generateWhatsAppURL } from "@/lib/whatsapp";

interface StickyWhatsAppMobileProps {
  hotelName: string;
}

export default function StickyWhatsAppMobile({ hotelName }: StickyWhatsAppMobileProps) {
  const handleClick = () => {
    const whatsappURL = generateWhatsAppURL("general inquiry", hotelName);
    window.open(whatsappURL, '_blank');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-lg">
      <div className="safe-area-inset-bottom">
        <motion.button
          onClick={handleClick}
          className="w-full bg-accent text-white py-4 px-6 font-semibold text-lg shadow-xl flex items-center justify-center space-x-3 hover:bg-accent/90 transition-colors"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 1.5, duration: 0.4 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageCircle className="w-6 h-6" />
          <span>Order via WhatsApp</span>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
        </motion.button>
      </div>
    </div>
  );
}