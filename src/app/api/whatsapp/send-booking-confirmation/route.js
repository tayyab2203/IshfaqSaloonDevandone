import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Booking from '../../../../models/Booking.js';
import Service from '../../../../models/Service.js';
import { format } from 'date-fns';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { bookingId, phone } = body;

    const booking = await Booking.findById(bookingId)
      .populate('customerId', 'name phone')
      .populate('serviceIds', 'name')
      .populate('employeeId', 'name');

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Generate message
    const message = `Your appointment is confirmed for ${format(
      new Date(booking.bookingDate),
      'MMM dd, yyyy'
    )} at ${booking.bookingTime}. Service: ${booking.serviceIds
      .map((s) => s.name)
      .join(', ')}. Staff: ${booking.employeeId?.name || 'Any Available'}. Location: 123 Main Street, City. To cancel, call +92 300 1234567.`;

    // Mock WhatsApp send - log to console
    console.log('WhatsApp Message Sent:', {
      to: phone || booking.customerId.phone,
      message,
      timestamp: new Date().toISOString(),
    });

    // In production, integrate with WhatsApp API here
    // For now, return mock success
    return NextResponse.json({
      success: true,
      data: {
        messageId: `mock_${Date.now()}`,
        to: phone || booking.customerId.phone,
        message,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
