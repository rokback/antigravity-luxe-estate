'use client';

import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-48 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-nordic/40">Loading map...</div>
});

interface PropertyDetailsMapProps {
  location: string;
}

export default function PropertyDetailsMap({ location }: PropertyDetailsMapProps) {
  return <PropertyMap location={location} />;
}
