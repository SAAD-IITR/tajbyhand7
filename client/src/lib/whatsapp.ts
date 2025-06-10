import { APP_CONFIG } from "@/config/constants";

export function generateWhatsAppURL(productName: string, hotelName: string): string {
  let message: string;
  
  if (productName === "general inquiry") {
    message = `Hi, I need help with ordering handicrafts. I'm staying at ${hotelName}.`;
  } else {
    message = `Hi, I'd like to order the ${productName}. I'm staying at ${hotelName}.`;
  }
  
  return `https://wa.me/${APP_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateSupportWhatsAppURL(hotelName: string): string {
  return generateWhatsAppURL("general inquiry", hotelName);
}
