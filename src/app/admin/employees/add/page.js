'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '../../../../components/admin/PageHeader.js';
import Button from '../../../../components/ui/Button.js';

export default function AddEmployeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [services, setServices] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'barber',
    commissionRate: 20,
    services: [],
    workingDays: [],
    status: 'active',
    image: '',
  });

  useEffect(() => {
    // Fetch services
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/employees');
      } else {
        setError(data.error || 'Failed to create employee');
      }
    } catch (error) {
      setError('Failed to create employee. Please try again.');
      console.error('Error creating employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (serviceId) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const handleWorkingDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload image
    setUploadingImage(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const res = await fetch('/api/upload/employee-image', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          image: data.data.imageUrl,
        }));
      } else {
        setError(data.error || 'Failed to upload image');
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div>
      <PageHeader title="Add New Employee" />

      {error && (
        <div className="bg-error-bg border border-red text-error-text px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 space-y-6">
        {/* Employee Image */}
        <div>
          <h2 className="text-xl font-bold text-dark-charcoal mb-4">Employee Photo</h2>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-medium-grey"
                />
              ) : (
                <div className="w-32 h-32 bg-light-grey border border-medium-grey rounded-lg flex items-center justify-center">
                  <span className="text-slate-blue text-sm">No image</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploadingImage}
                className="w-full text-sm text-dark-charcoal file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-slate-blue file:text-white hover:file:bg-[#7a8294] file:cursor-pointer disabled:opacity-50"
              />
              <p className="text-xs text-slate-blue mt-2">
                Max size: 5MB. Supported formats: JPG, PNG, GIF
              </p>
              {uploadingImage && (
                <p className="text-sm text-slate-blue mt-2">Uploading...</p>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-bold text-dark-charcoal mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                Name <span className="text-red">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                Role <span className="text-red">*</span>
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
              >
                <option value="barber">Barber</option>
                <option value="stylist">Stylist</option>
                <option value="receptionist">Receptionist</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                Commission Rate (%) <span className="text-red">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.commissionRate}
                onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                Status <span className="text-red">*</span>
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-xl font-bold text-dark-charcoal mb-4">Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {services.map((service) => (
              <label
                key={service._id}
                className="flex items-center gap-2 p-3 border border-medium-grey rounded cursor-pointer hover:bg-light-grey"
              >
                <input
                  type="checkbox"
                  checked={formData.services.includes(service._id)}
                  onChange={() => handleServiceToggle(service._id)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-dark-charcoal">{service.name}</span>
              </label>
            ))}
          </div>
          {services.length === 0 && (
            <p className="text-slate-blue">No services available. Add services in Settings.</p>
          )}
        </div>

        {/* Working Days */}
        <div>
          <h2 className="text-xl font-bold text-dark-charcoal mb-4">Working Days</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {daysOfWeek.map((day) => (
              <label
                key={day}
                className="flex items-center gap-2 p-3 border border-medium-grey rounded cursor-pointer hover:bg-light-grey"
              >
                <input
                  type="checkbox"
                  checked={formData.workingDays.includes(day)}
                  onChange={() => handleWorkingDayToggle(day)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-dark-charcoal">{day}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4 border-t border-medium-grey">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Employee'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/admin/employees')}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
