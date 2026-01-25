# Deployment Guide for Salon Management System

## Prerequisites
- MongoDB Atlas account
- Vercel account
- GitHub repository

## Step 1: MongoDB Atlas Setup

### 1.1 Whitelist Vercel IP Addresses

**IMPORTANT:** Vercel uses dynamic IP addresses, so you need to allow all IPs or use MongoDB Atlas Network Access settings.

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Navigate to **Network Access** (under Security)
3. Click **Add IP Address**
4. **Option A (Recommended for Production):**
   - Click **Allow Access from Anywhere**
   - This adds `0.0.0.0/0` to your whitelist
   - ⚠️ **Security Note:** This allows connections from any IP. Make sure your database user has strong credentials.

5. **Option B (More Secure - Advanced):**
   - Vercel doesn't have static IPs, but you can:
     - Use MongoDB Atlas VPC Peering (requires AWS/Azure/GCP)
     - Use MongoDB Atlas Private Endpoints
     - Or temporarily allow all IPs during deployment

### 1.2 Create Database User

1. Go to **Database Access** (under Security)
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Create a strong username and password
5. Set user privileges to **Read and write to any database**
6. Save the credentials - you'll need them for environment variables

### 1.3 Get Connection String

1. Go to **Database** → **Connect**
2. Click **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with your database name (e.g., `salon_db`)

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/salon_db?retryWrites=true&w=majority
```

## Step 2: Vercel Deployment

### 2.1 Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New Project**
3. Import your GitHub repository
4. Select the repository and branch (usually `main`)

### 2.2 Configure Environment Variables

In Vercel project settings, add these environment variables:

#### Required Variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/salon_db?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here-generate-a-random-string

# Optional: WhatsApp Configuration (if using)
OWNER_PHONE=+923001234567
```

#### How to Generate NEXTAUTH_SECRET:

Run this command in your terminal:
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

### 2.3 Configure Build Settings

Vercel should auto-detect Next.js, but verify:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (or `next build`)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install --legacy-peer-deps`

### 2.4 Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Check deployment logs for any errors

## Step 3: Post-Deployment Verification

### 3.1 Test Public Pages
- Visit your homepage: `https://your-domain.vercel.app`
- Check all public pages load correctly
- Verify logo and salon name display

### 3.2 Test Admin Access
- Visit: `https://your-domain.vercel.app/login`
- Login with admin credentials
- Verify dashboard loads

### 3.3 Check API Routes
- Test: `https://your-domain.vercel.app/api/settings/public`
- Should return JSON with salon settings (or fallback values)

## Step 4: Troubleshooting

### Issue: MongoDB Connection Errors

**Symptoms:**
- 500 errors on `/api/settings/public`
- "Could not connect to any servers" errors

**Solutions:**
1. ✅ Verify MongoDB Atlas Network Access allows `0.0.0.0/0`
2. ✅ Check `MONGODB_URI` environment variable is correct
3. ✅ Verify database user credentials are correct
4. ✅ Ensure database user has read/write permissions
5. ✅ Check MongoDB Atlas cluster is running (not paused)

### Issue: Build Failures

**Symptoms:**
- Build fails with module not found errors
- TypeScript errors

**Solutions:**
1. ✅ Ensure all dependencies are in `package.json`
2. ✅ Run `npm install` locally to verify dependencies
3. ✅ Check for TypeScript errors: `npm run build` locally
4. ✅ Verify Node.js version matches (check `package.json` engines)

### Issue: Authentication Not Working

**Symptoms:**
- Login page shows errors
- Can't access admin pages

**Solutions:**
1. ✅ Verify `NEXTAUTH_URL` matches your Vercel domain exactly
2. ✅ Check `NEXTAUTH_SECRET` is set and is a valid string
3. ✅ Ensure database connection works (users table exists)
4. ✅ Check admin user exists in database

## Step 5: Production Best Practices

### 5.1 Security
- ✅ Use strong database passwords
- ✅ Rotate `NEXTAUTH_SECRET` periodically
- ✅ Enable MongoDB Atlas IP whitelisting (if possible with static IPs)
- ✅ Use environment variables for all secrets
- ✅ Enable MongoDB Atlas audit logging

### 5.2 Performance
- ✅ Enable MongoDB Atlas auto-scaling
- ✅ Use Vercel's CDN (automatic)
- ✅ Monitor Vercel analytics
- ✅ Set up error tracking (Sentry, etc.)

### 5.3 Monitoring
- ✅ Set up Vercel deployment notifications
- ✅ Monitor MongoDB Atlas metrics
- ✅ Set up uptime monitoring
- ✅ Configure error alerts

## Step 6: Custom Domain (Optional)

1. In Vercel project settings, go to **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` environment variable to match

## Quick Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Network Access allows `0.0.0.0/0` (or VPC configured)
- [ ] Database user created with read/write permissions
- [ ] Connection string copied and password replaced
- [ ] GitHub repository connected to Vercel
- [ ] Environment variables set in Vercel:
  - [ ] `MONGODB_URI`
  - [ ] `NEXTAUTH_URL`
  - [ ] `NEXTAUTH_SECRET`
- [ ] Build successful
- [ ] Public pages load correctly
- [ ] Admin login works
- [ ] API routes return data

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Verify environment variables
4. Test database connection locally
5. Review error messages in browser console

---

**Note:** The app now includes fallback values, so it will work even if the database is temporarily unavailable. However, you should still configure MongoDB Atlas properly for full functionality.
