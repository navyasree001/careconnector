import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Volume2, AlertTriangle, CheckCircle, Clock, MapPin, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { TriageResult } from '../../types';
import { rankHospitalsForSpecialty } from '../../services/triageEngine';
import { speakText } from '../../utils/audio';

interface TriageResultViewProps {
  onOpenEmergency: (reason?: string) => void;
}

export const TriageResultView: React.FC<TriageResultViewProps> = ({ onOpenEmergency }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage, userLocation, hospitals, doctors, simpleMode } = useAppStore();
  const t = translations[currentLanguage];

  const stateData = location.state as { query?: string; triageResult?: TriageResult } | null;
  const triageResult: TriageResult = stateData?.triageResult || {
    specialty: 'Cardiology',
    urgency: 'Emergency',
    symptoms: ['Chest pain', 'Shortness of breath'],
    explanation: currentLanguage === 'te' 
      ? 'ఛాతీలో నొప్పి లేదా ఒత్తిడి గుండె సంబంధిత తీవ్రమైన అత్యవసర పరిస్థితి కావచ్చు; వెంటనే అత్యవసర వైద్య సేవలను సంప్రదించండి.'
      : currentLanguage === 'hi'
      ? 'सीने में दर्द या भारीपन दिल के दौरे का संकेत हो सकता है; कृपया तुरंत आपातकालीन चिकित्सा सहायता लें।'
      : 'Chest pain requires immediate emergency evaluation to rule out acute cardiac complications.',
    source: 'rules',
  };

  const [voiceNotice, setVoiceNotice] = useState('');

  // Auto-trigger emergency sheet if urgency is Emergency
  useEffect(() => {
    if (triageResult.urgency === 'Emergency') {
      onOpenEmergency(triageResult.explanation);
    }
  }, [triageResult, onOpenEmergency]);

  // Rank Vizag hospitals using deterministic scoring
  const rankedHospitals = rankHospitalsForSpecialty({
    specialty: triageResult.specialty,
    userLat: userLocation.lat,
    userLng: userLocation.lng,
    lang: currentLanguage,
    hospitals,
    doctors,
    urgency: triageResult.urgency,
  }).slice(0, 3);

  const handleListen = () => {
    const textToSpeak = `${triageResult.specialty}. ${triageResult.explanation}`;
    speakText(textToSpeak, currentLanguage, (missingLang) => {
      setVoiceNotice(`Your browser does not have offline voice for ${missingLang}. Playing with available system voice.`);
    });
  };

  const urgencyStyles = {
    Emergency: {
      bg: 'bg-rose-50 border-rose-300 text-rose-900',
      badge: 'bg-rose-600 text-white',
      icon: ShieldAlert,
      title: t.triage.emergency,
    },
    Urgent: {
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      badge: 'bg-amber-500 text-white',
      icon: AlertTriangle,
      title: t.triage.urgent,
    },
    Routine: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      badge: 'bg-emerald-600 text-white',
      icon: CheckCircle,
      title: t.triage.routine,
    },
  }[triageResult.urgency];

  const UrgencyIcon = urgencyStyles.icon;

  return (
    <div className={`max-w-2xl mx-auto px-4 py-4 pb-24 space-y-4 ${simpleMode ? 'text-lg' : 'text-sm'}`}>
      {/* Top back button */}
      <button
        onClick={() => navigate('/home')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.common.back} to Search</span>
      </button>

      {/* Emergency auto-trigger banner */}
      {triageResult.urgency === 'Emergency' && (
        <div className="p-4 rounded-2xl bg-rose-600 text-white shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 shrink-0 animate-bounce" />
            <div>
              <div className="font-extrabold text-sm">{t.triage.emergencyBanner.split(':')[0]}</div>
              <div className="text-xs text-rose-100">Ambulance dispatched on dial 108</div>
            </div>
          </div>
          <button
            onClick={() => onOpenEmergency(triageResult.explanation)}
            className="px-3 py-1.5 rounded-xl bg-white text-rose-700 font-extrabold text-xs shadow-xs"
          >
            Open 108
          </button>
        </div>
      )}

      {/* Main Assessment Card */}
      <div className={`p-5 rounded-3xl border shadow-sm space-y-4 ${urgencyStyles.bg}`}>
        {/* Urgency Badge Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${urgencyStyles.badge}`}>
              {urgencyStyles.title}
            </span>
            {triageResult.source === 'rules' && (
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                {t.common.offlineMode}
              </span>
            )}
          </div>

          <button
            onClick={handleListen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-teal-700 text-xs font-bold shadow-xs active:scale-95 transition-transform"
          >
            <Volume2 className="w-4 h-4 text-teal-600" />
            <span>{t.triage.listenToGuidance}</span>
          </button>
        </div>

        {voiceNotice && (
          <p className="text-[11px] text-amber-800 bg-amber-100/60 p-2 rounded-lg">
            {voiceNotice}
          </p>
        )}

        {/* Specialty Recommendation */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t.triage.specialtyRecommended}
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">
            {triageResult.specialty}
          </div>
        </div>

        {/* Symptoms Identified */}
        {triageResult.symptoms && triageResult.symptoms.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {t.triage.symptomsIdentified}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {triageResult.symptoms.map((sym, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-300 text-xs font-medium text-slate-800"
                >
                  {sym}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Explanation in User's Language */}
        <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200 text-slate-800 leading-relaxed font-medium text-sm">
          {triageResult.explanation}
        </div>

        {/* Follow up question if any */}
        {triageResult.followUpQuestion && (
          <div className="text-xs text-slate-600 italic">
            Q: {triageResult.followUpQuestion}
          </div>
        )}
      </div>

      {/* Top 3 Ranked Hospitals */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t.triage.topHospitalsTitle} ({triageResult.specialty})
          </div>
          <span className="text-xs text-slate-500">Ranked for you</span>
        </div>

        <div className="space-y-3">
          {rankedHospitals.map((item, idx) => (
            <div
              key={item.hospital.id}
              onClick={() => navigate(`/hospital/${item.hospital.id}?specialty=${encodeURIComponent(triageResult.specialty)}`)}
              className="cursor-pointer p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {item.hospital.name}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.hospital.locality}</span>
                    <span>·</span>
                    <span className="font-bold text-teal-700">{item.distanceKm} km away</span>
                    <span>·</span>
                    <span>⭐ {item.hospital.rating}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block px-3 py-1 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-xs">
                    {t.triage.viewDoctors}
                  </span>
                </div>
              </div>

              {/* Reasons list (deterministic badges) */}
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
                {item.reasons.map((r, rIdx) => (
                  <span
                    key={rIdx}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                  >
                    ✓ {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Disclaimer Notice */}
      <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-center text-[11px] text-slate-500 leading-relaxed">
        {t.triage.medicalDisclaimer}
      </div>
    </div>
  );
};
