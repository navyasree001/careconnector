import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Map, List, Filter, Star, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { calculateDistance } from '../../utils/geo';
import { HospitalMap } from '../maps/HospitalMap';
import { Hospital } from '../../types';

export const HospitalsView: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage, userLocation, hospitals, doctors, simpleMode } = useAppStore();
  const t = translations[currentLanguage];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'emergency' | 'govt' | 'private'>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'wait' | 'rating'>('distance');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Extract all unique specialties
  const allSpecialties = useMemo(() => {
    const set = new Set<string>();
    doctors.forEach((d) => set.add(d.specialty));
    return Array.from(set).sort();
  }, [doctors]);

  // Filter and sort hospitals
  const filteredHospitals = useMemo(() => {
    let list = hospitals.map((h) => {
      const dist = calculateDistance(userLocation.lat, userLocation.lng, h.lat, h.lng);
      const hospDocs = doctors.filter((d) => d.hospitalId === h.id);
      return {
        ...h,
        distanceKm: dist,
        doctorsCount: hospDocs.length,
      };
    });

    // 1. Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.locality.toLowerCase().includes(q) ||
          h.departments.some((dept) => dept.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (activeFilter === 'emergency') {
      list = list.filter((h) => h.emergency24x7);
    } else if (activeFilter === 'govt') {
      list = list.filter((h) => h.type === 'Government');
    } else if (activeFilter === 'private') {
      list = list.filter((h) => h.type === 'Private');
    }

    // 3. Specialty Filter
    if (selectedSpecialty !== 'all') {
      list = list.filter((h) =>
        doctors.some((d) => d.hospitalId === h.id && d.specialty === selectedSpecialty)
      );
    }

    // 4. Sorting
    if (sortBy === 'distance') {
      list.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'wait') {
      // Approximate queue wait
      list.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return list;
  }, [hospitals, doctors, userLocation, searchQuery, activeFilter, selectedSpecialty, sortBy]);

  return (
    <div className={`max-w-3xl mx-auto px-4 py-4 pb-24 space-y-4 ${simpleMode ? 'text-lg' : 'text-sm'}`}>
      {/* Title & View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-extrabold text-slate-900 text-lg md:text-xl">
            {t.hospitals.title}
          </h1>
          <p className="text-xs text-slate-500">
            {filteredHospitals.length} centres available in Vizag
          </p>
        </div>

        {/* List / Map Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>{t.hospitals.listView}</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'map'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>{t.hospitals.mapView}</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.hospitals.searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm outline-none text-slate-900 placeholder:text-slate-400 bg-white"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Tabs & Specialty Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.hospitals.filterAll}
          </button>
          <button
            onClick={() => setActiveFilter('emergency')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeFilter === 'emergency'
                ? 'bg-rose-600 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.hospitals.filterEmergency}
          </button>
          <button
            onClick={() => setActiveFilter('govt')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeFilter === 'govt'
                ? 'bg-teal-700 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.hospitals.filterGovt}
          </button>
          <button
            onClick={() => setActiveFilter('private')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeFilter === 'private'
                ? 'bg-teal-700 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.hospitals.filterPrivate}
          </button>
        </div>

        {/* Specialty Selector Dropdown */}
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          aria-label="Filter by department specialty"
          className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 outline-none"
        >
          <option value="all">All Specialties</option>
          {allSpecialties.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Sorting bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>Sort by:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('distance')}
            className={`font-semibold ${sortBy === 'distance' ? 'text-teal-700 underline' : 'hover:text-slate-900'}`}
          >
            {t.hospitals.sortDistance}
          </button>
          <span>·</span>
          <button
            onClick={() => setSortBy('rating')}
            className={`font-semibold ${sortBy === 'rating' ? 'text-teal-700 underline' : 'hover:text-slate-900'}`}
          >
            {t.hospitals.sortRating}
          </button>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="space-y-3">
          <HospitalMap
            hospitals={filteredHospitals}
            userLocation={userLocation}
            onSelectHospital={(hosp: Hospital) => navigate(`/hospital/${hosp.id}`)}
          />
          <p className="text-xs text-slate-500 text-center">
            Tap on any hospital pin to view details and live doctor OP tokens.
          </p>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredHospitals.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
              {t.hospitals.noResults}
            </div>
          ) : (
            filteredHospitals.map((hosp) => (
              <div
                key={hosp.id}
                onClick={() => navigate(`/hospital/${hosp.id}`)}
                className="cursor-pointer p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">
                        {hosp.name}
                      </h3>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {hosp.type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{hosp.locality}</span>
                      <span>·</span>
                      <span className="font-bold text-teal-700">{hosp.distanceKm} km away</span>
                      <span>·</span>
                      <span className="flex items-center text-amber-600 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                        {hosp.rating} ({hosp.reviewCount})
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl hover:bg-teal-100">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Facilities & Specs */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                  {hosp.emergency24x7 && (
                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md text-[11px]">
                      24x7 Emergency
                    </span>
                  )}
                  {hosp.icuAvailable && (
                    <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                      ICU Ready
                    </span>
                  )}
                  <span className="text-slate-600">
                    {hosp.doctorsCount} doctors on duty
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">
                    OPD: {hosp.opdHours}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
