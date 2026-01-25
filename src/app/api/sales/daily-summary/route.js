import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Sale from '../../../../models/Sale.js';
import Employee from '../../../../models/Employee.js';
import { requireAuth } from '../../../../lib/auth-helpers.js';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(request) {
  try {
    await requireAuth();
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const dayStart = startOfDay(new Date(date));
    const dayEnd = endOfDay(new Date(date));

    const sales = await Sale.find({
      saleDate: {
        $gte: dayStart,
        $lte: dayEnd,
      },
    }).populate('employeeId', 'name');

    const totalSales = sales.reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);
    const cashSales = sales
      .filter(sale => sale.paymentMethod === 'cash')
      .reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);
    const onlineSales = sales
      .filter(sale => sale.paymentMethod === 'online')
      .reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);

    // Staff-wise earnings
    const staffEarnings = {};
    sales.forEach(sale => {
      const empId = sale.employeeId?._id?.toString();
      if (empId) {
        if (!staffEarnings[empId]) {
          staffEarnings[empId] = {
            employeeId: empId,
            employeeName: sale.employeeId?.name || 'N/A',
            earnings: 0,
            commission: 0,
          };
        }
        staffEarnings[empId].earnings += sale.finalAmount || 0;
      }
    });

    // Calculate commission for each staff (Employee already imported at top)
    for (const empId in staffEarnings) {
      const employee = await Employee.findById(empId);
      if (employee) {
        staffEarnings[empId].commission =
          (staffEarnings[empId].earnings * employee.commissionRate) / 100;
      }
    }

    // Discounts tracking
    const totalDiscounts = sales.reduce(
      (sum, sale) => sum + (sale.discountApplied || 0),
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        date,
        totalSales,
        cashSales,
        onlineSales,
        totalClients: [...new Set(sales.map(s => s.customerId.toString()))].length,
        staffEarnings: Object.values(staffEarnings),
        totalDiscounts,
        sales,
      },
    });
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch daily summary' },
      { status: 500 }
    );
  }
}
