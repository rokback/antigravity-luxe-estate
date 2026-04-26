import Link from 'next/link';
import type { ReactNode } from 'react';
import { requireAdmin } from '@/lib/auth/roles';
import { getTranslations } from '@/i18n';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();
  const t = await getTranslations();

  const navItems = [
    { href: '/dashboard', label: t('dashboard.nav.home') },
    { href: '/dashboard/properties', label: t('dashboard.nav.properties') },
    { href: '/dashboard/users', label: t('dashboard.nav.users') },
  ];

  return (
    <div className="min-h-screen bg-clear-day text-nordic-dark">
      <div className="flex flex-col lg:flex-row">
        <aside className="lg:w-64 lg:min-h-screen bg-white border-b lg:border-b-0 lg:border-r border-nordic-dark/10 px-6 py-6">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <span className="material-icons text-mosque">real_estate_agent</span>
            <span className="font-semibold tracking-tight">LuxeEstate</span>
          </Link>

          <p className="text-xs uppercase tracking-wider text-nordic-muted mb-3">
            {t('dashboard.sidebar_title')}
          </p>
          <nav className="flex lg:flex-col gap-1 mb-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-clear-day transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block mt-auto pt-6 border-t border-nordic-dark/10">
            <p className="text-xs text-nordic-muted truncate" title={user.email ?? ''}>
              {user.email}
            </p>
            <p className="text-[11px] uppercase tracking-wider text-mosque mt-1">
              {t('dashboard.role.admin')}
            </p>
          </div>
        </aside>

        <main className="flex-1 px-6 py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
