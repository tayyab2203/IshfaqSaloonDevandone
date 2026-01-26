import { getSession, requireAuth } from '../../../../lib/auth-helpers.js';
import connectDB from '../../../../lib/db.js';
import Booking from '../../../../models/Booking.js';
import PageHeader from '../../../../components/admin/PageHeader.js';
import Button from '../../../../components/ui/Button.js';
import Link from 'next/link';
import { formatDate, formatTime, formatCurrency, getStatusBadgeClasses } from '../../../../lib/utils.js';
import { notFound } from 'next/navigation';

async function getBookingData(id) {
  try {
    await requireAuth();
    await connectDB();

    const booking = await Booking.findById(id)
      .populate('customerId', 'name phone email')
      .populate('serviceIds', 'name price duration')
      .populate('employeeId', 'name role')
      .lean();

    if (!booking) {
      return null;
    }

    // Convert _id to string for all nested objects
    return {
      ...booking,
      _id: booking._id.toString(),
      customerId: booking.customerId ? {
        ...booking.customerId,
        _id: booking.customerId._id.toString(),
      } : null,
      serviceIds: booking.serviceIds?.map(service => ({
        ...service,
        _id: service._id.toString(),
      })) || [],
      employeeId: booking.employeeId ? {
        ...booking.employeeId,
        _id: booking.employeeId._id.toString(),
      } : null,
    };
  } catch (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
}

export default async function BookingDetailsPage({ params }) {
  const session = await getSession();
  const { id } = await params;
  const booking = await getBookingData(id);

  if (!booking) {
    notFound();
  }

  // Calculate total price
  const totalPrice = booking.serviceIds?.reduce((sum, service) => sum + (service.price || 0), 0) || 0;
  const advanceAmount = booking.advanceAmount || 0;
  const remainingAmount = totalPrice - advanceAmount;

  return (
    <div>
      <PageHeader
        title={`Booking Details`}
        actions={
          <Link href="/admin/bookings">
            <Button variant="secondary">Back to Bookings</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Information */}
          <div className="bg-white border border-medium-grey rounded-lg p-6">
            <h2 className="text-xl font-bold text-dark-charcoal mb-4">Booking Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-blue">Booking ID</label>
                <p className="text-dark-charcoal mt-1">{booking._id}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Status</label>
                <div className="mt-1">
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${getStatusBadgeClasses(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Date</label>
                <p className="text-dark-charcoal mt-1">{formatDate(booking.bookingDate)}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Time</label>
                <p className="text-dark-charcoal mt-1">{formatTime(booking.bookingTime)}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Booking Type</label>
                <p className="text-dark-charcoal mt-1 capitalize">{booking.bookingType || 'online'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Created At</label>
                <p className="text-dark-charcoal mt-1">
                  {booking.createdAt ? formatDate(booking.createdAt) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white border border-medium-grey rounded-lg p-6">
            <h2 className="text-xl font-bold text-dark-charcoal mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-blue">Name</label>
                <p className="text-dark-charcoal mt-1">{booking.customerId?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-blue">Phone</label>
                <p className="text-dark-charcoal mt-1">{booking.customerId?.phone || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-slate-blue">Email</label>
                <p className="text-dark-charcoal mt-1">{booking.customerId?.email || 'N/A'}</p>
              </div>
            </div>
            {booking.customerId?._id && (
              <div className="mt-4">
                <Link href={`/admin/customers/${booking.customerId._id}`}>
                  <Button variant="secondary" className="text-sm">
                    View Customer Profile
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Services */}
          <div className="bg-white border border-medium-grey rounded-lg p-6">
            <h2 className="text-xl font-bold text-dark-charcoal mb-4">Services</h2>
            {booking.serviceIds && booking.serviceIds.length > 0 ? (
              <div className="space-y-3">
                {booking.serviceIds.map((service) => (
                  <div
                    key={service._id}
                    className="flex justify-between items-center p-3 border border-medium-grey rounded"
                  >
                    <div>
                      <p className="font-semibold text-dark-charcoal">{service.name}</p>
                      <p className="text-sm text-slate-blue">
                        Duration: {service.duration || 0} minutes
                      </p>
                    </div>
                    <p className="text-dark-charcoal font-semibold">
                      {formatCurrency(service.price || 0)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t border-medium-grey mt-3">
                  <p className="text-lg font-bold text-dark-charcoal">Total</p>
                  <p className="text-lg font-bold text-dark-charcoal">{formatCurrency(totalPrice)}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-blue">No services found</p>
            )}
          </div>

          {/* Staff Information */}
          {booking.employeeId && (
            <div className="bg-white border border-medium-grey rounded-lg p-6">
              <h2 className="text-xl font-bold text-dark-charcoal mb-4">Assigned Staff</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-blue">Name</label>
                  <p className="text-dark-charcoal mt-1">{booking.employeeId.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-blue">Role</label>
                  <p className="text-dark-charcoal mt-1 capitalize">
                    {booking.employeeId.role || 'N/A'}
                  </p>
                </div>
              </div>
              {booking.employeeId._id && (
                <div className="mt-4">
                  <Link href={`/admin/employees/${booking.employeeId._id}`}>
                    <Button variant="secondary" className="text-sm">
                      View Employee Profile
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className="bg-white border border-medium-grey rounded-lg p-6">
              <h2 className="text-xl font-bold text-dark-charcoal mb-4">Notes</h2>
              <p className="text-dark-charcoal whitespace-pre-wrap">{booking.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Information */}
          <div className="bg-white border border-medium-grey rounded-lg p-6">
            <h2 className="text-xl font-bold text-dark-charcoal mb-4">Payment Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-blue">Payment Status</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    booking.paymentStatus === 'paid'
                      ? 'bg-success-bg text-success-text'
                      : booking.paymentStatus === 'failed'
                      ? 'bg-error-bg text-error-text'
                      : 'bg-info-bg text-info-text'
                  }`}
                >
                  {booking.paymentStatus || 'pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-blue">Total Amount</span>
                <span className="text-dark-charcoal font-semibold">{formatCurrency(totalPrice)}</span>
              </div>
              {advanceAmount > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-blue">Advance Paid</span>
                    <span className="text-dark-charcoal font-semibold">
                      {formatCurrency(advanceAmount)}
                    </span>
                  </div>
                  {remainingAmount > 0 && (
                    <div className="flex justify-between pt-2 border-t border-medium-grey">
                      <span className="text-slate-blue">Remaining</span>
                      <span className="text-dark-charcoal font-semibold">
                        {formatCurrency(remainingAmount)}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Reschedule Information */}
          {booking.rescheduleCount > 0 && (
            <div className="bg-white border border-medium-grey rounded-lg p-6">
              <h2 className="text-xl font-bold text-dark-charcoal mb-4">Reschedule History</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-blue">Reschedule Count</span>
                  <span className="text-dark-charcoal font-semibold">
                    {booking.rescheduleCount}/2
                  </span>
                </div>
                {booking.rescheduledFrom && (
                  <div>
                    <label className="text-sm font-semibold text-slate-blue">Originally Scheduled</label>
                    <p className="text-dark-charcoal mt-1">
                      {formatDate(booking.rescheduledFrom)} {booking.bookingTime}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {booking.status === 'scheduled' && (
            <div className="bg-white border border-medium-grey rounded-lg p-6">
              <h2 className="text-xl font-bold text-dark-charcoal mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link href={`/admin/bookings?date=${formatDate(booking.bookingDate)}`} className="block">
                  <Button variant="secondary" className="w-full">
                    View All Bookings for This Date
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
