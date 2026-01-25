'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Button from '../../../components/ui/Button.js';
import EmployeeImage from '../../../components/admin/EmployeeImage.js';

export default function BookPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Services
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  // Step 2: Date & Time
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [totalDuration, setTotalDuration] = useState(0);

  // Step 3: Staff
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Step 4: Contact Info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Step 5: Confirmation
  const [bookingId, setBookingId] = useState(null);

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate && selectedServices.length > 0) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedServices]);

  // Fetch employees when services are selected
  useEffect(() => {
    if (selectedServices.length > 0) {
      fetchEmployees();
    }
  }, [selectedServices]);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services?activeOnly=true');
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;
    
    try {
      const serviceIds = selectedServices.map(s => s._id).join(',');
      const res = await fetch(
        `/api/bookings/available-slots?date=${selectedDate}&serviceIds=${serviceIds}`
      );
      const data = await res.json();
      if (data.success) {
        setAvailableSlots(data.data);
        setTotalDuration(data.totalDuration);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      const data = await res.json();
      if (data.success) {
        setEmployees(data.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s._id === service._id);
      if (exists) {
        return prev.filter(s => s._id !== service._id);
      } else {
        return [...prev, service];
      }
    });
  };

  const calculateTotalPrice = () => {
    return selectedServices.reduce((sum, service) => sum + (service.price || 0), 0);
  };

  const validatePhone = (phone) => {
    if (!phone) return false;
    const cleaned = phone.replace(/\s/g, '');
    const phoneRegex = /^[0-9+\-\(\)]{10,15}$/;
    return phoneRegex.test(cleaned);
  };

  const handleNext = () => {
    if (step === 1 && selectedServices.length === 0) {
      setError('Please select at least one service');
      return;
    }
    if (step === 2 && (!selectedDate || !selectedTime)) {
      setError('Please select date and time');
      return;
    }
    if (step === 4) {
      if (!customerName || !customerName.trim()) {
        setError('Name is required');
        return;
      }
      if (!customerPhone || !customerPhone.trim()) {
        setError('Phone number is required');
        return;
      }
      if (!validatePhone(customerPhone)) {
        setError('Please enter a valid phone number (10-15 digits)');
        return;
      }
      if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
        setError('Please enter a valid email address');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          serviceIds: selectedServices.map(s => s._id),
          employeeId: selectedEmployee?._id || null,
          bookingDate: selectedDate,
          bookingTime: selectedTime,
          notes,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setBookingId(data.data._id);
        // Mock WhatsApp confirmation
        console.log('WhatsApp confirmation sent:', {
          to: customerPhone,
          message: `Your appointment is confirmed for ${format(new Date(selectedDate), 'MMM dd, yyyy')} at ${selectedTime}. Service: ${selectedServices.map(s => s.name).join(', ')}. Staff: ${selectedEmployee?.name || 'Any Available'}.`,
        });
      } else {
        setError(data.error || 'Failed to create booking');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const minDate = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="py-12 sm:py-16 px-4 bg-light-grey min-h-screen">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-charcoal text-center mb-8 sm:mb-12">
          Book Appointment
        </h1>

        {/* Step Indicator */}
        <div className="flex justify-center mb-6 sm:mb-8 overflow-x-auto pb-2">
          <div className="flex items-center min-w-max">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base shrink-0 ${
                    s === step
                      ? 'bg-dark-charcoal text-white'
                      : s < step
                      ? 'bg-green text-white'
                      : 'bg-medium-grey text-dark-charcoal'
                  }`}
                >
                  {s}
                </div>
                {s < 5 && (
                  <div
                    className={`w-8 sm:w-16 h-1 shrink-0 ${
                      s < step ? 'bg-green' : 'bg-medium-grey'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-error-bg border border-red-300 rounded text-error-text">
            {error}
          </div>
        )}

        {/* Step 1: Select Services */}
        {step === 1 && (
          <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-dark-charcoal mb-4 sm:mb-6">Select Services</h2>
            <div className="space-y-4 mb-6">
              {services.map((service) => (
                <label
                  key={service._id}
                  className="flex items-start p-4 sm:p-5 border-2 border-medium-grey rounded-lg cursor-pointer hover:bg-light-grey hover:border-slate-blue transition-all duration-200 active:bg-medium-grey touch-manipulation"
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.some(s => s._id === service._id)}
                    onChange={() => handleServiceToggle(service)}
                    className="mt-1 mr-3 sm:mr-4 w-5 h-5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-dark-charcoal text-base sm:text-lg">{service.name}</h3>
                        {service.description && (
                          <p className="text-sm text-slate-blue mt-1 line-clamp-2">{service.description}</p>
                        )}
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <p className="font-bold text-dark-charcoal text-base sm:text-lg">
                          PKR {service.price?.toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-blue">{service.duration} min</p>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {selectedServices.length > 0 && (
              <div className="border-t border-medium-grey pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-dark-charcoal font-semibold">Total Duration:</span>
                  <span className="text-dark-charcoal font-bold">
                    {selectedServices.reduce((sum, s) => sum + (s.duration || 0), 0)} minutes
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-charcoal font-semibold">Total Price:</span>
                  <span className="text-dark-charcoal font-bold text-xl">
                    PKR {calculateTotalPrice().toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button onClick={handleNext} disabled={selectedServices.length === 0} className="w-full sm:w-auto">
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-dark-charcoal mb-4 sm:mb-6">Select Date & Time</h2>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDate}
                className="w-full px-4 py-3 text-base border-2 border-medium-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-blue focus:border-transparent transition-all"
                required
              />
            </div>
            {selectedDate && (
              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg border-2 text-sm sm:text-base font-medium transition-all duration-200 touch-manipulation ${
                        selectedTime === slot
                          ? 'bg-dark-charcoal text-white border-dark-charcoal shadow-md'
                          : 'bg-white text-dark-charcoal border-medium-grey hover:bg-light-grey active:bg-medium-grey'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {availableSlots.length === 0 && (
                  <p className="text-slate-blue mt-4">No available slots for this date</p>
                )}
              </div>
            )}
            <div className="mt-6 flex flex-col-reverse sm:flex-row justify-between gap-3">
              <Button onClick={handleBack} variant="secondary" className="w-full sm:w-auto">
                Back
              </Button>
              <Button onClick={handleNext} disabled={!selectedDate || !selectedTime} className="w-full sm:w-auto">
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Select Staff */}
        {step === 3 && (
          <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-dark-charcoal mb-4 sm:mb-6">Select Staff (Optional)</h2>
            <div className="space-y-4 mb-6">
              <label className="flex items-start p-4 sm:p-5 border-2 border-medium-grey rounded-lg cursor-pointer hover:bg-light-grey hover:border-slate-blue transition-all duration-200 active:bg-medium-grey touch-manipulation">
                <input
                  type="radio"
                  name="staff"
                  checked={selectedEmployee === null}
                  onChange={() => setSelectedEmployee(null)}
                  className="mt-1 mr-3 sm:mr-4 w-5 h-5 shrink-0"
                />
                <div>
                  <h3 className="font-semibold text-dark-charcoal text-base sm:text-lg">Any Available</h3>
                  <p className="text-sm text-slate-blue">We'll assign the best available staff</p>
                </div>
              </label>
              {employees.map((employee) => (
                <label
                  key={employee._id}
                  className="flex items-start p-4 sm:p-5 border-2 border-medium-grey rounded-lg cursor-pointer hover:bg-light-grey hover:border-slate-blue transition-all duration-200 active:bg-medium-grey touch-manipulation"
                >
                  <input
                    type="radio"
                    name="staff"
                    checked={selectedEmployee?._id === employee._id}
                    onChange={() => setSelectedEmployee(employee)}
                    className="mt-1 mr-3 sm:mr-4 w-5 h-5 shrink-0"
                  />
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <EmployeeImage
                      src={employee.imageUrl}
                      alt={employee.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-medium-grey shrink-0"
                      fallbackClassName="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-blue flex items-center justify-center shrink-0"
                      fallbackInitial={employee.name.charAt(0).toUpperCase()}
                      fallbackContent={
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-blue flex items-center justify-center shrink-0">
                          <span className="text-white text-base sm:text-xl font-bold">
                            {employee.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-dark-charcoal text-base sm:text-lg truncate">{employee.name}</h3>
                      <p className="text-sm text-slate-blue capitalize">{employee.role}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-6 flex flex-col-reverse sm:flex-row justify-between gap-3">
              <Button onClick={handleBack} variant="secondary" className="w-full sm:w-auto">
                Back
              </Button>
              <Button onClick={handleNext} className="w-full sm:w-auto">Next</Button>
            </div>
          </div>
        )}

        {/* Step 4: Contact Information */}
        {step === 4 && (
          <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-dark-charcoal mb-4 sm:mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Name <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-medium-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-blue focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Phone <span className="text-red">*</span>
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-medium-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-blue focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-medium-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-blue focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Special Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 text-base border-2 border-medium-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-blue focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse sm:flex-row justify-between gap-3">
              <Button onClick={handleBack} variant="secondary" className="w-full sm:w-auto">
                Back
              </Button>
              <Button onClick={handleNext} className="w-full sm:w-auto">Next</Button>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-dark-charcoal mb-4 sm:mb-6">Confirm Booking</h2>
            {bookingId ? (
              <div className="text-center">
                <div className="mb-6 p-6 bg-success-bg border border-green-300 rounded">
                  <h3 className="text-xl font-bold text-success-text mb-2">
                    Booking Confirmed!
                  </h3>
                  <p className="text-success-text">
                    Your booking ID: <strong>{bookingId}</strong>
                  </p>
                  <p className="text-success-text mt-2">
                    A confirmation message has been sent to your phone.
                  </p>
                </div>
                <Button onClick={() => router.push('/')}>Back to Home</Button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-dark-charcoal mb-2">Services:</h3>
                    <ul className="list-disc list-inside text-dark-charcoal">
                      {selectedServices.map((service) => (
                        <li key={service._id}>
                          {service.name} - PKR {service.price?.toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-charcoal mb-2">Date & Time:</h3>
                    <p className="text-dark-charcoal">
                      {format(new Date(selectedDate), 'MMMM dd, yyyy')} at {selectedTime}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-charcoal mb-2">Staff:</h3>
                    <p className="text-dark-charcoal">
                      {selectedEmployee?.name || 'Any Available'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-charcoal mb-2">Contact:</h3>
                    <p className="text-dark-charcoal">{customerName}</p>
                    <p className="text-dark-charcoal">{customerPhone}</p>
                    {customerEmail && <p className="text-dark-charcoal">{customerEmail}</p>}
                  </div>
                  <div className="border-t border-medium-grey pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-dark-charcoal">Total:</span>
                      <span className="text-xl font-bold text-dark-charcoal">
                        PKR {calculateTotalPrice().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-col-reverse sm:flex-row justify-between gap-3">
                  <Button onClick={handleBack} variant="secondary" className="w-full sm:w-auto">
                    Back
                  </Button>
                  <Button onClick={handleConfirmBooking} disabled={loading} className="w-full sm:w-auto">
                    {loading ? 'Confirming...' : 'Confirm Booking'}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
