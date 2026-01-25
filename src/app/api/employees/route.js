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

    // Validate required fields
    if (!body.name || !body.phone || !body.role) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and role are required' },
        { status: 400 }
      );
    }

    // Validate and process service IDs if provided
    if (body.services && Array.isArray(body.services) && body.services.length > 0) {
      const mongoose = (await import('mongoose')).default;
      const validServiceIds = body.services
        .map(id => {
          // Convert to string if needed
          const idStr = id?.toString?.() || id;
          return mongoose.Types.ObjectId.isValid(idStr) ? new mongoose.Types.ObjectId(idStr) : null;
        })
        .filter(id => id !== null);
      
      // Check if services exist
      if (validServiceIds.length > 0) {
        const existingServices = await Service.find({ _id: { $in: validServiceIds } });
        if (existingServices.length !== validServiceIds.length) {
          return NextResponse.json(
            { success: false, error: 'One or more service IDs are invalid' },
            { status: 400 }
          );
        }
        body.services = validServiceIds;
      } else {
        body.services = [];
      }
    } else {
      body.services = [];
    }

    // Create employee
    const employee = new Employee(body);
    await employee.save();

    // Populate services if any
    if (employee.services && employee.services.length > 0) {
      await employee.populate('services', 'name');
    }

    // Convert to plain object for JSON serialization
    const employeeData = employee.toObject();
    employeeData._id = employeeData._id.toString();
    if (employeeData.services) {
      employeeData.services = employeeData.services.map(s => ({
        ...s,
        _id: s._id.toString()
      }));
    }

    return NextResponse.json({ success: true, data: employeeData }, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message).join(', ');
      return NextResponse.json(
        { success: false, error: `Validation error: ${errors}` },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Employee with this phone number already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create employee',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
