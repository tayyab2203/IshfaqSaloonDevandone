import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Employee from '../../../models/Employee.js';
import Service from '../../../models/Service.js';
import { requireAuth } from '../../../lib/auth-helpers.js';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const serviceId = searchParams.get('serviceId');

    const query = {};
    
    if (status) {
      query.status = status;
    } else {
      query.status = 'active';
    }

    let employees = await Employee.find(query).populate('services', 'name');

    // Filter by service if provided
    if (serviceId) {
      employees = employees.filter(emp => 
        emp.services.some(s => s._id.toString() === serviceId)
      );
    }

    return NextResponse.json({ success: true, data: employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await requireAuth();
    await connectDB();
    const body = await request.json();

    const employee = new Employee(body);
    await employee.save();

    await employee.populate('services', 'name');

    return NextResponse.json({ success: true, data: employee }, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create employee' },
      { status: 500 }
    );
  }
}
