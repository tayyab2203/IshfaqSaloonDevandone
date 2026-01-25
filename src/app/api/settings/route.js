import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Settings from '../../../models/Settings.js';
import { requireAuth } from '../../../lib/auth-helpers.js';

export async function GET() {
  try {
    await requireAuth();
    await connectDB();
    
    const settings = await Settings.getSettings();
    
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await requireAuth();
    await connectDB();
    const body = await request.json();

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(body);
    } else {
      Object.assign(settings, body);
    }
    
    await settings.save();
    
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
