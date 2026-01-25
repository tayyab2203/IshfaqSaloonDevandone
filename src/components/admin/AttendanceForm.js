'use client';

import { useState } from 'react';
import Button from '../ui/Button.js';

export default function AttendanceForm({ employeeId, date, initialData = null }) {
  const [status, setStatus] = useState(initialData?.status || 'present');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          date,
          status,
          checkIn: status === 'present' ? new Date().toISOString() : null,
          checkOut: null,
        }),
      });

      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-1 border border-medium-grey rounded text-sm"
      >
        <option value="present">Present</option>
        <option value="absent">Absent</option>
        <option value="leave">Leave</option>
      </select>
      <Button type="submit" disabled={loading} className="py-1 px-3 text-sm">
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
