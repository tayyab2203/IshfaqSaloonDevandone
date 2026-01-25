import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Sale from '../../../../models/Sale.js';
import Employee from '../../../../models/Employee.js';
import { requireAuth } from '../../../../lib/auth-helpers.js';
import { startOfMonth, endOfMonth } from 'date-fns';

export async function GET(request) {
  try {
    await requireAuth();
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || new Date().toISOString().split('T')[0];

    const monthStart = startOfMonth(new Date(month));
    const monthEnd = endOfMonth(new Date(month));

    const sales = await Sale.find({
      saleDate: {
        $gte: monthStart,
        $lte: monthEnd,
      },
    }).populate('employeeId', 'name commissionRate');

    // Group by employee
    const employeeEarnings = {};
    sales.forEach(sale => {
      const empId = sale.employeeId?._id?.toString();
      if (empId) {
        if (!employeeEarnings[empId]) {
          employeeEarnings[empId] = {
            employeeId: empId,
            employeeName: sale.employeeId?.name || 'N/A',
            totalEarnings: 0,
            commissionRate: sale.employeeId?.commissionRate || 0,
            commission: 0,
            salesCount: 0,
          };
        }
        employeeEarnings[empId].totalEarnings += sale.finalAmount || 0;
        employeeEarnings[empId].salesCount += 1;
      }
    });

    // Calculate commission
    Object.values(employeeEarnings).forEach(emp => {
      emp.commission = (emp.totalEarnings * emp.commissionRate) / 100;
    });

    return NextResponse.json({
      success: true,
      data: Object.values(employeeEarnings),
    });
  } catch (error) {
    console.error('Error fetching employee earnings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employee earnings' },
      { status: 500 }
    );
  }
}
