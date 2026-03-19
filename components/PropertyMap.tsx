'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface PropertyMapProps {
  location: string;
}

export default function PropertyMap({ location }: PropertyMapProps) {
  useEffect(() => {
    // Basic setup for demonstration. In a real app, you'd geocode the location string.
    // For now, we'll use a fixed coordinate or a mock one.
    const map = L.map('property-map').setView([34.4208, -119.6982], 13); // Default to Santa Barbara or similar

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([34.4208, -119.6982]).addTo(map)
      .bindPopup(location)
      .openPopup();

    return () => {
      map.remove();
    };
  }, [location]);

  return (
    <div id="property-map" className="w-full h-full min-h-[200px] rounded-lg overflow-hidden shadow-inner"></div>
  );
}
