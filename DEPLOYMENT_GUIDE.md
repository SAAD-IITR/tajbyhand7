# TajByHand Deployment Guide 🚀

Your TajByHand hotel onboarding system is ready for deployment! Follow this guide to deploy to **Vercel** (recommended).

## 🌟 What You're Deploying

A complete hotel onboarding and commission tracking system with:

- ✅ Dynamic hotel onboarding (unlimited hotels)
- ✅ QR code generation for each hotel
- ✅ Commission tracking and reporting
- ✅ Admin panel for management
- ✅ WhatsApp integration for orders
- ✅ Device fingerprinting for fraud protection

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Prepare Your Repository

1. **Commit all changes** to Git:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy on Vercel

1. **Go to** [Vercel.com](https://vercel.com)
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your repository** (TajbyHand)
5. **Configure deployment settings:**

**Root Directory:** Leave empty (uses root)
**Framework Preset:** Other
**Build Command:** `npm run vercel-build`
**Output Directory:** `client/dist`
**Install Command:** `npm install`

### Step 3: Set Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

```env
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-key-min-32-chars
WHATSAPP_NUMBER=919876543210
FRONTEND_URL=https://your-app-name.vercel.app
BASE_URL=https://your-app-name.vercel.app
ADMIN_EMAIL=admin@tajbyhand.com
ADMIN_PASSWORD=SecurePassword123!
```

### Step 4: Deploy!

1. **Click "Deploy"**
2. **Wait for build** (2-3 minutes)
3. **Your app will be live** at `https://your-app-name.vercel.app`

## 🔧 Database Options

### Option 1: Keep In-Memory Database (Quick Start)

- Perfect for testing and demos
- Data resets on each deployment
- No additional setup needed

### Option 2: MongoDB Cloud (Production)

1. **Create account** at [MongoDB Atlas](https://cloud.mongodb.com)
2. **Create cluster** (free tier available)
3. **Get connection string**
4. **Add to environment variables:**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tajbyhand
```

### Option 3: PostgreSQL (Alternative)

1. **Create account** at [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com)
2. **Get connection string**
3. **Add to environment variables:**

```env
DATABASE_URL=postgresql://username:password@hostname:port/database
```

## 🧪 Test Your Deployment

Once deployed, test these features:

### 1. **Hotel Onboarding**

- Go to `/admin` → Login → Create Hotel
- Generate QR codes
- Test hotel-specific URLs: `?hotel=hotel-slug`

### 2. **Order System**

- Visit hotel-specific URL
- Add products to cart
- Test WhatsApp ordering

### 3. **Commission Tracking**

- Admin panel → Reports
- View hotel commissions
- Download commission reports

## 🎯 Admin Access

- **URL:** `https://your-app.vercel.app/admin`
- **Email:** `admin@tajbyhand.com`
- **Password:** `SecurePassword123!` (change this!)

## 🔄 Continuous Deployment

Once connected to Vercel:

- **Every push** to main branch automatically deploys
- **No manual work** needed
- **Instant updates** live in minutes

## 🌐 Custom Domain (Optional)

1. **Go to** Vercel dashboard → Domains
2. **Add your domain** (e.g., tajbyhand.com)
3. **Update DNS** settings as instructed
4. **SSL certificate** automatically provided

## 🛡️ Security Features Already Included

- ✅ **JWT Authentication**
- ✅ **Password Hashing** (bcrypt)
- ✅ **CORS Protection**
- ✅ **Device Fingerprinting**
- ✅ **Input Validation** (Zod)
- ✅ **SQL Injection Protection**

## 📊 Performance Features

- ✅ **Code Splitting** (Vite)
- ✅ **Asset Optimization**
- ✅ **Caching Headers**
- ✅ **CDN Distribution** (Vercel Edge)
- ✅ **Serverless Functions**

## 🆘 Troubleshooting

### Build Fails?

1. Check Node.js version (18.x required)
2. Verify all dependencies installed
3. Check build logs in Vercel dashboard

### API Not Working?

1. Check environment variables
2. Verify serverless function configuration
3. Check function logs in Vercel

### Database Issues?

1. Verify connection string
2. Check database permissions
3. Ensure IP whitelist (for MongoDB Atlas)

## 📞 Support

Your TajByHand system is production-ready with:

- **Hotel Management:** ✅ Working
- **QR Generation:** ✅ Working
- **Commission Tracking:** ✅ Working
- **WhatsApp Integration:** ✅ Working
- **Admin Panel:** ✅ Working

**Deploy now and start onboarding hotels immediately!** 🎉

---

### Quick Deploy Command:

```bash
# Commit and push
git add . && git commit -m "Deploy TajByHand" && git push

# Then deploy on Vercel.com
```

Your live URL will be: `https://your-app-name.vercel.app` 🌟
