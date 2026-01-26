import connectDB from '../../../lib/db.js';
import Settings from '../../../models/Settings.js';

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  try {
    await connectDB();
    const settings = await Settings.getSettings();
    return {
      title: `Gallery - ${settings.salonName}`,
      description: `View our gallery of recent work at ${settings.salonName}. See the quality and attention to detail we bring to every service.`,
      keywords: 'salon gallery, before after, salon work, transformations',
    };
  } catch (error) {
    return {
      title: 'Gallery - Professional Salon',
      description: 'View our gallery of recent work. See the quality and attention to detail we bring to every service.',
    };
  }
}

export default function GalleryPage() {
  const galleryItems = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Salon Work ${i + 1}`,
    category: i % 3 === 0 ? 'Haircut' : i % 3 === 1 ? 'Styling' : 'Grooming',
  }));

  return (
    <div className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-light-grey to-white min-h-screen">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-charcoal mb-4">
            Our Gallery
          </h1>
          <p className="text-lg sm:text-xl text-slate-blue max-w-3xl mx-auto">
            Take a look at some of our recent work and see the quality and attention to detail we bring to every service
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square bg-gradient-to-br from-slate-blue to-[#7a8294] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              {/* Placeholder Image */}
              <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
                <svg className="w-16 h-16 mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-semibold opacity-90">{item.title}</p>
                <p className="text-xs opacity-70 mt-1">{item.category}</p>
              </div>

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-dark-charcoal bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-4">
                  <p className="font-semibold text-lg mb-1">{item.title}</p>
                  <p className="text-sm text-slate-blue">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-white border border-medium-grey rounded-2xl p-8 lg:p-12 max-w-4xl mx-auto shadow-lg">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-charcoal mb-4">
              Want to See More?
            </h2>
            <p className="text-lg text-slate-blue mb-6 max-w-2xl mx-auto">
              Visit our salon to see our work in person, or follow us on social media for the latest updates and transformations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/book"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-dark-charcoal to-[#2d3139] text-white font-semibold rounded-lg hover:from-slate-blue hover:to-[#7a8294] transition-all duration-300 hover:scale-105"
              >
                Book a Consultation
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-dark-charcoal text-dark-charcoal font-semibold rounded-lg hover:bg-dark-charcoal hover:text-white transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
