import { getSession } from '../../../lib/auth-helpers.js';
import PageHeader from '../../../components/admin/PageHeader.js';
import Button from '../../../components/ui/Button.js';
import Link from 'next/link';
import { formatDate, formatCurrency, formatCookiesForHeader } from '../../../lib/utils.js';
import { cookies } from 'next/headers';

async function getDailySummary(date) {
  try {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    const cookieStore = await cookies();
    const cookieHeader = formatCookiesForHeader(cookieStore);

    const res = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/sales/daily-summary?${params.toString()}`,
      { 
        cache: 'no-store',
        headers: {
          Cookie: cookieHeader,
        },
      }
    );
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    return null;
  }
}

async function getEmployeeEarnings() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = formatCookiesForHeader(cookieStore);

    const res = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/sales/employee-earnings`,
      { 
        cache: 'no-store',
        headers: {
          Cookie: cookieHeader,
        },
      }
    );
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching employee earnings:', error);
    return [];
  }
}

export default async function SalesPage({ searchParams }) {
  const session = await getSession();
  const params = await searchParams;
  const date = params?.date || new Date().toISOString().split('T')[0];

  const dailySummary = await getDailySummary(date);
  const employeeEarnings = await getEmployeeEarnings();

  return (
    <div>
      <PageHeader
        title="Sales & Finance"
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/admin/sales/list">
              <Button variant="secondary" className="w-full sm:w-auto">
                View All Sales
              </Button>
            </Link>
            <form action="/api/export/csv" method="post">
              <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                Export to CSV
              </Button>
            </form>
          </div>
        }
      />

      {/* Date Filter */}
      <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <form method="get" className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center gap-2">
            <span className="text-sm font-semibold text-dark-charcoal">Date:</span>
            <input
              type="date"
              name="date"
              defaultValue={date}
              className="flex-1 px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
            />
          </label>
          <Button type="submit" className="w-full sm:w-auto">View</Button>
        </form>
      </div>

      {dailySummary && (
        <>
          {/* Daily Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-blue mb-2">Total Sales</h3>
              <p className="text-2xl sm:text-3xl font-bold text-dark-charcoal">
                {formatCurrency(dailySummary.totalSales)}
              </p>
            </div>
            <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-blue mb-2">Cash Sales</h3>
              <p className="text-2xl sm:text-3xl font-bold text-amber">
                {formatCurrency(dailySummary.cashSales)}
              </p>
            </div>
            <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-blue mb-2">Online Sales</h3>
              <p className="text-2xl sm:text-3xl font-bold text-blue">
                {formatCurrency(dailySummary.onlineSales)}
              </p>
            </div>
          </div>

          {/* Cash vs Online Breakdown */}
          <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-dark-charcoal mb-4">Payment Method Breakdown</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-amber bg-opacity-10 rounded">
                <span className="font-semibold text-dark-charcoal">Cash</span>
                <span className="font-bold text-amber">{formatCurrency(dailySummary.cashSales)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue bg-opacity-10 rounded">
                <span className="font-semibold text-dark-charcoal">Online</span>
                <span className="font-bold text-blue">{formatCurrency(dailySummary.onlineSales)}</span>
              </div>
            </div>
          </div>

          {/* Staff-wise Earnings */}
          <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-dark-charcoal mb-4">Staff-wise Earnings</h2>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-medium-grey">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                      Staff Name
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                      Earnings
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                      Commission
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dailySummary.staffEarnings.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-4 lg:px-6 py-8 text-center text-slate-blue">
                        No earnings data
                      </td>
                    </tr>
                  ) : (
                    dailySummary.staffEarnings.map((staff) => (
                      <tr
                        key={staff.employeeId}
                        className="border-b border-medium-grey hover:bg-light-grey"
                      >
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal font-semibold">
                          {staff.employeeName}
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                          {formatCurrency(staff.earnings)}
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-green font-bold">
                          {formatCurrency(staff.commission)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {dailySummary.staffEarnings.length === 0 ? (
                <div className="p-4 text-center text-slate-blue">No earnings data</div>
              ) : (
                dailySummary.staffEarnings.map((staff) => (
                  <div key={staff.employeeId} className="p-3 border border-medium-grey rounded">
                    <p className="font-semibold text-dark-charcoal text-sm mb-2">{staff.employeeName}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-blue">Earnings: </span>
                        <span className="font-semibold text-dark-charcoal">{formatCurrency(staff.earnings)}</span>
                      </div>
                      <div>
                        <span className="text-slate-blue">Commission: </span>
                        <span className="font-semibold text-green">{formatCurrency(staff.commission)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Discounts Tracking */}
          <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-dark-charcoal mb-4">Discounts Applied</h2>
            <p className="text-xl sm:text-2xl font-bold text-dark-charcoal">
              {formatCurrency(dailySummary.totalDiscounts)}
            </p>
          </div>
        </>
      )}

      {/* Monthly Employee Earnings */}
      <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-dark-charcoal mb-4">Monthly Earnings by Staff</h2>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-medium-grey">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Staff Name
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Total Earnings
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Commission
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Sales Count
                </th>
              </tr>
            </thead>
            <tbody>
              {employeeEarnings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 lg:px-6 py-8 text-center text-slate-blue">
                    No earnings data
                  </td>
                </tr>
              ) : (
                employeeEarnings.map((emp) => (
                  <tr
                    key={emp.employeeId}
                    className="border-b border-medium-grey hover:bg-light-grey"
                  >
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal font-semibold">
                      {emp.employeeName}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                      {formatCurrency(emp.totalEarnings)}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-green font-bold">
                      {formatCurrency(emp.commission)}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-blue">{emp.salesCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {employeeEarnings.length === 0 ? (
            <div className="p-4 text-center text-slate-blue">No earnings data</div>
          ) : (
            employeeEarnings.map((emp) => (
              <div key={emp.employeeId} className="p-3 border border-medium-grey rounded">
                <p className="font-semibold text-dark-charcoal text-sm mb-2">{emp.employeeName}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-blue">Earnings: </span>
                    <span className="font-semibold text-dark-charcoal">{formatCurrency(emp.totalEarnings)}</span>
                  </div>
                  <div>
                    <span className="text-slate-blue">Commission: </span>
                    <span className="font-semibold text-green">{formatCurrency(emp.commission)}</span>
                  </div>
                  <div>
                    <span className="text-slate-blue">Sales: </span>
                    <span className="font-semibold text-dark-charcoal">{emp.salesCount}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
