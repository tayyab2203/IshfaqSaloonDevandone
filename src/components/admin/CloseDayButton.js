'use client';

import { useState } from 'react';
import Button from '../ui/Button.js';

export default function CloseDayButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCloseDay = async () => {
    if (!confirm('Are you sure you want to close the day? This will generate the daily summary.')) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/daily-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: new Date().toISOString().split('T')[0] }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Daily summary created successfully!');
        
        // Optionally send WhatsApp summary
        const whatsappRes = await fetch('/api/whatsapp/send-daily-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ summaryId: data.data._id }),
        });

        if (whatsappRes.ok) {
          setMessage('Daily summary created and sent via WhatsApp!');
        }
      } else {
        setMessage(data.error || 'Failed to close day');
      }
    } catch (error) {
      console.error('Error closing day:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleCloseDay} disabled={loading} variant="secondary">
        {loading ? 'Closing...' : 'Close Day'}
      </Button>
      {message && (
        <p className={`mt-2 text-sm ${message.includes('error') || message.includes('Failed') ? 'text-red' : 'text-green'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
