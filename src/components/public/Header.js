'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState({ salonName: 'Ishfaq Mens Salon', logo: '' });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/team', label: 'Our Team' },
    { href: '/about', label: 'About' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/book', label: 'Book Appointment', highlight: true },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white shadow-2xl border-b border-medium-grey' 
        : 'bg-gradient-to-r from-dark-charcoal via-[#2d3139] to-dark-charcoal'
    }`}>
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-slate-blue via-[#7a8294] to-slate-blue"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section with Hover Animation */}
          <Link 
            href="/" 
            className="flex items-center group relative"
          >
            {/* Logo Container - shifts left on hover */}
            <div className="relative z-10 transition-transform duration-500 ease-out group-hover:-translate-x-2">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.salonName}
                  className="h-9 sm:h-11 w-auto object-contain transition-all duration-500 group-hover:scale-105"
                  style={scrolled ? { filter: 'brightness(0)' } : { filter: 'brightness(0) invert(1)' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className={`h-9 sm:h-11 w-9 sm:w-11 rounded-lg flex items-center justify-center transition-all duration-500 group-hover:scale-105 ${
                  scrolled ? 'bg-dark-charcoal' : 'bg-slate-blue'
                }`}>
                  <span className={`font-bold text-lg ${
                    scrolled ? 'text-white' : 'text-white'
                  }`}>
                    {settings.salonName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Brand Text Container - slides in from right on hover */}
            <div className="overflow-hidden max-w-0 group-hover:max-w-[300px] transition-all duration-500 ease-out">
              <div className="flex flex-col pl-0 group-hover:pl-3 transition-all duration-500 ease-out">
                <span className={`text-lg sm:text-xl lg:text-2xl font-heading font-bold whitespace-nowrap opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out ${
                  scrolled ? 'text-dark-charcoal' : 'text-white'
                }`}>
                  {settings.salonName}
                </span>
                {!scrolled && (
                  <span className="text-xs text-slate-blue/80 font-medium hidden sm:block whitespace-nowrap opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out delay-75">
                    Premium Grooming
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              
              if (link.highlight) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-6 py-2.5 bg-gradient-to-r from-slate-blue to-[#7a8294] text-white font-semibold rounded-full hover:from-[#7a8294] hover:to-slate-blue transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-slate-blue/50"
                  >
                    <span className="relative z-10">{link.label}</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-[#7a8294] to-slate-blue rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  </Link>
                );
              }
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2.5 font-medium rounded-lg transition-all duration-300 ${
                    scrolled
                      ? active
                        ? 'text-slate-blue bg-slate-blue/10'
                        : 'text-dark-charcoal hover:text-slate-blue hover:bg-slate-blue/5'
                      : active
                        ? 'text-white bg-white/15'
                        : 'text-white hover:text-white hover:bg-white/10'
                  }`}
                  style={!scrolled ? { color: '#FFFFFF' } : {}}
                >
                  <span>{link.label}</span>
                  {active && (
                    <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full ${
                      scrolled ? 'bg-slate-blue' : 'bg-white'
                    }`}></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2.5 rounded-lg transition-all duration-300 ${
              scrolled
                ? 'text-dark-charcoal hover:bg-slate-blue/10'
                : 'text-white hover:bg-white/10'
            }`}
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
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            mobileMenuOpen ? 'max-h-[600px] opacity-100 mt-2 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="space-y-1 pt-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              
              if (link.highlight) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 bg-gradient-to-r from-slate-blue to-[#7a8294] text-white font-semibold rounded-lg text-center hover:from-[#7a8294] hover:to-slate-blue transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                );
              }
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                    scrolled
                      ? active
                        ? 'bg-slate-blue/20 text-slate-blue font-semibold border-l-4 border-slate-blue'
                        : 'text-dark-charcoal hover:bg-slate-blue/10 hover:text-slate-blue'
                      : active
                        ? 'bg-white/20 text-white font-semibold border-l-4 border-white'
                        : 'text-white hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
