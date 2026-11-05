import { UserLocation } from '../types';

export const VIZAG_AREAS: UserLocation[] = [
  { name: 'RK Beach (Beach Road)', lat: 17.7143, lng: 83.3230 },
  { name: 'MVP Colony (Sector 1-9)', lat: 17.7425, lng: 83.3364 },
  { name: 'Siripuram Junction', lat: 17.7219, lng: 83.3156 },
  { name: 'Dwaraka Nagar (RTC Complex)', lat: 17.7265, lng: 83.3031 },
  { name: 'Asilmetta / Diamond Park', lat: 17.7224, lng: 83.3054 },
  { name: 'Jagadamba Centre', lat: 17.7098, lng: 83.3005 },
  { name: 'Rushikonda / IT SEZ', lat: 17.7820, lng: 83.3850 },
  { name: 'Madhurawada / PM Palem', lat: 17.8035, lng: 83.3524 },
  { name: 'Old Town / Port Area', lat: 17.6945, lng: 83.2980 },
  { name: 'Gajuwaka Industrial Hub', lat: 17.6904, lng: 83.2096 },
  { name: 'NAD Junction / Gopalapatnam', lat: 17.7511, lng: 83.2215 },
  { name: 'Pendurthi', lat: 17.8322, lng: 83.2014 },
];

export const DEFAULT_VIZAG_LOCATION = VIZAG_AREAS[0]; // RK Beach (17.7143, 83.3230)

// Haversine distance in kilometers
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

// Travel time in minutes (~3 min per km in Vizag traffic, minimum 5 mins)
export function estimateTravelTimeMinutes(distanceKm: number): number {
  return Math.max(5, Math.round(distanceKm * 3));
}

// Check if latitude/longitude is within Greater Visakhapatnam bounds (approx 17.5 to 18.0 N, 83.1 to 83.5 E)
export function isWithinVizag(lat: number, lng: number): boolean {
  return lat >= 17.5 && lat <= 18.0 && lng >= 83.1 && lng <= 83.5;
}
