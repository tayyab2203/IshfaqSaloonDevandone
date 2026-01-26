'use client';

import { useState } from 'react';
import Link from 'next/link';
import RescheduleModal from './RescheduleModal.js';
import { startOfDay, isBefore } from 'date-fns';

export default function BookingActions({ booking }) {
  const [loading, setLoading] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  async function updateStatus(newStatus, paymentMethod = 'cash') {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, paymentMethod }),
      });

      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking status');
    } finally {
      setLoading(false);
    }
  }

  // Check if booking is eligible for rescheduling
  const canReschedule = () => {
    if (booking.status !== 'scheduled') return false;
    if (booking.status === 'completed' || booking.status === 'cancelled') return false;
    
    // Check if booking is in the future
    const today = startOfDay(new Date());
    const bookingDate = startOfDay(new Date(booking.bookingDate));
    if (isBefore(bookingDate, today)) return false;
    
    // Check reschedule count
    if ((booking.rescheduleCount || 0) >= 2) return false;
    
    return true;
  };

  const handleRescheduleSuccess = () => {
    window.location.reload();
  };

  if (booking.status === 'completed') {
    return <span className="text-slate-blue text-sm">Completed</span>;
  }

  const eligibleForReschedule = canReschedule();

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <Link
          href={`/admin/bookings/${booking._id}`}
          className="text-sm text-slate-blue hover:underline"
        >
          View Details
        </Link>
        {booking.status === 'scheduled' && (
          <>
            {eligibleForReschedule && (
              <button
                onClick={() => setShowRescheduleModal(true)}
                className="text-sm text-blue hover:underline disabled:opacity-50"
                disabled={loading}
              >
                Reschedule
                {booking.rescheduleCount > 0 && (
                  <span className="ml-1 text-xs">({booking.rescheduleCount}/2)</span>
                )}
              </button>
            )}
            <button
              onClick={() => updateStatus('completed')}
              className="text-sm text-green hover:underline disabled:opacity-50"
              disabled={loading}
            >
              Mark Complete
            </button>
            <button
              onClick={() => updateStatus('no-show')}
              className="text-sm text-amber hover:underline disabled:opacity-50"
              disabled={loading}
            >
              No Show
            </button>
            <button
              onClick={() => updateStatus('cancelled')}
              className="text-sm text-red hover:underline disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
          </>
        )}
      </div>
      
      <RescheduleModal
        booking={booking}
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        onSuccess={handleRescheduleSuccess}
      />
    </>
  );
}
