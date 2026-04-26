'use client';

import Link from 'next/link';
import Image from 'next/image';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/i18n/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { t } = useLanguage();
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    async function loadRole(currentUser: User | null) {
      if (!currentUser) {
        if (active) setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.id)
        .maybeSingle();
      if (active) setIsAdmin(data?.role === 'admin');
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!active) return;
      setUser(user);
      loadRole(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const next = session?.user ?? null;
      setUser(next);
      loadRole(next);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="material-icons text-white text-lg">apartment</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-nordic-dark">LuxeEstate</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1">{t('navbar.buy')}</Link>
            <Link href="#" className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all">{t('navbar.rent')}</Link>
            <Link href="#" className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all">{t('navbar.sell')}</Link>
            <Link href="#" className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all">{t('navbar.saved_homes')}</Link>
          </div>

          <div className="flex items-center space-x-6">
            <LanguageSelector />
            <button className="text-nordic-dark hover:text-mosque transition-colors">
              <span className="material-icons">search</span>
            </button>
            <button className="text-nordic-dark hover:text-mosque transition-colors relative">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light"></span>
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 ml-2">
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(prev => !prev)}
                    className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all relative block"
                  >
                    <Image
                      src={user.user_metadata?.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                      alt="User profile"
                      fill
                      className="object-cover"
                    />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-soft border border-nordic-dark/5 py-1 z-50">
                      <div className="px-4 py-2 border-b border-nordic-dark/5">
                        <p className="text-xs font-medium text-nordic-dark truncate">{user.user_metadata?.full_name || user.email}</p>
                      </div>
                      {isAdmin && (
                        <Link
                          href="/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="w-full text-left px-4 py-2.5 text-sm text-nordic-dark hover:bg-clear-day transition-colors flex items-center gap-2"
                        >
                          <span className="material-icons text-sm">dashboard</span>
                          {t('navbar.dashboard')}
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <span className="material-icons text-sm">logout</span>
                        {t('navbar.logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="flex items-center justify-center bg-mosque text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-mosque/90 transition-colors">
                  {t('navbar.login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-nordic-dark/5 bg-background-light overflow-hidden h-0 transition-all duration-300">
        <div className="px-4 py-2 space-y-1">
          <Link href="#" className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10">{t('navbar.buy')}</Link>
          <Link href="#" className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5">{t('navbar.rent')}</Link>
          <Link href="#" className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5">{t('navbar.sell')}</Link>
          <Link href="#" className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5">{t('navbar.saved_homes')}</Link>
        </div>
      </div>
    </nav>
  );
}
