export function generateWhatsAppURL(productName: string, hotelName: string): string {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '7417994386';
  
  let message: string;
  
  if (productName === "general inquiry") {
    message = `Hi, I need help with ordering handicrafts. I'm staying at ${hotelName}.`;
  } else {
    message = `Hi, I'd like to order the ${productName}. I'm staying at ${hotelName}.`;
  }
  
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function generateSupportWhatsAppURL(hotelName: string): string {
  return generateWhatsAppURL("general inquiry", hotelName);
}
