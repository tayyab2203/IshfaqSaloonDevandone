import { getSession } from '../../../lib/auth-helpers.js';
import PageHeader from '../../../components/admin/PageHeader.js';
import Button from '../../../components/ui/Button.js';
import BookingActionsClient from '../../../components/admin/BookingActions.js';
import { formatDate, formatTime, getStatusBadgeClasses, formatCookiesForHeader } from '../../../lib/utils.js';
import { cookies } from 'next/headers';

async function getBookings(date, status, employeeId) {
  try {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (status) params.append('status', status);
    if (employeeId) params.append('employeeId', employeeId);
    const cookieStore = await cookies();
    const cookieHeader = formatCookiesForHeader(cookieStore);

    const res = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/bookings?${params.toString()}`,
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
    console.error('Error fetching bookings:', error);
    return [];
  }
}

async function getEmployees() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = formatCookiesForHeader(cookieStore);
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/employees`, {
      cache: 'no-store',
      headers: {
        Cookie: cookieHeader,
      },
    });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    return [];
  }
}

export default async function BookingsPage({ searchParams }) {
  const session = await getSession();
  const params = await searchParams;
  const date = params?.date || new Date().toISOString().split('T')[0];
  const status = params?.status || '';
  const employeeId = params?.employeeId || '';

  const bookings = await getBookings(date, status, employeeId);
  const employees = await getEmployees();

  return (
    <div>
      <PageHeader title="Bookings Management" />

      {/* Filters */}
      <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <form method="get" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-dark-charcoal mb-2">Date</label>
            <input
              type="date"
              name="date"
              defaultValue={date}
              className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark-charcoal mb-2">Status</label>
            <select
              name="status"
              defaultValue={status}
              className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
            >
              <option value="">All</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark-charcoal mb-2">Staff</label>
            <select
              name="employeeId"
              defaultValue={employeeId}
              className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
            >
              <option value="">All</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <Button type="submit" className="w-full sm:w-auto">Apply Filters</Button>
          </div>
        </form>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-medium-grey rounded-lg overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-medium-grey">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Client Name
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Service
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Time
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Staff
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
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 lg:px-6 py-8 text-center text-slate-blue">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-medium-grey hover:bg-light-grey"
                  >
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                      {booking.customerId?.name || 'N/A'}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                      {booking.serviceIds?.map((s) => s.name).join(', ') || 'N/A'}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                      {formatDate(booking.bookingDate)} {formatTime(booking.bookingTime)}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">
                      {booking.employeeId?.name || 'Any Available'}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <span
                        className={`px-2 lg:px-3 py-1 rounded text-xs font-semibold ${getStatusBadgeClasses(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <BookingActionsClient booking={booking} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-medium-grey">
          {bookings.length === 0 ? (
            <div className="p-6 text-center text-slate-blue">No bookings found</div>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-dark-charcoal text-sm">
                      {booking.customerId?.name || 'N/A'}
                    </p>
                    <p className="text-xs text-slate-blue mt-1">
                      {booking.serviceIds?.map((s) => s.name).join(', ') || 'N/A'}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getStatusBadgeClasses(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-blue">
                  <div>
                    <span className="font-semibold text-dark-charcoal">Time: </span>
                    {formatDate(booking.bookingDate)} {formatTime(booking.bookingTime)}
                  </div>
                  <div>
                    <span className="font-semibold text-dark-charcoal">Staff: </span>
                    {booking.employeeId?.name || 'Any Available'}
                  </div>
                </div>
                <div className="pt-2">
                  <BookingActionsClient booking={booking} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

