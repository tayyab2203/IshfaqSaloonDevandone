import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Customer from '../../../../models/Customer.js';
import { requireAuth } from '../../../../lib/auth-helpers.js';
import { subDays } from 'date-fns';

export async function GET() {
  try {
    await requireAuth();
    await connectDB();

    // Find customers with last visit between 25-30 days ago
    const twentyFiveDaysAgo = subDays(new Date(), 25);
    const thirtyDaysAgo = subDays(new Date(), 30);

    const customers = await Customer.find({
      lastVisit: {
        $gte: thirtyDaysAgo,
        $lte: twentyFiveDaysAgo,
      },
      isDue: true,
    }).populate('preferredEmployee', 'name');

    return NextResponse.json({ success: true, data: customers });
  } catch (error) {
    console.error('Error fetching due customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch due customers' },
      { status: 500 }
    );
  }
}
