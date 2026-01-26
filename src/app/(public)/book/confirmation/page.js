'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import Button from '../../../../components/ui/Button.js';
import Link from 'next/link';

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    } else {
      setError('Booking ID is required');
      setLoading(false);
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      const data = await res.json();
      
      if (data.success) {
        setBooking(data.data);
      } else {
        setError(data.error || 'Failed to load booking details');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 sm:py-16 px-4 bg-light-grey min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-blue mx-auto mb-4"></div>
          <p className="text-slate-blue">Loading booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (!booking || error) {
    return (
      <div className="py-12 sm:py-16 px-4 bg-light-grey min-h-screen">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white border border-medium-grey rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-dark-charcoal mb-4">Booking Not Found</h1>
            <p className="text-slate-blue mb-6">{error || 'Unable to load booking details'}</p>
            <Link href="/book">
              <Button variant="primary">Back to Booking</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = booking.serviceIds?.reduce((sum, service) => sum + (service.price || 0), 0) || 0;
  const advanceAmount = booking.advanceAmount || 0;
  const remainingAmount = totalPrice - advanceAmount;

  return (
    <div className="py-12 sm:py-16 px-4 bg-light-grey min-h-screen">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white border border-medium-grey rounded-lg p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-success-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-charcoal mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-slate-blue">
              Your appointment has been successfully booked
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-xl font-bold text-dark-charcoal mb-4">Booking Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-blue">Booking ID:</span>
                  <span className="text-dark-charcoal font-semibold">{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-blue">Customer:</span>
                  <span className="text-dark-charcoal font-semibold">{booking.customerId?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-blue">Date:</span>
                  <span className="text-dark-charcoal font-semibold">
                    {format(new Date(booking.bookingDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-blue">Time:</span>
                  <span className="text-dark-charcoal font-semibold">{booking.bookingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-blue">Services:</span>
                  <span className="text-dark-charcoal font-semibold text-right">
                    {booking.serviceIds?.map(s => s.name).join(', ') || 'N/A'}
                  </span>
                </div>
                {booking.employeeId && (
                  <div className="flex justify-between">
                    <span className="text-slate-blue">Staff:</span>
                    <span className="text-dark-charcoal font-semibold">{booking.employeeId.name}</span>
                  </div>
                )}
              </div>
            </div>

            {advanceAmount > 0 && (
              <div className="border-t border-medium-grey pt-6">
                <h2 className="text-xl font-bold text-dark-charcoal mb-4">Payment Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-blue">Total Amount:</span>
                    <span className="text-dark-charcoal font-semibold">
                      PKR {totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-green">
                    <span>Advance Paid:</span>
                    <span className="font-semibold">
                      PKR {advanceAmount.toLocaleString()}
                    </span>
                  </div>
                  {remainingAmount > 0 && (
                    <div className="flex justify-between text-slate-blue">
                      <span>Remaining (pay at salon):</span>
                      <span>PKR {remainingAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-slate-blue bg-opacity-10 border border-slate-blue rounded-lg p-4">
              <p className="text-sm text-slate-blue text-center">
                A confirmation message has been sent to your phone number. 
                Please arrive on time for your appointment.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="primary" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
            <Link href="/book">
              <Button variant="secondary" className="w-full sm:w-auto">
                Book Another Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
