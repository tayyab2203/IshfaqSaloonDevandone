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

    // Validate working hours if they are being updated
    if (body.openingTime !== undefined || body.closingTime !== undefined) {
      const openingTime = body.openingTime;
      const closingTime = body.closingTime;
      
      if (openingTime && closingTime) {
        // Parse times to minutes for comparison
        const [startHour, startMin] = openingTime.split(':').map(Number);
        const [endHour, endMin] = closingTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        
        if (startMinutes >= endMinutes) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Opening time must be before closing time. Please check your working hours.' 
            },
            { status: 400 }
          );
        }
      }
    }

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
