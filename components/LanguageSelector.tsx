"use client";

import { useLanguage } from "@/i18n/LanguageContext";

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  const getFlag = (loc: string) => {
    switch (loc) {
      case "es":
        return "🇪🇸";
      case "en":
        return "🇺🇸";
      case "fr":
        return "🇫🇷";
      default:
        return "🌐";
    }
  };

  return (
    <div className="relative group flex items-center pr-2 border-r border-nordic-dark/10 mr-2 h-6">
      <button className="flex items-center gap-1.5 text-sm font-medium text-nordic-dark hover:text-mosque transition-colors uppercase">
        <span className="text-base leading-none">{getFlag(locale)}</span>
        {locale}
      </button>
      <div className="absolute top-full right-0 mt-4 bg-white border border-nordic-dark/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-32 overflow-hidden z-50">
        <div className="flex flex-col py-1">
          <button
            onClick={() => setLocale("es")}
            className={`px-4 py-2.5 text-sm text-left w-full flex items-center transition-all ${locale === "es" ? "font-semibold text-mosque bg-mosque/5" : "text-nordic-dark hover:bg-gray-50"}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">🇪🇸</span> Esp
              {locale === "es" && (
                <span className="material-icons text-[14px]">check</span>
              )}
            </div>
          </button>
          <button
            onClick={() => setLocale("en")}
            className={`px-4 py-2.5 text-sm text-left w-full flex items-center transition-all ${locale === "en" ? "font-semibold text-mosque bg-mosque/5" : "text-nordic-dark hover:bg-gray-50"}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">🇺🇸</span> Eng
              {locale === "en" && (
                <span className="material-icons text-[14px]">check</span>
              )}
            </div>
          </button>
          <button
            onClick={() => setLocale("fr")}
            className={`px-4 py-2.5 text-sm text-left w-full flex items-center transition-all ${locale === "fr" ? "font-semibold text-mosque bg-mosque/5" : "text-nordic-dark hover:bg-gray-50"}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">🇫🇷</span> Fra
              {locale === "fr" && (
                <span className="material-icons text-[14px]">check</span>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
