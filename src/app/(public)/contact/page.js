'use client';

import { useState, useEffect } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [settings, setSettings] = useState({
    salonPhone: '+92 300 1234567',
    salonAddress: '123 Main Street, City, Country',
    openingTime: '09:00',
    closingTime: '18:00',
    closedDays: [],
  });

  useEffect(() => {
    // Fetch public settings
    fetch('/api/settings/public')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings(data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching settings:', error);
      });
  }, []);

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Name is required';
    }
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      return 'Message is required';
    }
    if (formData.message.trim().length < 10) {
      return 'Message must be at least 10 characters long';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    
    setSubmitting(true);
    
    try {
      // In production, this would send to an API endpoint
      // For now, simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      setSubmitting(false);
      setFormError('Failed to send message. Please try again.');
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getBusinessHours = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const closedDays = settings.closedDays || [];
    
    if (closedDays.length === 0) {
      return [
        { day: 'Monday - Sunday', time: `${formatTime(settings.openingTime)} - ${formatTime(settings.closingTime)}` },
      ];
    }
    
    const openDays = days.filter(day => !closedDays.includes(day));
    if (openDays.length === 0) {
      return [{ day: 'Closed', time: 'Please contact us for appointments' }];
    }
    
    // Group consecutive days
    const groups = [];
    let currentGroup = [openDays[0]];
    
    for (let i = 1; i < openDays.length; i++) {
      const currentIndex = days.indexOf(openDays[i]);
      const prevIndex = days.indexOf(openDays[i - 1]);
      
      if (currentIndex === prevIndex + 1) {
        currentGroup.push(openDays[i]);
      } else {
        groups.push(currentGroup);
        currentGroup = [openDays[i]];
      }
    }
    groups.push(currentGroup);
    
    return groups.map(group => ({
      day: group.length === 1 ? group[0] : `${group[0]} - ${group[group.length - 1]}`,
      time: `${formatTime(settings.openingTime)} - ${formatTime(settings.closingTime)}`,
    }));
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone',
      content: settings.salonPhone || '+92 300 1234567',
      link: `tel:${(settings.salonPhone || '+923001234567').replace(/\s/g, '')}`,
    },
    settings.whatsappNumber ? {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.582 10-9.582 2.689 0 5.22 1.05 7.13 2.96 1.909 1.91 2.96 4.44 2.96 7.13-.001 5.464-4.13 9.99-9.581 9.99m8.907-18.26A11.815 11.815 0 0012.05 0C5.396 0 .05 5.344.05 11.997c0 2.09.547 4.142 1.595 5.945L.03 23.988l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.654 0 12-5.346 12-11.998 0-3.176-1.24-6.165-3.495-8.411"/>
        </svg>
      ),
      title: 'WhatsApp',
      content: settings.whatsappNumber || settings.salonPhone || '+92 300 1234567',
      link: `https://wa.me/${(settings.whatsappNumber || settings.salonPhone || '923001234567').replace(/[^0-9]/g, '')}`,
    } : null,
    settings.salonAddress ? {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Address',
      content: settings.salonAddress,
      link: null,
    } : null,
  ].filter(Boolean);

  const hours = getBusinessHours();

  return (
    <div className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-light-grey to-white min-h-screen">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-charcoal mb-4">
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl text-slate-blue max-w-3xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white border border-medium-grey rounded-xl p-6 hover:shadow-xl hover:border-slate-blue transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-slate-blue to-[#7a8294] rounded-lg flex items-center justify-center text-white mb-4">
                {info.icon}
              </div>
              <h3 className="text-lg font-bold text-dark-charcoal mb-2">{info.title}</h3>
              {info.link ? (
                <a
                  href={info.link}
                  className="text-slate-blue hover:text-dark-charcoal transition-colors"
                >
                  {info.content}
                </a>
              ) : (
                <p className="text-slate-blue">{info.content}</p>
              )}
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Contact Form */}
          <div className="bg-white border border-medium-grey rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg">
            <h2 className="text-2xl lg:text-3xl font-bold text-dark-charcoal mb-6">Send us a Message</h2>
            
            {formError && (
              <div className="mb-6 p-4 bg-red bg-opacity-10 border border-red rounded-lg">
                <p className="text-red font-semibold">{formError}</p>
              </div>
            )}

            {submitted && (
              <div className="mb-6 p-4 bg-green bg-opacity-10 border border-green rounded-lg">
                <p className="text-green font-semibold">Thank you! Your message has been sent successfully.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Name <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-medium-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-blue focus:border-transparent transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Email <span className="text-red">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-medium-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-blue focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-medium-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-blue focus:border-transparent transition-all"
                  placeholder="+92 300 1234567"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-dark-charcoal mb-2">
                  Message <span className="text-red">*</span>
                </label>
                <textarea
                  id="message"
                  rows="6"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-medium-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-blue focus:border-transparent transition-all resize-none"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-dark-charcoal to-[#2d3139] text-white py-4 px-6 rounded-lg font-semibold hover:from-slate-blue hover:to-[#7a8294] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Hours */}
            <div className="bg-white border border-medium-grey rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-blue to-[#7a8294] rounded-lg flex items-center justify-center text-white mb-6">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-dark-charcoal mb-6">Business Hours</h2>
              <div className="space-y-4">
                {hours.map((hour, index) => (
                  <div key={index} className="flex justify-between items-center pb-4 border-b border-medium-grey last:border-0">
                    <span className="font-semibold text-dark-charcoal">{hour.day}</span>
                    <span className="text-slate-blue">{hour.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white border border-medium-grey rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg">
              <h2 className="text-2xl font-bold text-dark-charcoal mb-6">Find Us</h2>
              <div className="w-full h-64 bg-gradient-to-br from-slate-blue to-[#7a8294] rounded-xl flex items-center justify-center text-white">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm opacity-90">Map will be embedded here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
