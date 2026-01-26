import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db.js';
import Booking from '../../../../../models/Booking.js';
import Settings from '../../../../../models/Settings.js';
import Service from '../../../../../models/Service.js';
import { format, parse, isBefore, isAfter, startOfDay, isSameDay, addMinutes } from 'date-fns';
import { requireAuth } from '../../../../../lib/auth-helpers.js';

/**
 * Reschedule Booking API
 * Allows rescheduling of future bookings with validation
 * Rules:
 * - Only future bookings can be rescheduled
 * - Cannot reschedule completed or cancelled bookings
 * - Maximum 2 reschedules allowed
 * - New date/time must be validated (no past dates/times, not closed days)
 * - New slot must be available (no conflicts)
 */
export async function PUT(request, { params }) {
  try {
    await requireAuth();
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    const { bookingDate, bookingTime } = body;
    
    if (!bookingDate || !bookingTime) {
      return NextResponse.json(
        { success: false, error: 'Booking date and time are required' },
        { status: 400 }
      );
    }
    
    // Find the booking
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Validation: Check if booking is in the past
    const today = startOfDay(new Date());
    const currentBookingDate = startOfDay(new Date(booking.bookingDate));
    
    if (isBefore(currentBookingDate, today)) {
      return NextResponse.json(
        { success: false, error: 'Cannot reschedule past bookings' },
        { status: 400 }
      );
    }
    
    // Validation: Check booking status
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return NextResponse.json(
        { success: false, error: `Cannot reschedule ${booking.status} bookings` },
        { status: 400 }
      );
    }
    
    // Validation: Check reschedule count
    if (booking.rescheduleCount >= 2) {
      return NextResponse.json(
        { success: false, error: 'Maximum reschedule limit (2) reached for this booking' },
        { status: 400 }
      );
    }
    
    // Validate new date and time
    const settings = await Settings.getSettings();
    const newBookingDate = startOfDay(new Date(bookingDate));
    
    // Check if new date is in the past
    if (isBefore(newBookingDate, today)) {
      return NextResponse.json(
        { success: false, error: 'Cannot reschedule to a past date' },
        { status: 400 }
      );
    }
    
    // Check if new date is a closed day
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const newDayName = dayNames[newBookingDate.getDay()];
    
    if (settings.closedDays && settings.closedDays.includes(newDayName)) {
      return NextResponse.json(
        { success: false, error: `The salon is closed on ${newDayName}` },
        { status: 400 }
      );
    }
    
    // Check if new time is in the past for today
    if (isSameDay(newBookingDate, today)) {
      const now = new Date();
      const currentTime = format(now, 'HH:mm');
      const newTimeObj = parse(bookingTime, 'HH:mm', new Date());
      const currentTimeObj = parse(currentTime, 'HH:mm', new Date());
      
      if (isBefore(newTimeObj, currentTimeObj)) {
        return NextResponse.json(
          { success: false, error: 'Cannot reschedule to a past time slot' },
          { status: 400 }
        );
      }
    }
    
    // Check slot availability (no conflicts with other bookings)
    const startOfNewDay = startOfDay(new Date(bookingDate));
    const endOfNewDay = new Date(bookingDate);
    endOfNewDay.setHours(23, 59, 59, 999);
    
    // Get existing bookings for the new date (excluding current booking)
    const existingBookings = await Booking.find({
      bookingDate: {
        $gte: startOfNewDay,
        $lte: endOfNewDay,
      },
      status: { $in: ['scheduled', 'completed'] },
      _id: { $ne: booking._id }, // Exclude current booking
      ...(booking.employeeId ? { employeeId: booking.employeeId } : {}),
    }).populate('serviceIds');
    
    // Calculate total duration for current booking
    const bookingDuration = await booking.getTotalDuration();
    const newBookingTime = parse(bookingTime, 'HH:mm', new Date());
    const newBookingEndTime = addMinutes(newBookingTime, bookingDuration);
    
    // Check for conflicts with existing bookings
    for (const existingBooking of existingBookings) {
      const existingTime = parse(existingBooking.bookingTime, 'HH:mm', new Date());
      const existingDuration = await existingBooking.getTotalDuration();
      const existingEndTime = addMinutes(existingTime, existingDuration);
      
      // Check if time slots overlap
      if (
        (isAfter(newBookingTime, existingTime) && isBefore(newBookingTime, existingEndTime)) ||
        (isAfter(newBookingEndTime, existingTime) && isBefore(newBookingEndTime, existingEndTime)) ||
        (isBefore(newBookingTime, existingTime) && isAfter(newBookingEndTime, existingEndTime))
      ) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Time slot ${bookingTime} is not available. Please select another time.` 
          },
          { status: 400 }
        );
      }
    }
    
    // Save old date/time to rescheduledFrom
    const oldBookingDateTime = new Date(booking.bookingDate);
    oldBookingDateTime.setHours(
      parseInt(booking.bookingTime.split(':')[0]),
      parseInt(booking.bookingTime.split(':')[1]),
      0,
      0
    );
    
    // Update booking
    booking.rescheduledFrom = oldBookingDateTime;
    booking.bookingDate = new Date(bookingDate);
    booking.bookingTime = bookingTime;
    booking.rescheduleCount = (booking.rescheduleCount || 0) + 1;
    
    await booking.save();
    
    // Populate for response
    await booking.populate('customerId', 'name phone email');
    await booking.populate('serviceIds', 'name price duration');
    if (booking.employeeId) {
      await booking.populate('employeeId', 'name role');
    }
    
    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking rescheduled successfully',
    });
  } catch (error) {
    console.error('Error rescheduling booking:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to reschedule booking',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
