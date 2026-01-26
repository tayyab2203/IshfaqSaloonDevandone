import Link from 'next/link';
import connectDB from '../../../lib/db.js';
import Service from '../../../models/Service.js';
import Settings from '../../../models/Settings.js';
import ServiceImage from '../../../components/admin/ServiceImage.js';

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
    <div className="min-h-screen bg-gradient-to-br from-light-grey via-white to-light-grey">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-dark-charcoal via-[#2d3139] to-dark-charcoal text-white py-20 sm:py-28 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-slate-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-slate-blue rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-slate-blue to-white bg-clip-text text-transparent">
              Our Services
            </h1>
            <p className="text-xl sm:text-2xl text-slate-blue/90 max-w-3xl mx-auto leading-relaxed">
              Discover our comprehensive range of professional grooming services. 
              Each service is designed to help you look and feel your absolute best.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16 sm:py-20">
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {services.map((service, index) => (
              <div
                key={service._id.toString()}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-medium-grey/50"
              >
                {/* Image Container */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-gradient-to-br from-slate-blue/20 to-dark-charcoal/20">
                  <ServiceImage
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    fallbackContent={
                      <div className="w-full h-full bg-gradient-to-br from-slate-blue via-[#7a8294] to-dark-charcoal flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-24 h-24 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                          </svg>
                          <p className="text-white/40 text-sm font-medium">{service.name}</p>
                        </div>
                      </div>
                    }
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-dark-charcoal">
                      PKR {service.price?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8">
                  {/* Service Name */}
                  <h3 className="text-2xl sm:text-3xl font-bold text-dark-charcoal mb-3 group-hover:text-slate-blue transition-colors duration-300">
                    {service.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-blue text-base mb-6 leading-relaxed line-clamp-3">
                    {service.description || 'Professional grooming service tailored to your needs. Experience quality and excellence.'}
                  </p>

                  {/* Duration Badge */}
                  <div className="flex items-center gap-2 mb-6 pb-6 border-b border-medium-grey">
                    <div className="flex items-center gap-2 text-slate-blue">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">{service.duration || 30} minutes</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Link
                    href="/book"
                    className="block w-full bg-gradient-to-r from-dark-charcoal to-[#2d3139] text-white text-center py-4 rounded-xl font-semibold hover:from-slate-blue hover:to-[#7a8294] transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-slate-blue/50 relative overflow-hidden group"
                    style={{ color: '#FFFFFF' }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Book This Service
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-blue to-[#7a8294] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>

                {/* Decorative Corner Accent */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-slate-blue/20 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-slate-blue to-dark-charcoal rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-dark-charcoal mb-4">Services Coming Soon</h3>
            <p className="text-slate-blue text-xl max-w-md mx-auto">We're preparing amazing services for you! Check back soon.</p>
          </div>
        )}

        {/* Enhanced CTA Section */}
        {services.length > 0 && (
          <div className="mt-20">
            <div className="relative bg-gradient-to-br from-dark-charcoal via-[#2d3139] to-dark-charcoal rounded-3xl p-10 sm:p-16 text-white overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-64 h-64 bg-slate-blue rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-slate-blue rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-slate-blue to-white bg-clip-text text-transparent">
                  Ready to Transform Your Look?
                </h2>
                <p className="text-lg sm:text-xl text-slate-blue/90 mb-8 leading-relaxed">
                  Choose from our wide range of professional services and book with our expert team today. 
                  Experience the difference of quality grooming and styling.
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center px-12 py-5 bg-gradient-to-r from-slate-blue to-[#7a8294] text-white font-semibold rounded-xl hover:from-[#7a8294] hover:to-slate-blue transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-slate-blue/50 text-lg"
                >
                  <span className="mr-2">Book Your Appointment</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
