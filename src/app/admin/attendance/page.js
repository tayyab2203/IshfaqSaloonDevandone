import { getSession } from '../../../lib/auth-helpers.js';
import PageHeader from '../../../components/admin/PageHeader.js';
import Button from '../../../components/ui/Button.js';
import { formatDate, getStatusBadgeClasses, formatCookiesForHeader } from '../../../lib/utils.js';
import AttendanceForm from '../../../components/admin/AttendanceForm.js';
import { cookies } from 'next/headers';

async function getAttendanceData(date) {
  try {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    const cookieStore = await cookies();
    const cookieHeader = formatCookiesForHeader(cookieStore);

    const res = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/attendance?${params.toString()}`,
      { 
        cache: 'no-store',
        headers: {
          Cookie: cookieHeader,
        },
      }
    );
    const data = await res.json();
    return data.success ? data.data : { attendance: [], unmarkedEmployees: [] };
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return { attendance: [], unmarkedEmployees: [] };
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

export default async function AttendancePage({ searchParams }) {
  const session = await getSession();
  const params = await searchParams;
  const date = params?.date || new Date().toISOString().split('T')[0];

  const { attendance, unmarkedEmployees } = await getAttendanceData(date);
  const allEmployees = await getEmployees();

  return (
    <div>
      <PageHeader title="Attendance Tracking" />

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

      {/* Attendance Table */}
      <div className="bg-white border border-medium-grey rounded-lg overflow-hidden mb-4 sm:mb-6">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-medium-grey">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Employee
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Check In
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Check Out
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 && unmarkedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 lg:px-6 py-8 text-center text-slate-blue">
                    No attendance records for this date
                  </td>
                </tr>
              ) : (
                <>
                  {attendance.map((record) => (
                    <tr
                      key={record._id}
                      className="border-b border-medium-grey hover:bg-light-grey"
                    >
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal font-semibold">
                        {record.employeeId?.name || 'N/A'}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <span
                          className={`px-2 lg:px-3 py-1 rounded text-xs font-semibold ${getStatusBadgeClasses(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-blue">
                        {record.checkIn ? formatDate(record.checkIn, 'HH:mm') : 'N/A'}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-blue">
                        {record.checkOut ? formatDate(record.checkOut, 'HH:mm') : 'N/A'}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <AttendanceForm
                          employeeId={record.employeeId._id}
                          date={date}
                          initialData={record}
                        />
                      </td>
                    </tr>
                  ))}
                  {unmarkedEmployees.map((employee) => (
                    <tr
                      key={employee._id}
                      className="border-b border-medium-grey hover:bg-light-grey"
                    >
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal font-semibold">
                        {employee.name}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <span className="px-2 lg:px-3 py-1 rounded text-xs font-semibold bg-medium-grey text-slate-blue">
                          Not Marked
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-blue">-</td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-blue">-</td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <AttendanceForm employeeId={employee._id} date={date} />
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-medium-grey">
          {attendance.length === 0 && unmarkedEmployees.length === 0 ? (
            <div className="p-6 text-center text-slate-blue">No attendance records for this date</div>
          ) : (
            <>
              {attendance.map((record) => (
                <div key={record._id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-dark-charcoal text-sm">
                        {record.employeeId?.name || 'N/A'}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getStatusBadgeClasses(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-blue">
                    <div>
                      <span className="font-semibold text-dark-charcoal">Check In: </span>
                      {record.checkIn ? formatDate(record.checkIn, 'HH:mm') : 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold text-dark-charcoal">Check Out: </span>
                      {record.checkOut ? formatDate(record.checkOut, 'HH:mm') : 'N/A'}
                    </div>
                  </div>
                  <div className="pt-2">
                    <AttendanceForm
                      employeeId={record.employeeId._id}
                      date={date}
                      initialData={record}
                    />
                  </div>
                </div>
              ))}
              {unmarkedEmployees.map((employee) => (
                <div key={employee._id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-dark-charcoal text-sm">{employee.name}</p>
                    </div>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-medium-grey text-slate-blue">
                      Not Marked
                    </span>
                  </div>
                  <div className="pt-2">
                    <AttendanceForm employeeId={employee._id} date={date} />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
