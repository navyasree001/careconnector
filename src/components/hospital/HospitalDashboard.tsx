import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  Clock,
  UserCheck,
  Bell,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Plus,
  AlertCircle,
  Calendar,
  Send,
  UserPlus,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAppStore, minutesToTime, deriveDoctorStatus } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { DoctorStatus, DoctorReason, Doctor } from '../../types';

export const HospitalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    session,
    hospitals,
    doctors,
    queues,
    appointments,
    notifications,
    simMinutes,
    simSpeed,
    setSimSpeed,
    simPaused,
    toggleSimPause,
    advanceSimMinutes,
    resetDemoData,
    hospitalCallNextToken,
    hospitalIssueWalkInToken,
    hospitalSetServingToken,
    hospitalSetDoctorStatus,
    hospitalDelayDoctor,
    hospitalUpdateDoctorSchedule,
    hospitalToggleAutoRun,
    currentLanguage,
  } = useAppStore();

  const t = translations[currentLanguage];
  const hospitalId = session.hospitalId || 'hosp-1';
  const hospital = hospitals.find((h) => h.id === hospitalId) || hospitals[0];

  // Doctors belonging to this hospital only (Strict ownership)
  const myDoctors = doctors.filter((d) => d.hospitalId === hospital.id);

  // Appointments for this hospital
  const myAppointments = appointments.filter((a) => a.hospitalId === hospital.id);

  // Sent alerts for this hospital
  const myNotifications = notifications.filter((n) => n.hospitalId === hospital.id);

  // Summary Tiles calculations
  let totalIssued = 0;
  let totalCompleted = 0;
  let totalWaiting = 0;
  let activeDoctorsCount = 0;

  myDoctors.forEach((doc) => {
    const q = queues[doc.id] || { current: 4, occupied: [], walkIns: [], nextCallAt: '10:20', doctorId: doc.id };
    const status = deriveDoctorStatus(doc, simMinutes, q.occupied.length).status;
    if (status === 'Available') activeDoctorsCount++;

    const occupied = q.occupied || [];
    const walkIns = q.walkIns || [];
    const totalTokens = Array.from(new Set([...occupied, ...walkIns]));

    totalIssued += totalTokens.length + q.current;
    totalCompleted += Math.max(0, q.current - 1);
    totalWaiting += totalTokens.filter((t) => t > q.current).length;
  });

  const [activeTab, setActiveTab] = useState<'queue' | 'doctors' | 'appointments' | 'alerts' | 'demo'>('queue');
  const [expandedTokenBoards, setExpandedTokenBoards] = useState<Record<string, boolean>>({});
  const [selectedServingTokenInput, setSelectedServingTokenInput] = useState<Record<string, number>>({});
  const [statusReasonSelections, setStatusReasonSelections] = useState<Record<string, DoctorReason>>({});
  const [customDelayInput, setCustomDelayInput] = useState<Record<string, number>>({});
  const [toastMessage, setToastMessage] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const toggleTokenBoard = (docId: string) => {
    setExpandedTokenBoards((prev) => ({ ...prev, [docId]: !prev[docId] }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 pb-24 space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center gap-2 border border-teal-500 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Hospital Dashboard Header Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-black text-xl md:text-2xl">{hospital.name}</h1>
            <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded">
              {hospital.type} OPD
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {hospital.locality} · {hospital.opdHours} · Logged in as staff
          </p>
        </div>

        {/* Live Auto-Run Toggle */}
        <div className="flex items-center gap-3 bg-slate-800 p-2.5 rounded-2xl border border-slate-700">
          <div>
            <div className="text-xs font-bold text-white">{t.hospitalPortal.autoRunQueueLabel}</div>
            <div className="text-[10px] text-slate-400">
              {hospital.autoRunQueue ? 'Clock moves tokens automatically' : 'Staff controls token calls manually'}
            </div>
          </div>
          <button
            onClick={() => hospitalToggleAutoRun(hospital.id, !hospital.autoRunQueue)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              hospital.autoRunQueue ? 'bg-teal-500' : 'bg-slate-600'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                hospital.autoRunQueue ? 'left-6.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Summary KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {t.hospitalPortal.summaryTokensToday}
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono tabular-nums">
            {totalIssued}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {t.hospitalPortal.summaryCompleted}
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1 font-mono tabular-nums">
            {totalCompleted}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {t.hospitalPortal.summaryWaiting}
          </div>
          <div className="text-2xl font-black text-teal-700 mt-1 font-mono tabular-nums">
            {totalWaiting}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {t.hospitalPortal.summaryDoctorsAvailable}
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono tabular-nums">
            {activeDoctorsCount} / {myDoctors.length}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {t.hospitalPortal.summaryPatientsNotified}
          </div>
          <div className="text-2xl font-black text-blue-600 mt-1 font-mono tabular-nums">
            {myNotifications.length}
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'queue' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.hospitalPortal.tabLiveQueue}
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'doctors' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.hospitalPortal.tabDoctors}
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'appointments' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.hospitalPortal.tabAppointments} ({myAppointments.length})
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'alerts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.hospitalPortal.tabSentAlerts} ({myNotifications.length})
        </button>

        <button
          onClick={() => setActiveTab('demo')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'demo' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.hospitalPortal.tabDemo}
        </button>
      </div>

      {/* TAB 1: LIVE QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {myDoctors.map((doc) => {
            const q = queues[doc.id] || { current: 4, occupied: [], walkIns: [], nextCallAt: '10:20', doctorId: doc.id };
            const status = deriveDoctorStatus(doc, simMinutes, q.occupied.length);

            const occupied = q.occupied || [];
            const walkIns = q.walkIns || [];
            const allTokens = Array.from(new Set([...occupied, ...walkIns])).sort((a, b) => a - b);
            const waitingCount = allTokens.filter((t) => t > q.current).length;
            const completedCount = Math.max(0, q.current - 1);

            const isExpanded = expandedTokenBoards[doc.id];

            return (
              <div
                key={doc.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
              >
                {/* Doctor Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">{doc.name}</h3>
                      <span className="text-xs font-semibold text-teal-700">Room {doc.roomNumber}</span>
                    </div>
                    <div className="text-xs text-slate-500">{doc.specialty}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        status.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : status.status === 'Busy'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}
                    >
                      {status.status}
                    </span>
                    {doc.runtime.delayMin > 0 && (
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        +{doc.runtime.delayMin}m late
                      </span>
                    )}
                  </div>
                </div>

                {/* Big Token Controls Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  {/* Now Serving Big Badge */}
                  <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-center">
                    <div className="text-xs font-bold uppercase text-teal-700 tracking-wider">
                      NOW SERVING
                    </div>
                    <div className="text-4xl font-black text-teal-900 mt-1 font-mono tabular-nums">
                      #{q.current}
                    </div>
                    <div className="text-[11px] text-teal-800 mt-0.5">
                      Next call ~{q.nextCallAt}
                    </div>
                  </div>

                  {/* Token Counts */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Completed:</span>
                      <span className="font-bold text-emerald-700 font-mono">{completedCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Waiting in queue:</span>
                      <span className="font-bold text-teal-700 font-mono">{waitingCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Issued:</span>
                      <span className="font-bold text-slate-800 font-mono">{allTokens.length}</span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="col-span-1 md:col-span-2 flex flex-wrap gap-2">
                    {/* Call Next Button */}
                    <button
                      onClick={() => {
                        hospitalCallNextToken(hospital.id, doc.id);
                        showToast(`Called next token for Dr. ${doc.name}. Patients notified.`);
                      }}
                      className="flex-1 min-w-[140px] py-3 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.hospitalPortal.completeAndCallNext}</span>
                    </button>

                    {/* Issue Walk-In Token */}
                    <button
                      onClick={() => {
                        const token = hospitalIssueWalkInToken(hospital.id, doc.id);
                        showToast(`Issued Walk-in Token #${token} for Dr. ${doc.name}`);
                      }}
                      className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 flex items-center gap-1.5 transition-colors"
                    >
                      <UserPlus className="w-4 h-4 text-teal-700" />
                      <span>{t.hospitalPortal.issueWalkInToken}</span>
                    </button>

                    {/* Set Serving Token Direct */}
                    <div className="flex items-center gap-1.5 w-full mt-1">
                      <input
                        type="number"
                        placeholder="Token #"
                        value={selectedServingTokenInput[doc.id] || ''}
                        onChange={(e) =>
                          setSelectedServingTokenInput({
                            ...selectedServingTokenInput,
                            [doc.id]: parseInt(e.target.value || '0', 10),
                          })
                        }
                        className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-slate-900"
                      />
                      <button
                        onClick={() => {
                          const val = selectedServingTokenInput[doc.id];
                          if (val) {
                            hospitalSetServingToken(hospital.id, doc.id, val);
                            showToast(`Set serving token to #${val} for Dr. ${doc.name}`);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs"
                      >
                        {t.hospitalPortal.setServingToken}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collapsible Token Board */}
                <div className="pt-2">
                  <button
                    onClick={() => toggleTokenBoard(doc.id)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-teal-700"
                  >
                    <span>{t.hospitalPortal.tokenBoardTitle}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {/* Render tokens 1..20 */}
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((tok) => {
                          const isOccupied = occupied.includes(tok);
                          const isWalkIn = walkIns.includes(tok);
                          const isServing = q.current === tok;
                          const isDone = q.current > tok;

                          let bg = 'bg-white border-slate-200 text-slate-400';
                          let label = 'Free';
                          if (isServing) {
                            bg = 'bg-teal-600 text-white font-black ring-2 ring-teal-300';
                            label = 'Serving';
                          } else if (isDone) {
                            bg = 'bg-slate-200 text-slate-500 line-through';
                            label = 'Completed';
                          } else if (isOccupied) {
                            bg = 'bg-teal-100 text-teal-900 font-bold border-teal-300';
                            label = 'App';
                          } else if (isWalkIn) {
                            bg = 'bg-amber-100 text-amber-900 font-bold border-amber-300';
                            label = 'Walk-in';
                          }

                          return (
                            <div
                              key={tok}
                              className={`px-2.5 py-1.5 rounded-xl border text-center text-xs flex flex-col items-center min-w-[50px] ${bg}`}
                            >
                              <span className="font-mono text-sm font-black">#{tok}</span>
                              <span className="text-[9px] uppercase font-semibold">{label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: DOCTORS & SCHEDULE */}
      {activeTab === 'doctors' && (
        <div className="space-y-4">
          {myDoctors.map((doc) => {
            const affectedCount = myAppointments.filter(
              (a) => a.doctorId === doc.id && a.status === 'booked'
            ).length;

            const selectedReason = statusReasonSelections[doc.id] || 'emergency case';

            return (
              <div
                key={doc.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{doc.name}</h3>
                    <div className="text-xs text-teal-700 font-semibold">{doc.specialty} · Room {doc.roomNumber}</div>
                  </div>
                  <div className="text-xs text-slate-500">
                    <span className="font-bold text-teal-800">{affectedCount}</span> patients currently booked today
                  </div>
                </div>

                {/* 1. Status Actions */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Update Consultation Status & Reason
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Reason Selector */}
                    <select
                      value={selectedReason}
                      onChange={(e) =>
                        setStatusReasonSelections({
                          ...statusReasonSelections,
                          [doc.id]: e.target.value as DoctorReason,
                        })
                      }
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-800 outline-none"
                    >
                      <option value="emergency case">Emergency case</option>
                      <option value="procedure or surgery">Procedure or surgery</option>
                      <option value="ward rounds">Ward rounds</option>
                      <option value="left the hospital">Left the hospital</option>
                      <option value="on leave">On leave</option>
                      <option value="other">Other</option>
                    </select>

                    <button
                      onClick={() => {
                        const { affectedCount } = hospitalSetDoctorStatus(hospital.id, doc.id, 'Available');
                        showToast(`Marked Available. ${affectedCount} patients notified on WhatsApp and in-app!`);
                      }}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      {t.hospitalPortal.markAvailable}
                    </button>

                    <button
                      onClick={() => {
                        const { affectedCount } = hospitalSetDoctorStatus(hospital.id, doc.id, 'Busy', selectedReason);
                        showToast(`Marked Busy (${selectedReason}). ${affectedCount} patients notified!`);
                      }}
                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
                    >
                      {t.hospitalPortal.markBusy}
                    </button>

                    <button
                      onClick={() => {
                        const { affectedCount } = hospitalSetDoctorStatus(hospital.id, doc.id, 'Unavailable', selectedReason);
                        showToast(`Marked Unavailable (${selectedReason}). ${affectedCount} patients redirected to rebook!`);
                      }}
                      className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                    >
                      {t.hospitalPortal.markUnavailable}
                    </button>
                  </div>
                </div>

                {/* 2. Delay Consultation */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {t.hospitalPortal.delayConsultation}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        const { affectedCount } = hospitalDelayDoctor(hospital.id, doc.id, 15);
                        showToast(`Added 15 min delay. ${affectedCount} patients notified!`);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300"
                    >
                      +15 mins
                    </button>

                    <button
                      onClick={() => {
                        const { affectedCount } = hospitalDelayDoctor(hospital.id, doc.id, 30);
                        showToast(`Added 30 min delay. ${affectedCount} patients notified!`);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300"
                    >
                      +30 mins
                    </button>

                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        placeholder="Mins"
                        value={customDelayInput[doc.id] || ''}
                        onChange={(e) =>
                          setCustomDelayInput({
                            ...customDelayInput,
                            [doc.id]: parseInt(e.target.value || '0', 10),
                          })
                        }
                        className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                      />
                      <button
                        onClick={() => {
                          const val = customDelayInput[doc.id];
                          if (val) {
                            const { affectedCount } = hospitalDelayDoctor(hospital.id, doc.id, val);
                            showToast(`Added ${val} min delay. ${affectedCount} patients notified!`);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                      >
                        Apply Delay
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pre-Save Warning */}
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>
                    {t.hospitalPortal.patientsAffectedWarning.replace('{count}', String(affectedCount))}
                  </span>
                  <span className="font-bold text-teal-700">Auto WhatsApp + In-App</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Today's Online Patient Bookings ({myAppointments.length})
          </div>

          {myAppointments.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              No appointments booked online for this hospital yet.
            </div>
          ) : (
            myAppointments.map((app) => {
              const doc = myDoctors.find((d) => d.id === app.doctorId);
              return (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-black text-slate-900">
                        TOKEN #{app.token}
                      </span>
                      <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded">
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="font-bold text-slate-800 text-sm mt-0.5">{app.patient.name}</div>
                    <div className="text-xs text-slate-500 font-mono">+91 {app.patient.phone} · Age: {app.patient.age}</div>
                    <div className="text-xs text-teal-700 font-medium mt-1">Doctor: {doc?.name} ({doc?.specialty})</div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-900">{app.slotStart} – {app.slotEnd}</div>
                    <div className="text-[11px] text-slate-400 font-medium">Lang: {app.lang.toUpperCase()}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 4: SENT ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Log of Dispatched Patient Notifications ({myNotifications.length})
          </div>

          {myNotifications.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              No alerts dispatched yet. Updates trigger automatically when doctor status or tokens change.
            </div>
          ) : (
            myNotifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{notif.title}</span>
                  <span className="text-slate-400 font-mono">{notif.at}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{notif.body}</p>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 text-slate-400">
                  <span>To: +91 {notif.phone}</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    ✓ WhatsApp + In-App
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 5: DEMO */}
      {activeTab === 'demo' && (
        <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-teal-300">
              Simulation Clock & Demo Controller
            </h2>
            <div className="text-xl font-black text-amber-400 font-mono">
              {minutesToTime(simMinutes)}
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            CareConnect runs on a shared deterministic simulation clock starting at 10:15 AM today.
            All tabs share the state via localStorage events.
          </p>

          <div>
            <div className="text-xs text-slate-400 mb-2">Simulation Speed Multiplier:</div>
            <div className="flex gap-2">
              {[1, 10, 30, 60, 120].map((s) => (
                <button
                  key={s}
                  onClick={() => setSimSpeed(s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                    simSpeed === s ? 'bg-teal-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={toggleSimPause}
              className={`flex-1 py-3 rounded-2xl text-xs font-black transition-colors ${
                simPaused ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              {simPaused ? '▶ Resume Simulation' : '⏸ Pause Simulation'}
            </button>

            <button
              onClick={() => advanceSimMinutes(15)}
              className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-black text-xs"
            >
              +15 Minutes ⏩
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset all queues and doctor schedules to initial 10:15 AM state?')) {
                resetDemoData();
                showToast('Demo data reset to initial 10:15 AM state.');
              }
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold"
          >
            Reset All Demo Data
          </button>
        </div>
      )}
    </div>
  );
};
