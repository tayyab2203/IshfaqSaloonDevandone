import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import DailySummary from '../../../models/DailySummary.js';
import Sale from '../../../models/Sale.js';
import Employee from '../../../models/Employee.js';
import { requireAuth } from '../../../lib/auth-helpers.js';
import { startOfDay, endOfDay, format } from 'date-fns';

export async function POST(request) {
  try {
    await requireAuth();
    await connectDB();
    const body = await request.json();
    const date = body.date || new Date().toISOString().split('T')[0];

    const dayStart = startOfDay(new Date(date));
    const dayEnd = endOfDay(new Date(date));

    // Check if summary already exists
    const existing = await DailySummary.findOne({ summaryDate: dayStart });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Summary already exists for this date' },
        { status: 400 }
      );
    }

    // Get all sales for the day
    const sales = await Sale.find({
      saleDate: {
        $gte: dayStart,
        $lte: dayEnd,
      },
    });

    const totalSales = sales.reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);
    const cashSales = sales
      .filter(sale => sale.paymentMethod === 'cash')
      .reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);
    const onlineSales = sales
      .filter(sale => sale.paymentMethod === 'online')
      .reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);

    // Unique clients
    const uniqueCustomerIds = [...new Set(sales.map(s => s.customerId.toString()))];
    const totalClients = uniqueCustomerIds.length;

    // Top earner
    const employeeEarnings = {};
    sales.forEach(sale => {
      const empId = sale.employeeId?.toString();
      if (empId) {
        if (!employeeEarnings[empId]) {
          employeeEarnings[empId] = { amount: 0, employeeId: empId };
        }
        employeeEarnings[empId].amount += sale.finalAmount || 0;
      }
    });

    let topEarner = { employeeId: null, employeeName: 'N/A', earnings: 0 };
    if (Object.keys(employeeEarnings).length > 0) {
      const topEarnerData = Object.values(employeeEarnings).sort((a, b) => b.amount - a.amount)[0];
      const employee = await Employee.findById(topEarnerData.employeeId);
      if (employee) {
        topEarner = {
          employeeId: employee._id,
          employeeName: employee.name,
          earnings: topEarnerData.amount,
        };
      }
    }

    // Generate summary text
    const summaryData = `Daily Summary for ${format(new Date(date), 'MMM dd, yyyy')}: Total Sales: PKR ${totalSales.toLocaleString()}, Cash: PKR ${cashSales.toLocaleString()}, Online: PKR ${onlineSales.toLocaleString()}, Clients: ${totalClients}, Top Earner: ${topEarner.employeeName} - PKR ${topEarner.earnings.toLocaleString()}`;

    // Create summary
    const summary = new DailySummary({
      summaryDate: dayStart,
      totalSales,
      cashSales,
      onlineSales,
      totalClients,
      topEarner,
      summaryData,
      sentViaWhatsApp: false,
    });

    await summary.save();

    return NextResponse.json({ success: true, data: summary }, { status: 201 });
  } catch (error) {
    console.error('Error creating daily summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create daily summary' },
      { status: 500 }
    );
  }
}
