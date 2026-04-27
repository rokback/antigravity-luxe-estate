'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface PropertyMapProps {
  location: string;
  latitude: number | null;
  longitude: number | null;
}

const FALLBACK_CENTER: [number, number] = [34.4208, -119.6982];
const FALLBACK_ZOOM = 5;

export default function PropertyMap({
  location,
  latitude,
  longitude,
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const hasCoords = latitude !== null && longitude !== null;
    const center: [number, number] = hasCoords
      ? [latitude as number, longitude as number]
      : FALLBACK_CENTER;
    const zoom = hasCoords ? 15 : FALLBACK_ZOOM;

    const map = L.map(containerRef.current).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    if (hasCoords) {
      L.marker(center).addTo(map).bindPopup(location).openPopup();
    }

    return () => {
      map.remove();
    };
  }, [location, latitude, longitude]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[200px] rounded-lg overflow-hidden shadow-inner"
    />
  );
}
