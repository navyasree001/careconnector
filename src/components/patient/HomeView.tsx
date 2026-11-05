import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Send, AlertTriangle, ArrowRight, Clock, Building2, MapPin, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { calculateDistance } from '../../utils/geo';
import { triageSymptoms } from '../../services/api';

interface HomeViewProps {
  onOpenEmergency: () => void;
  onOpenLocationPicker: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenEmergency, onOpenLocationPicker }) => {
  const navigate = useNavigate();
  const {
    currentLanguage,
    userLocation,
    session,
    appointments,
    doctors,
    hospitals,
    simpleMode,
  } = useAppStore();

  const t = translations[currentLanguage];

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Active appointment for current user
  const userPhone = session.phone;
  const userAppointments = appointments.filter((a) => a.patient.phone === userPhone);
  const activeAppointment = userAppointments.find(
    (a) => a.status === 'booked' || a.status === 'serving'
  );
  const activeDoctor = activeAppointment
    ? doctors.find((d) => d.id === activeAppointment.doctorId)
    : null;
  const activeHospital = activeAppointment
    ? hospitals.find((h) => h.id === activeAppointment.hospitalId)
    : null;

  // Nearest hospitals (top 3)
  const nearestHospitals = hospitals
    .map((h) => ({
      ...h,
      distanceKm: calculateDistance(userLocation.lat, userLocation.lng, h.lat, h.lng),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 3);

  // Setup Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        const langMap = {
          en: 'en-IN',
          te: 'te-IN',
          hi: 'hi-IN',
        };
        recognition.lang = langMap[currentLanguage] || 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechError('');
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setInputText(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setSpeechError('Microphone permission denied. Please type your symptoms.');
          } else {
            setSpeechError('Could not capture audio. Please type below.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [currentLanguage]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      setSpeechError('Speech recognition is not supported in this browser. Please type below.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        const langMap = { en: 'en-IN', te: 'te-IN', hi: 'hi-IN' };
        recognitionRef.current.lang = langMap[currentLanguage] || 'en-IN';
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Failed to start speech recognition:', err);
      }
    }
  };

  const handleTriageSubmit = async (queryText?: string) => {
    const textToAnalyze = queryText || inputText;
    if (!textToAnalyze.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await triageSymptoms(textToAnalyze, currentLanguage);
      navigate('/triage-result', {
        state: {
          query: textToAnalyze,
          triageResult: result,
        },
      });
    } catch (err) {
      console.error('Triage submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickSymptoms = [
    { key: 'fever', label: t.symptoms.fever, query: currentLanguage === 'te' ? 'జ్వరం మరియు ఒళ్ళు నొప్పులు' : currentLanguage === 'hi' ? 'तेज़ बुखार और सिरदर्द' : 'High fever and chills' },
    { key: 'chestPain', label: t.symptoms.chestPain, query: currentLanguage === 'te' ? 'నాకు రెండు రోజులుగా ఛాతీలో నొప్పిగా ఉంది' : currentLanguage === 'hi' ? 'दो दिन से सीने में दर्द और भारीपन' : 'Severe chest pain radiating to arm' },
    { key: 'childUnwell', label: t.symptoms.childUnwell, query: currentLanguage === 'te' ? 'పిల్లాడికి తీవ్రమైన జ్వరం మరియు దగ్గు' : currentLanguage === 'hi' ? 'बच्चे को बुखार और लगातार खांसी' : 'Child is unwell with high temperature' },
    { key: 'pregnancy', label: t.symptoms.pregnancy, query: currentLanguage === 'te' ? 'గర్భధారణ సమయంలో కడుపు నొప్పి మరియు అసౌకర్యం' : currentLanguage === 'hi' ? 'गर्भावस्था में पेट दर्द और बेचैनी' : 'Pregnancy checkup and abdominal discomfort' },
    { key: 'injury', label: t.symptoms.injury, query: currentLanguage === 'te' ? 'కాలు బెణికింది, విపరీతమైన నొప్పి' : currentLanguage === 'hi' ? 'पैर में मोच और चलने में भारी दर्द' : 'Leg injury and severe joint swelling' },
    { key: 'skin', label: t.symptoms.skin, query: currentLanguage === 'te' ? 'చర్మంపై ఎర్రటి దద్దుర్లు మరియు దురద' : currentLanguage === 'hi' ? 'त्वचा पर लाल चकत्ते और तेज़ खुजली' : 'Skin rash and severe itching' },
    { key: 'eye', label: t.symptoms.eye, query: currentLanguage === 'te' ? 'కన్ను ఎర్రబడి చూపు మందగించింది' : currentLanguage === 'hi' ? 'आंख लाल है और धुंधला दिख रहा है' : 'Eye redness and blurred vision' },
    { key: 'tooth', label: t.symptoms.tooth, query: currentLanguage === 'te' ? 'పంటి నొప్పి మరియు వాపు' : currentLanguage === 'hi' ? 'दांत में तेज़ दर्द और सूजन' : 'Severe toothache and gum pain' },
    { key: 'stomach', label: t.symptoms.stomach, query: currentLanguage === 'te' ? 'కడుపు నొప్పి మరియు వాంతులు' : currentLanguage === 'hi' ? 'पेट में तेज दर्द और उल्टी' : 'Severe stomach cramps and nausea' },
    { key: 'breathing', label: t.symptoms.breathing, query: currentLanguage === 'te' ? 'తీవ్రమైన శ్వాస తీసుకోవడంలో ఇబ్బంది' : currentLanguage === 'hi' ? 'सांस लेने में भारी कठिनाई' : 'Shortness of breath and wheezing' },
  ];

  return (
    <div className={`max-w-2xl mx-auto px-4 py-4 pb-24 space-y-5 ${simpleMode ? 'text-lg' : 'text-sm'}`}>
      {/* Emergency Alert Banner */}
      <div
        onClick={onOpenEmergency}
        className="cursor-pointer p-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-sm flex items-center justify-between gap-3 active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="font-extrabold text-xs md:text-sm tracking-tight leading-tight">
              {t.home.emergencyCallout}
            </div>
            <div className="text-[11px] text-rose-100 font-medium">Tap here for instant emergency dispatch</div>
          </div>
        </div>
        <span className="text-xs font-bold bg-white text-rose-700 px-2.5 py-1 rounded-full shrink-0">
          Dial 108
        </span>
      </div>

      {/* Active Token Card (if any) */}
      {activeAppointment && activeDoctor && activeHospital && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-900 to-slate-900 text-white shadow-md border border-teal-800">
          <div className="flex items-center justify-between pb-3 border-b border-teal-800/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold tracking-wide uppercase text-teal-300">
                {t.home.activeTokenTitle}
              </span>
            </div>
            <div className="text-lg font-black text-amber-400 tracking-wider">
              TOKEN #{activeAppointment.token}
            </div>
          </div>

          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <div className="font-bold text-base text-white">{activeDoctor.name}</div>
              <div className="text-xs text-teal-200">{activeDoctor.specialty} · Room {activeDoctor.roomNumber}</div>
              <div className="text-xs text-slate-300 mt-1">{activeHospital.name}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-slate-400">Slot Window</div>
              <div className="text-xs font-bold text-white">{activeAppointment.slotStart}</div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/queue?appointmentId=${activeAppointment.id}`)}
            className="w-full mt-3.5 py-2 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>Track Live Queue & Travel Reminders</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Voice / Text AI Triage Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-50 text-teal-700 rounded-lg">
              <Sparkles className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="font-extrabold text-slate-900 text-base md:text-lg">
              {t.home.micPrompt}
            </h2>
          </div>
          <button
            onClick={onOpenLocationPicker}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-teal-700 font-medium"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>{userLocation.name.split('(')[0]}</span>
          </button>
        </div>

        {/* Giant Mic Button */}
        <div className="flex flex-col items-center justify-center pt-2 pb-1">
          <button
            onClick={toggleMic}
            className={`relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 shadow-lg active:scale-95 ${
              isListening
                ? 'bg-rose-600 text-white ring-8 ring-rose-100 animate-pulse'
                : 'bg-teal-600 hover:bg-teal-700 text-white ring-8 ring-teal-50'
            }`}
            aria-label="Toggle voice input"
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
          <div className="mt-2.5 text-center">
            <span className={`text-xs font-semibold ${isListening ? 'text-rose-600 animate-pulse' : 'text-slate-600'}`}>
              {isListening ? t.home.micListening : 'Tap to Speak in Telugu, Hindi or English'}
            </span>
          </div>
        </div>

        {speechError && (
          <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200 text-center">
            {speechError}
          </p>
        )}

        {/* Text Input Box */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTriageSubmit();
              }
            }}
            placeholder={t.home.textPlaceholder}
            rows={2}
            className="w-full p-3 pr-12 rounded-2xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm outline-none resize-none text-slate-900 placeholder:text-slate-400"
          />
          <button
            onClick={() => handleTriageSubmit()}
            disabled={!inputText.trim() || isSubmitting}
            className={`absolute right-2.5 bottom-3.5 p-2 rounded-xl text-white transition-all ${
              inputText.trim() && !isSubmitting
                ? 'bg-teal-600 hover:bg-teal-700 active:scale-95 shadow-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {isSubmitting && (
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 py-2 rounded-xl">
            <span className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></span>
            <span>{t.triage.analyzing}</span>
          </div>
        )}
      </div>

      {/* Quick Symptom Chips */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {t.home.quickSymptomsTitle}
        </div>
        <div className="flex flex-wrap gap-2">
          {quickSymptoms.map((sym) => (
            <button
              key={sym.key}
              onClick={() => {
                setInputText(sym.query);
                handleTriageSubmit(sym.query);
              }}
              className="px-3 py-2 rounded-xl bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-400 text-slate-700 hover:text-teal-900 text-xs font-medium transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <span>{sym.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nearest Hospitals Preview */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t.home.nearestHospitalsTitle}
          </div>
          <button
            onClick={() => navigate('/hospitals')}
            className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-0.5"
          >
            <span>{t.common.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {nearestHospitals.map((hosp) => (
            <div
              key={hosp.id}
              onClick={() => navigate(`/hospital/${hosp.id}`)}
              className="cursor-pointer p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{hosp.name}</h3>
                  {hosp.emergency24x7 && (
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded shrink-0">
                      24x7
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>{hosp.locality}</span>
                  <span>·</span>
                  <span className="font-semibold text-teal-700">{hosp.distanceKm} km</span>
                  <span>·</span>
                  <span>⭐ {hosp.rating}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                  View Doctors
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="pt-3 text-center text-[11px] text-slate-600 leading-relaxed">
        {t.home.disclaimer}
      </div>
    </div>
  );
};
