import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const extension = originalName.split('.').pop() || 'png';
    const filename = `logo_${timestamp}.${extension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'logo');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }

    // Save file
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    // Return the public URL path
    const logoUrl = `/uploads/logo/${filename}`;

    return NextResponse.json({
      success: true,
      data: { logoUrl },
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload logo' },
      { status: 500 }
    );
  }
}
