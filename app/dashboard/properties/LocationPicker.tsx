'use client';

import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('./LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-clear-day animate-pulse rounded-lg flex items-center justify-center text-nordic-dark/40 text-sm">
      Loading map…
    </div>
  ),
});

type Props = {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
  hintLabel: string;
};

export default function LocationPicker(props: Props) {
  return <InteractiveMap {...props} />;
}
