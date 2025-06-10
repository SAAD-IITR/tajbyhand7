# TajByHand - Authentic Agra Handicrafts Platform

A MERN stack e-commerce platform connecting tourists with authentic Agra handicrafts through WhatsApp-based ordering and hotel delivery services.

## Features

- **WhatsApp Integration**: Direct ordering through WhatsApp with configurable phone number
- **Hotel Partnership System**: Commission tracking and hotel-specific ordering codes
- **Mobile-First Design**: Sticky ordering button and responsive layout
- **Trust-Building Elements**: Reviews, testimonials, and credibility indicators
- **SEO Optimized**: Tourist-focused content and meta tags
- **Real-time Inventory**: Product management with stock tracking
- **Secure Backend**: PostgreSQL database with proper authentication

## Configuration

### WhatsApp Number Setup

The WhatsApp number is centrally configured and easily replaceable:

1. **Environment Variable** (Recommended for production):
   ```bash
   VITE_WHATSAPP_NUMBER=your_whatsapp_number
   ```

2. **Configuration File**: 
   Edit `client/src/config/constants.ts`:
   ```typescript
   export const APP_CONFIG = {
     WHATSAPP_NUMBER: "your_whatsapp_number",
     // ... other settings
   };
   ```

### Hotel Codes

Hotel partners can access their specific interface using URL parameters:
- `?hotel=taj` - Taj Mahal Palace Hotel
- `?hotel=oberoi` - The Oberoi Amarvilas
- `?hotel=itc` - ITC Mughal Resort & Spa
- `?hotel=trident` - Trident Agra
- `?hotel=radisson` - Radisson Blu Agra
- Default: Pearl Heritage Hotel

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query
- **Authentication**: Passport.js with sessions
- **Styling**: Tailwind CSS with custom design system

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access the application
http://localhost:5000
```

## Database Schema

- **Users**: Admin authentication and management
- **Hotels**: Partner hotel information and commission rates
- **Products**: Handicraft inventory with images and pricing
- **Orders**: Customer orders with WhatsApp integration tracking

## SEO & Performance

- Lazy loading for all images
- Mobile-optimized sticky WhatsApp button
- Smooth scrolling and touch-friendly interfaces
- Tourist-focused keywords and meta descriptions
- Safe area support for modern mobile devices

## Production Deployment

1. Set environment variables:
   ```bash
   DATABASE_URL=your_postgresql_url
   VITE_WHATSAPP_NUMBER=your_whatsapp_number
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Deploy using Replit Deployments or your preferred hosting service

## WhatsApp Integration Testing

The platform generates WhatsApp URLs in the format:
```
https://wa.me/PHONE_NUMBER?text=MESSAGE
```

Messages are automatically encoded and include:
- Product name
- Hotel name
- Professional greeting
- Call-to-action for hotel delivery

## Trust & Conversion Features

- **Reviews**: Authentic tourist reviews with country flags
- **Trust Statement**: "Built by IITians. Trusted by locals. Loved by travelers."
- **Fast Delivery**: 30-60 minute hotel delivery promise
- **No Commission**: Direct artisan pricing bypass tourist markups
- **Mobile UX**: Sticky WhatsApp button with pulse animation

## Support

For technical support or customization requests, contact through the admin panel or modify the WhatsApp number in the configuration files.