'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import Button from '../../../../components/ui/Button.js';
import Link from 'next/link';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);

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

  const handlePayment = async () => {
    if (!bookingId) return;
    
    setProcessing(true);
    setError('');

    try {
      const res = await fetch(`/api/bookings/${bookingId}/mock-pay`, {
        method: 'POST',
      });

      const data = await res.json();

      if (data.success) {
        // Redirect to confirmation page
        router.push(`/book/confirmation?bookingId=${bookingId}&payment=success`);
      } else {
        setError(data.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 sm:py-16 px-4 bg-light-grey min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-blue mx-auto mb-4"></div>
          <p className="text-slate-blue">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-12 sm:py-16 px-4 bg-light-grey min-h-screen">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white border border-medium-grey rounded-lg p-6 text-center shadow-lg">
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
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-charcoal text-center mb-8">
          Complete Your Payment
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-error-bg border border-red-300 rounded text-error-text">
            {error}
          </div>
        )}

        <div className="bg-white border border-medium-grey rounded-lg p-6 sm:p-8 space-y-6 shadow-lg">
          {/* Booking Summary */}
          <div>
            <h2 className="text-xl font-bold text-dark-charcoal mb-4">Booking Summary</h2>
            <div className="space-y-3">
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

          {/* Payment Details */}
          <div className="border-t border-medium-grey pt-6">
            <h2 className="text-xl font-bold text-dark-charcoal mb-4">Payment Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-blue">Total Amount:</span>
                <span className="text-dark-charcoal font-semibold">
                  PKR {totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-blue">
                <span>Advance Payment Required:</span>
                <span className="font-semibold text-dark-charcoal">
                  PKR {advanceAmount.toLocaleString()}
                </span>
              </div>
              {remainingAmount > 0 && (
                <div className="flex justify-between text-slate-blue text-sm">
                  <span>Remaining (pay at salon):</span>
                  <span>PKR {remainingAmount.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Button */}
          <div className="border-t border-medium-grey pt-6">
            <div className="bg-slate-blue bg-opacity-10 border border-slate-blue rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-blue text-center">
                This is a mock payment system. Click "Pay Advance" to simulate payment processing.
              </p>
            </div>
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full"
              variant="primary"
            >
              {processing ? 'Processing Payment...' : `Pay Advance (PKR ${advanceAmount.toLocaleString()})`}
            </Button>
            <Link href="/book" className="block text-center mt-4 text-slate-blue hover:text-dark-charcoal">
              Cancel and Return to Booking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
