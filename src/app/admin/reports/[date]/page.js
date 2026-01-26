import { getSession } from '../../../../lib/auth-helpers.js';
import PageHeader from '../../../../components/admin/PageHeader.js';
import { formatDate, formatCurrency, formatCookiesForHeader } from '../../../../lib/utils.js';
import { cookies } from 'next/headers';
import Link from 'next/link';

async function getDetailedReport(date) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = formatCookiesForHeader(cookieStore);

    const res = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/reports/daily/${date}`,
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
    console.error('Error fetching detailed report:', error);
    return null;
  }
}

export default async function DetailedReportPage({ params }) {
  const session = await getSession();
  const { date } = await params;
  const report = await getDetailedReport(date);

  if (!report) {
    return (
      <div>
        <PageHeader title="Detailed Report" />
        <div className="bg-white border border-medium-grey rounded-lg p-8 text-center">
          <p className="text-slate-blue text-lg mb-4">Report not found for this date.</p>
          <Link
            href="/admin/reports"
            className="inline-block px-6 py-2.5 bg-gradient-to-r from-dark-charcoal to-[#2d3139] text-white rounded-lg font-semibold hover:from-slate-blue hover:to-[#7a8294] transition-all duration-300"
            style={{ color: '#FFFFFF' }}
          >
            Back to Reports
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title={`Detailed Report - ${formatDate(report.summaryDate)}`}
        actions={
          <Link
            href="/admin/reports"
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-medium-grey text-dark-charcoal rounded-lg font-semibold hover:bg-slate-blue hover:text-white transition-all duration-300 text-sm sm:text-base"
          >
            Back to Reports
          </Link>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="text-slate-blue text-xs sm:text-sm font-semibold mb-2">Total Sales</div>
          <div className="text-2xl sm:text-3xl font-bold text-dark-charcoal">{formatCurrency(report.totalSales)}</div>
          <div className="text-xs text-slate-blue mt-1">{report.totalSalesCount} transactions</div>
        </div>
        <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="text-amber text-xs sm:text-sm font-semibold mb-2">Cash Sales</div>
          <div className="text-2xl sm:text-3xl font-bold text-amber">{formatCurrency(report.cashSales)}</div>
          <div className="text-xs text-slate-blue mt-1">{report.paymentBreakdown.cash.count} transactions</div>
        </div>
        <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="text-blue text-xs sm:text-sm font-semibold mb-2">Online Sales</div>
          <div className="text-2xl sm:text-3xl font-bold text-blue">{formatCurrency(report.onlineSales)}</div>
          <div className="text-xs text-slate-blue mt-1">{report.paymentBreakdown.online.count} transactions</div>
        </div>
        <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="text-slate-blue text-xs sm:text-sm font-semibold mb-2">Total Clients</div>
          <div className="text-2xl sm:text-3xl font-bold text-dark-charcoal">{report.totalClients}</div>
          <div className="text-xs text-slate-blue mt-1">Unique customers</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="text-slate-blue text-xs sm:text-sm font-semibold mb-2">Total Discounts</div>
          <div className="text-xl sm:text-2xl font-bold text-dark-charcoal">{formatCurrency(report.totalDiscounts)}</div>
        </div>
        <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="text-slate-blue text-xs sm:text-sm font-semibold mb-2">Net Revenue</div>
          <div className="text-xl sm:text-2xl font-bold text-dark-charcoal">{formatCurrency(report.totalSales - report.totalDiscounts)}</div>
        </div>
      </div>

      {/* Staff Earnings Breakdown */}
      {report.staffEarnings && report.staffEarnings.length > 0 && (
        <div className="bg-white border border-medium-grey rounded-lg overflow-hidden shadow-sm mb-6">
          <div className="p-4 sm:p-6 border-b border-medium-grey bg-gradient-to-r from-light-grey to-white">
            <h2 className="text-lg sm:text-xl font-bold text-dark-charcoal">Staff Earnings Breakdown</h2>
          </div>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-medium-grey">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                    Employee
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                    Sales Count
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                    Total Earnings
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                    Commission Rate
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                    Commission
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.staffEarnings.map((staff, index) => (
                  <tr
                    key={staff.employeeId || `staff-${index}`}
                    className="border-b border-medium-grey hover:bg-light-grey"
                  >
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal font-semibold">
                      {staff.employeeName}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                      {staff.saleCount}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal font-bold">
                      {formatCurrency(staff.earnings)}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-blue">
                      {staff.commissionRate}%
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-blue font-semibold">
                      {formatCurrency(staff.commission)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-medium-grey">
            {report.staffEarnings.map((staff, index) => (
              <div key={staff.employeeId || `staff-${index}`} className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-dark-charcoal text-sm">{staff.employeeName}</p>
                    <p className="text-xs text-slate-blue mt-1">Sales: {staff.saleCount}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-blue">Earnings: </span>
                    <span className="font-bold text-dark-charcoal">{formatCurrency(staff.earnings)}</span>
                  </div>
                  <div>
                    <span className="text-slate-blue">Rate: </span>
                    <span className="font-semibold text-slate-blue">{staff.commissionRate}%</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-blue">Commission: </span>
                    <span className="font-semibold text-slate-blue">{formatCurrency(staff.commission)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Sales Transactions */}
      <div className="bg-white border border-medium-grey rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-medium-grey bg-gradient-to-r from-light-grey to-white">
          <h2 className="text-lg sm:text-xl font-bold text-dark-charcoal">All Sales Transactions</h2>
        </div>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-medium-grey">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Time
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Customer
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Employee
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Services
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Amount
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Discount
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Final Amount
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody>
              {report.sales && report.sales.length > 0 ? (
                report.sales.map((sale, index) => (
                  <tr
                    key={sale._id || `sale-${index}`}
                    className="border-b border-medium-grey hover:bg-light-grey"
                  >
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                      {sale.saleDate ? new Date(sale.saleDate).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : 'N/A'}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                      <div>
                        <div className="font-semibold">{sale.customerId?.name || 'N/A'}</div>
                        {sale.customerId?.phone && (
                          <div className="text-xs text-slate-blue">{sale.customerId.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                      {sale.employeeId?.name || 'N/A'}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                      {sale.services && sale.services.length > 0 ? (
                        <div className="space-y-1">
                          {sale.services.map((service, idx) => (
                            <div key={idx} className="text-xs">
                              {service.name} - {formatCurrency(service.price)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-blue">N/A</span>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal font-semibold">
                      {formatCurrency(sale.amount || 0)}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-amber">
                      {sale.discountApplied > 0 ? formatCurrency(sale.discountApplied) : '-'}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal font-bold">
                      {formatCurrency(sale.finalAmount || 0)}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        sale.paymentMethod === 'cash'
                          ? 'bg-amber/20 text-amber border border-amber/30'
                          : 'bg-blue/20 text-blue border border-blue/30'
                      }`}>
                        {sale.paymentMethod === 'cash' ? 'Cash' : 'Online'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 lg:px-6 py-8 text-center text-slate-blue">
                    No sales found for this date
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-medium-grey">
          {report.sales && report.sales.length > 0 ? (
            report.sales.map((sale, index) => (
              <div key={sale._id || `sale-${index}`} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-dark-charcoal text-sm">{sale.customerId?.name || 'N/A'}</p>
                    {sale.customerId?.phone && (
                      <p className="text-xs text-slate-blue mt-1">{sale.customerId.phone}</p>
                    )}
                    <p className="text-xs text-slate-blue mt-1">
                      {sale.saleDate ? new Date(sale.saleDate).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : 'N/A'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold shrink-0 ${
                    sale.paymentMethod === 'cash'
                      ? 'bg-amber/20 text-amber border border-amber/30'
                      : 'bg-blue/20 text-blue border border-blue/30'
                  }`}>
                    {sale.paymentMethod === 'cash' ? 'Cash' : 'Online'}
                  </span>
                </div>
                <div className="space-y-2">
                  {sale.employeeId?.name && (
                    <div className="text-xs">
                      <span className="text-slate-blue">Employee: </span>
                      <span className="font-semibold text-dark-charcoal">{sale.employeeId.name}</span>
                    </div>
                  )}
                  {sale.services && sale.services.length > 0 && (
                    <div className="text-xs">
                      <span className="text-slate-blue">Services: </span>
                      <div className="mt-1 space-y-1">
                        {sale.services.map((service, idx) => (
                          <div key={idx} className="text-dark-charcoal">
                            • {service.name} - {formatCurrency(service.price)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-medium-grey">
                  <div>
                    <span className="text-slate-blue">Amount: </span>
                    <span className="font-semibold text-dark-charcoal">{formatCurrency(sale.amount || 0)}</span>
                  </div>
                  {sale.discountApplied > 0 && (
                    <div>
                      <span className="text-slate-blue">Discount: </span>
                      <span className="font-semibold text-amber">{formatCurrency(sale.discountApplied)}</span>
                    </div>
                  )}
                  <div className={sale.discountApplied > 0 ? 'col-span-2' : 'col-span-1'}>
                    <span className="text-slate-blue">Final: </span>
                    <span className="font-bold text-dark-charcoal text-sm">{formatCurrency(sale.finalAmount || 0)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-blue">No sales found for this date</div>
          )}
        </div>
      </div>
    </div>
  );
}
