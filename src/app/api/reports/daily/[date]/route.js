import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db.js';
import Sale from '../../../../../models/Sale.js';
import Employee from '../../../../../models/Employee.js';
import Customer from '../../../../../models/Customer.js';
import Booking from '../../../../../models/Booking.js';
import Service from '../../../../../models/Service.js';
import { requireAuth } from '../../../../../lib/auth-helpers.js';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(request, { params }) {
  try {
    await requireAuth();
    await connectDB();
    const { date } = await params;

    const dayStart = startOfDay(new Date(date));
    const dayEnd = endOfDay(new Date(date));

    // Get all sales for the day with full population
    const sales = await Sale.find({
      saleDate: {
        $gte: dayStart,
        $lte: dayEnd,
      },
    })
      .populate('customerId', 'name phone')
      .populate('employeeId', 'name role commissionRate')
      .populate('bookingId')
      .sort({ saleDate: -1 })
      .lean();

    // Get booking services for each sale
    const salesWithServices = await Promise.all(
      sales.map(async (sale) => {
        let services = [];
        if (sale.bookingId && sale.bookingId.serviceIds) {
          services = await Service.find({
            _id: { $in: sale.bookingId.serviceIds },
          }).lean();
        }
        return {
          ...sale,
          services: services.map(s => ({ name: s.name, price: s.price })),
        };
      })
    );

    // Calculate summary statistics
    const totalSales = sales.reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);
    const cashSales = sales
      .filter(sale => sale.paymentMethod === 'cash')
      .reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);
    const onlineSales = sales
      .filter(sale => sale.paymentMethod === 'online')
      .reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);
    const totalDiscounts = sales.reduce((sum, sale) => sum + (sale.discountApplied || 0), 0);

    // Unique clients
    const uniqueCustomerIds = [...new Set(sales.map(s => s.customerId?._id?.toString()).filter(Boolean))];
    const totalClients = uniqueCustomerIds.length;

    // Staff-wise earnings breakdown
    const staffEarnings = {};
    sales.forEach(sale => {
      const empId = sale.employeeId?._id?.toString();
      if (empId) {
        if (!staffEarnings[empId]) {
          staffEarnings[empId] = {
            employeeId: empId,
            employeeName: sale.employeeId?.name || 'N/A',
            commissionRate: sale.employeeId?.commissionRate || 0,
            earnings: 0,
            commission: 0,
            saleCount: 0,
          };
        }
        staffEarnings[empId].earnings += sale.finalAmount || 0;
        staffEarnings[empId].saleCount += 1;
      }
    });

    // Calculate commission for each staff
    for (const empId in staffEarnings) {
      const employee = await Employee.findById(empId).lean();
      if (employee && employee.commissionRate) {
        staffEarnings[empId].commission =
          (staffEarnings[empId].earnings * employee.commissionRate) / 100;
      }
    }

    // Payment method breakdown
    const paymentBreakdown = {
      cash: {
        count: sales.filter(s => s.paymentMethod === 'cash').length,
        amount: cashSales,
      },
      online: {
        count: sales.filter(s => s.paymentMethod === 'online').length,
        amount: onlineSales,
      },
    };

    return NextResponse.json({
      success: true,
      data: {
        date: date,
        summaryDate: dayStart,
        totalSales,
        cashSales,
        onlineSales,
        totalDiscounts,
        totalClients,
        totalSalesCount: sales.length,
        staffEarnings: Object.values(staffEarnings).sort((a, b) => b.earnings - a.earnings),
        paymentBreakdown,
        sales: salesWithServices,
      },
    });
  } catch (error) {
    console.error('Error fetching detailed report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch detailed report' },
      { status: 500 }
    );
  }
}
