import { getSession } from '../../../lib/auth-helpers.js';
import PageHeader from '../../../components/admin/PageHeader.js';
import SettingsForms from '../../../components/admin/SettingsForms.js';
import { formatCookiesForHeader } from '../../../lib/utils.js';
import { cookies } from 'next/headers';

async function getSettings() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = formatCookiesForHeader(cookieStore);
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/settings`,
      {
        cache: 'no-store',
        headers: {
          Cookie: cookieHeader,
        },
      }
    );
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}

export default async function SettingsPage() {
  const session = await getSession();
  const settings = await getSettings();

  return (
    <div>
      <PageHeader title="Settings" />
      <SettingsForms initialSettings={settings} />
    </div>
  );
}
