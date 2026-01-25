import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Booking from '../../../../models/Booking.js';
import Service from '../../../../models/Service.js';
import { format, addMinutes, parse, isBefore, isAfter } from 'date-fns';

// Working hours (can be moved to settings later)
const WORKING_HOURS = {
  start: '09:00',
  end: '18:00',
};

// Time slot interval in minutes
const SLOT_INTERVAL = 30;

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const serviceIds = searchParams.get('serviceIds')?.split(',') || [];
    const employeeId = searchParams.get('employeeId');

    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Date is required' },
        { status: 400 }
      );
    }

    // Calculate total duration from services
    let totalDuration = 0;
    if (serviceIds.length > 0) {
      const services = await Service.find({ _id: { $in: serviceIds } });
      totalDuration = services.reduce((sum, service) => sum + (service.duration || 0), 0);
    }

    // Get all bookings for the date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const query = {
      bookingDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $in: ['scheduled', 'completed'] },
    };

    if (employeeId) {
      query.employeeId = employeeId;
    }

    const existingBookings = await Booking.find(query).populate('serviceIds');

    // Generate all possible time slots
    const allSlots = generateTimeSlots(WORKING_HOURS.start, WORKING_HOURS.end, SLOT_INTERVAL);
    
    // Filter out unavailable slots
    const availableSlots = [];
    
    for (const slot of allSlots) {
      const slotTime = parse(slot, 'HH:mm', new Date());
      const slotEndTime = addMinutes(slotTime, totalDuration);
      
      // Check if slot is within working hours
      const workingStart = parse(WORKING_HOURS.start, 'HH:mm', new Date());
      const workingEnd = parse(WORKING_HOURS.end, 'HH:mm', new Date());
      
      if (isBefore(slotTime, workingStart) || isAfter(slotEndTime, workingEnd)) {
        continue;
      }

      // Check if slot conflicts with existing bookings
      let hasConflict = false;
      for (const booking of existingBookings) {
        const bookingTime = parse(booking.bookingTime, 'HH:mm', new Date());
        const bookingDuration = await booking.getTotalDuration();
        const bookingEndTime = addMinutes(bookingTime, bookingDuration);
        
        // Check if slots overlap
        if (
          (isAfter(slotTime, bookingTime) && isBefore(slotTime, bookingEndTime)) ||
          (isAfter(slotEndTime, bookingTime) && isBefore(slotEndTime, bookingEndTime)) ||
          (isBefore(slotTime, bookingTime) && isAfter(slotEndTime, bookingEndTime))
        ) {
          hasConflict = true;
          break;
        }
      }

      if (!hasConflict) {
        availableSlots.push(slot);
      }
    }

    return NextResponse.json({
      success: true,
      data: availableSlots,
      totalDuration,
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
}

function generateTimeSlots(startTime, endTime, intervalMinutes) {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    slots.push(timeStr);
    
    currentMin += intervalMinutes;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour += 1;
    }
  }
  
  return slots;
}
