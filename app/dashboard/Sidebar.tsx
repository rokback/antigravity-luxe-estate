'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type NavItem = { href: string; label: string; icon: string };

type Props = {
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  navItems: NavItem[];
  labels: {
    sidebarTitle: string;
    role: string;
    logout: string;
    loggingOut: string;
  };
};

export default function Sidebar({
  email,
  fullName,
  avatarUrl,
  navItems,
  labels,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function handleLogout() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="lg:w-64 lg:min-h-screen bg-white border-b lg:border-b-0 lg:border-r border-nordic-dark/10 px-6 py-6 flex flex-col">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-mosque flex items-center justify-center">
          <span className="material-icons text-white text-lg">apartment</span>
        </div>
        <span className="font-semibold tracking-tight text-nordic-dark">
          LuxeEstate
        </span>
      </Link>

      {/* Profile block */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-nordic-dark/10">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={fullName ?? email}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-mosque/20"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-mosque/10 text-mosque font-semibold flex items-center justify-center ring-2 ring-mosque/20">
            {(fullName ?? email).slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p
            className="text-sm font-semibold text-nordic-dark truncate"
            title={fullName ?? email}
          >
            {fullName ?? email}
          </p>
          <p className="text-[11px] uppercase tracking-wider text-mosque font-medium">
            {labels.role}
          </p>
        </div>
      </div>

      <p className="text-xs uppercase tracking-wider text-nordic-muted mb-3">
        {labels.sidebarTitle}
      </p>
      <nav className="flex lg:flex-col gap-1 mb-6">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative rounded-lg px-3 py-2.5 text-sm font-medium transition-colors flex items-center gap-2.5 ${
                active
                  ? 'bg-mosque text-white shadow-sm'
                  : 'text-nordic-dark hover:bg-clear-day'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="material-icons text-[18px]">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout pinned to bottom on desktop */}
      <div className="lg:mt-auto pt-6 border-t border-nordic-dark/10">
        <p className="text-xs text-nordic-muted truncate mb-3" title={email}>
          {email}
        </p>
        <button
          type="button"
          onClick={handleLogout}
          disabled={signingOut}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="material-icons text-[18px]">logout</span>
          {signingOut ? labels.loggingOut : labels.logout}
        </button>
      </div>
    </aside>
  );
}
