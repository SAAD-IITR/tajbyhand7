// Central configuration for the application
export const APP_CONFIG = {
  // WhatsApp configuration - easily replaceable
  WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER || "7417994386",
  
  // Business information
  BUSINESS_NAME: "TajByHand",
  BUSINESS_TAGLINE: "Authentic Agra Handicrafts",
  
  // Delivery settings
  DELIVERY_TIME_MIN: 30,
  DELIVERY_TIME_MAX: 60,
  
  // Trust indicators
  TRUST_STATEMENT: "Built by IITians. Trusted by locals. Loved by travelers.",
  
  // SEO meta information
  META_TITLE: "TajByHand - Authentic Agra Handicrafts | Skip Tourist Scams, Order Real Art",
  META_DESCRIPTION: "Skip tourist scams in Agra. Order real marble inlay, woodwork, and textiles directly from artisans — delivered to your hotel in 30 minutes. No guide commissions.",
};

// Image optimization settings
export const IMAGE_CONFIG = {
  LAZY_LOADING: true,
  PLACEHOLDER_URL: "https://via.placeholder.com/400x300?text=Loading...",
  ERROR_URL: "https://via.placeholder.com/400x300?text=Product+Image",
};

// Animation settings
export const ANIMATION_CONFIG = {
  FADE_DURATION: 0.6,
  SLIDE_DURATION: 0.8,
  HOVER_SCALE: 1.05,
  BUTTON_PULSE_DELAY: 1.5,
};