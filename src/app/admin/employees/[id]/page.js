import { getSession } from '../../../../lib/auth-helpers.js';
import PageHeader from '../../../../components/admin/PageHeader.js';
import Button from '../../../../components/ui/Button.js';
import EmployeeImage from '../../../../components/admin/EmployeeImage.js';
import Link from 'next/link';
import { formatDate, formatCurrency, formatCookiesForHeader } from '../../../../lib/utils.js';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

async function getEmployeeData(id) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = formatCookiesForHeader(cookieStore);
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/employees/${id}`,
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
    console.error('Error fetching employee:', error);
    return null;
  }
}

export default async function EmployeeDetailsPage({ params }) {
  const session = await getSession();
  const { id } = await params;
  const employeeData = await getEmployeeData(id);

  if (!employeeData) {
    notFound();
  }

  const { employee, currentMonthEarnings, commission, totalBookings, recentBookings, attendance } = employeeData;

  return (
    <div>
      <PageHeader
        title={`Employee: ${employee.name}`}
        actions={
          <>
            <Link href={`/admin/employees/${id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Link href="/admin/employees">
              <Button variant="secondary">Back to List</Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Photo */}
          {employee.image && (
            <div className="bg-white border border-medium-grey rounded-lg p-6">
              <h2 className="text-xl font-bold text-dark-charcoal mb-4">Photo</h2>
              <EmployeeImage
                src={employee.image}
                alt={employee.name}
                className="w-48 h-48 object-cover rounded-lg border border-medium-grey"
                fallbackInitial={employee.name.charAt(0).toUpperCase()}
              />
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold text-dark-charcoal mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-blue">Name</label>
                <p className="text-dark-charcoal font-semibold">{employee.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Phone</label>
                <p className="text-dark-charcoal">{employee.phone}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Role</label>
                <p className="text-dark-charcoal capitalize">{employee.role}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Status</label>
                <p className="text-dark-charcoal capitalize">{employee.status}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Commission Rate</label>
                <p className="text-dark-charcoal">{employee.commissionRate}%</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Joined Date</label>
                <p className="text-dark-charcoal">{formatDate(employee.joinedDate)}</p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white border border-medium-grey rounded-lg p-6">
            <h2 className="text-xl font-bold text-dark-charcoal mb-4">Services</h2>
            {employee.services && employee.services.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {employee.services.map((service) => (
                  <span
                    key={service._id}
                    className="px-3 py-1 bg-slate-blue bg-opacity-10 text-slate-blue rounded text-sm"
                  >
                    {service.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-blue">No services assigned</p>
            )}
          </div>

          {/* Working Days */}
          {employee.workingDays && employee.workingDays.length > 0 && (
            <div className="bg-white border border-medium-grey rounded-lg p-6">
              <h2 className="text-xl font-bold text-dark-charcoal mb-4">Working Days</h2>
              <div className="flex flex-wrap gap-2">
                {employee.workingDays.map((day) => (
                  <span
                    key={day}
                    className="px-3 py-1 bg-green bg-opacity-10 text-green rounded text-sm"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent Bookings */}
          <div className="bg-white border border-medium-grey rounded-lg p-6">
            <h2 className="text-xl font-bold text-dark-charcoal mb-4">Recent Bookings</h2>
            {recentBookings && recentBookings.length > 0 ? (
              <div className="space-y-2">
                {recentBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex justify-between items-center p-3 border border-medium-grey rounded"
                  >
                    <div>
                      <p className="font-semibold text-dark-charcoal">
                        {booking.customerId?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-slate-blue">
                        {booking.serviceIds?.map((s) => s.name).join(', ') || 'N/A'}
                      </p>
                    </div>
                    <p className="text-sm text-dark-charcoal">
                      {formatDate(booking.bookingDate)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-blue">No recent bookings</p>
            )}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Earnings Stats */}
          <div className="bg-white border border-medium-grey rounded-lg p-6">
            <h2 className="text-xl font-bold text-dark-charcoal mb-4">Current Month</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-slate-blue">Total Earnings</label>
                <p className="text-2xl font-bold text-dark-charcoal">
                  {formatCurrency(currentMonthEarnings)}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Commission</label>
                <p className="text-2xl font-bold text-green">{formatCurrency(commission)}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Total Bookings</label>
                <p className="text-2xl font-bold text-dark-charcoal">{totalBookings}</p>
              </div>
            </div>
          </div>

          {/* Recent Attendance */}
          <div className="bg-white border border-medium-grey rounded-lg p-6">
            <h2 className="text-xl font-bold text-dark-charcoal mb-4">Recent Attendance</h2>
            {attendance && attendance.length > 0 ? (
              <div className="space-y-2">
                {attendance.slice(0, 7).map((record) => (
                  <div
                    key={record._id}
                    className="flex justify-between items-center p-2 border border-medium-grey rounded text-sm"
                  >
                    <span className="text-dark-charcoal">{formatDate(record.date)}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        record.status === 'present'
                          ? 'bg-success-bg text-success-text'
                          : record.status === 'absent'
                          ? 'bg-error-bg text-error-text'
                          : 'bg-warning-bg text-warning-text'
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-blue text-sm">No attendance records</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
