# TajbyHand - Deployment Guide

## 🚀 Quick Deploy to Netlify

### Prerequisites

1. GitHub account
2. Netlify account (free)
3. Your code pushed to GitHub

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/tajbyhand.git
git push -u origin main
```

### Step 2: Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click "New site from Git"
3. Choose GitHub and select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
   - **Node version**: `18`

### Step 3: Environment Variables (Optional)

In Netlify dashboard > Site settings > Environment variables:

- `NODE_ENV`: `production`

### Step 4: Custom Domain (Optional)

1. In Netlify dashboard > Domain settings
2. Add your custom domain
3. Configure DNS settings

## 🔧 Local Development

### Setup

```bash
npm install
cd client && npm install
cd ..
npm run dev
```

### Build Test

```bash
npm run build
```

## 📊 Analytics Setup (Optional)

1. Create Google Analytics account
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Replace placeholder in:
   - `client/src/utils/analytics.ts`
   - `client/index.html` (uncomment the script)

## 🛠 Backend API

The frontend is configured to work with a backend API. For production:

1. Deploy backend to Render/Railway/Heroku
2. Update API URL in `client/src/lib/queryClient.ts`
3. Update redirect in `netlify.toml`

## 📱 Features Included

✅ Responsive design
✅ Product catalog
✅ Admin panel
✅ WhatsApp integration
✅ Image upload
✅ Analytics ready
✅ SEO optimized
✅ Trust indicators
✅ FOMO elements

## 🎯 Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Verify WhatsApp links work
- [ ] Test admin panel login
- [ ] Check mobile responsiveness
- [ ] Verify product images display
- [ ] Test contact forms
- [ ] Set up Google Analytics
- [ ] Configure custom domain
- [ ] Test performance (GTmetrix/PageSpeed)

## 🚨 Troubleshooting

### Build Fails

- Check Node.js version (use 18+)
- Verify all dependencies installed
- Check for TypeScript errors

### Images Not Loading

- Ensure images are in `attached_assets/products/`
- Check file permissions
- Verify API endpoints

### API Errors

- Update API URL in production
- Check CORS settings
- Verify environment variables

## 📞 Support

For issues or questions:

- WhatsApp: +91-XXXXXXXXXX
- Email: support@tajbyhand.com

---

**Your website is now live! 🎉**

Share your Netlify URL and start selling your beautiful handcrafted products!
