import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Settings from '../../../../models/Settings.js';

export async function GET() {
  try {
    await connectDB();
    
    const settings = await Settings.getSettings();
    
    // Return public settings (name, logo, address, phone, hours)
    return NextResponse.json({
      success: true,
      data: {
        salonName: settings.salonName || 'Ishfaq Mens Salon',
        logo: settings.logo || '',
        salonAddress: settings.salonAddress || '',
        salonPhone: settings.salonPhone || '+92 300 1234567',
        whatsappNumber: settings.whatsappNumber || settings.salonPhone || '+92 300 1234567',
        openingTime: settings.openingTime || '09:00',
        closingTime: settings.closingTime || '18:00',
        closedDays: settings.closedDays || [],
      },
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}
