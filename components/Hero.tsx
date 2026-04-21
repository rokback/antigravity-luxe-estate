'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterModal from './FilterModal';
import { PropertyFilters } from '@/lib/properties';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Hero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [location, setLocation] = useState(searchParams.get('location') || '');

  const categories = ['All', 'House', 'Apartment', 'Villa', 'Penthouse'];
  const currentCategory = searchParams.get('category') || 'All';

  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0) || value === 'All') {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else {
        params.set(key, value.toString());
      }
    });

    // Reset to page 1 on filter change
    params.set('page', '1');
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleSearch = () => {
    updateFilters({ location });
  };

  const handleCategoryClick = (category: string) => {
    updateFilters({ category });
  };

  const handleApplyFilters = (filters: PropertyFilters) => {
    updateFilters(filters);
    setIsFilterModalOpen(false);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight">
          {t('hero.title_start')}{' '}
          <span className="relative inline-block">
            <span className="relative z-10 font-medium">{t('hero.title_highlight')}</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
          </span>
          .
        </h1>

        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">search</span>
          </div>
          <input 
            type="text" 
            placeholder={t('hero.search_placeholder')} 
            className="block w-full pl-12 pr-32 py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-lg outline-none"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20"
          >
            {t('hero.search_button')}
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all transform hover:-translate-y-0.5 ${
                currentCategory === cat 
                  ? 'bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10' 
                  : 'bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 hover:bg-mosque/5'
              }`}
            >
              {t(`hero.categories.${cat}`) === `hero.categories.${cat}` ? cat : t(`hero.categories.${cat}`)}
            </button>
          ))}
          <div className="w-px h-6 bg-nordic-dark/10 mx-2 flex-shrink-0"></div>
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 transition-colors"
          >
            <span className="material-icons text-base">tune</span> {t('hero.filters')}
          </button>
        </div>
      </div>

      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={{
          location: searchParams.get('location') || undefined,
          minPrice: parseInt(searchParams.get('minPrice') || '') || undefined,
          maxPrice: parseInt(searchParams.get('maxPrice') || '') || undefined,
          category: searchParams.get('category') || undefined,
          beds: parseInt(searchParams.get('beds') || '') || undefined,
          baths: parseInt(searchParams.get('baths') || '') || undefined,
          amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || undefined,
        }}
        totalResults={42} // Should ideally be dynamic, but for now we'll use the total count
      />
    </section>
  );
}
