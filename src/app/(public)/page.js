import Link from 'next/link';
import connectDB from '../../lib/db.js';
import Service from '../../models/Service.js';
import Employee from '../../models/Employee.js';
import Settings from '../../models/Settings.js';
import EmployeeImage from '../../components/admin/EmployeeImage.js';

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  try {
    await connectDB();
    const settings = await Settings.getSettings();
    return {
      title: `${settings.salonName} - Professional Salon Services`,
      description: `Experience professional salon services at ${settings.salonName}. Book your appointment online for quality grooming and styling services.`,
      keywords: 'salon, grooming, haircut, styling, professional services, book appointment',
      openGraph: {
        title: `${settings.salonName} - Professional Salon Services`,
        description: `Experience professional salon services at ${settings.salonName}.`,
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'Professional Salon Services',
      description: 'Experience professional salon services. Book your appointment online for quality grooming and styling services.',
    };
  }
}

async function getFeaturedServices() {
  try {
    await connectDB();
    const services = await Service.find({ isActive: true })
      .sort({ price: 1 })
      .limit(3);
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

async function getFeaturedTeam() {
  try {
    await connectDB();
    const employees = await Employee.find({ status: 'active' })
      .populate('services', 'name')
      .sort({ joinedDate: -1 })
      .limit(3);
    return employees;
  } catch (error) {
    console.error('Error fetching team:', error);
    return [];
  }
}

async function getSalonSettings() {
  try {
    await connectDB();
    const settings = await Settings.getSettings();
    return {
      salonName: settings.salonName || 'Ishfaq Mens Salon',
      logo: settings.logo || '',
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      salonName: 'Ishfaq Mens Salon',
      logo: '',
    };
  }
}

export default async function HomePage() {
  const featuredServices = await getFeaturedServices();
  const featuredTeam = await getFeaturedTeam();
  const salonSettings = await getSalonSettings();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark-charcoal via-[#2d3139] to-dark-charcoal text-white min-h-screen flex items-center px-4 overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          <source src="/videos/hero-video.webm" type="video/webm" />
          {/* Fallback if video doesn't load */}
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-charcoal/50 via-[#2d3139]/50 to-dark-charcoal/50"></div>
        
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-slate-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-slate-blue rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight">
              Welcome to Our
              <span className="block text-white mt-2">{salonSettings.salonName}</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-blue mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
              Experience professional salon services with our expert team. 
              Transform your look and boost your confidence with our premium grooming services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/book"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-slate-blue text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-slate-blue/50"
                style={{ color: '#FFFFFF' }}
              >
                <span className="relative z-10" style={{ color: '#FFFFFF' }}>Book Appointment</span>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-blue to-[#7a8294] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
      </section>

      {/* Featured Services */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 bg-light-grey">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-charcoal mb-4">
              Our Services
            </h2>
            <p className="text-lg text-slate-blue max-w-2xl mx-auto">
              Discover our range of professional grooming services designed to make you look and feel your best
            </p>
          </div>
          
          {featuredServices.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
                {featuredServices.map((service, index) => (
                  <div
                    key={service._id.toString()}
                    className="group bg-white border border-medium-grey rounded-xl p-6 lg:p-8 hover:shadow-xl hover:border-slate-blue transition-all duration-300 transform hover:-translate-y-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-blue to-[#7a8294] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                        </svg>
                      </div>
                      <h3 className="text-xl lg:text-2xl font-bold text-dark-charcoal mb-2">
                        {service.name}
                      </h3>
                      <p className="text-slate-blue text-sm mb-4 line-clamp-2">
                        {service.description || 'Professional service'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-2xl lg:text-3xl font-bold text-dark-charcoal">
                          PKR {service.price?.toLocaleString() || '0'}
                        </p>
                        <p className="text-sm text-slate-blue">{service.duration || 30} minutes</p>
                      </div>
                    </div>
                    <Link
                      href="/book"
                      className="block w-full bg-dark-charcoal text-white text-center py-3 rounded-lg font-semibold hover:bg-[#2d3139] transition-colors duration-300"
                      style={{ color: '#FFFFFF' }}
                    >
                      Book Now
                    </Link>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-slate-blue hover:text-dark-charcoal transition-colors font-semibold text-lg group"
                >
                  View All Services
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-blue text-lg">Services coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Team Introduction */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-charcoal mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-lg text-slate-blue max-w-2xl mx-auto">
              Our skilled professionals are dedicated to providing you with exceptional service
            </p>
          </div>
          
          {featuredTeam.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
                {featuredTeam.map((member, index) => (
                  <div
                    key={member._id.toString()}
                    className="group bg-white border-2 border-medium-grey rounded-2xl p-6 lg:p-8 text-center hover:shadow-2xl hover:border-slate-blue transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="mb-4">
                      <div className="relative mb-6">
                        <EmployeeImage
                          src={member.image}
                          alt={member.name}
                          className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full mx-auto object-cover border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-300"
                          fallbackClassName="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full mx-auto bg-gradient-to-br from-slate-blue to-[#7a8294] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300"
                          fallbackInitial={member.name.charAt(0).toUpperCase()}
                          fallbackContent={
                            <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full mx-auto bg-gradient-to-br from-slate-blue to-[#7a8294] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                              <span className="text-white text-4xl sm:text-5xl font-bold">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          }
                        />
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-blue text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </div>
                      </div>
                      <h3 className="text-xl lg:text-2xl font-bold text-dark-charcoal mb-3">
                        {member.name}
                      </h3>
                      {member.services && member.services.length > 0 ? (
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                          {member.services.slice(0, 3).map((service) => (
                            <span
                              key={service._id?.toString() || service}
                              className="px-3 py-1.5 bg-gradient-to-r from-slate-blue/10 to-[#7a8294]/10 text-slate-blue rounded-full text-xs font-medium border border-slate-blue/20"
                            >
                              {service.name || service}
                            </span>
                          ))}
                          {member.services.length > 3 && (
                            <span className="px-3 py-1.5 bg-gradient-to-r from-slate-blue/10 to-[#7a8294]/10 text-slate-blue rounded-full text-xs font-medium border border-slate-blue/20">
                              +{member.services.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-blue italic mb-4">Specialized in all services</p>
                      )}
                      <Link
                        href={`/book?employeeId=${member._id}`}
                        className="inline-block w-full bg-gradient-to-r from-dark-charcoal to-[#2d3139] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:from-slate-blue hover:to-[#7a8294] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl"
                        style={{ color: '#FFFFFF' }}
                      >
                        Book with {member.name.split(' ')[0]}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link
                  href="/team"
                  className="inline-flex items-center gap-2 text-slate-blue hover:text-dark-charcoal transition-colors font-semibold text-lg group"
                >
                  View Full Team
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-blue text-lg">Team members coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 bg-gradient-to-br from-light-grey to-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-charcoal mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-slate-blue max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Ahmed Ali',
                rating: 5,
                comment: 'Excellent service! The team is professional and the results are amazing. I always leave feeling confident and refreshed.',
                role: 'Regular Client',
              },
              {
                name: 'Sara Khan',
                rating: 5,
                comment: 'Best salon in town. Highly recommend their services! The staff is friendly, skilled, and always goes the extra mile.',
                role: 'Regular Client',
              },
              {
                name: 'Hassan Malik',
                rating: 5,
                comment: 'Outstanding experience every time. The attention to detail and quality of service is unmatched. Worth every penny!',
                role: 'Regular Client',
              },
              {
                name: 'Fatima Sheikh',
                rating: 5,
                comment: 'Professional, clean, and welcoming atmosphere. The team truly cares about their clients and it shows in their work.',
                role: 'Regular Client',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white border border-medium-grey rounded-xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-dark-charcoal mb-6 leading-relaxed italic">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-blue to-[#7a8294] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-dark-charcoal font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-slate-blue">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 bg-gradient-to-br from-dark-charcoal to-[#2d3139] text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Look?
          </h2>
          <p className="text-lg sm:text-xl text-slate-blue mb-8 max-w-2xl mx-auto">
            Book your appointment today and experience the difference of professional salon services
          </p>
          <Link
            href="/book"
            className="inline-flex items-center justify-center px-10 py-4 bg-slate-blue text-white font-semibold rounded-lg hover:bg-[#7a8294] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-slate-blue/50"
          >
            Book Your Appointment Now
          </Link>
        </div>
      </section>
    </div>
  );
}
