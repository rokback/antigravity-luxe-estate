'use client';

import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-nordic/40">
      Loading map...
    </div>
  ),
});

interface PropertyDetailsMapProps {
  location: string;
  latitude: number | null;
  longitude: number | null;
}

export default function PropertyDetailsMap({
  location,
  latitude,
  longitude,
}: PropertyDetailsMapProps) {
  return (
    <PropertyMap
      location={location}
      latitude={latitude}
      longitude={longitude}
    />
  );
}
