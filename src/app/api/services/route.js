import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Service from '../../../models/Service.js';
import { requireAuth } from '../../../lib/auth-helpers.js';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    // Return all services by default, or only active if activeOnly=true
    const query = activeOnly ? { isActive: true } : {};
    const services = await Service.find(query).sort({ name: 1 });
    
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await requireAuth();
    await connectDB();
    const body = await request.json();
    
    const service = new Service(body);
    await service.save();
    
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
