import Header from '../../components/public/Header.js';
import Footer from '../../components/public/Footer.js';
import connectDB from '../../lib/db.js';
import Settings from '../../models/Settings.js';

export async function generateMetadata() {
  try {
    await connectDB();
    const settings = await Settings.getSettings();
    return {
      title: `${settings.salonName} - Professional Salon Services`,
      description: `Book your appointment online at ${settings.salonName}. Professional grooming and styling services with expert team.`,
      keywords: 'salon, grooming, haircut, styling, book appointment, professional services',
      openGraph: {
        title: `${settings.salonName} - Professional Salon Services`,
        description: `Book your appointment online at ${settings.salonName}.`,
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'Professional Salon Services',
      description: 'Book your appointment online for professional salon services',
    };
  }
}

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow pt-16">{children}</main>
      <Footer />
    </div>
  );
}
