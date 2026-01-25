import Link from 'next/link';
import connectDB from '../../../lib/db.js';
import Service from '../../../models/Service.js';
import Settings from '../../../models/Settings.js';

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  try {
    await connectDB();
    const settings = await Settings.getSettings();
    return {
      title: `Our Services - ${settings.salonName}`,
      description: `Discover our comprehensive range of professional grooming services at ${settings.salonName}. Quality services designed to make you look and feel your best.`,
      keywords: 'salon services, grooming services, haircut, styling, professional services',
    };
  } catch (error) {
    return {
      title: 'Our Services - Professional Salon',
      description: 'Discover our comprehensive range of professional grooming services.',
    };
  }
}

async function getServices() {
  try {
    await connectDB();
    const services = await Service.find({ isActive: true }).sort({ name: 1 });
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-light-grey to-white min-h-screen">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-charcoal mb-4">
            Our Services
          </h1>
          <p className="text-lg sm:text-xl text-slate-blue max-w-3xl mx-auto">
            Discover our comprehensive range of professional grooming services. 
            Each service is designed to help you look and feel your absolute best.
          </p>
        </div>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div
                key={service._id.toString()}
                className="group bg-white border border-medium-grey rounded-xl p-6 lg:p-8 hover:shadow-2xl hover:border-slate-blue transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Service Icon/Header */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-blue to-[#7a8294] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-dark-charcoal mb-3">
                    {service.name}
                  </h3>
                  <p className="text-dark-charcoal text-sm lg:text-base mb-4 leading-relaxed">
                    {service.description || 'Professional grooming service'}
                  </p>
                </div>

                {/* Price and Duration */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-medium-grey">
                  <div>
                    <p className="text-3xl lg:text-4xl font-bold text-dark-charcoal mb-1">
                      PKR {service.price?.toLocaleString() || '0'}
                    </p>
                    <p className="text-sm text-slate-blue flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {service.duration || 30} minutes
                    </p>
                  </div>
                </div>

                {/* Book Button */}
                <Link
                  href="/book"
                  className="block w-full bg-gradient-to-r from-dark-charcoal to-[#2d3139] text-white text-center py-3 lg:py-4 rounded-lg font-semibold hover:from-slate-blue hover:to-[#7a8294] transition-all duration-300 transform hover:scale-105"
                  style={{ color: '#FFFFFF' }}
                >
                  Book This Service
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-blue rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-dark-charcoal mb-2">Services Coming Soon</h3>
            <p className="text-slate-blue text-lg">We're preparing amazing services for you!</p>
          </div>
        )}

        {/* CTA Section */}
        {services.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-dark-charcoal to-[#2d3139] rounded-2xl p-8 lg:p-12 text-white">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Ready to Book Your Appointment?
              </h2>
              <p className="text-lg text-slate-blue mb-6 max-w-2xl mx-auto">
                Choose from our wide range of services and book with our expert team today
              </p>
              <Link
                href="/book"
                className="inline-flex items-center justify-center px-10 py-4 bg-slate-blue text-white font-semibold rounded-lg hover:bg-[#7a8294] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-slate-blue/50"
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
