import React, { useState } from 'react';
import { MapPin, Navigation, X, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { VIZAG_AREAS, DEFAULT_VIZAG_LOCATION, isWithinVizag } from '../../utils/geo';
import { UserLocation } from '../../types';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ isOpen, onClose }) => {
  const { currentLanguage, userLocation, setUserLocation } = useAppStore();
  const t = translations[currentLanguage];
  const [detecting, setDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectArea = (area: UserLocation) => {
    setUserLocation(area);
    onClose();
  };

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation not supported on this browser. Falling back to RK Beach.');
      setUserLocation(DEFAULT_VIZAG_LOCATION);
      return;
    }

    setDetecting(true);
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetecting(false);
        const { latitude, longitude } = pos.coords;

        if (isWithinVizag(latitude, longitude)) {
          setUserLocation({
            lat: latitude,
            lng: longitude,
            name: `Detected GPS (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`,
            isCustom: true,
          });
          onClose();
        } else {
          // If outside Vizag, notify and use RK Beach
          setErrorMsg('You are currently outside Visakhapatnam. Centering on Beach Road (RK Beach).');
          setUserLocation(DEFAULT_VIZAG_LOCATION);
        }
      },
      (err) => {
        setDetecting(false);
        console.warn('Geolocation error:', err);
        setErrorMsg('GPS location access denied or unavailable. Using Beach Road (RK Beach).');
        setUserLocation(DEFAULT_VIZAG_LOCATION);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">{t.auth.selectLocation}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Button */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <button
            onClick={handleDetectGps}
            disabled={detecting}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Navigation className={`w-4 h-4 ${detecting ? 'animate-spin' : ''}`} />
            <span>{detecting ? t.common.loading : t.auth.detectGps}</span>
          </button>
          {errorMsg && (
            <p className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Localities list */}
        <div className="p-4 overflow-y-auto space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            {t.auth.orChooseArea}
          </div>
          {VIZAG_AREAS.map((area) => {
            const isSelected = userLocation.name === area.name;
            return (
              <button
                key={area.name}
                onClick={() => handleSelectArea(area)}
                className={`w-full p-3 rounded-xl text-left text-sm flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{area.name}</span>
                {isSelected && <Check className="w-4 h-4 text-teal-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
