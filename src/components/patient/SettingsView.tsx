import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, MapPin, Sparkles, Clock, RefreshCw, LogOut, Shield } from 'lucide-react';
import { useAppStore, minutesToTime } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { Language } from '../../types';

interface SettingsViewProps {
  onOpenLocationPicker: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenLocationPicker }) => {
  const navigate = useNavigate();
  const {
    currentLanguage,
    setLanguage,
    userLocation,
    simpleMode,
    setSimpleMode,
    simMinutes,
    simSpeed,
    setSimSpeed,
    simPaused,
    toggleSimPause,
    advanceSimMinutes,
    resetDemoData,
    setSession,
    session,
  } = useAppStore();

  const t = translations[currentLanguage];

  const handleLogout = () => {
    setSession({ type: 'none' });
    navigate('/');
  };

  return (
    <div className={`max-w-2xl mx-auto px-4 py-4 pb-24 space-y-5 ${simpleMode ? 'text-lg' : 'text-sm'}`}>
      <h1 className="font-extrabold text-slate-900 text-lg md:text-xl">
        {t.settings.title}
      </h1>

      {/* User Identity Chip */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Patient Profile</div>
          <div className="font-extrabold text-slate-900 text-base">{session.patientName || 'Ramesh Kumar'}</div>
          <div className="text-xs text-slate-500 font-mono">+91 {session.phone || '9876543210'}</div>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t.auth.logout}</span>
        </button>
      </div>

      {/* Language Selection */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal-600" />
          <h2 className="font-bold text-slate-900 text-sm">{t.settings.language}</h2>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { id: 'en' as Language, label: 'English' },
            { id: 'te' as Language, label: 'తెలుగు (Telugu)' },
            { id: 'hi' as Language, label: 'हिंदी (Hindi)' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setLanguage(l.id)}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                currentLanguage === l.id
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location Picker */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-teal-600" />
          <div>
            <div className="font-bold text-slate-900 text-sm">{t.settings.location}</div>
            <div className="text-xs text-slate-500">{userLocation.name}</div>
          </div>
        </div>
        <button
          onClick={onOpenLocationPicker}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
        >
          {t.common.change}
        </button>
      </div>

      {/* Simple Mode Toggle */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <div>
            <div className="font-bold text-slate-900 text-sm">{t.settings.simpleMode}</div>
            <div className="text-xs text-slate-500 leading-snug">{t.settings.simpleModeDesc}</div>
          </div>
        </div>
        <input
          type="checkbox"
          checked={simpleMode}
          onChange={(e) => setSimpleMode(e.target.checked)}
          aria-label={t.settings.simpleMode}
          className="w-5 h-5 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
        />
      </div>

      {/* Demo Simulation Controls */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400" />
            <h2 className="font-extrabold text-sm uppercase tracking-wider text-teal-300">
              {t.settings.demoControls}
            </h2>
          </div>
          <span className="font-mono text-base font-bold text-amber-400">
            {minutesToTime(simMinutes)}
          </span>
        </div>

        {/* Speed buttons */}
        <div>
          <div className="text-xs text-slate-400 mb-1.5">{t.settings.simSpeed}:</div>
          <div className="flex gap-1.5">
            {[1, 10, 30, 60, 120].map((s) => (
              <button
                key={s}
                onClick={() => setSimSpeed(s)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  simSpeed === s
                    ? 'bg-teal-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Fast forward & Pause */}
        <div className="flex gap-2">
          <button
            onClick={toggleSimPause}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
              simPaused
                ? 'bg-teal-500 text-slate-950'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {simPaused ? '▶ Resume Simulation' : '⏸ Pause Simulation'}
          </button>
          <button
            onClick={() => advanceSimMinutes(15)}
            className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold transition-colors"
          >
            {t.settings.advance15}
          </button>
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={() => {
            if (window.confirm('Reset all queues and doctor schedules to initial 10:15 AM state?')) {
              resetDemoData();
            }
          }}
          className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t.settings.resetDemoData}</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-slate-600 pt-2 space-y-1">
        <div>CareConnect Visakhapatnam Hackathon Edition</div>
        <div className="font-semibold text-teal-700">Demo Data · All hospital and doctor identities are for demonstration</div>
      </div>
    </div>
  );
};
