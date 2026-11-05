import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore, minutesToTime } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { Language } from '../../types';
import { MapPin, Globe, Sparkles, LogOut, Clock, Activity, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  onOpenEmergency?: () => void;
  onOpenLocationPicker?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenEmergency, onOpenLocationPicker }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    session,
    currentLanguage,
    setLanguage,
    userLocation,
    simpleMode,
    setSimpleMode,
    simMinutes,
    simSpeed,
    simPaused,
    toggleSimPause,
    advanceSimMinutes,
    setSession,
    hospitals,
  } = useAppStore();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [clockMenuOpen, setClockMenuOpen] = useState(false);

  const t = translations[currentLanguage];
  const isHospitalPortal = location.pathname.startsWith('/portal');

  const currentHospital = isHospitalPortal && session.hospitalId
    ? hospitals.find((h) => h.id === session.hospitalId)
    : null;

  const handleLogout = () => {
    setSession({ type: 'none' });
    navigate('/');
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate(isHospitalPortal ? '/portal' : '/home')}
            className="flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg p-0.5"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm md:text-base leading-tight tracking-tight">
                {t.common.appName}
              </div>
              <div className="text-[10px] text-slate-600 font-medium leading-none">
                {isHospitalPortal ? currentHospital?.name || t.hospitalPortal.portalName : t.common.vizag}
              </div>
            </div>
          </button>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Simulation Time Pill (Compact indicator with fast click controls) */}
          <div className="relative">
            <button
              onClick={() => setClockMenuOpen(!clockMenuOpen)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-mono font-medium text-slate-800 transition-colors"
              title="Click to adjust demo clock speed or advance time"
            >
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              <span>{minutesToTime(simMinutes)}</span>
              <span className="text-[10px] text-slate-600 font-sans font-bold">
                {simPaused ? '⏸' : `${simSpeed}x`}
              </span>
            </button>

            {/* Sim Clock Popover */}
            {clockMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs font-sans">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-900">Demo Sim Clock</span>
                  <span className="font-mono text-teal-700 font-bold">{minutesToTime(simMinutes)}</span>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-1">
                  <button
                    onClick={() => {
                      toggleSimPause();
                      setClockMenuOpen(false);
                    }}
                    className={`flex-1 py-1 px-2 rounded-lg font-medium text-center border ${
                      simPaused
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {simPaused ? '▶ Resume' : '⏸ Pause'}
                  </button>
                  <button
                    onClick={() => {
                      advanceSimMinutes(15);
                      setClockMenuOpen(false);
                    }}
                    className="flex-1 py-1 px-2 rounded-lg font-medium text-center bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100"
                  >
                    +15 min ⏩
                  </button>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  Clock Speed:
                  <div className="flex gap-1 mt-1">
                    {[1, 10, 30, 60, 120].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          useAppStore.getState().setSimSpeed(s);
                          setClockMenuOpen(false);
                        }}
                        className={`flex-1 py-1 rounded text-center font-bold ${
                          simSpeed === s
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Location Chip (for Patient) */}
          {!isHospitalPortal && onOpenLocationPicker && (
            <button
              onClick={onOpenLocationPicker}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 max-w-[140px] truncate"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">{userLocation.name.split('(')[0]}</span>
            </button>
          )}

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-300 text-xs font-medium text-slate-700"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentLanguage === 'te' ? 'తెలుగు' : currentLanguage === 'hi' ? 'हिंदी' : 'English'}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs">
                <button
                  onClick={() => handleLanguageSelect('en')}
                  className={`w-full px-3 py-2 text-left font-medium hover:bg-slate-50 ${
                    currentLanguage === 'en' ? 'text-teal-700 font-bold bg-teal-50' : 'text-slate-800'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageSelect('te')}
                  className={`w-full px-3 py-2 text-left font-medium hover:bg-slate-50 ${
                    currentLanguage === 'te' ? 'text-teal-700 font-bold bg-teal-50' : 'text-slate-800'
                  }`}
                >
                  తెలుగు (Telugu)
                </button>
                <button
                  onClick={() => handleLanguageSelect('hi')}
                  className={`w-full px-3 py-2 text-left font-medium hover:bg-slate-50 ${
                    currentLanguage === 'hi' ? 'text-teal-700 font-bold bg-teal-50' : 'text-slate-800'
                  }`}
                >
                  हिंदी (Hindi)
                </button>
              </div>
            )}
          </div>

          {/* Simple Mode Toggle (Patient) */}
          {!isHospitalPortal && (
            <button
              onClick={() => setSimpleMode(!simpleMode)}
              className={`p-1.5 rounded-md border text-xs font-semibold flex items-center gap-1 ${
                simpleMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
              title="Toggle Large Text / Simple Mode"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">{simpleMode ? 'Simple: ON' : 'Simple'}</span>
            </button>
          )}

          {/* Hospital Logout / Switch Button */}
          {isHospitalPortal ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.auth.logout}</span>
            </button>
          ) : (
            onOpenEmergency && (
              <button
                onClick={onOpenEmergency}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>108</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};
