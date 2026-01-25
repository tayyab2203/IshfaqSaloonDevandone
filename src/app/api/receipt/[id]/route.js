import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Sale from '../../../../models/Sale.js';
import Settings from '../../../../models/Settings.js';
import { requireAuth } from '../../../../lib/auth-helpers.js';

export async function GET(request, { params }) {
  try {
    await requireAuth();
    await connectDB();
    
    const { id } = await params;
    
    // Try to find sale by ID first
    let sale = await Sale.findById(id)
      .populate('customerId', 'name phone email')
      .populate('employeeId', 'name role')
      .populate('bookingId');
    
    // If not found, try to find by bookingId
    if (!sale) {
      const Booking = (await import('../../../../models/Booking.js')).default;
      const booking = await Booking.findById(id);
      if (booking) {
        sale = await Sale.findOne({ bookingId: booking._id })
          .populate('customerId', 'name phone email')
          .populate('employeeId', 'name role')
          .populate('bookingId');
      }
    }
    
    if (!sale) {
      return NextResponse.json(
        { success: false, error: 'Sale not found' },
        { status: 404 }
      );
    }

    // Get salon settings
    const settings = await Settings.getSettings();

    // Calculate commission if employee exists
    let commissionAmount = 0;
    let commissionRate = 0;
    if (sale.employeeId) {
      const Employee = (await import('../../../../models/Employee.js')).default;
      const employeeId = sale.employeeId._id || sale.employeeId;
      const employee = await Employee.findById(employeeId);
      if (employee) {
        commissionRate = employee.commissionRate || 0;
        const finalAmount = sale.finalAmount || (sale.amount || 0) - (sale.discountApplied || 0);
        commissionAmount = (finalAmount * commissionRate) / 100;
      }
    }

    // Get services from booking
    let services = [];
    const Service = (await import('../../../../models/Service.js')).default;
    
    // Try to get services from booking first
    if (sale.bookingId) {
      // If bookingId is populated, get serviceIds from it
      const bookingServiceIds = sale.bookingId.serviceIds || [];
      if (bookingServiceIds.length > 0) {
        // Check if already populated
        if (typeof bookingServiceIds[0] === 'object' && bookingServiceIds[0].name) {
          services = bookingServiceIds;
        } else {
          services = await Service.find({ _id: { $in: bookingServiceIds } });
        }
      }
    }
    
    // If no services found, try to get from sale directly (if it has serviceIds field)
    if (services.length === 0 && sale.serviceIds && sale.serviceIds.length > 0) {
      // If serviceIds is populated, use it directly
      if (typeof sale.serviceIds[0] === 'object' && sale.serviceIds[0].name) {
        services = sale.serviceIds;
      } else {
        services = await Service.find({ _id: { $in: sale.serviceIds } });
      }
    }
    
    // If still no services, calculate from amount (fallback)
    if (services.length === 0 && sale.amount > 0) {
      services = [{
        name: 'Service',
        price: sale.amount,
        duration: 0,
      }];
    }

    // Prepare receipt data
    const receiptData = {
      saleId: sale._id.toString(),
      receiptNumber: `REC-${sale._id.toString().slice(-8).toUpperCase()}`,
      saleDate: sale.saleDate,
      salon: {
        name: settings.salonName,
        address: settings.salonAddress,
        phone: settings.salonPhone,
        logo: settings.logo,
      },
      customer: {
        name: sale.customerId?.name || sale.bookingId?.customerName || 'Walk-in Customer',
        phone: sale.customerId?.phone || sale.bookingId?.customerPhone || 'N/A',
        email: sale.customerId?.email || sale.bookingId?.customerEmail || null,
      },
      employee: sale.employeeId ? {
        name: sale.employeeId.name,
        role: sale.employeeId.role,
      } : null,
      services: services.map(service => ({
        name: service.name,
        price: service.price,
        duration: service.duration,
      })),
      payment: {
        subtotal: sale.amount || 0,
        discount: sale.discountApplied || 0,
        total: sale.finalAmount || ((sale.amount || 0) - (sale.discountApplied || 0)),
        method: sale.paymentMethod || 'cash',
      },
      commission: {
        amount: commissionAmount,
        rate: commissionRate,
      },
    };

    return NextResponse.json({ success: true, data: receiptData });
  } catch (error) {
    console.error('Error fetching receipt:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch receipt data' },
      { status: 500 }
    );
  }
}
