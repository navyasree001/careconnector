import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, User, Building2, Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../i18n/translations';
import { Language } from '../types';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage, setLanguage, session } = useAppStore();
  const t = translations[currentLanguage];

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-slate-50 flex flex-col justify-between p-4">
      <div className="max-w-md w-full mx-auto space-y-6 pt-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-600 text-white shadow-lg mb-1">
            <Activity className="w-10 h-10" />
          </div>
          <h1 className="font-black text-2xl md:text-3xl text-slate-900 tracking-tight">
            {t.common.appName}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 font-medium max-w-xs mx-auto leading-relaxed">
            {t.auth.chooseRoleSubtitle}
          </p>
        </div>

        {/* 1. Language Selection */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Globe className="w-4 h-4 text-teal-600" />
            <span>Select Your Language / భాష / भाषा</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'te' as Language, label: 'తెలుగు', sub: 'Telugu' },
              { id: 'hi' as Language, label: 'हिंदी', sub: 'Hindi' },
              { id: 'en' as Language, label: 'English', sub: 'English' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleLanguageSelect(lang.id)}
                className={`py-3 px-2 rounded-2xl text-center border transition-all ${
                  currentLanguage === lang.id
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-200'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-extrabold text-sm">{lang.label}</div>
                <div className={`text-[10px] mt-0.5 ${currentLanguage === lang.id ? 'text-teal-100' : 'text-slate-500'}`}>
                  {lang.sub}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Role Selection */}
        <div className="space-y-3">
          {/* Patient Login Option */}
          <button
            onClick={() => navigate('/auth/patient')}
            className="w-full p-4 rounded-3xl bg-white border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all text-left flex items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-base">
                  {t.auth.patientRole}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                  {t.auth.patientRoleDesc}
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors shrink-0" />
          </button>

          {/* Hospital Staff Portal Option */}
          <button
            onClick={() => navigate('/auth/hospital')}
            className="w-full p-4 rounded-3xl bg-white border border-slate-200 hover:border-slate-800 hover:shadow-md transition-all text-left flex items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-base">
                  {t.auth.hospitalRole}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                  {t.auth.hospitalRoleDesc}
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center py-4 text-xs text-slate-600 space-y-1">
        <div className="flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>Visakhapatnam Smart Healthcare Initiative</span>
        </div>
        <div className="text-[11px] text-slate-500">
          Demo data seeded · All rights reserved
        </div>
      </div>
    </div>
  );
};
