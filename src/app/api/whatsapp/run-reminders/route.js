import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Booking from '../../../../models/Booking.js';
import Settings from '../../../../models/Settings.js';
import WhatsAppLog from '../../../../models/WhatsAppLog.js';
import { format, addDays, startOfDay, endOfDay } from 'date-fns';

/**
 * Run Reminders API
 * Finds all bookings for tomorrow and sends WhatsApp reminders
 * This is a mock system that logs messages instead of sending real WhatsApp
 */
export async function POST(request) {
  try {
    await connectDB();
    
    // Get settings for salon name
    const settings = await Settings.getSettings();
    
    // Calculate tomorrow's date range
    const tomorrow = addDays(new Date(), 1);
    const tomorrowStart = startOfDay(tomorrow);
    const tomorrowEnd = endOfDay(tomorrow);
    
    // Find all bookings for tomorrow that need reminders
    // Conditions:
    // - bookingDate = tomorrow
    // - status = 'scheduled'
    // - paymentStatus = 'paid' OR advancePaymentEnabled = false (no payment required)
    const bookings = await Booking.find({
      bookingDate: {
        $gte: tomorrowStart,
        $lte: tomorrowEnd,
      },
      status: 'scheduled',
    })
      .populate('customerId', 'name phone')
      .populate('serviceIds', 'name')
      .populate('employeeId', 'name');
    
    // Filter bookings based on payment status
    const bookingsToRemind = bookings.filter(booking => {
      // If advance payment is enabled, only remind if payment is paid
      if (settings.advancePaymentEnabled) {
        return booking.paymentStatus === 'paid';
      }
      // If advance payment is disabled, remind all scheduled bookings
      return true;
    });
    
    const remindersSent = [];
    const errors = [];
    
    // Process each booking and send reminder
    for (const booking of bookingsToRemind) {
      try {
        // Generate reminder message
        const customerName = booking.customerId?.name || 'Customer';
        const bookingTime = booking.bookingTime;
        const salonName = settings.salonName || 'Ishfaq Mens Salon';
        
        const message = `Reminder: Dear ${customerName}, tomorrow at ${bookingTime} you have an appointment at ${salonName}.`;
        
        // Create WhatsApp log entry (mock send)
        const whatsAppLog = new WhatsAppLog({
          phone: booking.customerId?.phone || '',
          message,
          bookingId: booking._id,
          status: 'sent',
        });
        
        await whatsAppLog.save();
        
        // Log to console (mock WhatsApp send)
        console.log('WhatsApp Reminder Sent:', {
          to: booking.customerId?.phone,
          message,
          bookingId: booking._id.toString(),
          timestamp: new Date().toISOString(),
        });
        
        remindersSent.push({
          bookingId: booking._id.toString(),
          customerName,
          customerPhone: booking.customerId?.phone,
          bookingTime,
          message,
        });
      } catch (error) {
        console.error(`Error sending reminder for booking ${booking._id}:`, error);
        errors.push({
          bookingId: booking._id.toString(),
          error: error.message,
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        totalRemindersSent: remindersSent.length,
        totalBookingsFound: bookings.length,
        remindersSent,
        errors: errors.length > 0 ? errors : undefined,
      },
      message: `Successfully sent ${remindersSent.length} reminder(s) for tomorrow's bookings`,
    });
  } catch (error) {
    console.error('Error running reminders:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to run reminders',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
