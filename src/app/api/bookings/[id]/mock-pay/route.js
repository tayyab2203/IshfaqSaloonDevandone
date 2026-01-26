import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db.js';
import Booking from '../../../../../models/Booking.js';

/**
 * Mock Payment API
 * Processes mock advance payment for a booking
 * Sets paymentStatus to 'paid' and confirms the booking
 */
export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // Find the booking
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Validate that payment is pending
    if (booking.paymentStatus !== 'pending') {
      return NextResponse.json(
        { 
          success: false, 
          error: `Payment already processed. Current status: ${booking.paymentStatus}` 
        },
        { status: 400 }
      );
    }

    // Process mock payment - update payment status to paid
    booking.paymentStatus = 'paid';
    
    // Ensure booking status is scheduled (confirm the booking)
    if (booking.status !== 'scheduled') {
      booking.status = 'scheduled';
    }
    
    await booking.save();

    // Populate for response
    await booking.populate('customerId', 'name phone email');
    await booking.populate('serviceIds', 'name price duration');
    if (booking.employeeId) {
      await booking.populate('employeeId', 'name role');
    }

    // Log mock payment (in production, this would integrate with payment gateway)
    console.log('Mock Payment Processed:', {
      bookingId: booking._id.toString(),
      advanceAmount: booking.advanceAmount,
      customerPhone: booking.customerId?.phone,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Payment processed successfully. Your booking is confirmed!',
    });
  } catch (error) {
    console.error('Error processing mock payment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process payment',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
