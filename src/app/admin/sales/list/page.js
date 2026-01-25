import { getSession } from '../../../../lib/auth-helpers.js';
import PageHeader from '../../../../components/admin/PageHeader.js';
import { formatDate, formatCurrency, formatCookiesForHeader } from '../../../../lib/utils.js';
import { cookies } from 'next/headers';
import SalesListClient from '../../../../components/admin/SalesListClient.js';

async function getSales(date) {
  try {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    const cookieStore = await cookies();
    const cookieHeader = formatCookiesForHeader(cookieStore);

    const res = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/sales?${params.toString()}`,
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
    console.error('Error fetching sales:', error);
    return [];
  }
}

export default async function SalesListPage({ searchParams }) {
  const session = await getSession();
  const params = await searchParams;
  const date = params?.date || new Date().toISOString().split('T')[0];

  const sales = await getSales(date);

  return (
    <div>
      <PageHeader
        title="Sales List"
        description="View and print receipts for all sales"
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
          <button
            type="submit"
            className="px-6 py-2 bg-dark-charcoal text-white rounded-lg hover:bg-[#2d3139] transition-colors"
          >
            View
          </button>
        </form>
      </div>

      <SalesListClient sales={sales} />
    </div>
  );
}
