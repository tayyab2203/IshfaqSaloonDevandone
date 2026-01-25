'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState({ salonName: 'Ishfaq Mens Salon', logo: '' });

  useEffect(() => {
    // Fetch settings for admin
    fetch('/api/settings')
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

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/bookings', label: 'Bookings', icon: '📅' },
    { href: '/admin/customers', label: 'Customers', icon: '👥' },
    { href: '/admin/employees', label: 'Employees', icon: '👔' },
    { href: '/admin/sales', label: 'Sales', icon: '💰' },
    { href: '/admin/attendance', label: 'Attendance', icon: '✅' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
    { href: '/admin/reports', label: 'Reports', icon: '📈' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-dark-charcoal text-white p-2 rounded-md shadow-lg"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-dark-charcoal text-white min-h-screen flex flex-col transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 lg:p-6 border-b border-slate-blue">
          <div className="flex items-center gap-3 mb-3">
            {settings.logo ? (
              <img
                src={settings.logo}
                alt={settings.salonName}
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : null}
            <h1 className="text-lg lg:text-xl font-heading font-bold">{settings.salonName}</h1>
          </div>
          <p className="text-xs lg:text-sm text-slate-blue mt-1">{user?.name || 'Admin'}</p>
          <p className="text-xs text-slate-blue mt-1 capitalize">{user?.role || 'staff'}</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 lg:px-4 py-2 lg:py-3 rounded transition-colors ${
                      isActive
                        ? 'bg-slate-blue text-white'
                        : 'text-white opacity-80 hover:bg-[#2d3139] hover:text-white'
                    }`}
                  >
                    <span className="mr-2 lg:mr-3 text-base lg:text-lg">{item.icon}</span>
                    <span className="text-xs lg:text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-blue">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center px-3 lg:px-4 py-2 lg:py-3 rounded text-white opacity-80 hover:bg-[#2d3139] hover:text-white transition-colors"
          >
            <span className="mr-2 lg:mr-3 text-base lg:text-lg">🚪</span>
            <span className="text-xs lg:text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
