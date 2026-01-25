import Link from 'next/link';
import connectDB from '../../../lib/db.js';
import Settings from '../../../models/Settings.js';

export async function generateMetadata() {
  try {
    await connectDB();
    const settings = await Settings.getSettings();
    return {
      title: `About Us - ${settings.salonName}`,
      description: `Learn about ${settings.salonName} - your trusted partner in professional grooming and personal care. Quality service, expert team, and customer satisfaction.`,
      keywords: 'about salon, salon history, salon mission, professional grooming',
    };
  } catch (error) {
    return {
      title: 'About Us - Professional Salon',
      description: 'Learn about our salon - your trusted partner in professional grooming and personal care.',
    };
  }
}

export default async function AboutPage() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Quality Service',
      description: 'We maintain the highest standards in every service we provide.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Expert Team',
      description: 'Our skilled professionals are trained in the latest techniques.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Hygiene First',
      description: 'Clean and sanitized environment for your safety and comfort.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Fair Pricing',
      description: 'Transparent and competitive pricing for all our services.',
    },
  ];

  return (
    <div className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-light-grey to-white min-h-screen">
      <div className="container mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-charcoal mb-6">
            About Us
          </h1>
          <p className="text-lg sm:text-xl text-slate-blue max-w-3xl mx-auto">
            Your trusted partner in professional grooming and personal care
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-white border border-medium-grey rounded-2xl p-8 lg:p-12 mb-8 lg:mb-12 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-blue to-[#7a8294] rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-dark-charcoal">Our Story</h2>
          </div>
          <div className="space-y-4 text-dark-charcoal leading-relaxed">
            <p className="text-lg">
              Founded in 2010, our salon has been a cornerstone of professional grooming services 
              in the community. What started as a small local business has grown into a trusted 
              establishment known for excellence, quality, and customer satisfaction.
            </p>
            <p>
              Over the years, we've built a reputation for delivering exceptional services that 
              go beyond just haircuts and styling. We believe in creating an experience that makes 
              our clients feel confident, refreshed, and valued. Our commitment to staying updated 
              with the latest trends and techniques ensures that you always receive contemporary 
              and professional service.
            </p>
            <p>
              Our team of experienced professionals is not just skilled in their craft, but also 
              passionate about helping you look and feel your absolute best. Every visit to our 
              salon is an opportunity to transform not just your appearance, but also your confidence.
            </p>
          </div>
        </div>

        {/* Mission & Values Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Mission */}
          <div className="bg-white border border-medium-grey rounded-2xl p-8 lg:p-10 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-blue to-[#7a8294] rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-dark-charcoal mb-4">Our Mission</h2>
            <p className="text-dark-charcoal leading-relaxed">
              To provide exceptional salon services that enhance our clients' confidence and appearance, 
              while maintaining the highest standards of professionalism, hygiene, and customer care. 
              We strive to create a welcoming environment where every client feels valued and leaves 
              feeling their absolute best.
            </p>
          </div>

          {/* Values */}
          <div className="bg-white border border-medium-grey rounded-2xl p-8 lg:p-10 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-blue to-[#7a8294] rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-dark-charcoal mb-4">Our Values</h2>
            <ul className="space-y-3 text-dark-charcoal">
              <li className="flex items-start gap-3">
                <span className="text-slate-blue mt-1">✓</span>
                <span>Quality service above all else</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-blue mt-1">✓</span>
                <span>Customer satisfaction is our top priority</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-blue mt-1">✓</span>
                <span>Professional and friendly staff</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-blue mt-1">✓</span>
                <span>Clean and hygienic environment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-blue mt-1">✓</span>
                <span>Fair and transparent pricing</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-medium-grey rounded-xl p-6 hover:shadow-xl hover:border-slate-blue transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-slate-blue to-[#7a8294] rounded-lg flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-dark-charcoal mb-2">{feature.title}</h3>
              <p className="text-slate-blue text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-dark-charcoal to-[#2d3139] rounded-2xl p-8 lg:p-12 text-white text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Experience the Difference
          </h2>
          <p className="text-lg text-slate-blue mb-6 max-w-2xl mx-auto">
            Join our community of satisfied clients and discover why we're the preferred choice for professional grooming
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-4 bg-slate-blue text-white font-semibold rounded-lg hover:bg-[#7a8294] transition-all duration-300 hover:scale-105"
            >
              Book Appointment
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-dark-charcoal transition-all duration-300"
            >
              View Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
