import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import DailySummary from '../../../../models/DailySummary.js';
import Sale from '../../../../models/Sale.js';
import Employee from '../../../../models/Employee.js';
import { requireAuth } from '../../../../lib/auth-helpers.js';
import { startOfDay, endOfDay, eachDayOfInterval, format } from 'date-fns';

// Helper function to generate report from sales data for a specific date
async function generateReportForDate(date) {
  const dayStart = startOfDay(new Date(date));
  const dayEnd = endOfDay(new Date(date));

  // Get all sales for the day
  const sales = await Sale.find({
    saleDate: {
      $gte: dayStart,
      $lte: dayEnd,
    },
  }).lean();

  const totalSales = sales.reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);
  const cashSales = sales
    .filter(sale => sale.paymentMethod === 'cash')
    .reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);
  const onlineSales = sales
    .filter(sale => sale.paymentMethod === 'online')
    .reduce((sum, sale) => sum + (sale.finalAmount || 0), 0);

  // Unique clients
  const uniqueCustomerIds = [...new Set(sales.map(s => s.customerId?.toString()).filter(Boolean))];
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
    const employee = await Employee.findById(topEarnerData.employeeId).lean();
    if (employee) {
      topEarner = {
        employeeId: employee._id,
        employeeName: employee.name || 'N/A',
        earnings: topEarnerData.amount,
      };
    }
  }

  return {
    summaryDate: dayStart,
    totalSales,
    cashSales,
    onlineSales,
    totalClients,
    topEarner,
  };
}

export async function GET(request) {
  try {
    await requireAuth();
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    let dateRange = [];
    
    if (startDateParam && endDateParam) {
      // Generate reports for date range
      const start = new Date(startDateParam);
      const end = new Date(endDateParam);
      dateRange = eachDayOfInterval({ start, end });
    } else if (startDateParam) {
      // If only start date, generate report for that date
      dateRange = [new Date(startDateParam)];
    } else if (endDateParam) {
      // If only end date, generate report for that date
      dateRange = [new Date(endDateParam)];
    } else {
      // If no dates provided, get all existing summaries (backward compatibility)
      const summaries = await DailySummary.find({})
        .sort({ summaryDate: -1 })
        .limit(30) // Limit to last 30 days
        .lean();
      
      const formattedSummaries = summaries.map(summary => ({
        _id: summary._id,
        summaryDate: summary.summaryDate,
        totalSales: summary.totalSales || 0,
        cashSales: summary.cashSales || 0,
        onlineSales: summary.onlineSales || 0,
        totalClients: summary.totalClients || 0,
        topEarner: {
          employeeId: summary.topEarner?.employeeId || null,
          employeeName: summary.topEarner?.employeeName || 'N/A',
          earnings: summary.topEarner?.earnings || 0,
        },
        summaryData: summary.summaryData || '',
        sentViaWhatsApp: summary.sentViaWhatsApp || false,
        createdAt: summary.createdAt,
        updatedAt: summary.updatedAt,
      }));

      return NextResponse.json({ success: true, data: formattedSummaries });
    }

    // Generate reports for each date in the range
    const reports = await Promise.all(
      dateRange.map(async (date) => {
        const dayStart = startOfDay(date);
        
        // Check if summary exists in database
        const existingSummary = await DailySummary.findOne({ summaryDate: dayStart }).lean();
        
        if (existingSummary) {
          // Use existing summary
          return {
            _id: existingSummary._id,
            summaryDate: existingSummary.summaryDate,
            totalSales: existingSummary.totalSales || 0,
            cashSales: existingSummary.cashSales || 0,
            onlineSales: existingSummary.onlineSales || 0,
            totalClients: existingSummary.totalClients || 0,
            topEarner: {
              employeeId: existingSummary.topEarner?.employeeId || null,
              employeeName: existingSummary.topEarner?.employeeName || 'N/A',
              earnings: existingSummary.topEarner?.earnings || 0,
            },
            summaryData: existingSummary.summaryData || '',
            sentViaWhatsApp: existingSummary.sentViaWhatsApp || false,
            createdAt: existingSummary.createdAt,
            updatedAt: existingSummary.updatedAt,
          };
        } else {
          // Generate report on-demand from sales data
          const report = await generateReportForDate(date);
          return {
            _id: null, // No database ID for on-demand reports
            summaryDate: report.summaryDate,
            totalSales: report.totalSales,
            cashSales: report.cashSales,
            onlineSales: report.onlineSales,
            totalClients: report.totalClients,
            topEarner: report.topEarner,
            summaryData: '',
            sentViaWhatsApp: false,
            createdAt: null,
            updatedAt: null,
          };
        }
      })
    );

    // Sort by date descending
    reports.sort((a, b) => new Date(b.summaryDate) - new Date(a.summaryDate));

    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    console.error('Error fetching daily reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
