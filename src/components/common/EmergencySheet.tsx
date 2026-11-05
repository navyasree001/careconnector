import React from 'react';
import { PhoneCall, MapPin, X, AlertTriangle, ExternalLink } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { calculateDistance } from '../../utils/geo';

interface EmergencySheetProps {
  isOpen: boolean;
  onClose: () => void;
  reasonText?: string;
}

export const EmergencySheet: React.FC<EmergencySheetProps> = ({ isOpen, onClose, reasonText }) => {
  const { currentLanguage, userLocation, hospitals } = useAppStore();
  const t = translations[currentLanguage];

  if (!isOpen) return null;

  // Filter 24x7 emergency ready hospitals and sort by distance from patient
  const emergencyHospitals = hospitals
    .filter((h) => h.emergency24x7)
    .map((h) => ({
      ...h,
      distanceKm: calculateDistance(userLocation.lat, userLocation.lng, h.lat, h.lng),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-rose-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-rose-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-base leading-tight">
                {t.triage.emergencyBanner.split(':')[0] || 'EMERGENCY ASSISTANCE'}
              </div>
              <div className="text-xs text-rose-100 font-medium">Visakhapatnam Rapid Response</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {reasonText && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 leading-relaxed font-medium">
              {reasonText}
            </div>
          )}

          {/* Emergency Call Action Tiles */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:108"
              className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md active:scale-95 transition-all min-h-[52px]"
            >
              <div className="flex items-center gap-2 font-black text-lg">
                <PhoneCall className="w-5 h-5" />
                <span>108</span>
              </div>
              <span className="text-[11px] font-semibold text-rose-100 mt-0.5">{t.triage.emergencyCall108}</span>
            </a>

            <a
              href="tel:112"
              className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-95 transition-all min-h-[52px]"
            >
              <div className="flex items-center gap-2 font-black text-lg">
                <PhoneCall className="w-5 h-5" />
                <span>112</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-300 mt-0.5">{t.triage.emergencyCall112}</span>
            </a>
          </div>

          {/* Nearest 24x7 Emergency Hospitals in Vizag */}
          <div className="pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Nearest 24x7 Trauma & Emergency Centres
            </div>
            <div className="space-y-2.5">
              {emergencyHospitals.map((hosp) => (
                <div
                  key={hosp.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-teal-400 transition-all flex items-start justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-sm leading-snug">{hosp.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{hosp.locality}</span>
                      <span>·</span>
                      <span className="font-semibold text-teal-700">{hosp.distanceKm} km</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">{hosp.phone}</div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <a
                      href={`tel:${hosp.phone.replace(/\s+/g, '')}`}
                      className="px-2.5 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 flex items-center gap-1 justify-center"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${hosp.name} ${hosp.address}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 flex items-center gap-1 justify-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Maps</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-semibold text-slate-700 text-sm hover:bg-slate-200 transition-colors"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
