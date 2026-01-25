import { getSession } from '../../../lib/auth-helpers.js';
import PageHeader from '../../../components/admin/PageHeader.js';
import Button from '../../../components/ui/Button.js';
import { formatDate, getStatusBadgeClasses, formatCookiesForHeader } from '../../../lib/utils.js';
import Link from 'next/link';
import { cookies } from 'next/headers';

async function getEmployees(search, status) {
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    const cookieStore = await cookies();
    const cookieHeader = formatCookiesForHeader(cookieStore);

    const res = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/employees?${params.toString()}`,
      { 
        cache: 'no-store',
        headers: {
          Cookie: cookieHeader,
        },
      }
    );
    const data = await res.json();
    
    let employees = data.success ? data.data : [];
    
    // Filter by search if provided
    if (search) {
      const searchLower = search.toLowerCase();
      employees = employees.filter(
        emp => emp.name.toLowerCase().includes(searchLower)
      );
    }
    
    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

export default async function EmployeesPage({ searchParams }) {
  const session = await getSession();
  const params = await searchParams;
  const search = params?.search || '';
  const status = params?.status || '';

  const employees = await getEmployees(search, status);

  return (
    <div>
      <PageHeader
        title="Employee Management"
        actions={
          <Link href="/admin/employees/add">
            <Button variant="primary">Add Employee</Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <form method="get" className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search by name..."
            defaultValue={search}
            className="flex-1 px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
          />
          <select
            name="status"
            defaultValue={status}
            className="px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button type="submit" className="w-full sm:w-auto">Search</Button>
        </form>
      </div>

      {/* Employees Table */}
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
                  Role
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Commission %
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Joined Date
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 lg:px-6 py-8 text-center text-slate-blue">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr
                    key={employee._id}
                    className="border-b border-medium-grey hover:bg-light-grey"
                  >
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div className="flex items-center gap-3">
                        {employee.image ? (
                          <img
                            src={employee.image}
                            alt={employee.name}
                            className="w-10 h-10 rounded-full object-cover border border-medium-grey"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-light-grey border border-medium-grey flex items-center justify-center">
                            <span className="text-slate-blue text-xs">{employee.name.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <span className="text-sm text-dark-charcoal font-semibold">{employee.name}</span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">{employee.phone}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-blue capitalize">{employee.role}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <span
                        className={`px-2 lg:px-3 py-1 rounded text-xs font-semibold ${getStatusBadgeClasses(
                          employee.status
                        )}`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">{employee.commissionRate}%</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-blue">
                      {formatDate(employee.joinedDate)}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/employees/${employee._id}`}
                          className="text-xs lg:text-sm text-blue hover:underline"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/employees/${employee._id}/edit`}
                          className="text-xs lg:text-sm text-green hover:underline"
                        >
                          Edit
                        </Link>
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
          {employees.length === 0 ? (
            <div className="p-6 text-center text-slate-blue">No employees found</div>
          ) : (
            employees.map((employee) => (
              <div key={employee._id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {employee.image ? (
                      <img
                        src={employee.image}
                        alt={employee.name}
                        className="w-12 h-12 rounded-full object-cover border border-medium-grey flex-shrink-0"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-light-grey border border-medium-grey flex items-center justify-center flex-shrink-0">
                        <span className="text-slate-blue text-xs">{employee.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-dark-charcoal text-sm">{employee.name}</p>
                      <p className="text-xs text-slate-blue mt-1">{employee.phone}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getStatusBadgeClasses(
                      employee.status
                    )}`}
                  >
                    {employee.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-blue">
                  <div>
                    <span className="font-semibold text-dark-charcoal">Role: </span>
                    <span className="capitalize">{employee.role}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-dark-charcoal">Commission: </span>
                    {employee.commissionRate}%
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-dark-charcoal">Joined: </span>
                    {formatDate(employee.joinedDate)}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/admin/employees/${employee._id}`}
                    className="text-xs text-blue hover:underline"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/employees/${employee._id}/edit`}
                    className="text-xs text-green hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
