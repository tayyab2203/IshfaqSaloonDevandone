import Link from 'next/link';
import connectDB from '../../../lib/db.js';
import Employee from '../../../models/Employee.js';
import Settings from '../../../models/Settings.js';

export async function generateMetadata() {
  try {
    await connectDB();
    const settings = await Settings.getSettings();
    return {
      title: `Our Expert Team - ${settings.salonName}`,
      description: `Meet our skilled professionals at ${settings.salonName} who are dedicated to providing you with exceptional service and helping you look your absolute best.`,
      keywords: 'salon team, professional stylists, expert barbers, salon staff',
    };
  } catch (error) {
    return {
      title: 'Our Expert Team - Professional Salon',
      description: 'Meet our skilled professionals who are dedicated to providing exceptional service.',
    };
  }
}

async function getTeamMembers() {
  try {
    await connectDB();
    const employees = await Employee.find({ status: 'active' })
      .populate('services', 'name')
      .sort({ name: 1 })
      .limit(12);
    return employees;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();

  return (
    <div className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-light-grey to-white min-h-screen">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-charcoal mb-4">
            Our Expert Team
          </h1>
          <p className="text-lg sm:text-xl text-slate-blue max-w-3xl mx-auto">
            Meet our skilled professionals who are dedicated to providing you with exceptional service and helping you look your absolute best
          </p>
        </div>

        {teamMembers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-12">
              {teamMembers.map((member, index) => (
                <div
                  key={member._id.toString()}
                  className="group bg-white border border-medium-grey rounded-xl p-6 lg:p-8 text-center hover:shadow-2xl hover:border-slate-blue transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="mb-6">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg group-hover:scale-110 group-hover:border-slate-blue transition-all duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full mx-auto mb-4 bg-gradient-to-br from-slate-blue to-[#7a8294] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:from-dark-charcoal group-hover:to-slate-blue transition-all duration-300 ${member.imageUrl ? 'hidden' : ''}`}
                      style={{ display: member.imageUrl ? 'none' : 'flex' }}
                    >
                      <span className="text-white text-4xl sm:text-5xl font-bold">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-dark-charcoal mb-2">
                      {member.name}
                    </h3>
                    <p className="text-slate-blue capitalize font-semibold mb-3 text-sm lg:text-base">
                      {member.role}
                    </p>
                    {member.services && member.services.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {member.services.slice(0, 3).map((service) => (
                          <span
                            key={service._id?.toString() || service}
                            className="px-3 py-1 bg-slate-blue bg-opacity-10 text-slate-blue rounded-full text-xs font-medium"
                          >
                            {service.name}
                          </span>
                        ))}
                        {member.services.length > 3 && (
                          <span className="px-3 py-1 bg-slate-blue bg-opacity-10 text-slate-blue rounded-full text-xs font-medium">
                            +{member.services.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/book?employeeId=${member._id}`}
                    className="inline-block w-full bg-gradient-to-r from-dark-charcoal to-[#2d3139] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:from-slate-blue hover:to-[#7a8294] transition-all duration-300 transform hover:scale-105"
                    style={{ color: '#FFFFFF' }}
                  >
                    Book with {member.name.split(' ')[0]}
                  </Link>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center mt-16">
              <div className="bg-gradient-to-br from-dark-charcoal to-[#2d3139] rounded-2xl p-8 lg:p-12 text-white max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                  Ready to Book Your Appointment?
                </h2>
                <p className="text-lg text-slate-blue mb-6">
                  Choose your preferred team member or let us assign the best available professional for you
                </p>
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center px-10 py-4 bg-slate-blue text-white font-semibold rounded-lg hover:bg-[#7a8294] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-slate-blue/50"
                >
                  Book Appointment Now
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-blue rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-dark-charcoal mb-2">Team Members Coming Soon</h3>
            <p className="text-slate-blue text-lg">We're assembling an amazing team for you!</p>
          </div>
        )}
      </div>
    </div>
  );
}
