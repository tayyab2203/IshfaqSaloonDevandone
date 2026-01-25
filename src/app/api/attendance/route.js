import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Attendance from '../../../models/Attendance.js';
import Employee from '../../../models/Employee.js';
import { requireAuth } from '../../../lib/auth-helpers.js';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(request) {
  try {
    await requireAuth();
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const dayStart = startOfDay(new Date(date));
    const dayEnd = endOfDay(new Date(date));

    const attendance = await Attendance.find({
      date: {
        $gte: dayStart,
        $lte: dayEnd,
      },
    }).populate('employeeId', 'name role');

    // Get all active employees to show who hasn't marked attendance
    const allEmployees = await Employee.find({ status: 'active' });
    const markedEmployeeIds = attendance.map(a => a.employeeId._id.toString());
    const unmarkedEmployees = allEmployees.filter(
      emp => !markedEmployeeIds.includes(emp._id.toString())
    );

    return NextResponse.json({
      success: true,
      data: {
        attendance,
        unmarkedEmployees,
      },
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await requireAuth();
    await connectDB();
    const body = await request.json();

    const { employeeId, date, status, checkIn, checkOut } = body;

    // Check if attendance already exists
    const dayStart = startOfDay(new Date(date));
    const dayEnd = endOfDay(new Date(date));

    let attendance = await Attendance.findOne({
      employeeId,
      date: {
        $gte: dayStart,
        $lte: dayEnd,
      },
    });

    if (attendance) {
      // Update existing
      Object.assign(attendance, { status, checkIn, checkOut });
      await attendance.save();
    } else {
      // Create new
      attendance = new Attendance({
        employeeId,
        date: new Date(date),
        status,
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
      });
      await attendance.save();
    }

    await attendance.populate('employeeId', 'name role');

    return NextResponse.json({ success: true, data: attendance }, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating attendance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create/update attendance' },
      { status: 500 }
    );
  }
}
