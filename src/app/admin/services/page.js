'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '../../../components/admin/PageHeader.js';
import Button from '../../../components/ui/Button.js';
import Link from 'next/link';
import { formatCurrency } from '../../../lib/utils.js';

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    isActive: true,
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingId ? `/api/services/${editingId}` : '/api/services';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', description: '', price: 0, duration: 30, isActive: true });
        fetchServices();
      } else {
        setError(data.error || 'Failed to save service');
      }
    } catch (error) {
      setError('Failed to save service. Please try again.');
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name || '',
      description: service.description || '',
      price: service.price || 0,
      duration: service.duration || 30,
      isActive: service.isActive !== undefined ? service.isActive : true,
    });
    setEditingId(service._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        fetchServices();
      } else {
        setError(data.error || 'Failed to delete service');
      }
    } catch (error) {
      setError('Failed to delete service. Please try again.');
      console.error('Error deleting service:', error);
    }
  };

  const handleToggleActive = async (service) => {
    try {
      const res = await fetch(`/api/services/${service._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...service, isActive: !service.isActive }),
      });

      const data = await res.json();

      if (data.success) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error toggling service:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Services Management" />
        <div className="bg-white border border-medium-grey rounded-lg p-6 text-center">
          <p className="text-slate-blue">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Services Management"
        actions={
          <>
            {!showForm && (
              <Button variant="primary" onClick={() => setShowForm(true)}>
                Add Service
              </Button>
            )}
            <Link href="/admin/settings">
              <Button variant="secondary">Back to Settings</Button>
            </Link>
          </>
        }
      />

      {error && (
        <div className="bg-error-bg border border-red text-error-text px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-xl font-bold text-dark-charcoal mb-4">
            {editingId ? 'Edit Service' : 'Add New Service'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Service Name <span className="text-red">*</span>
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
                  Price (PKR) <span className="text-red">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Duration (minutes) <span className="text-red">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                  className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                Description
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit">{editingId ? 'Update' : 'Create'} Service</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: '', description: '', price: 0, duration: 30, isActive: true });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-white border border-medium-grey rounded-lg overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-medium-grey">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Name
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Description
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Price
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Duration
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-bold text-dark-charcoal border-b-2 border-medium-grey">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 lg:px-6 py-8 text-center text-slate-blue">
                    No services found. Add your first service above.
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr
                    key={service._id}
                    className="border-b border-medium-grey hover:bg-light-grey"
                  >
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal font-semibold">{service.name}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">{service.description || 'N/A'}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">{formatCurrency(service.price)}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-dark-charcoal">{service.duration} min</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <button
                        onClick={() => handleToggleActive(service)}
                        className={`px-2 lg:px-3 py-1 rounded text-xs font-semibold ${
                          service.isActive
                            ? 'bg-success-bg text-success-text border border-green-300'
                            : 'bg-medium-grey text-slate-blue border border-medium-grey'
                        }`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-xs lg:text-sm text-blue hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="text-xs lg:text-sm text-red hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-medium-grey">
          {services.length === 0 ? (
            <div className="p-6 text-center text-slate-blue">No services found. Add your first service above.</div>
          ) : (
            services.map((service) => (
              <div key={service._id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-dark-charcoal text-sm">{service.name}</p>
                    <p className="text-xs text-slate-blue mt-1">{service.description || 'N/A'}</p>
                  </div>
                  <button
                    onClick={() => handleToggleActive(service)}
                    className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                      service.isActive
                        ? 'bg-success-bg text-success-text border border-green-300'
                        : 'bg-medium-grey text-slate-blue border border-medium-grey'
                    }`}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-blue">
                  <div>
                    <span className="font-semibold text-dark-charcoal">Price: </span>
                    {formatCurrency(service.price)}
                  </div>
                  <div>
                    <span className="font-semibold text-dark-charcoal">Duration: </span>
                    {service.duration} min
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-xs text-blue hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="text-xs text-red hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
