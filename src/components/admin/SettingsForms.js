'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button.js';
import Link from 'next/link';

export default function SettingsForms({ initialSettings }) {
  const router = useRouter();
  const [loading, setLoading] = useState({});
  const [message, setMessage] = useState({});
  const [settings, setSettings] = useState({
    salonName: '',
    salonAddress: '',
    salonPhone: '',
    logo: '',
    openingTime: '09:00',
    closingTime: '18:00',
    closedDays: [],
    whatsappNumber: '',
    defaultCommissionRate: 20,
    ...initialSettings,
  });
  const [logoPreview, setLogoPreview] = useState(initialSettings?.logo || '');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setSettings({
        salonName: initialSettings.salonName || '',
        salonAddress: initialSettings.salonAddress || '',
        salonPhone: initialSettings.salonPhone || '',
        logo: initialSettings.logo || '',
        openingTime: initialSettings.openingTime || '09:00',
        closingTime: initialSettings.closingTime || '18:00',
        closedDays: initialSettings.closedDays || [],
        whatsappNumber: initialSettings.whatsappNumber || '',
        defaultCommissionRate: initialSettings.defaultCommissionRate || 20,
      });
      setLogoPreview(initialSettings.logo || '');
    }
  }, [initialSettings]);

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ ...message, logo: 'Please select a valid image file' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ ...message, logo: 'Image size must be less than 5MB' });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload logo
    setUploadingLogo(true);
    setMessage({ ...message, logo: '' });

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('logo', file);

      const res = await fetch('/api/upload/logo', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();

      if (data.success) {
        setSettings({ ...settings, logo: data.data.logoUrl });
        setMessage({ ...message, logo: 'Logo uploaded successfully! Click "Save Salon Info" to save.' });
      } else {
        setMessage({ ...message, logo: data.error || 'Failed to upload logo' });
        setLogoPreview(settings.logo || '');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      setMessage({ ...message, logo: 'Failed to upload logo. Please try again.' });
      setLogoPreview(settings.logo || '');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e, section) => {
    e.preventDefault();
    setLoading({ ...loading, [section]: true });
    setMessage({ ...message, [section]: '' });

    try {
      let dataToSend = {};
      
      switch (section) {
        case 'salon':
          dataToSend = {
            salonName: settings.salonName,
            salonAddress: settings.salonAddress,
            salonPhone: settings.salonPhone,
            logo: settings.logo,
          };
          break;
        case 'hours':
          dataToSend = {
            openingTime: settings.openingTime,
            closingTime: settings.closingTime,
            closedDays: settings.closedDays,
          };
          break;
        case 'whatsapp':
          dataToSend = {
            whatsappNumber: settings.whatsappNumber,
          };
          break;
        case 'commission':
          dataToSend = {
            defaultCommissionRate: settings.defaultCommissionRate,
          };
          break;
      }

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ ...message, [section]: 'Settings saved successfully!' });
        setTimeout(() => {
          setMessage({ ...message, [section]: '' });
        }, 3000);
      } else {
        setMessage({ ...message, [section]: data.error || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ ...message, [section]: 'An error occurred. Please try again.' });
      console.error('Error saving settings:', error);
    } finally {
      setLoading({ ...loading, [section]: false });
    }
  };

  const handleDayToggle = (day) => {
    setSettings((prev) => ({
      ...prev,
      closedDays: prev.closedDays.includes(day)
        ? prev.closedDays.filter((d) => d !== day)
        : [...prev.closedDays, day],
    }));
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6">
      {/* Salon Info */}
      <div className="bg-white border border-medium-grey rounded-lg p-4 sm:p-6">
        <h2 className="text-xl font-bold text-dark-charcoal mb-4">Salon Information</h2>
        <form onSubmit={(e) => handleSubmit(e, 'salon')} className="space-y-4">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-semibold text-dark-charcoal mb-2">
              Logo
            </label>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-32 h-32 object-contain border border-medium-grey rounded-lg bg-white p-2"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 bg-light-grey border border-medium-grey rounded-lg flex items-center justify-center">
                    <span className="text-slate-blue text-sm">No logo</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={uploadingLogo}
                  className="w-full text-sm text-dark-charcoal file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-slate-blue file:text-white hover:file:bg-[#7a8294] file:cursor-pointer disabled:opacity-50"
                />
                <p className="text-xs text-slate-blue mt-2">
                  Max size: 5MB. Supported formats: JPG, PNG, GIF, SVG
                </p>
                {uploadingLogo && (
                  <p className="text-sm text-slate-blue mt-2">Uploading...</p>
                )}
                {message.logo && (
                  <p className={`text-sm mt-2 ${message.logo.includes('success') ? 'text-green' : 'text-red'}`}>
                    {message.logo}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark-charcoal mb-2">
              Salon Name
            </label>
            <input
              type="text"
              value={settings.salonName}
              onChange={(e) => setSettings({ ...settings, salonName: e.target.value })}
              className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark-charcoal mb-2">
              Address
            </label>
            <textarea
              rows="3"
              value={settings.salonAddress}
              onChange={(e) => setSettings({ ...settings, salonAddress: e.target.value })}
              className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark-charcoal mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={settings.salonPhone}
              onChange={(e) => setSettings({ ...settings, salonPhone: e.target.value })}
              className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
            />
          </div>
          {message.salon && (
            <p className={`text-sm ${message.salon.includes('success') ? 'text-green' : 'text-red'}`}>
              {message.salon}
            </p>
          )}
          <Button type="submit" disabled={loading.salon}>
            {loading.salon ? 'Saving...' : 'Save Salon Info'}
          </Button>
        </form>
      </div>

      {/* Working Hours */}
      <div className="bg-white border border-medium-grey rounded-lg p-6">
        <h2 className="text-xl font-bold text-dark-charcoal mb-4">Working Hours</h2>
        <form onSubmit={(e) => handleSubmit(e, 'hours')} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                Opening Time
              </label>
              <input
                type="time"
                value={settings.openingTime}
                onChange={(e) => setSettings({ ...settings, openingTime: e.target.value })}
                className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-charcoal mb-2">
                Closing Time
              </label>
              <input
                type="time"
                value={settings.closingTime}
                onChange={(e) => setSettings({ ...settings, closingTime: e.target.value })}
                className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark-charcoal mb-2">
              Days Closed
            </label>
            <div className="space-y-2">
              {daysOfWeek.map((day) => (
                <label key={day} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.closedDays.includes(day)}
                    onChange={() => handleDayToggle(day)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-dark-charcoal">{day}</span>
                </label>
              ))}
            </div>
          </div>
          {message.hours && (
            <p className={`text-sm ${message.hours.includes('success') ? 'text-green' : 'text-red'}`}>
              {message.hours}
            </p>
          )}
          <Button type="submit" disabled={loading.hours}>
            {loading.hours ? 'Saving...' : 'Save Working Hours'}
          </Button>
        </form>
      </div>

      {/* WhatsApp Number */}
      <div className="bg-white border border-medium-grey rounded-lg p-6">
        <h2 className="text-xl font-bold text-dark-charcoal mb-4">WhatsApp Integration</h2>
        <form onSubmit={(e) => handleSubmit(e, 'whatsapp')} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark-charcoal mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
            />
          </div>
          {message.whatsapp && (
            <p className={`text-sm ${message.whatsapp.includes('success') ? 'text-green' : 'text-red'}`}>
              {message.whatsapp}
            </p>
          )}
          <Button type="submit" disabled={loading.whatsapp}>
            {loading.whatsapp ? 'Saving...' : 'Save WhatsApp Number'}
          </Button>
        </form>
      </div>

      {/* Default Commission Rates */}
      <div className="bg-white border border-medium-grey rounded-lg p-6">
        <h2 className="text-xl font-bold text-dark-charcoal mb-4">Default Commission Rates</h2>
        <form onSubmit={(e) => handleSubmit(e, 'commission')} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark-charcoal mb-2">
              Default Commission Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.defaultCommissionRate}
              onChange={(e) => setSettings({ ...settings, defaultCommissionRate: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-medium-grey rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
            />
          </div>
          {message.commission && (
            <p className={`text-sm ${message.commission.includes('success') ? 'text-green' : 'text-red'}`}>
              {message.commission}
            </p>
          )}
          <Button type="submit" disabled={loading.commission}>
            {loading.commission ? 'Saving...' : 'Save Commission Rate'}
          </Button>
        </form>
      </div>

      {/* Services Management */}
      <div className="bg-white border border-medium-grey rounded-lg p-6">
        <h2 className="text-xl font-bold text-dark-charcoal mb-4">Services Management</h2>
        <p className="text-slate-blue mb-4">
          Manage your services list. Add, edit, or deactivate services.
        </p>
        <Link href="/admin/services">
          <Button variant="secondary">Manage Services</Button>
        </Link>
      </div>
    </div>
  );
}
