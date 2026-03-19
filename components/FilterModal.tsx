'use client';

import { useState, useEffect } from 'react';
import { PropertyFilters } from '@/lib/properties';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: PropertyFilters) => void;
  initialFilters: PropertyFilters;
  totalResults: number;
}

const AMENITIES_OPTIONS = [
  { id: 'Pool', label: 'Swimming Pool', icon: 'pool' },
  { id: 'Gym', label: 'Gym', icon: 'fitness_center' },
  { id: 'Parking', label: 'Parking', icon: 'local_parking' },
  { id: 'Air Conditioning', label: 'Air Conditioning', icon: 'ac_unit' },
  { id: 'Wifi', label: 'High-speed Wifi', icon: 'wifi' },
  { id: 'Patio', label: 'Patio / Terrace', icon: 'deck' },
];

const CATEGORIES = ['Any Type', 'House', 'Apartment', 'Condo', 'Townhouse', 'Villa', 'Penthouse'];

export default function FilterModal({ isOpen, onClose, onApply, initialFilters, totalResults }: FilterModalProps) {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);

  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, initialFilters]);

  if (!isOpen) return null;

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => {
      const current = prev.amenities || [];
      if (current.includes(amenity)) {
        return { ...prev, amenities: current.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...current, amenity] };
      }
    });
  };

  const handleClearAll = () => {
    setFilters({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity cursor-pointer" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Filters</h1>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <span className="material-icons">close</span>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Section 1: Location */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Location</label>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-mosque transition-colors">location_on</span>
              <input 
                type="text"
                placeholder="City, neighborhood, or address"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-mosque focus:bg-white transition-all shadow-sm outline-none"
                value={filters.location || ''}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>
          </section>

          {/* Section 2: Price Range */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Price Range</label>
              {(filters.minPrice || filters.maxPrice) && (
                <span className="text-sm font-medium text-mosque">
                  ${(filters.minPrice || 0).toLocaleString()} – ${(filters.maxPrice || 'Any').toLocaleString()}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-xl border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">Min Price</label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1 text-sm">$</span>
                  <input 
                    type="number"
                    placeholder="0"
                    className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={filters.minPrice || ''}
                    onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) || undefined })}
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">Max Price</label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1 text-sm">$</span>
                  <input 
                    type="number"
                    placeholder="Any"
                    className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) || undefined })}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Property Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Property Type */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Property Type</label>
              <div className="relative">
                <select 
                  className="w-full bg-gray-50 border-0 rounded-xl py-3 pl-4 pr-10 text-gray-900 appearance-none focus:ring-2 focus:ring-mosque cursor-pointer outline-none shadow-sm"
                  value={filters.category || 'Any Type'}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <span className="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Rooms */}
            <div className="space-y-4">
              {/* Beds */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Bedrooms</span>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-1 border border-gray-100">
                  <button 
                    type="button"
                    onClick={() => setFilters(f => ({ ...f, beds: Math.max(0, (f.beds || 0) - 1) }))}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-50 transition-colors"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">{filters.beds || 0}+</span>
                  <button 
                    type="button"
                    onClick={() => setFilters(f => ({ ...f, beds: (f.beds || 0) + 1 }))}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>

              {/* Baths */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Bathrooms</span>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-1 border border-gray-100">
                  <button 
                    type="button"
                    onClick={() => setFilters(f => ({ ...f, baths: Math.max(0, (f.baths || 0) - 1) }))}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-50 transition-colors"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">{filters.baths || 0}+</span>
                  <button 
                    type="button"
                    onClick={() => setFilters(f => ({ ...f, baths: (f.baths || 0) + 1 }))}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Amenities */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Amenities & Features</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITIES_OPTIONS.map((amenity) => {
                const isActive = filters.amenities?.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity.id)}
                    className={`relative p-3 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                      isActive 
                        ? 'border-mosque bg-mosque/5 text-mosque' 
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className={`material-icons text-lg ${isActive ? 'text-mosque' : 'text-gray-400'}`}>
                      {amenity.icon}
                    </span>
                    {amenity.label}
                    {isActive && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
          <button 
            type="button"
            onClick={handleClearAll}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors underline decoration-gray-300 underline-offset-4"
          >
            Clear all filters
          </button>
          <button 
            onClick={() => onApply(filters)}
            className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-mosque/20 transition-all hover:shadow-mosque/30 flex items-center gap-2 transform active:scale-95"
          >
            Show {totalResults} Homes
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
