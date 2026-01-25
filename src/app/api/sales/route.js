import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Sale from '../../../models/Sale.js';
import Booking from '../../../models/Booking.js';
import Service from '../../../models/Service.js';
import { requireAuth } from '../../../lib/auth-helpers.js';

export async function GET(request) {
  try {
    await requireAuth();
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const employeeId = searchParams.get('employeeId');
    const paymentMethod = searchParams.get('paymentMethod');

    const query = {};
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.saleDate = { $gte: startOfDay, $lte: endOfDay };
    }
    
    if (employeeId) {
      query.employeeId = employeeId;
    }
    
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    const sales = await Sale.find(query)
      .populate('customerId', 'name phone')
      .populate('employeeId', 'name role')
      .populate('bookingId')
      .sort({ saleDate: -1 });

    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await requireAuth();
    await connectDB();
    const body = await request.json();

    const sale = new Sale({
      ...body,
      saleDate: body.saleDate || new Date(),
    });

    await sale.save();

    await sale.populate('customerId', 'name phone');
    await sale.populate('employeeId', 'name role');

    return NextResponse.json({ success: true, data: sale }, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create sale' },
      { status: 500 }
    );
  }
}
