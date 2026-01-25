import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Customer from '../../../models/Customer.js';
import { requireAuth } from '../../../lib/auth-helpers.js';

export async function GET(request) {
  try {
    await requireAuth();
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const isDue = searchParams.get('isDue');

    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (isDue === 'true') {
      query.isDue = true;
    }

    const customers = await Customer.find(query)
      .populate('preferredEmployee', 'name role')
      .sort({ name: 1 });

    return NextResponse.json({ success: true, data: customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await requireAuth();
    await connectDB();
    const body = await request.json();

    // Check if customer exists by phone
    let customer = await Customer.findOne({ phone: body.phone });
    
    if (customer) {
      // Update existing customer
      Object.assign(customer, body);
      await customer.save();
    } else {
      // Create new customer
      customer = new Customer(body);
      await customer.save();
    }

    await customer.populate('preferredEmployee', 'name role');

    return NextResponse.json({ success: true, data: customer }, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create/update customer' },
      { status: 500 }
    );
  }
}
