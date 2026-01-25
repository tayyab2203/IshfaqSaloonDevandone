import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireAuth } from '../../../../lib/auth-helpers.js';

export async function POST(request) {
  try {
    await requireAuth();
    
    const formData = await request.formData();
    const file = formData.get('logo');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No logo file provided' },
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
    const extension = originalName.split('.').pop() || 'png';
    const filename = `logo/logo_${timestamp}.${extension}`;

    // Upload to Vercel Blob Storage
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
    });

    // Return the public URL
    return NextResponse.json({
      success: true,
      data: { logoUrl: blob.url },
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to upload logo',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
