import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Booking from '../../../models/Booking.js';
import Customer from '../../../models/Customer.js';
import Service from '../../../models/Service.js';
import Settings from '../../../models/Settings.js';
import { format, parse, isBefore, isAfter, startOfDay, isSameDay } from 'date-fns';

import { requireAuth } from '../../../lib/auth-helpers.js';

export async function GET(request) {
  try {
    await requireAuth();
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    const employeeId = searchParams.get('employeeId');

    const query = {};
    
    if (date) {
      const dateStart = startOfDay(new Date(date));
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);
      query.bookingDate = { $gte: dateStart, $lte: dateEnd };
    }
    
    if (status) {
      query.status = status;
    }
    
    if (employeeId) {
      query.employeeId = employeeId;
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'name phone email')
      .populate('serviceIds', 'name price duration')
      .populate('employeeId', 'name role')
      .sort({ bookingDate: 1, bookingTime: 1 });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

/**
 * Validate booking date and time
 * Checks for past dates, past times for today, and closed days
 */
async function validateBookingDateTime(bookingDate, bookingTime) {
  const settings = await Settings.getSettings();
  const today = startOfDay(new Date());
  const bookingDateObj = startOfDay(new Date(bookingDate));
  
  // Check if booking date is in the past
  if (isBefore(bookingDateObj, today)) {
    return {
      valid: false,
      error: 'Cannot book appointments for past dates',
    };
  }
  
  // Check if booking date is a closed day
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const bookingDayName = dayNames[bookingDateObj.getDay()];
  
  if (settings.closedDays && settings.closedDays.includes(bookingDayName)) {
    return {
      valid: false,
      error: `The salon is closed on ${bookingDayName}`,
    };
  }
  
  // Check if booking time is in the past for today
  if (isSameDay(bookingDateObj, today)) {
    const now = new Date();
    const currentTime = format(now, 'HH:mm');
    const bookingTimeObj = parse(bookingTime, 'HH:mm', new Date());
    const currentTimeObj = parse(currentTime, 'HH:mm', new Date());
    
    if (isBefore(bookingTimeObj, currentTimeObj)) {
      return {
        valid: false,
        error: 'Cannot book appointments for past time slots',
      };
    }
  }
  
  return { valid: true };
}

export async function POST(request) {
  try {
    // Public endpoint for booking creation
    await connectDB();
    const body = await request.json();
    
    const { customerName, customerPhone, customerEmail, serviceIds, employeeId, bookingDate, bookingTime, notes } = body;

    // Validate booking date and time
    const validation = await validateBookingDateTime(bookingDate, bookingTime);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Find or create customer
    let customer = await Customer.findOne({ phone: customerPhone });
    
    if (!customer) {
      customer = new Customer({
        name: customerName,
        phone: customerPhone,
        email: customerEmail || '',
      });
      await customer.save();
    } else {
      // Update customer info if provided
      if (customerName) customer.name = customerName;
      if (customerEmail) customer.email = customerEmail;
      await customer.save();
    }

    // Get settings for advance payment calculation
    const settings = await Settings.getSettings();
    
    // Calculate total price for advance payment
    const services = await Service.find({ _id: { $in: serviceIds } });
    const totalPrice = services.reduce((sum, service) => sum + (service.price || 0), 0);
    
    // Calculate advance amount if advance payment is enabled
    let advanceAmount = 0;
    let paymentStatus = 'pending';
    
    if (settings.advancePaymentEnabled) {
      advanceAmount = Math.round(totalPrice * (settings.advancePercentage / 100));
      paymentStatus = 'pending';
    } else {
      paymentStatus = 'paid'; // No advance payment required, consider as paid
    }

    // Create booking
    const booking = new Booking({
      customerId: customer._id,
      serviceIds,
      employeeId: employeeId || null,
      bookingDate: new Date(bookingDate),
      bookingTime,
      bookingType: 'online',
      notes: notes || '',
      status: 'scheduled',
      paymentStatus,
      advanceAmount,
    });

    await booking.save();

    // Populate for response
    await booking.populate('customerId', 'name phone email');
    await booking.populate('serviceIds', 'name price duration');
    if (booking.employeeId) {
      await booking.populate('employeeId', 'name role');
    }

    return NextResponse.json(
      { 
        success: true, 
        data: booking, 
        message: 'Booking created successfully',
        advanceAmount,
        paymentStatus,
        requiresPayment: settings.advancePaymentEnabled && paymentStatus === 'pending',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
