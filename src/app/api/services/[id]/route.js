import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Service from '../../../../models/Service.js';
import { requireAuth } from '../../../../lib/auth-helpers.js';

export async function GET(request, { params }) {
  try {
    await requireAuth();
    await connectDB();
    const { id } = await params;

    const service = await Service.findById(id);
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service' },
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

    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    Object.assign(service, body);
    await service.save();

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAuth();
    await connectDB();
    const { id } = await params;

    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    await service.deleteOne();

    return NextResponse.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
