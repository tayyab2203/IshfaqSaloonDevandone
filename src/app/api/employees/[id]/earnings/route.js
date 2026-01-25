import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db.js';
import Sale from '../../../../../models/Sale.js';
import Employee from '../../../../../models/Employee.js';
import { requireAuth } from '../../../../../lib/auth-helpers.js';
import { startOfMonth, endOfMonth } from 'date-fns';

export async function GET(request, { params }) {
  try {
    await requireAuth();
    await connectDB();
    const { id } = await params;

    const employee = await Employee.findById(id);
    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const sales = await Sale.find({
      employeeId: id,
      saleDate: {
        $gte: monthStart,
        $lte: monthEnd,
      },
    }).populate('customerId', 'name');

    const totalEarnings = sales.reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);
    const commission = (totalEarnings * employee.commissionRate) / 100;

    return NextResponse.json({
      success: true,
      data: {
        totalEarnings,
        commission,
        sales,
      },
    });
  } catch (error) {
    console.error('Error fetching employee earnings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
}
