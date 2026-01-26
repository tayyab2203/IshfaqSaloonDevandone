'use client';

import { useState, useEffect } from 'react';

export default function WhatsAppButton() {
  const [settings, setSettings] = useState({ whatsappNumber: '+92 300 1234567' });

  useEffect(() => {
    fetch('/api/settings/public')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.whatsappNumber) {
          setSettings(data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching settings:', error);
      });
  }, []);

  const handleWhatsAppClick = () => {
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanNumber = settings.whatsappNumber?.replace(/[^0-9]/g, '') || '923001234567';
    const whatsappUrl = `https://wa.me/${cleanNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed left-4 bottom-20 sm:bottom-24 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center hover:bg-[#20BA5A] transition-all duration-300 transform hover:scale-110 group whatsapp-blink"
      aria-label="Contact us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <svg
        className="w-8 h-8 sm:w-9 sm:h-9 text-white relative z-10"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.582 10-9.582 2.689 0 5.22 1.05 7.13 2.96 1.909 1.91 2.96 4.44 2.96 7.13-.001 5.464-4.13 9.99-9.581 9.99m8.907-18.26A11.815 11.815 0 0012.05 0C5.396 0 .05 5.344.05 11.997c0 2.09.547 4.142 1.595 5.945L.03 23.988l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.654 0 12-5.346 12-11.998 0-3.176-1.24-6.165-3.495-8.411"/>
      </svg>
      {/* Animated pulse ring effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] whatsapp-pulse"></span>
    </button>
  );
}
