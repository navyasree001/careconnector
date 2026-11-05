import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, CheckCircle, Navigation, MapPin, Zap } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../i18n/translations';
import { DEMO_PATIENT } from '../data/seedData';
import { VIZAG_AREAS, DEFAULT_VIZAG_LOCATION, isWithinVizag } from '../utils/geo';
import { UserLocation } from '../types';

export const PatientAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage, setSession, setUserLocation, userLocation } = useAppStore();
  const t = translations[currentLanguage];

  // Steps: 1: Details -> 2: OTP -> 3: Location
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [detectingGps, setDetectingGps] = useState(false);

  // Quick Demo Patient Shortcut
  const handleQuickDemoPatient = () => {
    setFullName(DEMO_PATIENT.name);
    setPhone(DEMO_PATIENT.phone);
    setGeneratedOtp(DEMO_PATIENT.otp);
    setEnteredOtp(DEMO_PATIENT.otp);
    setStep(2);
  };

  // Step 1: Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setErrorMsg('');
    setStep(2);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== generatedOtp) {
      setErrorMsg('Invalid OTP. Please enter the OTP displayed above.');
      return;
    }

    setErrorMsg('');
    setStep(3); // Go to location step
  };

  // Step 3: Finish location and enter
  const handleFinishLocation = (loc: UserLocation) => {
    setUserLocation(loc);
    setSession({
      type: 'user',
      phone: phone.replace(/\D/g, ''),
      patientName: fullName.trim(),
    });
    navigate('/home');
  };

  const handleGpsDetect = () => {
    if (!navigator.geolocation) {
      handleFinishLocation(DEFAULT_VIZAG_LOCATION);
      return;
    }

    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingGps(false);
        const { latitude, longitude } = pos.coords;
        if (isWithinVizag(latitude, longitude)) {
          handleFinishLocation({
            lat: latitude,
            lng: longitude,
            name: `GPS Location (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`,
            isCustom: true,
          });
        } else {
          handleFinishLocation(DEFAULT_VIZAG_LOCATION);
        }
      },
      () => {
        setDetectingGps(false);
        handleFinishLocation(DEFAULT_VIZAG_LOCATION);
      },
      { timeout: 7000 }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center p-4">
      <div className="max-w-md w-full mx-auto space-y-5">
        {/* Back Link */}
        <button
          onClick={() => (step === 1 ? navigate('/') : setStep((s) => (s - 1) as any))}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.common.back}</span>
        </button>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                step === s ? 'w-8 bg-teal-600' : step > s ? 'w-4 bg-teal-300' : 'w-4 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: Name and Phone */}
        {step === 1 && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="text-center space-y-1">
              <h2 className="font-extrabold text-slate-900 text-lg md:text-xl">
                {t.auth.enterMobile}
              </h2>
              <p className="text-xs text-slate-500">
                Your mobile number links your appointments and WhatsApp queue tokens.
              </p>
            </div>

            {/* Quick Demo Button */}
            <button
              type="button"
              onClick={handleQuickDemoPatient}
              className="w-full py-2.5 px-3 rounded-2xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Zap className="w-4 h-4 text-teal-600 fill-teal-600" />
              <span>{t.auth.demoPatientBtn}</span>
            </button>

            <form onSubmit={handleSendOtp} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.auth.fullName} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.auth.namePlaceholder}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm outline-none text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-slate-500 font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.auth.mobilePlaceholder}
                    maxLength={10}
                    required
                    className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm outline-none font-mono text-slate-900"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg font-medium">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-sm active:scale-98 transition-all"
              >
                {t.auth.sendOtp}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Demo OTP */}
        {step === 2 && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="text-center space-y-1">
              <h2 className="font-extrabold text-slate-900 text-lg md:text-xl">
                {t.auth.enterOtp}
              </h2>
              <p className="text-xs text-slate-500">
                Sent to +91 {phone}
              </p>
            </div>

            {/* Display OTP on screen as requested */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-center space-y-1">
              <div className="text-xs text-amber-800 font-semibold">
                {t.auth.otpHint.replace('{otp}', generatedOtp)}
              </div>
              <div className="text-2xl font-black font-mono tracking-widest text-amber-900">
                {generatedOtp}
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="Enter 4-digit code"
                  maxLength={4}
                  className="w-full py-3 text-center text-xl font-mono font-black tracking-widest rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 outline-none text-slate-900"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg font-medium text-center">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-sm active:scale-98 transition-all"
              >
                {t.auth.verifyOtp}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: Location Selection */}
        {step === 3 && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="text-center space-y-1">
              <h2 className="font-extrabold text-slate-900 text-lg md:text-xl">
                {t.auth.selectLocation}
              </h2>
              <p className="text-xs text-slate-500">
                We use your area to calculate travel time and hospital distance.
              </p>
            </div>

            <button
              onClick={handleGpsDetect}
              disabled={detectingGps}
              className="w-full py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Navigation className={`w-4 h-4 ${detectingGps ? 'animate-spin' : ''}`} />
              <span>{detectingGps ? t.common.loading : t.auth.detectGps}</span>
            </button>

            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2 text-center">
              {t.auth.orChooseArea}
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
              {VIZAG_AREAS.map((area) => (
                <button
                  key={area.name}
                  onClick={() => handleFinishLocation(area)}
                  className="w-full p-2.5 rounded-xl text-left text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-900 hover:font-bold transition-all flex items-center justify-between border border-transparent hover:border-teal-200"
                >
                  <span>{area.name}</span>
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
