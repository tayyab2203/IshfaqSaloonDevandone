import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Employee from '../../../../models/Employee.js';
import Sale from '../../../../models/Sale.js';
import Booking from '../../../../models/Booking.js';
import Service from '../../../../models/Service.js';
import Attendance from '../../../../models/Attendance.js';
import { requireOwner, requireAuth } from '../../../../lib/auth-helpers.js';
import { startOfMonth, endOfMonth, subDays } from 'date-fns';

export async function GET(request, { params }) {
  try {
    await requireAuth();
    await connectDB();
    const { id } = await params;

    const employee = await Employee.findById(id).populate('services', 'name price');
    
    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Get current month earnings
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthSales = await Sale.find({
      employeeId: id,
      saleDate: {
        $gte: monthStart,
        $lte: monthEnd,
      },
    });

    const currentMonthEarnings = monthSales.reduce(
      (sum, sale) => sum + (sale.finalAmount || 0),
      0
    );

    // Calculate commission
    const commission = (currentMonthEarnings * employee.commissionRate) / 100;

    // Get total bookings
    const totalBookings = await Booking.countDocuments({ employeeId: id });

    // Get recent bookings
    const recentBookings = await Booking.find({ employeeId: id })
      .populate('customerId', 'name phone')
      .populate('serviceIds', 'name')
      .sort({ bookingDate: -1 })
      .limit(10);

    // Get attendance record (last 30 days)
    const thirtyDaysAgo = subDays(new Date(), 30);
    const attendance = await Attendance.find({
      employeeId: id,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 });

    return NextResponse.json({
      success: true,
      data: {
        employee,
        currentMonthEarnings,
        commission,
        totalBookings,
        recentBookings,
        attendance,
      },
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employee' },
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

    const employee = await Employee.findById(id);
    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    Object.assign(employee, body);
    await employee.save();

    await employee.populate('services', 'name');

    return NextResponse.json({ success: true, data: employee });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}
