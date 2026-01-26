'use client';

import { useState, useEffect } from 'react';
import Button from '../ui/Button.js';
import { format } from 'date-fns';

export default function RescheduleModal({ booking, isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  // Set minimum date to today
  const minDate = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (isOpen && booking) {
      // Set initial values to current booking date/time
      const bookingDate = new Date(booking.bookingDate);
      setSelectedDate(format(bookingDate, 'yyyy-MM-dd'));
      setSelectedTime(booking.bookingTime || '');
      setError('');
    }
  }, [isOpen, booking]);

  useEffect(() => {
    if (selectedDate && booking?.serviceIds) {
      fetchAvailableSlots();
    }
  }, [selectedDate, booking]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !booking?.serviceIds) return;
    
    setFetchingSlots(true);
    setError('');
    
    try {
      const serviceIds = booking.serviceIds.map(s => s._id || s).join(',');
      const employeeId = booking.employeeId?._id || booking.employeeId || '';
      
      let url = `/api/bookings/available-slots?date=${selectedDate}&serviceIds=${serviceIds}`;
      if (employeeId) {
        url += `&employeeId=${employeeId}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        // Filter out past times if date is today
        const today = format(new Date(), 'yyyy-MM-dd');
        const currentTime = format(new Date(), 'HH:mm');
        
        let slots = data.data || [];
        if (selectedDate === today) {
          slots = slots.filter(slot => slot >= currentTime);
        }
        
        setAvailableSlots(slots);
        
        // Auto-select first available slot if current time is not available
        if (selectedDate === today && !slots.includes(selectedTime) && slots.length > 0) {
          setSelectedTime(slots[0]);
        }
      } else {
        setError(data.error || 'Failed to fetch available slots');
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setError('Failed to fetch available time slots');
    } finally {
      setFetchingSlots(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/bookings/${booking._id}/reschedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingDate: selectedDate,
          bookingTime: selectedTime,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        if (onSuccess) {
          onSuccess(data.data);
        }
        onClose();
      } else {
        setError(data.error || 'Failed to reschedule booking');
      }
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-dark-charcoal">Reschedule Booking</h2>
            <button
              onClick={onClose}
              className="text-slate-blue hover:text-dark-charcoal text-2xl"
            >
              ×
            </button>
          </div>

          {/* Current Booking Info */}
          <div className="bg-light-grey rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-dark-charcoal mb-2">Current Booking:</h3>
            <p className="text-sm text-slate-blue">
              {format(new Date(booking.bookingDate), 'MMM dd, yyyy')} at {booking.bookingTime}
            </p>
            {booking.rescheduleCount > 0 && (
              <p className="text-xs text-amber mt-1">
                Rescheduled {booking.rescheduleCount} time(s) before
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error-bg border border-red-300 rounded text-error-text text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                New Date <span className="text-red">*</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime(''); // Reset time when date changes
                }}
                min={minDate}
                className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
                required
              />
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                  New Time <span className="text-red">*</span>
                </label>
                {fetchingSlots ? (
                  <div className="text-center py-4 text-slate-blue">
                    Loading available slots...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-slate-blue py-2">
                    No available time slots for this date. Please select another date.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`px-3 py-2 rounded border-2 text-sm font-medium transition-all ${
                          selectedTime === slot
                            ? 'bg-dark-charcoal text-white border-dark-charcoal'
                            : 'bg-white text-dark-charcoal border-medium-grey hover:bg-light-grey'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-medium-grey">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !selectedDate || !selectedTime || fetchingSlots}
                className="flex-1"
              >
                {loading ? 'Rescheduling...' : 'Reschedule Booking'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
