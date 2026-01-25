'use client';

import { useState } from 'react';

export default function BookingActions({ booking }) {
  const [loading, setLoading] = useState(false);

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

  if (booking.status === 'completed') {
    return <span className="text-slate-blue text-sm">Completed</span>;
  }

  return (
    <div className="flex gap-2">
      {booking.status === 'scheduled' && (
        <>
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
  );
}
