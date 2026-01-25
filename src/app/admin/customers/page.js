import { getSession } from '../../../lib/auth-helpers.js';
import PageHeader from '../../../components/admin/PageHeader.js';
import Button from '../../../components/ui/Button.js';
import { formatDate, getStatusBadgeClasses, formatCookiesForHeader } from '../../../lib/utils.js';
import { cookies } from 'next/headers';
import Link from 'next/link';
import RemindButton from '../../../components/admin/RemindButton.js';

async function getCustomers(search, isDue) {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (isDue) params.append('isDue', 'true');
    const cookieStore = await cookies();
    const cookieHeader = formatCookiesForHeader(cookieStore);

    const res = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/customers?${params.toString()}`,
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
    console.error('Error fetching customers:', error);
    return [];
  }
}

export default async function CustomersPage({ searchParams }) {
  const session = await getSession();
  const params = await searchParams;
  const search = params?.search || '';
  const isDue = params?.isDue || '';

  const customers = await getCustomers(search, isDue);

  return (
    <div>
      <PageHeader title="Customer Management" />

      {/* Filters */}
      <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <form method="get" className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search by name or phone..."
            defaultValue={search}
            className="flex-1 px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isDue"
              defaultChecked={isDue === 'true'}
              className="w-4 h-4"
            />
            <span className="text-sm text-dark-charcoal">Due for reminder</span>
          </label>
          <Button type="submit" className="w-full sm:w-auto">Search</Button>
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-medium-grey rounded-lg overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-medium-grey">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Name
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Phone
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Email
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Visits
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Last Visit
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 lg:px-6 py-8 text-center text-slate-blue">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="border-b border-medium-grey hover:bg-light-grey"
                  >
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal font-semibold">
                      {customer.name}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">{customer.phone}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-blue">{customer.email || 'N/A'}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">{customer.visitCount || 0}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-blue">
                      {customer.lastVisit ? formatDate(customer.lastVisit) : 'Never'}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      {customer.isDue ? (
                        <span className="px-2 lg:px-3 py-1 rounded text-xs font-semibold bg-warning-bg text-warning-text border border-amber-300">
                          Due
                        </span>
                      ) : (
                        <span className="px-2 lg:px-3 py-1 rounded text-xs font-semibold bg-success-bg text-success-text border border-green-300">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/customers/${customer._id}`}
                          className="text-xs lg:text-sm text-blue hover:underline"
                        >
                          View
                        </Link>
                        {customer.isDue && <RemindButton customerId={customer._id} />}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-medium-grey">
          {customers.length === 0 ? (
            <div className="p-6 text-center text-slate-blue">No customers found</div>
          ) : (
            customers.map((customer) => (
              <div key={customer._id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-dark-charcoal text-sm">{customer.name}</p>
                    <p className="text-xs text-slate-blue mt-1">{customer.phone}</p>
                  </div>
                  {customer.isDue ? (
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-warning-bg text-warning-text border border-amber-300">
                      Due
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-success-bg text-success-text border border-green-300">
                      Active
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-blue">
                  <div>
                    <span className="font-semibold text-dark-charcoal">Email: </span>
                    {customer.email || 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold text-dark-charcoal">Visits: </span>
                    {customer.visitCount || 0}
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-dark-charcoal">Last Visit: </span>
                    {customer.lastVisit ? formatDate(customer.lastVisit) : 'Never'}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/admin/customers/${customer._id}`}
                    className="text-xs text-blue hover:underline"
                  >
                    View
                  </Link>
                  {customer.isDue && <RemindButton customerId={customer._id} />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
