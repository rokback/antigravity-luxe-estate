'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type LanguageContextType = {
  locale: string;
  t: (key: string) => string;
  setLocale: (locale: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  initialLocale, 
  dictionary 
}: { 
  children: React.ReactNode, 
  initialLocale: string,
  dictionary: any 
}) {
  const [locale, setLocaleState] = useState(initialLocale);
  const router = useRouter();

  const setLocale = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    setLocaleState(newLocale);
    router.refresh();
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let value = dictionary;
    for (const k of keys) {
      if (value === undefined || value[k] === undefined) {
        return key; // return the key itself if not found
      }
      value = value[k];
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
