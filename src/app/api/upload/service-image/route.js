import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireAuth } from '../../../../lib/auth-helpers.js';

export async function POST(request) {
  try {
    await requireAuth();
    
    // Check if BLOB_READ_WRITE_TOKEN is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'BLOB_READ_WRITE_TOKEN is not configured. Please add it to your environment variables. See BLOB_SETUP.md for instructions.',
        },
        { status: 500 }
      );
    }
    
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'Image size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const extension = originalName.split('.').pop() || 'jpg';
    const filename = `services/service_${timestamp}_${originalName}`;

    // Upload to Vercel Blob Storage
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
    });

    // Return the public URL
    return NextResponse.json({
      success: true,
      data: { imageUrl: blob.url },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Provide helpful error message for missing token
    if (error.message?.includes('No token found') || error.message?.includes('token')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Vercel Blob token not configured. Please add BLOB_READ_WRITE_TOKEN to your environment variables. See BLOB_SETUP.md for setup instructions.',
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to upload image',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
