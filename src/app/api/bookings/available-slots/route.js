import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Booking from '../../../../models/Booking.js';
import Service from '../../../../models/Service.js';
import Settings from '../../../../models/Settings.js';
import { format, addMinutes, parse, isBefore, isAfter, startOfDay, isSameDay } from 'date-fns';

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

    // Get settings for working hours and closed days
    const settings = await Settings.getSettings();
    const workingHours = {
      start: settings.openingTime || '09:00',
      end: settings.closingTime || '18:00',
    };

    // Check if the selected date is a closed day
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // Parse date string (format: yyyy-MM-dd) and create date in local timezone
    const [year, month, day] = date.split('-').map(Number);
    const selectedDateObj = new Date(year, month - 1, day); // month is 0-indexed
    const dayName = dayNames[selectedDateObj.getDay()];
    
    if (settings.closedDays && Array.isArray(settings.closedDays) && settings.closedDays.includes(dayName)) {
      return NextResponse.json({
        success: true,
        data: [],
        totalDuration: 0,
        message: `The salon is closed on ${dayName}`,
      });
    }

    // Calculate total duration from services
    let totalDuration = 0;
    if (serviceIds.length > 0 && serviceIds[0] !== '') {
      // Filter out empty strings
      const validServiceIds = serviceIds.filter(id => id && id.trim() !== '');
      if (validServiceIds.length > 0) {
        const services = await Service.find({ _id: { $in: validServiceIds } });
        totalDuration = services.reduce((sum, service) => sum + (service.duration || 0), 0);
      }
    }

    // Get all bookings for the date (use the parsed date object)
    const dateStart = startOfDay(selectedDateObj);
    const dateEnd = new Date(selectedDateObj);
    dateEnd.setHours(23, 59, 59, 999);

    const query = {
      bookingDate: {
        $gte: dateStart,
        $lte: dateEnd,
      },
      status: { $in: ['scheduled', 'completed'] },
    };

    if (employeeId) {
      query.employeeId = employeeId;
    }

    const existingBookings = await Booking.find(query).populate('serviceIds');

    // Validate working hours
    if (!workingHours.start || !workingHours.end) {
      return NextResponse.json({
        success: false,
        error: 'Working hours are not configured. Please set opening and closing times in Settings.',
      }, { status: 400 });
    }

    // Validate that opening time is before closing time
    const [startHour, startMin] = workingHours.start.split(':').map(Number);
    const [endHour, endMin] = workingHours.end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (startMinutes >= endMinutes) {
      return NextResponse.json({
        success: false,
        error: `Invalid working hours: Opening time (${workingHours.start}) must be before closing time (${workingHours.end}). Please update your working hours in Admin Settings.`,
      }, { status: 400 });
    }

    // Generate all possible time slots using settings
    const allSlots = generateTimeSlots(workingHours.start, workingHours.end, SLOT_INTERVAL);
    
    if (allSlots.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No time slots can be generated. Please check working hours in Settings.',
      }, { status: 400 });
    }
    
    // Get current time for filtering past slots if date is today
    const today = startOfDay(new Date());
    const isToday = isSameDay(selectedDateObj, today);
    const currentTime = isToday ? format(new Date(), 'HH:mm') : null;
    
    // Filter out unavailable slots
    const availableSlots = [];
    
    for (const slot of allSlots) {
      // Filter out past time slots if date is today
      if (isToday && currentTime) {
        const slotTimeObj = parse(slot, 'HH:mm', new Date());
        const currentTimeObj = parse(currentTime, 'HH:mm', new Date());
        if (isBefore(slotTimeObj, currentTimeObj)) {
          continue;
        }
      }
      
      const slotTime = parse(slot, 'HH:mm', new Date());
      const slotEndTime = addMinutes(slotTime, totalDuration);
      
      // Check if slot is within working hours
      const workingStart = parse(workingHours.start, 'HH:mm', new Date());
      const workingEnd = parse(workingHours.end, 'HH:mm', new Date());
      
      // Slot must start at or after opening time
      // Slot must end at or before closing time (isAfter returns false for equality, so slots ending exactly at closing are allowed)
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

    // Debug logging (remove in production if needed)
    console.log('Available slots calculation:', {
      date,
      workingHours,
      totalSlotsGenerated: allSlots.length,
      availableSlotsCount: availableSlots.length,
      totalDuration,
      isClosedDay: settings.closedDays?.includes(dayName),
    });

    return NextResponse.json({
      success: true,
      data: availableSlots,
      totalDuration,
      debug: process.env.NODE_ENV === 'development' ? {
        workingHours,
        totalSlotsGenerated: allSlots.length,
        isClosedDay: settings.closedDays?.includes(dayName),
      } : undefined,
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch available slots',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
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
