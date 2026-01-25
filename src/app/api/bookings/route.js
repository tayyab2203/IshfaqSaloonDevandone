import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Booking from '../../../models/Booking.js';
import Customer from '../../../models/Customer.js';
import Service from '../../../models/Service.js';

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
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.bookingDate = { $gte: startOfDay, $lte: endOfDay };
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

export async function POST(request) {
  try {
    // Public endpoint for booking creation
    await connectDB();
    const body = await request.json();
    
    const { customerName, customerPhone, customerEmail, serviceIds, employeeId, bookingDate, bookingTime, notes } = body;

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
    });

    await booking.save();

    // Populate for response
    await booking.populate('customerId', 'name phone email');
    await booking.populate('serviceIds', 'name price duration');
    if (booking.employeeId) {
      await booking.populate('employeeId', 'name role');
    }

    return NextResponse.json(
      { success: true, data: booking, message: 'Booking created successfully' },
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
