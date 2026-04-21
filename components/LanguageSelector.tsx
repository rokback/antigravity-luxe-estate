'use client';

import { useLanguage } from '@/i18n/LanguageContext';

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="relative group flex items-center pr-2 border-r border-nordic-dark/10 mr-2 h-6">
      <button className="flex items-center gap-1 text-sm font-medium text-nordic-dark hover:text-mosque transition-colors uppercase">
        <span className="material-icons text-[18px]">language</span>
        {locale}
      </button>
      <div className="absolute top-full right-0 mt-4 bg-white border border-nordic-dark/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-24 overflow-hidden z-50">
        <div className="flex flex-col py-1">
          <button 
            onClick={() => setLocale('es')}
            className={`px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${locale === 'es' ? 'font-semibold text-mosque' : 'text-nordic-dark'}`}
          >
            ES
          </button>
          <button 
            onClick={() => setLocale('en')}
            className={`px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${locale === 'en' ? 'font-semibold text-mosque' : 'text-nordic-dark'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLocale('fr')}
            className={`px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${locale === 'fr' ? 'font-semibold text-mosque' : 'text-nordic-dark'}`}
          >
            FR
          </button>
        </div>
      </div>
    </div>
  );
}
