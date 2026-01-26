# Vercel Blob Storage Setup Guide

## What is Vercel Blob?

Vercel Blob is a storage service for storing images and files. It's used in this project to store employee and service images.

## Setup Instructions

### Step 1: Create a Vercel Blob Store

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project (or create one if you haven't)
3. Go to **Storage** tab
4. Click **Create Database/Store**
5. Select **Blob** from the options
6. Give it a name (e.g., "salon-images")
7. Click **Create**

### Step 2: Get Your Token

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Look for `BLOB_READ_WRITE_TOKEN` or create it:
   - Click **Add New**
   - Name: `BLOB_READ_WRITE_TOKEN`
   - Value: Copy the token from your Blob store settings
   - Environment: Select all (Production, Preview, Development)

### Step 3: Add to Local Environment

Add the token to your `.env.local` file:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 4: Restart Your Dev Server

After adding the token, restart your development server:

```bash
npm run dev
```

## Alternative: Use Local File Storage (Development Only)

If you don't want to use Vercel Blob for local development, you can modify the upload endpoints to save files locally. However, this won't work in production on Vercel.

## Troubleshooting

- **Error: "No token found"** → Make sure `BLOB_READ_WRITE_TOKEN` is set in your `.env.local` file
- **Error: "Invalid token"** → Verify the token is correct and hasn't expired
- **Images not uploading** → Check that the token has read/write permissions

## For Production

When deploying to Vercel:
1. The environment variable will automatically be available if you set it in the Vercel dashboard
2. Make sure to add it to all environments (Production, Preview, Development)
