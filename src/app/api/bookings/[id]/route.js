import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Booking from '../../../../models/Booking.js';
import Sale from '../../../../models/Sale.js';
import Customer from '../../../../models/Customer.js';
import Employee from '../../../../models/Employee.js';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const booking = await Booking.findById(id)
      .populate('customerId', 'name phone email')
      .populate('serviceIds', 'name price duration')
      .populate('employeeId', 'name role');

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // If status is being changed to 'completed', create a sale
    if (body.status === 'completed' && booking.status !== 'completed') {
      // Get services to calculate total amount
      const Service = (await import('../../../../models/Service.js')).default;
      const services = await Service.find({ _id: { $in: booking.serviceIds } });
      const totalAmount = services.reduce((sum, service) => sum + (service.price || 0), 0);

      // Check if sale already exists
      const existingSale = await Sale.findOne({ bookingId: booking._id });
      
      if (!existingSale) {
        // Get employee (use booking employee or assign default)
        let employeeId = booking.employeeId;
        if (!employeeId) {
          // Find first active employee
          const defaultEmployee = await Employee.findOne({ status: 'active' });
          employeeId = defaultEmployee?._id;
        }

        // Create sale
        const sale = new Sale({
          bookingId: booking._id,
          customerId: booking.customerId,
          employeeId: employeeId,
          amount: totalAmount,
          paymentMethod: body.paymentMethod || 'cash',
          discountApplied: body.discountApplied || 0,
          finalAmount: totalAmount - (body.discountApplied || 0),
          saleDate: new Date(),
        });

        await sale.save();

        // Update customer visit count and last visit
        const customer = await Customer.findById(booking.customerId);
        if (customer) {
          customer.visitCount = (customer.visitCount || 0) + 1;
          customer.lastVisit = new Date();
          customer.isDue = false; // Reset due flag
          await customer.save();
        }

        // Populate for response
        await booking.populate('customerId', 'name phone email');
        await booking.populate('serviceIds', 'name price duration');
        if (booking.employeeId) {
          await booking.populate('employeeId', 'name role');
        }

        // Return booking with sale ID
        return NextResponse.json({ 
          success: true, 
          data: {
            ...booking.toObject(),
            saleId: sale._id.toString(),
          }
        });
      }
    }

    // Update booking
    Object.assign(booking, body);
    await booking.save();

    // Populate for response
    await booking.populate('customerId', 'name phone email');
    await booking.populate('serviceIds', 'name price duration');
    if (booking.employeeId) {
      await booking.populate('employeeId', 'name role');
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}
