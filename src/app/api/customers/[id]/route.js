import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Customer from '../../../../models/Customer.js';
import Booking from '../../../../models/Booking.js';
import Service from '../../../../models/Service.js';
import { requireAuth } from '../../../../lib/auth-helpers.js';

export async function GET(request, { params }) {
  try {
    await requireAuth();
    await connectDB();
    const { id } = await params;

    const customer = await Customer.findById(id).populate('preferredEmployee', 'name role');
    
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Get customer booking history
    const bookings = await Booking.find({ customerId: id })
      .populate('serviceIds', 'name price')
      .populate('employeeId', 'name')
      .sort({ bookingDate: -1 })
      .limit(10);

    return NextResponse.json({
      success: true,
      data: {
        customer,
        recentBookings: bookings,
      },
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAuth();
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const customer = await Customer.findById(id);
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    Object.assign(customer, body);
    await customer.save();

    await customer.populate('preferredEmployee', 'name role');

    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}
