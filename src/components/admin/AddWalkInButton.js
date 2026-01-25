'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button.js';
import Receipt from './Receipt.js';

export default function AddWalkInButton() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [receiptSaleId, setReceiptSaleId] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    serviceIds: [],
    employeeId: '',
    paymentMethod: 'cash',
    amount: 0,
    discountApplied: 0,
  });
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);

  const fetchData = async () => {
    try {
      const [servicesRes, employeesRes] = await Promise.all([
        fetch('/api/services?activeOnly=true'),
        fetch('/api/employees'),
      ]);

      const servicesData = await servicesRes.json();
      const employeesData = await employeesRes.json();

      if (servicesData.success) {
        setServices(servicesData.data);
      }
      if (employeesData.success) {
        setEmployees(employeesData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleOpen = () => {
    setShowModal(true);
    setError('');
    fetchData();
  };

  const handleServiceToggle = (serviceId) => {
    setFormData((prev) => {
      const newServiceIds = prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter((id) => id !== serviceId)
        : [...prev.serviceIds, serviceId];
      
      // Calculate total amount
      const selectedServices = services.filter((s) => newServiceIds.includes(s._id));
      const totalAmount = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
      
      return {
        ...prev,
        serviceIds: newServiceIds,
        amount: totalAmount - prev.discountApplied,
      };
    });
  };

  const handleDiscountChange = (e) => {
    const discount = Number(e.target.value) || 0;
    const selectedServices = services.filter((s) => formData.serviceIds.includes(s._id));
    const totalAmount = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
    
    setFormData((prev) => ({
      ...prev,
      discountApplied: discount,
      amount: totalAmount - discount,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.customerName || !formData.customerPhone) {
      setError('Customer name and phone are required');
      setLoading(false);
      return;
    }

    if (formData.serviceIds.length === 0) {
      setError('Please select at least one service');
      setLoading(false);
      return;
    }

    try {
      const now = new Date();
      const bookingDate = now.toISOString().split('T')[0];
      const bookingTime = now.toTimeString().slice(0, 5);

      // Create a completed booking (this will also create/find the customer)
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          serviceIds: formData.serviceIds,
          employeeId: formData.employeeId || null,
          bookingDate,
          bookingTime,
          bookingType: 'walk-in',
          notes: 'Walk-in sale',
        }),
      });

      const bookingData = await bookingRes.json();
      if (!bookingData.success) {
        throw new Error(bookingData.error || 'Failed to create booking');
      }

      const booking = bookingData.data;
      const customerId = booking.customerId?._id || booking.customerId;

      // Update booking status to completed (this will create the sale automatically)
      const updateRes = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'completed',
          paymentMethod: formData.paymentMethod,
          discountApplied: formData.discountApplied,
        }),
      });

      const updateData = await updateRes.json();
      if (!updateData.success) {
        throw new Error(updateData.error || 'Failed to complete booking');
      }

      // Get sale ID from booking response or find it
      let saleId = updateData.data?.saleId;
      
      if (!saleId) {
        // Find the sale that was created
        const saleRes = await fetch(`/api/sales?date=${bookingDate}`);
        const saleData = await saleRes.json();
        
        if (saleData.success && saleData.data.length > 0) {
          // Find the most recent sale for this booking
          const recentSale = saleData.data.find(s => 
            s.bookingId?.toString() === booking._id.toString() || 
            s.bookingId?._id?.toString() === booking._id.toString()
          );
          if (recentSale) {
            saleId = recentSale._id.toString();
          }
        }
      }

      // Success - show receipt and refresh
      router.refresh();
      setShowModal(false);
      
      // Show receipt if sale was created
      if (saleId) {
        setReceiptSaleId(saleId);
      }
      
      setFormData({
        customerName: '',
        customerPhone: '',
        serviceIds: [],
        employeeId: '',
        paymentMethod: 'cash',
        amount: 0,
        discountApplied: 0,
      });
    } catch (error) {
      console.error('Error creating walk-in:', error);
      setError(error.message || 'Failed to create walk-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleOpen}>
        Add Walk-in
      </Button>

      {receiptSaleId && (
        <Receipt
          saleId={receiptSaleId}
          onClose={() => setReceiptSaleId(null)}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-dark-charcoal">Add Walk-in Sale</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-blue hover:text-dark-charcoal text-2xl"
                >
                  ×
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-error-bg border border-red-300 rounded text-error-text">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-dark-charcoal mb-4">Customer Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                        Name <span className="text-red">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                        Phone <span className="text-red">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
                      />
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-lg font-semibold text-dark-charcoal mb-4">Services <span className="text-red">*</span></h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {services.map((service) => (
                      <label
                        key={service._id}
                        className="flex items-start p-3 border border-medium-grey rounded cursor-pointer hover:bg-light-grey"
                      >
                        <input
                          type="checkbox"
                          checked={formData.serviceIds.includes(service._id)}
                          onChange={() => handleServiceToggle(service._id)}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-dark-charcoal text-sm">{service.name}</p>
                              <p className="text-xs text-slate-blue">{service.duration} min</p>
                            </div>
                            <p className="font-bold text-dark-charcoal text-sm">
                              PKR {service.price?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Employee */}
                <div>
                  <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                    Staff (Optional)
                  </label>
                  <select
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
                  >
                    <option value="">Any Available</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment */}
                <div>
                  <h3 className="text-lg font-semibold text-dark-charcoal mb-4">Payment</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                        Payment Method <span className="text-red">*</span>
                      </label>
                      <select
                        required
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
                      >
                        <option value="cash">Cash</option>
                        <option value="online">Online</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                        Discount (PKR)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.discountApplied}
                        onChange={handleDiscountChange}
                        className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-light-grey rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-dark-charcoal">Total Amount:</span>
                      <span className="text-2xl font-bold text-dark-charcoal">
                        PKR {formData.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-medium-grey">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Processing...' : 'Complete Sale'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
