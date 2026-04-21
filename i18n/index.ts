import { cookies } from 'next/headers';

export const defaultLocale = 'es';
export const locales = ['es', 'en', 'fr'];

const dictionaries: Record<string, any> = {
  es: () => import('./dictionaries/es.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  fr: () => import('./dictionaries/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  return dictionaries[locale]?.() ?? dictionaries[defaultLocale]();
};

export const getTranslations = async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || defaultLocale;
  const dict = await getDictionary(locale);

  return (key: string) => {
    const keys = key.split('.');
    let value = dict;
    for (const k of keys) {
      if (value === undefined || value[k] === undefined) {
        return key; // return the key itself if not found
      }
      value = value[k];
    }
    return value;
  };
};
