import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import DailySummary from '../../../../models/DailySummary.js';
import { requireAuth } from '../../../../lib/auth-helpers.js';
import { format } from 'date-fns';

export async function POST(request) {
  try {
    await requireAuth();
    await connectDB();
    const body = await request.json();
    const { summaryId, phone } = body;

    const summary = await DailySummary.findById(summaryId);

    if (!summary) {
      return NextResponse.json(
        { success: false, error: 'Summary not found' },
        { status: 404 }
      );
    }

    // Generate summary message
    const message = `Today's Summary: Total Sales: PKR ${summary.totalSales.toLocaleString()}. Cash: PKR ${summary.cashSales.toLocaleString()}. Online: PKR ${summary.onlineSales.toLocaleString()}. Clients: ${summary.totalClients}. Top Earner: ${summary.topEarner.employeeName} - PKR ${summary.topEarner.earnings.toLocaleString()}.`;

    // Mock WhatsApp send
    console.log('WhatsApp Daily Summary Sent:', {
      to: phone || process.env.OWNER_PHONE || '+923001234567',
      message,
      timestamp: new Date().toISOString(),
    });

    // Update sent status
    summary.sentViaWhatsApp = true;
    await summary.save();

    return NextResponse.json({
      success: true,
      data: {
        messageId: `mock_summary_${Date.now()}`,
        to: phone || process.env.OWNER_PHONE || '+923001234567',
        message,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error sending daily summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send summary' },
      { status: 500 }
    );
  }
}
