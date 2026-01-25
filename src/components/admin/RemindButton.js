'use client';

import { useState } from 'react';

export default function RemindButton({ customerId }) {
  const [loading, setLoading] = useState(false);

  const handleRemind = async () => {
    if (!confirm('Send reminder to this customer?')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/whatsapp/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Reminder sent successfully!');
        window.location.reload();
      } else {
        alert(data.error || 'Failed to send reminder');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Failed to send reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemind}
      disabled={loading}
      className="text-sm text-green hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Sending...' : 'Remind'}
    </button>
  );
}
