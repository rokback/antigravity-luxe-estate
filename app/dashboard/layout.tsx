import type { ReactNode } from 'react';
import { requireAdmin } from '@/lib/auth/roles';
import { getTranslations } from '@/i18n';
import Sidebar from './Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();
  const t = await getTranslations();

  const navItems = [
    {
      href: '/dashboard',
      label: t('dashboard.nav.home'),
      icon: 'space_dashboard',
    },
    {
      href: '/dashboard/properties',
      label: t('dashboard.nav.properties'),
      icon: 'apartment',
    },
    {
      href: '/dashboard/users',
      label: t('dashboard.nav.users'),
      icon: 'group',
    },
  ];

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    null;
  const avatarUrl =
    (user.user_metadata?.avatar_url as string | undefined) ??
    (user.user_metadata?.picture as string | undefined) ??
    null;

  return (
    <div className="min-h-screen bg-clear-day text-nordic-dark">
      <div className="flex flex-col lg:flex-row">
        <Sidebar
          email={user.email ?? ''}
          fullName={fullName}
          avatarUrl={avatarUrl}
          navItems={navItems}
          labels={{
            sidebarTitle: t('dashboard.sidebar_title'),
            role: t('dashboard.role.admin'),
            logout: t('navbar.logout'),
            loggingOut: t('dashboard.logging_out'),
          }}
        />

        <main className="flex-1 px-6 py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
