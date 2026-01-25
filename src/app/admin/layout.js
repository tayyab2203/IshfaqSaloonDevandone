import { getSession } from '../../lib/auth-helpers.js';
import Sidebar from '../../components/admin/Sidebar';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  // Login page is now at /login (outside /admin folder), so this layout won't run for it
  // All routes under /admin require authentication
  
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-light-grey">
      <Sidebar user={session.user} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        {children}
      </div>
    </div>
  );
}
