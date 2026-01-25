import { getSession } from '../../../lib/auth-helpers.js';
import PageHeader from '../../../components/admin/PageHeader.js';
import { formatDate, formatCurrency, formatCookiesForHeader } from '../../../lib/utils.js';
import { cookies } from 'next/headers';

async function getDailyReports(startDate, endDate) {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const cookieStore = await cookies();
    const cookieHeader = formatCookiesForHeader(cookieStore);

    const res = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/reports/daily?${params.toString()}`,
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
    console.error('Error fetching reports:', error);
    return [];
  }
}

export default async function ReportsPage({ searchParams }) {
  const session = await getSession();
  const params = await searchParams;
  const startDate = params?.startDate || '';
  const endDate = params?.endDate || '';

  const reports = await getDailyReports(startDate, endDate);

  return (
    <div>
      <PageHeader title="Reports" />

      {/* Date Range Filter */}
      <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
        <h3 className="text-lg font-bold text-dark-charcoal mb-4">Filter Reports</h3>
        <form method="get" className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
            <label className="text-sm font-semibold text-dark-charcoal whitespace-nowrap">Start Date:</label>
            <input
              type="date"
              name="startDate"
              defaultValue={startDate}
              className="flex-1 px-4 py-2.5 border-2 border-medium-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-blue focus:border-transparent transition-all"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
            <label className="text-sm font-semibold text-dark-charcoal whitespace-nowrap">End Date:</label>
            <input
              type="date"
              name="endDate"
              defaultValue={endDate}
              className="flex-1 px-4 py-2.5 border-2 border-medium-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-blue focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-dark-charcoal to-[#2d3139] text-white rounded-lg font-semibold hover:from-slate-blue hover:to-[#7a8294] transition-all duration-300 transform hover:scale-105 w-full sm:w-auto shadow-md"
              style={{ color: '#FFFFFF' }}
            >
              View Reports
            </button>
            {(startDate || endDate) && (
              <a
                href="/admin/reports"
                className="px-6 py-2.5 bg-medium-grey text-dark-charcoal rounded-lg font-semibold hover:bg-slate-blue hover:text-white transition-all duration-300 w-full sm:w-auto text-center flex items-center justify-center"
              >
                Clear
              </a>
            )}
          </div>
        </form>
        {(!startDate || !endDate) && (
          <p className="mt-4 text-sm text-slate-blue">
            {!startDate && !endDate 
              ? 'Showing all reports. Select date range to filter.'
              : 'Please select both start and end dates for accurate filtering.'}
          </p>
        )}
      </div>

      {/* Daily Summary Table */}
      <div className="bg-white border border-medium-grey rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-medium-grey bg-gradient-to-r from-light-grey to-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-dark-charcoal">
              Daily Summary Reports
            </h2>
            {reports.length > 0 && (
              <div className="text-sm text-slate-blue">
                <span className="font-semibold text-dark-charcoal">{reports.length}</span> {reports.length === 1 ? 'report' : 'reports'} found
              </div>
            )}
          </div>
        </div>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-medium-grey">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Date
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Total Sales
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Cash
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Online
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Clients
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Top Earner
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 lg:px-6 py-8 text-center text-slate-blue">
                    No reports found
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr
                    key={report._id}
                    className="border-b border-medium-grey hover:bg-light-grey"
                  >
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal font-semibold">
                      {formatDate(report.summaryDate)}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal font-bold">
                      {formatCurrency(report.totalSales || 0)}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-amber font-bold">
                      {formatCurrency(report.cashSales || 0)}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-blue font-bold">
                      {formatCurrency(report.onlineSales || 0)}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                      {report.totalClients || 0}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-blue">
                      {report.topEarner?.employeeName || 'N/A'} - {formatCurrency(report.topEarner?.earnings || 0)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-medium-grey">
          {reports.length === 0 ? (
            <div className="p-6 text-center text-slate-blue">No reports found</div>
          ) : (
            reports.map((report) => (
              <div key={report._id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-dark-charcoal text-sm">
                    {formatDate(report.summaryDate)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-blue">Total Sales: </span>
                    <span className="font-bold text-dark-charcoal">{formatCurrency(report.totalSales || 0)}</span>
                  </div>
                  <div>
                    <span className="text-slate-blue">Clients: </span>
                    <span className="font-semibold text-dark-charcoal">{report.totalClients || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-blue">Cash: </span>
                    <span className="font-bold text-amber">{formatCurrency(report.cashSales || 0)}</span>
                  </div>
                  <div>
                    <span className="text-slate-blue">Online: </span>
                    <span className="font-bold text-blue">{formatCurrency(report.onlineSales || 0)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-blue">Top Earner: </span>
                    <span className="font-semibold text-dark-charcoal">{report.topEarner?.employeeName || 'N/A'}</span>
                    <span className="text-slate-blue ml-2">({formatCurrency(report.topEarner?.earnings || 0)})</span>
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
