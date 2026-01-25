import { getSession } from '../../../../lib/auth-helpers.js';
import PageHeader from '../../../../components/admin/PageHeader.js';
import Button from '../../../../components/ui/Button.js';
import Link from 'next/link';
import { formatDate, formatCurrency, formatCookiesForHeader } from '../../../../lib/utils.js';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

async function getCustomerData(id) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = formatCookiesForHeader(cookieStore);
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/customers/${id}`,
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
    console.error('Error fetching customer:', error);
    return null;
  }
}

export default async function CustomerDetailsPage({ params }) {
  const session = await getSession();
  const { id } = await params;
  const customerData = await getCustomerData(id);

  if (!customerData) {
    notFound();
  }

  const { customer, recentBookings } = customerData;

  return (
    <div>
      <PageHeader
        title={`Customer: ${customer.name}`}
        actions={
          <Link href="/admin/customers">
            <Button variant="secondary">Back to List</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white border border-medium-grey rounded-lg p-6">
            <h2 className="text-xl font-bold text-dark-charcoal mb-4">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-blue">Name</label>
                <p className="text-dark-charcoal font-semibold">{customer.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Phone</label>
                <p className="text-dark-charcoal">{customer.phone}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Email</label>
                <p className="text-dark-charcoal">{customer.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Visit Count</label>
                <p className="text-dark-charcoal">{customer.visitCount || 0}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Last Visit</label>
                <p className="text-dark-charcoal">
                  {customer.lastVisit ? formatDate(customer.lastVisit) : 'Never'}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Status</label>
                <p className="text-dark-charcoal">
                  {customer.isDue ? (
                    <span className="px-3 py-1 rounded text-xs font-semibold bg-warning-bg text-warning-text border border-amber-300">
                      Due for Reminder
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded text-xs font-semibold bg-success-bg text-success-text border border-green-300">
                      Active
                    </span>
                  )}
                </p>
              </div>
              {customer.preferredEmployee && (
                <div>
                  <label className="text-sm font-semibold text-slate-blue">Preferred Employee</label>
                  <p className="text-dark-charcoal">{customer.preferredEmployee.name}</p>
                </div>
              )}
            </div>
            {customer.notes && (
              <div className="mt-4">
                <label className="text-sm font-semibold text-slate-blue">Notes</label>
                <p className="text-dark-charcoal mt-2 p-3 bg-light-grey rounded">{customer.notes}</p>
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="bg-white border border-medium-grey rounded-lg p-6">
            <h2 className="text-xl font-bold text-dark-charcoal mb-4">Booking History</h2>
            {recentBookings && recentBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-medium-grey">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-bold text-dark-charcoal">Date</th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-dark-charcoal">Time</th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-dark-charcoal">Services</th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-dark-charcoal">Staff</th>
                      <th className="px-4 py-2 text-left text-sm font-bold text-dark-charcoal">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking._id} className="border-b border-medium-grey">
                        <td className="px-4 py-2 text-dark-charcoal">{formatDate(booking.bookingDate)}</td>
                        <td className="px-4 py-2 text-dark-charcoal">{booking.bookingTime}</td>
                        <td className="px-4 py-2 text-dark-charcoal">
                          {booking.serviceIds?.map((s) => s.name).join(', ') || 'N/A'}
                        </td>
                        <td className="px-4 py-2 text-dark-charcoal">
                          {booking.employeeId?.name || 'Any Available'}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              booking.status === 'completed'
                                ? 'bg-success-bg text-success-text'
                                : booking.status === 'cancelled'
                                ? 'bg-error-bg text-error-text'
                                : 'bg-info-bg text-info-text'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-blue">No booking history</p>
            )}
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-medium-grey rounded-lg p-6">
            <h2 className="text-xl font-bold text-dark-charcoal mb-4">Actions</h2>
            <div className="space-y-3">
              <Link href={`/admin/bookings?customerId=${customer._id}`}>
                <Button variant="primary" className="w-full">
                  View Bookings
                </Button>
              </Link>
              {customer.isDue && (
                <form action="/api/whatsapp/send-reminder" method="POST" className="w-full">
                  <input type="hidden" name="customerId" value={customer._id} />
                  <Button type="submit" variant="secondary" className="w-full">
                    Send Reminder
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
