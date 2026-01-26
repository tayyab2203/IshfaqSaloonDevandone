import { getSession } from '../../../lib/auth-helpers.js';
import PageHeader from '../../../components/admin/PageHeader.js';
import { formatDate, formatCurrency, formatCookiesForHeader } from '../../../lib/utils.js';
import { cookies } from 'next/headers';
import Link from 'next/link';

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
                reports.map((report, index) => {
                  const dateStr = report.summaryDate ? new Date(report.summaryDate).toISOString().split('T')[0] : '';
                  return (
                  <tr
                    key={report._id || `report-${report.summaryDate}-${index}`}
                    className="border-b border-medium-grey hover:bg-light-grey cursor-pointer transition-colors group"
                  >
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal font-semibold">
                      <Link 
                        href={`/admin/reports/${dateStr}`}
                        className="hover:text-slate-blue hover:underline transition-colors flex items-center gap-2 group-hover:text-slate-blue"
                      >
                        {formatDate(report.summaryDate)}
                        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal font-bold">
                      <Link href={`/admin/reports/${dateStr}`} className="block">
                        {formatCurrency(report.totalSales || 0)}
                      </Link>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-amber font-bold">
                      <Link href={`/admin/reports/${dateStr}`} className="block">
                        {formatCurrency(report.cashSales || 0)}
                      </Link>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-blue font-bold">
                      <Link href={`/admin/reports/${dateStr}`} className="block">
                        {formatCurrency(report.onlineSales || 0)}
                      </Link>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                      <Link href={`/admin/reports/${dateStr}`} className="block">
                        {report.totalClients || 0}
                      </Link>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-blue">
                      <Link href={`/admin/reports/${dateStr}`} className="block">
                        {report.topEarner?.employeeName || 'N/A'} - {formatCurrency(report.topEarner?.earnings || 0)}
                      </Link>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-medium-grey">
          {reports.length === 0 ? (
            <div className="p-6 text-center text-slate-blue">No reports found</div>
          ) : (
            reports.map((report, index) => {
              const dateStr = report.summaryDate ? new Date(report.summaryDate).toISOString().split('T')[0] : '';
              return (
              <div key={report._id || `report-${report.summaryDate}-${index}`} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <Link 
                    href={`/admin/reports/${dateStr}`}
                    className="font-semibold text-dark-charcoal text-sm hover:text-slate-blue hover:underline transition-colors"
                  >
                    {formatDate(report.summaryDate)}
                  </Link>
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
