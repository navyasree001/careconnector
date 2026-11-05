import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Clock, Navigation, AlertCircle, CheckCircle2, User, Building2, Bell, AlertTriangle } from 'lucide-react';
import { useAppStore, calculateQueueMetrics } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { DoctorUnavailableRebookModal } from '../common/DoctorUnavailableRebookModal';

export const LiveQueueView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const appointmentIdParam = searchParams.get('appointmentId');
  const navigate = useNavigate();

  const {
    currentLanguage,
    session,
    appointments,
    doctors,
    hospitals,
    queues,
    simMinutes,
    simpleMode,
  } = useAppStore();

  const t = translations[currentLanguage];
  const [rebookModalOpen, setRebookModalOpen] = useState(false);

  // Find active appointment for current patient
  const userPhone = session.phone;
  const userAppointments = appointments.filter((a) => a.patient.phone === userPhone);

  const activeAppointment = appointmentIdParam
    ? userAppointments.find((a) => a.id === appointmentIdParam) || userAppointments[0]
    : userAppointments.find((a) => a.status === 'booked' || a.status === 'serving') || userAppointments[0];

  if (!activeAppointment) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="font-extrabold text-slate-800 text-lg">No Active OP Queue</h2>
        <p className="text-xs text-slate-500">
          You don't have any booked appointments yet. Book a slot to start live queue tracking.
        </p>
        <button
          onClick={() => navigate('/hospitals')}
          className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700"
        >
          Browse Hospitals & Doctors
        </button>
      </div>
    );
  }

  const doctor = doctors.find((d) => d.id === activeAppointment.doctorId);
  const hospital = hospitals.find((h) => h.id === activeAppointment.hospitalId);
  const queue = (doctor && queues[doctor.id]) || {
    current: 4,
    occupied: [],
    walkIns: [],
    nextCallAt: '10:20',
    doctorId: doctor?.id || '',
  };

  if (!doctor || !hospital) return null;

  const metrics = calculateQueueMetrics({
    doctor,
    queue,
    token: activeAppointment.token,
    currentSimMins: simMinutes,
    patientDistanceKm: activeAppointment.distKm,
  });

  const nowServing = queue.current;
  const yourToken = activeAppointment.token;
  const isServingYou = nowServing === yourToken;
  const isCompleted = nowServing > yourToken;

  // Progress percentage (based on start of day to token)
  const totalInQueue = (queue.occupied || []).length + (queue.walkIns || []).length;
  const queueProgress = Math.min(
    100,
    Math.max(10, Math.round((nowServing / Math.max(yourToken, 1)) * 100))
  );

  // Dynamic status message according to section 4 and 8
  let statusMessage = t.liveQueue.statusRelax;
  let statusBadgeStyle = 'bg-teal-50 text-teal-800 border-teal-200';

  if (doctor.runtime.statusOverride === 'Unavailable') {
    statusMessage = t.liveQueue.statusDoctorUnavailable.replace(
      '{reason}',
      doctor.runtime.reason || 'Left the hospital'
    );
    statusBadgeStyle = 'bg-rose-50 text-rose-800 border-rose-300';
  } else if (doctor.runtime.statusOverride === 'Busy') {
    statusMessage = t.liveQueue.statusDoctorBusy.replace(
      '{reason}',
      doctor.runtime.reason || 'Attending emergency case'
    );
    statusBadgeStyle = 'bg-amber-50 text-amber-800 border-amber-300';
  } else if (doctor.runtime.delayMin > 0) {
    statusMessage = t.liveQueue.statusDelayed.replace(
      '{min}',
      String(doctor.runtime.delayMin)
    );
    statusBadgeStyle = 'bg-amber-50 text-amber-800 border-amber-300';
  } else if (isCompleted) {
    statusMessage = t.liveQueue.statusCompleted;
    statusBadgeStyle = 'bg-slate-100 text-slate-700 border-slate-300';
  } else if (isServingYou) {
    statusMessage = t.liveQueue.statusYourTurn.replace('{room}', doctor.roomNumber);
    statusBadgeStyle = 'bg-emerald-600 text-white border-emerald-600 animate-pulse';
  } else if (metrics.patientsAhead <= 2) {
    statusMessage = t.liveQueue.statusReached;
    statusBadgeStyle = 'bg-teal-100 text-teal-900 border-teal-300';
  } else if (metrics.patientsAhead <= 5) {
    statusMessage = t.liveQueue.statusStartNow;
    statusBadgeStyle = 'bg-amber-50 text-amber-900 border-amber-200';
  }

  return (
    <div className={`max-w-2xl mx-auto px-4 py-4 pb-24 space-y-4 ${simpleMode ? 'text-lg' : 'text-sm'}`}>
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-extrabold text-slate-900 text-lg md:text-xl">
            {t.liveQueue.title}
          </h1>
          <p className="text-xs text-slate-500">
            {hospital.name} · Room {doctor.roomNumber}
          </p>
        </div>
        <button
          onClick={() => navigate('/alerts')}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
          title="View sent WhatsApp & In-App alerts"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>

      {/* Doctor Status Banner (if busy or unavailable) */}
      {doctor.runtime.statusOverride === 'Unavailable' && (
        <div className="p-4 rounded-2xl bg-rose-600 text-white shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-6 h-6 text-white shrink-0 animate-bounce" />
            <div>
              <div className="font-extrabold text-sm">Doctor Unavailable</div>
              <div className="text-xs text-rose-100">
                Dr. {doctor.name} is currently out ({doctor.runtime.reason || 'Hospital duty'})
              </div>
            </div>
          </div>
          <button
            onClick={() => setRebookModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-white text-rose-700 font-extrabold text-xs shadow-xs active:scale-95 transition-transform"
          >
            {t.liveQueue.rebookBtn}
          </button>
        </div>
      )}

      {doctor.runtime.statusOverride === 'Busy' && (
        <div className="p-3.5 rounded-2xl bg-amber-500 text-white shadow-sm flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-white shrink-0" />
          <div className="text-xs font-semibold">
            Doctor is temporarily attending to: {doctor.runtime.reason || 'Emergency procedure'}. Queue is paused, your slot is safe.
          </div>
        </div>
      )}

      {/* Big Live OP Dashboard Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        {/* Token numbers row */}
        <div className="grid grid-cols-2 gap-4 text-center">
          {/* Now Serving */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.liveQueue.nowServing}
            </div>
            <div className="text-4xl md:text-5xl font-black text-slate-900 mt-1 font-mono tabular-nums">
              #{nowServing}
            </div>
            <div className="text-[11px] text-teal-700 font-semibold mt-1">In Room {doctor.roomNumber}</div>
          </div>

          {/* Your Token */}
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
            <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              {t.liveQueue.yourToken}
            </div>
            <div className="text-4xl md:text-5xl font-black text-teal-900 mt-1 font-mono tabular-nums">
              #{yourToken}
            </div>
            <div className="text-[11px] text-teal-800 font-semibold mt-1">{activeAppointment.patient.name}</div>
          </div>
        </div>

        {/* Dynamic Status Callout Bubble */}
        <div className={`p-4 rounded-2xl border text-center font-bold text-xs md:text-sm leading-relaxed ${statusBadgeStyle}`}>
          {statusMessage}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Queue Progress</span>
            <span className="font-mono">{metrics.patientsAhead} patients ahead</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isCompleted
                  ? 'bg-slate-400'
                  : isServingYou
                  ? 'bg-emerald-500'
                  : 'bg-teal-600'
              }`}
              style={{ width: `${queueProgress}%` }}
            />
          </div>
        </div>

        {/* Forward Simulated Timing Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-400 uppercase font-bold">{t.liveQueue.patientsAhead}</div>
            <div className="text-base font-extrabold text-slate-900 mt-0.5 font-mono tabular-nums">
              {metrics.patientsAhead}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-400 uppercase font-bold">{t.liveQueue.estimatedWait}</div>
            <div className="text-base font-extrabold text-teal-700 mt-0.5 font-mono tabular-nums">
              ~{metrics.estimatedWaitMins} {t.common.mins}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-400 uppercase font-bold">{t.liveQueue.arriveBy}</div>
            <div className="text-base font-extrabold text-slate-900 mt-0.5 font-mono tabular-nums">
              {metrics.arriveByTime}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-400 uppercase font-bold">{t.liveQueue.leaveHomeBy}</div>
            <div className="text-base font-extrabold text-teal-800 mt-0.5 font-mono tabular-nums">
              {metrics.leaveByTime}
            </div>
          </div>
        </div>
      </div>

      {/* Doctor & Location Info Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between text-xs text-slate-700">
        <div>
          <div className="font-bold text-slate-900 text-sm">{doctor.name}</div>
          <div className="text-slate-500">{doctor.specialty} · {hospital.name}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Average consult time: ~{doctor.avgConsultMinutes} mins / patient</div>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${hospital.name} ${hospital.address}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-teal-800 font-bold flex items-center gap-1 shrink-0"
        >
          <Navigation className="w-4 h-4" />
          <span>Maps</span>
        </a>
      </div>

      {/* Rebook Modal (for doctor unavailable scenario) */}
      <DoctorUnavailableRebookModal
        isOpen={rebookModalOpen}
        appointmentId={activeAppointment.id}
        onClose={() => setRebookModalOpen(false)}
      />
    </div>
  );
};
