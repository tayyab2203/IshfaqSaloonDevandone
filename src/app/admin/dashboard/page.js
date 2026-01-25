import { getSession } from '../../../lib/auth-helpers.js';
import StatCard from '../../../components/admin/StatCard.js';
import PageHeader from '../../../components/admin/PageHeader.js';
import Button from '../../../components/ui/Button.js';
import CloseDayButton from '../../../components/admin/CloseDayButton.js';
import AddWalkInButton from '../../../components/admin/AddWalkInButton.js';
import { formatCurrency, formatCookiesForHeader } from '../../../lib/utils.js';
import { cookies } from 'next/headers';

async function getDashboardData() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = formatCookiesForHeader(cookieStore);
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/dashboard/overview`, {
      cache: 'no-store',
      headers: {
        Cookie: cookieHeader,
      },
    });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return null;
  }
}

export default async function DashboardPage() {
  const session = await getSession();
  const dashboardData = await getDashboardData();

  const stats = dashboardData || {
    todayTotalSale: 0,
    cashSales: 0,
    onlineSales: 0,
    clientsToday: 0,
    topEarner: { name: 'N/A', earnings: 0 },
    tomorrowBookings: 0,
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        actions={
          <>
            <AddWalkInButton />
            <CloseDayButton />
            <Button variant="secondary">View Today Summary</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Today's Total Sale"
          value={formatCurrency(stats.todayTotalSale)}
          borderColor="border-slate-blue"
        />
        
        <StatCard
          title="Cash vs Online"
          value={
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-amber text-lg font-bold">
                  {formatCurrency(stats.cashSales)}
                </span>
                <span className="text-sm text-slate-blue">Cash</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue text-lg font-bold">
                  {formatCurrency(stats.onlineSales)}
                </span>
                <span className="text-sm text-slate-blue">Online</span>
              </div>
            </div>
          }
        />

        <StatCard
          title="Clients Today"
          value={stats.clientsToday}
          icon="👥"
        />

        <StatCard
          title="Top Earner Today"
          value={
            <div>
              <p className="text-xl font-bold text-dark-charcoal mb-1">
                {stats.topEarner.name}
              </p>
              <p className="text-lg text-slate-blue font-bold">
                {formatCurrency(stats.topEarner.earnings)}
              </p>
              <span className="text-amber text-xl">★</span>
            </div>
          }
          borderColor="border-slate-blue"
        />

        <StatCard
          title="Tomorrow's Bookings"
          value={stats.tomorrowBookings}
          subtitle="Confirmed bookings"
        />
      </div>
    </div>
  );
}
