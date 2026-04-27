'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
  hintLabel: string;
};

const DEFAULT_CENTER: [number, number] = [40.4168, -3.7038]; // Madrid
const DEFAULT_ZOOM = 5;

export default function LocationPickerMap({
  latitude,
  longitude,
  onChange,
  hintLabel,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialCenter: [number, number] =
      latitude !== null && longitude !== null
        ? [latitude, longitude]
        : DEFAULT_CENTER;
    const initialZoom = latitude !== null && longitude !== null ? 14 : DEFAULT_ZOOM;

    const map = L.map(containerRef.current).setView(initialCenter, initialZoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    if (latitude !== null && longitude !== null) {
      markerRef.current = L.marker([latitude, longitude], { draggable: true })
        .addTo(map)
        .on('dragend', (e) => {
          const m = e.target as L.Marker;
          const { lat, lng } = m.getLatLng();
          onChangeRef.current(lat, lng);
        });
    }

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { draggable: true })
          .addTo(map)
          .on('dragend', (ev) => {
            const m = ev.target as L.Marker;
            const next = m.getLatLng();
            onChangeRef.current(next.lat, next.lng);
          });
      }
      onChangeRef.current(lat, lng);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // We intentionally only init once. lat/lng updates are handled by the next effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external lat/lng changes (manual input fields, edit-load, etc.)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (latitude === null || longitude === null) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
    } else {
      markerRef.current = L.marker([latitude, longitude], { draggable: true })
        .addTo(map)
        .on('dragend', (e) => {
          const m = e.target as L.Marker;
          const next = m.getLatLng();
          onChangeRef.current(next.lat, next.lng);
        });
    }

    // Recentrar la vista solo si las coords nuevas están fuera del viewport actual
    const center = map.getCenter();
    if (
      Math.abs(center.lat - latitude) > 0.001 ||
      Math.abs(center.lng - longitude) > 0.001
    ) {
      map.setView([latitude, longitude], Math.max(map.getZoom(), 13));
    }
  }, [latitude, longitude]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full h-64 rounded-lg overflow-hidden border border-nordic-dark/10 bg-clear-day"
      />
      {(latitude === null || longitude === null) && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/95 text-nordic-dark px-3 py-1.5 rounded-full shadow-sm text-xs font-medium flex items-center gap-1 pointer-events-none">
          <span className="material-icons text-sm text-mosque">touch_app</span>
          {hintLabel}
        </div>
      )}
    </div>
  );
}
