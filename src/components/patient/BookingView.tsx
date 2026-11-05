import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { CheckCircle2, ArrowRight, Calendar, MessageSquare, MapPin, Share2, ArrowLeft, QrCode } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { generateIcsCalendar } from '../../utils/calendar';
import { calculateDistance } from '../../utils/geo';
import { Appointment } from '../../types';

export const BookingView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage, userLocation, session, doctors, hospitals, bookAppointment, simpleMode } = useAppStore();
  const t = translations[currentLanguage];

  const stateData = location.state as {
    hospitalId: string;
    doctorId: string;
    slotIndex: number;
    slotStart: string;
    slotEnd: string;
    date: string;
    windowStr: string;
    problemNotePrefill?: string;
  } | null;

  const doctor = doctors.find((d) => d.id === stateData?.doctorId) || doctors[0];
  const hospital = hospitals.find((h) => h.id === stateData?.hospitalId) || hospitals[0];
  const distanceKm = calculateDistance(userLocation.lat, userLocation.lng, hospital.lat, hospital.lng);

  // Form State
  const [patientName, setPatientName] = useState(session.patientName || 'Ramesh Kumar');
  const [patientAge, setPatientAge] = useState<number>(42);
  const [phone] = useState(session.phone || '9876543210');
  const [problemNote, setProblemNote] = useState(stateData?.problemNotePrefill || 'General checkup and consultation');
  const [whatsappConsent, setWhatsappConsent] = useState(true);

  // Confirmed Appointment state
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const handleConfirm = () => {
    if (!stateData) return;

    const appointment = bookAppointment({
      hospitalId: hospital.id,
      doctorId: doctor.id,
      patientName,
      patientAge,
      phone,
      problemNote,
      slotIndex: stateData.slotIndex,
      slotStart: stateData.slotStart,
      slotEnd: stateData.slotEnd,
      date: stateData.date,
      lang: currentLanguage,
      distKm: distanceKm,
      whatsappConsent,
    });

    setConfirmedAppointment(appointment);

    // Generate real QR code
    QRCode.toDataURL(
      JSON.stringify({
        careconnect: true,
        tokenId: appointment.token,
        hospital: hospital.name,
        doctor: doctor.name,
        date: appointment.date,
        time: appointment.slotStart,
        phone: appointment.patient.phone,
      }),
      { width: 200, margin: 1 }
    ).then((url) => {
      setQrCodeUrl(url);
    });
  };

  const handleAddToCalendar = () => {
    if (!confirmedAppointment) return;
    const today = new Date();
    generateIcsCalendar({
      title: `CareConnect OP Token #${confirmedAppointment.token} - Dr. ${doctor.name}`,
      description: `Appointment with Dr. ${doctor.name} (${doctor.specialty}) at ${hospital.name}. Room: ${doctor.roomNumber}. Token: #${confirmedAppointment.token}. Arrive 15 minutes before your turn.`,
      location: `${hospital.name}, ${hospital.address}`,
      startDateTime: today,
      durationMinutes: 20,
    });
  };

  const handleOpenWhatsAppLink = () => {
    if (!confirmedAppointment) return;
    const msg = encodeURIComponent(
      `*CareConnect OP Token Confirmation*\n\n` +
      `Hospital: ${hospital.name}\n` +
      `Doctor: ${doctor.name} (${doctor.specialty})\n` +
      `Room: ${doctor.roomNumber}\n` +
      `Date & Time: ${confirmedAppointment.date}, ${confirmedAppointment.slotStart}\n` +
      `Token Number: #${confirmedAppointment.token}\n\n` +
      `Track Live Queue: ${window.location.origin}/#/queue?appointmentId=${confirmedAppointment.id}`
    );
    window.open(`https://wa.me/91${phone}?text=${msg}`, '_blank');
  };

  // If already confirmed, render success screen with Token, QR, WhatsApp Preview, Calendar
  if (confirmedAppointment) {
    const tmpl = translations[currentLanguage].templates.bookingConfirmed;
    const whatsappMessage = tmpl.whatsapp
      .replace(/{hospital}/g, hospital.name)
      .replace(/{doctor}/g, doctor.name)
      .replace(/{specialty}/g, doctor.specialty)
      .replace(/{date}/g, confirmedAppointment.date)
      .replace(/{time}/g, confirmedAppointment.slotStart)
      .replace(/{token}/g, String(confirmedAppointment.token))
      .replace(/{ahead}/g, '2')
      .replace(/{wait}/g, `10 ${t.common.mins}`)
      .replace(/{arriveBy}/g, confirmedAppointment.slotStart);

    return (
      <div className={`max-w-2xl mx-auto px-4 py-4 pb-24 space-y-5 ${simpleMode ? 'text-lg' : 'text-sm'}`}>
        {/* Success Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg text-center space-y-2">
          <div className="inline-flex p-2 bg-white/20 rounded-full mb-1">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-black text-xl md:text-2xl tracking-tight">
            {t.booking.successTitle}
          </h1>
          <p className="text-xs text-emerald-100 font-medium">
            Your OP token is generated and confirmed in the hospital's live system.
          </p>

          {/* Giant OP Token Badge */}
          <div className="inline-block mt-3 px-6 py-2.5 rounded-2xl bg-white text-teal-900 shadow-md">
            <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Outpatient Consultation</div>
            <div className="text-2xl md:text-3xl font-black tracking-widest">
              TOKEN #{confirmedAppointment.token}
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">Room: {doctor.roomNumber}</div>
          </div>
        </div>

        {/* QR Code & Appointment Details */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-5">
          {qrCodeUrl && (
            <div className="flex flex-col items-center p-3 bg-slate-50 border border-slate-200 rounded-2xl shrink-0">
              <img src={qrCodeUrl} alt="OP QR Code" className="w-36 h-36" />
              <div className="text-[10px] text-slate-500 font-medium text-center mt-1.5 flex items-center gap-1">
                <QrCode className="w-3 h-3" />
                <span>{t.booking.scanQrNotice}</span>
              </div>
            </div>
          )}

          <div className="space-y-1.5 text-xs text-slate-700 w-full">
            <div>
              <span className="text-slate-400 font-medium">Hospital:</span>
              <div className="font-bold text-slate-900 text-sm">{hospital.name}</div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Doctor:</span>
              <div className="font-bold text-slate-900">{doctor.name} ({doctor.specialty})</div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Time Window:</span>
              <div className="font-bold text-teal-700">{confirmedAppointment.slotStart} – {confirmedAppointment.slotEnd}</div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Patient:</span>
              <div className="font-bold text-slate-900">{confirmedAppointment.patient.name} ({confirmedAppointment.patient.phone})</div>
            </div>
          </div>
        </div>

        {/* WhatsApp Phone-Frame Preview */}
        <div className="p-4 rounded-3xl bg-slate-100 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-xs uppercase tracking-wide text-slate-700">
                {t.booking.whatsappPreviewTitle}
              </h3>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              Sent to +91 {phone}
            </span>
          </div>

          {/* WhatsApp message bubble */}
          <div className="p-4 rounded-2xl bg-[#DCF8C6] border border-emerald-200 text-slate-900 text-xs font-sans whitespace-pre-line shadow-xs leading-relaxed">
            {whatsappMessage}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleOpenWhatsAppLink}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t.booking.sendToMyWhatsapp}</span>
            </button>

            <button
              onClick={handleAddToCalendar}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.booking.addToCalendar}</span>
            </button>
          </div>
        </div>

        {/* Bottom CTA to Live Queue */}
        <button
          onClick={() => navigate(`/queue?appointmentId=${confirmedAppointment.id}`)}
          className="w-full py-3.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform"
        >
          <span>{t.booking.trackQueueBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Pre-confirmation Form View
  return (
    <div className={`max-w-xl mx-auto px-4 py-4 pb-24 space-y-5 ${simpleMode ? 'text-lg' : 'text-sm'}`}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.common.back}</span>
      </button>

      <div>
        <h1 className="font-extrabold text-slate-900 text-lg md:text-xl">
          {t.booking.title}
        </h1>
        <p className="text-xs text-slate-500">
          Hospital: {hospital.name} · Dr. {doctor.name}
        </p>
      </div>

      {/* Selected Slot Recap */}
      <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-teal-900">OP Slot Window</div>
          <div className="text-sm font-extrabold text-teal-800">
            {stateData?.windowStr || '10:20 AM – 10:40 AM'} ({stateData?.date})
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-teal-700 font-medium">Consultation Fee</div>
          <div className="text-sm font-bold text-teal-950">
            {doctor.consultationFee === 0 ? 'Free OPD' : `₹${doctor.consultationFee}`}
          </div>
        </div>
      </div>

      {/* Patient Form Fields */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {t.booking.patientName} *
          </label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm outline-none font-medium text-slate-900"
            required
          />
        </div>

        {/* Age and Mobile */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.booking.patientAge} *
            </label>
            <input
              type="number"
              value={patientAge}
              onChange={(e) => setPatientAge(parseInt(e.target.value || '0', 10))}
              min={1}
              max={110}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm outline-none font-medium text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.booking.phoneLabel}
            </label>
            <input
              type="text"
              value={phone}
              readOnly
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm font-mono cursor-not-allowed"
            />
          </div>
        </div>

        {/* Health Issue Summary */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {t.booking.symptomSummary}
          </label>
          <textarea
            value={problemNote}
            onChange={(e) => setProblemNote(e.target.value)}
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 text-sm outline-none resize-none text-slate-900"
          />
        </div>

        {/* WhatsApp Consent Checkbox */}
        <label className="flex items-start gap-2.5 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={whatsappConsent}
            onChange={(e) => setWhatsappConsent(e.target.checked)}
            className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
          />
          <span className="text-xs text-slate-600 leading-snug">
            {t.booking.whatsappConsentLabel}
          </span>
        </label>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        disabled={!patientName.trim()}
        className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm shadow-md transition-all ${
          patientName.trim()
            ? 'bg-teal-600 hover:bg-teal-700 text-white active:scale-98'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        {t.booking.confirmBookingBtn}
      </button>
    </div>
  );
};
