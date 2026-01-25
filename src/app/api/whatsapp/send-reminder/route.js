import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Customer from '../../../../models/Customer.js';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { customerId } = body;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Generate reminder message
    const message = `It's been a while! We'd love to see you again. Book now: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/book`;

    // Mock WhatsApp send
    console.log('WhatsApp Reminder Sent:', {
      to: customer.phone,
      message,
      timestamp: new Date().toISOString(),
    });

    // Update last reminder sent date
    customer.lastReminderSent = new Date();
    await customer.save();

    return NextResponse.json({
      success: true,
      data: {
        messageId: `mock_reminder_${Date.now()}`,
        to: customer.phone,
        message,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error sending reminder:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send reminder' },
      { status: 500 }
    );
  }
}
