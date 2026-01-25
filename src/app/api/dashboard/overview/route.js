import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Sale from '../../../../models/Sale.js';
import Booking from '../../../../models/Booking.js';
import Employee from '../../../../models/Employee.js';
import { requireAuth } from '../../../../lib/auth-helpers.js';
import { format, startOfDay, endOfDay, addDays } from 'date-fns';

export async function GET() {
  try {
    await requireAuth();
    await connectDB();

    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const tomorrowStart = startOfDay(addDays(today, 1));

    // Today's sales
    const todaySales = await Sale.find({
      saleDate: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

    const todayTotalSale = todaySales.reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);
    const cashSales = todaySales
      .filter(sale => sale.paymentMethod === 'cash')
      .reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);
    const onlineSales = todaySales
      .filter(sale => sale.paymentMethod === 'online')
      .reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);

    // Unique clients today
    const uniqueCustomerIds = [...new Set(todaySales.map(sale => sale.customerId.toString()))];
    const clientsToday = uniqueCustomerIds.length;

    // Top earner today
    const employeeEarnings = {};
    todaySales.forEach(sale => {
      const empId = sale.employeeId?.toString();
      if (empId) {
        if (!employeeEarnings[empId]) {
          employeeEarnings[empId] = { amount: 0, employeeId: empId };
        }
        employeeEarnings[empId].amount += sale.finalAmount || 0;
      }
    });

    let topEarner = { name: 'N/A', earnings: 0 };
    if (Object.keys(employeeEarnings).length > 0) {
      const topEarnerData = Object.values(employeeEarnings).sort((a, b) => b.amount - a.amount)[0];
      const employee = await Employee.findById(topEarnerData.employeeId);
      if (employee) {
        topEarner = {
          name: employee.name,
          earnings: topEarnerData.amount,
        };
      }
    }

    // Tomorrow's bookings
    const tomorrowBookings = await Booking.countDocuments({
      bookingDate: {
        $gte: tomorrowStart,
        $lt: addDays(tomorrowStart, 1),
      },
      status: 'scheduled',
    });

    return NextResponse.json({
      success: true,
      data: {
        todayTotalSale,
        cashSales,
        onlineSales,
        clientsToday,
        topEarner,
        tomorrowBookings,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
