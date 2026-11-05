import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Hospital, UserLocation } from '../../types';
import { calculateDistance } from '../../utils/geo';

interface HospitalMapProps {
  hospitals: Hospital[];
  userLocation: UserLocation;
  selectedHospitalId?: string;
  onSelectHospital?: (hospital: Hospital) => void;
}

export const HospitalMap: React.FC<HospitalMapProps> = ({
  hospitals,
  userLocation,
  selectedHospitalId,
  onSelectHospital,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map centered around Vizag / userLocation
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 13,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 13);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // 1. User Location Marker
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
          <div class="relative flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-md text-white text-[10px] font-bold">
            📍
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
    userMarker.bindPopup(`
      <div class="p-2 text-slate-800 text-xs">
        <div class="font-bold">Your Location</div>
        <div>${userLocation.name}</div>
      </div>
    `);
    markersRef.current.push(userMarker);

    // 2. Hospital Markers
    hospitals.forEach((hosp) => {
      const isSelected = hosp.id === selectedHospitalId;
      const dist = calculateDistance(userLocation.lat, userLocation.lng, hosp.lat, hosp.lng);

      const hospIcon = L.divIcon({
        className: 'custom-hosp-marker',
        html: `
          <div class="cursor-pointer transition-transform duration-200 hover:scale-110 flex items-center justify-center">
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-md border ${
              isSelected
                ? 'bg-emerald-600 text-white border-white ring-2 ring-emerald-400'
                : hosp.emergency24x7
                ? 'bg-rose-600 text-white border-white'
                : 'bg-teal-700 text-white border-teal-200'
            } text-xs font-semibold whitespace-nowrap">
              <span>🏥</span>
              <span>${dist} km</span>
            </div>
          </div>
        `,
        iconSize: [80, 32],
        iconAnchor: [40, 16],
      });

      const marker = L.marker([hosp.lat, hosp.lng], { icon: hospIcon }).addTo(map);

      marker.on('click', () => {
        if (onSelectHospital) {
          onSelectHospital(hosp);
        }
      });

      marker.bindPopup(`
        <div class="p-2.5 text-slate-900 font-sans max-w-[200px]">
          <div class="font-bold text-sm text-slate-900">${hosp.name}</div>
          <div class="text-xs text-slate-500 mt-0.5">${hosp.locality}</div>
          <div class="flex items-center gap-2 mt-2 text-xs">
            <span class="font-semibold text-teal-700">⭐ ${hosp.rating}</span>
            <span class="text-slate-400">·</span>
            <span class="text-slate-600 font-medium">${dist} km away</span>
          </div>
          ${
            hosp.emergency24x7
              ? '<div class="mt-1.5 inline-block text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">24x7 Emergency Ready</div>'
              : ''
          }
        </div>
      `);

      markersRef.current.push(marker);
    });

    return () => {
      // Cleanup on unmount handled gracefully
    };
  }, [hospitals, userLocation, selectedHospitalId, onSelectHospital]);

  return (
    <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
