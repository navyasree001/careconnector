import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Hospital,
  Doctor,
  QueueState,
  Appointment,
  NotificationItem,
  HospitalAccount,
  SessionState,
  Language,
  UserLocation,
  DoctorStatus,
  DoctorReason,
} from '../types';
import {
  SEED_HOSPITALS,
  SEED_DOCTORS,
  INITIAL_QUEUES,
  INITIAL_HOSPITAL_ACCOUNTS,
  INITIAL_SIM_TIME,
  DEMO_PATIENT,
} from '../data/seedData';
import { DEFAULT_VIZAG_LOCATION, estimateTravelTimeMinutes } from '../utils/geo';
import { translations } from '../i18n/translations';
import { playNotificationChime, triggerHapticVibration } from '../utils/audio';

// Helper: parse HH:MM to minutes since midnight
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  // Handle formats like "10:15", "10:15 AM", "10:15:00"
  const clean = timeStr.trim();
  const isPM = /pm/i.test(clean);
  const isAM = /am/i.test(clean);
  const parts = clean.replace(/[^\d:]/g, '').split(':');
  let h = parseInt(parts[0] || '0', 10);
  const m = parseInt(parts[1] || '0', 10);
  if (isPM && h < 12) h += 12;
  if (isAM && h === 12) h = 0;
  return h * 60 + m;
}

// Helper: convert minutes since midnight to "HH:MM AM/PM"
export function minutesToTime(totalMins: number): string {
  const norm = ((totalMins % 1440) + 1440) % 1440;
  const h24 = Math.floor(norm / 60);
  const m = norm % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 || 12;
  const padM = m < 10 ? '0' + m : '' + m;
  return `${h12}:${padM} ${period}`;
}

// Helper: 24h format "HH:MM"
export function minutesTo24(totalMins: number): string {
  const norm = ((totalMins % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
}

// Today's date string YYYY-MM-DD
export function getTodayDateString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// Derive effective doctor status at current simulated minute
export function deriveDoctorStatus(doc: Doctor, currentMins: number, queueLen: number): {
  status: DoctorStatus;
  reason?: string;
} {
  // If runtime override exists, override wins
  if (doc.runtime.statusOverride) {
    return {
      status: doc.runtime.statusOverride,
      reason: doc.runtime.reason,
    };
  }

  const arrivalMins = timeToMinutes(doc.runtime.arrivalOverride || doc.defaultSchedule.arrival);
  const startMins = timeToMinutes(doc.defaultSchedule.start) + doc.runtime.delayMin;
  const depMins = timeToMinutes(doc.runtime.departureOverride || doc.defaultSchedule.departure);

  if (currentMins < arrivalMins) {
    return { status: 'Unavailable', reason: 'Not yet arrived at hospital' };
  }
  if (currentMins >= depMins) {
    return { status: 'Unavailable', reason: 'Shift completed for today' };
  }
  if (currentMins < startMins) {
    return { status: 'Busy', reason: 'Preparing for consultation' };
  }

  // If 5+ patients waiting, mark busy
  if (queueLen >= 5) {
    return { status: 'Busy', reason: 'High patient load' };
  }

  return { status: 'Available' };
}

// Calculate token queue simulation
export function calculateQueueMetrics(params: {
  doctor: Doctor;
  queue: QueueState;
  token: number;
  currentSimMins: number;
  patientDistanceKm: number;
}): {
  patientsAhead: number;
  estimatedWaitMins: number;
  expectedCallMins: number;
  expectedCallTime: string;
  arriveByTime: string;
  leaveByTime: string;
  isPaused: boolean;
  pauseReason?: string;
} {
  const { doctor, queue, token, currentSimMins, patientDistanceKm } = params;

  const currentServing = queue.current;
  const isPaused = doctor.runtime.statusOverride === 'Busy' || doctor.runtime.statusOverride === 'Unavailable';
  const pauseReason = doctor.runtime.reason;

  // Booked tokens strictly between current serving and user token
  const occupiedTokens = (queue.occupied || []).filter(t => t < token && t > currentServing);
  const walkInsAhead = (queue.walkIns || []).filter(t => t < token && t > currentServing);
  const totalAhead = occupiedTokens.length + walkInsAhead.length;

  // Forward simulation: each token takes avgConsultMinutes
  const avg = doctor.avgConsultMinutes || 5;
  const estimatedWaitMins = Math.max(0, totalAhead * avg);

  // Expected call time = current sim time + wait time + delay
  const expectedCallMins = currentSimMins + estimatedWaitMins;
  const expectedCallTime = minutesToTime(expectedCallMins);

  // Arrive 15 minutes before call time
  const arriveByMins = Math.max(currentSimMins, expectedCallMins - 15);
  const arriveByTime = minutesToTime(arriveByMins);

  // Leave home = arriveBy - travel time (~3 min/km, min 5)
  const travelMins = estimateTravelTimeMinutes(patientDistanceKm);
  const leaveByMins = Math.max(currentSimMins, arriveByMins - travelMins);
  const leaveByTime = minutesToTime(leaveByMins);

  return {
    patientsAhead: totalAhead,
    estimatedWaitMins,
    expectedCallMins,
    expectedCallTime,
    arriveByTime,
    leaveByTime,
    isPaused,
    pauseReason,
  };
}

// Persistent Store Interface
interface SharedWorldState {
  hospitals: Hospital[];
  doctors: Doctor[];
  queues: Record<string, QueueState>;
  appointments: Appointment[];
  notifications: NotificationItem[];
  hospitalAccounts: HospitalAccount[];
  simMinutes: number; // minutes since midnight (default 10:15 = 615)
  simSpeed: number; // 1, 10, 30 (default), 60, 120
  simPaused: boolean;
  activeToast: { title: string; body: string } | null;
}

interface AppStore extends SharedWorldState {
  // Session (Per-Tab state initialized from sessionStorage)
  session: SessionState;
  currentLanguage: Language;
  userLocation: UserLocation;
  simpleMode: boolean;

  // Actions
  setSession: (session: SessionState) => void;
  setLanguage: (lang: Language) => void;
  setUserLocation: (loc: UserLocation) => void;
  setSimpleMode: (enabled: boolean) => void;
  dismissToast: () => void;

  // Simulation controls
  setSimSpeed: (speed: number) => void;
  toggleSimPause: () => void;
  advanceSimMinutes: (mins: number) => void;
  resetDemoData: () => void;
  tickSimClock: () => void;

  // Patient Actions
  bookAppointment: (params: {
    hospitalId: string;
    doctorId: string;
    patientName: string;
    patientAge: number;
    phone: string;
    problemNote: string;
    slotIndex: number;
    slotStart: string;
    slotEnd: string;
    date: string;
    lang: Language;
    distKm: number;
    whatsappConsent: boolean;
  }) => Appointment;
  cancelAppointment: (appointmentId: string) => void;
  rebookToAlternativeDoctor: (appointmentId: string, newDoctorId: string, newHospitalId: string, slotIndex: number, slotStart: string, slotEnd: string) => Appointment | null;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (phone: string) => void;

  // Hospital Actions (Strict hospitalId ownership enforced)
  hospitalCallNextToken: (hospitalId: string, doctorId: string) => void;
  hospitalIssueWalkInToken: (hospitalId: string, doctorId: string) => number;
  hospitalSetServingToken: (hospitalId: string, doctorId: string, token: number) => void;
  hospitalSetDoctorStatus: (hospitalId: string, doctorId: string, status?: DoctorStatus, reason?: DoctorReason | string) => { affectedCount: number };
  hospitalDelayDoctor: (hospitalId: string, doctorId: string, extraMinutes: number) => { affectedCount: number };
  hospitalUpdateDoctorSchedule: (hospitalId: string, doctorId: string, arrival?: string, start?: string, departure?: string) => { affectedCount: number };
  hospitalToggleAutoRun: (hospitalId: string, enabled: boolean) => void;
  registerHospitalAccount: (account: HospitalAccount) => boolean;
}

// Per-tab session storage helpers (safe try/catch)
function getTabSession(): SessionState {
  try {
    const raw = sessionStorage.getItem('careconnect_session');
    if (raw) return JSON.parse(raw);
  } catch {}
  return { type: 'none' };
}

function saveTabSession(session: SessionState) {
  try {
    sessionStorage.setItem('careconnect_session', JSON.stringify(session));
  } catch {}
}

function getTabLanguage(): Language {
  try {
    const l = sessionStorage.getItem('careconnect_lang') as Language;
    if (l === 'en' || l === 'te' || l === 'hi') return l;
  } catch {}
  return 'en';
}

function saveTabLanguage(l: Language) {
  try {
    sessionStorage.setItem('careconnect_lang', l);
  } catch {}
}

function getTabLocation(): UserLocation {
  try {
    const raw = sessionStorage.getItem('careconnect_location');
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_VIZAG_LOCATION;
}

function saveTabLocation(loc: UserLocation) {
  try {
    sessionStorage.setItem('careconnect_location', JSON.stringify(loc));
  } catch {}
}

function getTabSimpleMode(): boolean {
  try {
    return sessionStorage.getItem('careconnect_simple_mode') === 'true';
  } catch {}
  return false;
}

function saveTabSimpleMode(val: boolean) {
  try {
    sessionStorage.setItem('careconnect_simple_mode', val ? 'true' : 'false');
  } catch {}
}

// Generate notification item helper
function createNotification(params: {
  kind: NotificationItem['kind'];
  appointment: Appointment;
  doctor: Doctor;
  hospital: Hospital;
  nowMins: number;
  extra?: any;
}): NotificationItem {
  const { kind, appointment, doctor, hospital, nowMins, extra } = params;
  const lang = appointment.lang || 'en';
  const t = translations[lang].templates;

  const wait = `${extra?.waitMins || 15} ${translations[lang].common.mins}`;
  const arriveBy = extra?.arriveBy || minutesToTime(nowMins + 10);
  const room = doctor.roomNumber;
  const token = appointment.token;
  const delay = extra?.delayMin || doctor.runtime.delayMin || 15;
  const reason = extra?.reason || doctor.runtime.reason || 'Hospital operational update';

  let tmpl = t.bookingConfirmed;
  switch (kind) {
    case 'booked': tmpl = t.bookingConfirmed; break;
    case 'doc_arrival_expected': tmpl = t.doctorArrivalExpected; break;
    case 'doc_arrived': tmpl = t.doctorArrived; break;
    case 'reminder_60m': tmpl = t.reminder60m; break;
    case 'ahead_5': tmpl = t.ahead5; break;
    case 'start_now': tmpl = t.startNow; break;
    case 'turn_approaching': tmpl = t.turnApproaching; break;
    case 'now_serving': tmpl = t.nowServing; break;
    case 'completed': tmpl = t.completed; break;
    case 'doc_delayed': tmpl = t.docDelayed; break;
    case 'doc_busy': tmpl = t.docBusy; break;
    case 'doc_unavailable': tmpl = t.docUnavailable; break;
    case 'doc_available': tmpl = t.docAvailable; break;
  }

  const fill = (text: string) => {
    return text
      .replace(/{hospital}/g, hospital.name)
      .replace(/{doctor}/g, doctor.name)
      .replace(/{specialty}/g, doctor.specialty)
      .replace(/{date}/g, appointment.date)
      .replace(/{time}/g, appointment.slotStart)
      .replace(/{token}/g, String(token))
      .replace(/{ahead}/g, String(extra?.ahead ?? 3))
      .replace(/{wait}/g, wait)
      .replace(/{arriveBy}/g, arriveBy)
      .replace(/{room}/g, room)
      .replace(/{delay}/g, String(delay))
      .replace(/{reason}/g, reason)
      .replace(/{link}/g, window?.location ? `${window.location.origin}/#/rebook` : '/#/rebook');
  };

  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    kind,
    appointmentId: appointment.id,
    phone: appointment.patient.phone,
    hospitalId: hospital.id,
    title: fill(tmpl.title),
    body: fill(tmpl.body),
    whatsapp: fill(tmpl.whatsapp),
    at: minutesToTime(nowMins),
    read: false,
    link: kind === 'doc_unavailable' ? '/rebook' : `/queue?appointmentId=${appointment.id}`,
  };
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Shared World Initial State
      hospitals: SEED_HOSPITALS,
      doctors: SEED_DOCTORS,
      queues: INITIAL_QUEUES,
      appointments: [],
      notifications: [],
      hospitalAccounts: INITIAL_HOSPITAL_ACCOUNTS,
      simMinutes: timeToMinutes(INITIAL_SIM_TIME), // 615 = 10:15 AM
      simSpeed: 30, // Default 30x
      simPaused: false,
      activeToast: null,

      // Per-Tab session state
      session: getTabSession(),
      currentLanguage: getTabLanguage(),
      userLocation: getTabLocation(),
      simpleMode: getTabSimpleMode(),

      // Session & Preferences
      setSession: (session) => {
        saveTabSession(session);
        set({ session });
      },
      setLanguage: (lang) => {
        saveTabLanguage(lang);
        set({ currentLanguage: lang });
      },
      setUserLocation: (loc) => {
        saveTabLocation(loc);
        set({ userLocation: loc });
      },
      setSimpleMode: (simpleMode) => {
        saveTabSimpleMode(simpleMode);
        set({ simpleMode });
      },
      dismissToast: () => set({ activeToast: null }),

      // Simulation clock actions
      setSimSpeed: (simSpeed) => set({ simSpeed }),
      toggleSimPause: () => set((s) => ({ simPaused: !s.simPaused })),
      advanceSimMinutes: (mins) => {
        const next = get().simMinutes + mins;
        set({ simMinutes: next });
        get().tickSimClock();
      },
      resetDemoData: () => {
        set({
          hospitals: SEED_HOSPITALS,
          doctors: SEED_DOCTORS,
          queues: INITIAL_QUEUES,
          appointments: [],
          notifications: [],
          hospitalAccounts: INITIAL_HOSPITAL_ACCOUNTS,
          simMinutes: timeToMinutes(INITIAL_SIM_TIME),
          simSpeed: 30,
          simPaused: false,
          activeToast: {
            title: 'Demo Data Reset',
            body: 'Reset to 10:15 AM with 9 Vizag hospitals and fresh OP queues.',
          },
        });
      },

      // Tick simulation clock and evaluate queued triggers
      tickSimClock: () => {
        const state = get();
        const nowMins = state.simMinutes;
        const newNotifications: NotificationItem[] = [];
        let updatedAppointments = [...state.appointments];
        let queuesUpdated = { ...state.queues };

        // 1. Check auto-run queues
        state.hospitals.forEach((hosp) => {
          if (!hosp.autoRunQueue) return;
          const hospDocs = state.doctors.filter((d) => d.hospitalId === hosp.id);
          hospDocs.forEach((doc) => {
            const q = queuesUpdated[doc.id];
            if (!q) return;
            // Check if next call time is reached
            const nextCallMins = timeToMinutes(q.nextCallAt);
            if (nowMins >= nextCallMins && q.current > 0) {
              // Advance queue token
              const nextServing = q.current + 1;
              const nextCallTime = minutesTo24(nowMins + (doc.avgConsultMinutes || 5));
              queuesUpdated[doc.id] = {
                ...q,
                current: nextServing,
                nextCallAt: nextCallTime,
                lastCompletedAt: minutesTo24(nowMins),
              };
            }
          });
        });

        // 2. Evaluate time-based appointment triggers
        updatedAppointments = updatedAppointments.map((app) => {
          if (app.status === 'cancelled' || app.status === 'completed') return app;

          const doc = state.doctors.find((d) => d.id === app.doctorId);
          const hosp = state.hospitals.find((h) => h.id === app.hospitalId);
          const q = queuesUpdated[app.doctorId];
          if (!doc || !hosp || !q) return app;

          const sent = new Set(app.sent || []);
          const slotMins = timeToMinutes(app.slotStart);
          const arrivalMins = timeToMinutes(doc.runtime.arrivalOverride || doc.defaultSchedule.arrival);
          const startMins = timeToMinutes(doc.defaultSchedule.start) + doc.runtime.delayMin;

          const metrics = calculateQueueMetrics({
            doctor: doc,
            queue: q,
            token: app.token,
            currentSimMins: nowMins,
            patientDistanceKm: app.distKm,
          });

          // Check if now serving this token
          if (q.current === app.token && !sent.has('now_serving')) {
            sent.add('now_serving');
            const notif = createNotification({
              kind: 'now_serving',
              appointment: app,
              doctor: doc,
              hospital: hosp,
              nowMins,
              extra: { arriveBy: metrics.arriveByTime, waitMins: metrics.estimatedWaitMins },
            });
            newNotifications.push(notif);
            return { ...app, status: 'serving', sent: Array.from(sent) };
          }

          // Check if completed (current passed token)
          if (q.current > app.token && !sent.has('completed')) {
            sent.add('completed');
            const notif = createNotification({
              kind: 'completed',
              appointment: app,
              doctor: doc,
              hospital: hosp,
              nowMins,
            });
            newNotifications.push(notif);
            return { ...app, status: 'completed', sent: Array.from(sent) };
          }

          // doc_arrival_expected (15 min before arrival)
          if (nowMins >= arrivalMins - 15 && nowMins < arrivalMins && !sent.has('doc_arrival_expected')) {
            sent.add('doc_arrival_expected');
            newNotifications.push(
              createNotification({
                kind: 'doc_arrival_expected',
                appointment: app,
                doctor: doc,
                hospital: hosp,
                nowMins,
              })
            );
          }

          // doc_arrived
          if (nowMins >= arrivalMins && nowMins < startMins && !sent.has('doc_arrived')) {
            sent.add('doc_arrived');
            newNotifications.push(
              createNotification({
                kind: 'doc_arrived',
                appointment: app,
                doctor: doc,
                hospital: hosp,
                nowMins,
              })
            );
          }

          // reminder_60m
          if (nowMins >= slotMins - 60 && nowMins < slotMins - 40 && !sent.has('reminder_60m')) {
            sent.add('reminder_60m');
            newNotifications.push(
              createNotification({
                kind: 'reminder_60m',
                appointment: app,
                doctor: doc,
                hospital: hosp,
                nowMins,
                extra: { arriveBy: metrics.arriveByTime, waitMins: metrics.estimatedWaitMins },
              })
            );
          }

          // ahead_5 (<= 5 patients ahead)
          if (metrics.patientsAhead <= 5 && metrics.patientsAhead > 2 && !sent.has('ahead_5')) {
            sent.add('ahead_5');
            newNotifications.push(
              createNotification({
                kind: 'ahead_5',
                appointment: app,
                doctor: doc,
                hospital: hosp,
                nowMins,
                extra: { ahead: metrics.patientsAhead, waitMins: metrics.estimatedWaitMins },
              })
            );
          }

          // start_now: when now >= callTime - 15 - travelTime
          const travelTime = estimateTravelTimeMinutes(app.distKm);
          const startNowThreshold = metrics.expectedCallMins - 15 - travelTime;
          if (nowMins >= startNowThreshold && q.current < app.token && !sent.has('start_now')) {
            sent.add('start_now');
            newNotifications.push(
              createNotification({
                kind: 'start_now',
                appointment: app,
                doctor: doc,
                hospital: hosp,
                nowMins,
                extra: { arriveBy: metrics.arriveByTime },
              })
            );
          }

          // turn_approaching (<= 2 ahead and <= 15 min away)
          if (metrics.patientsAhead <= 2 && metrics.patientsAhead > 0 && !sent.has('turn_approaching')) {
            sent.add('turn_approaching');
            newNotifications.push(
              createNotification({
                kind: 'turn_approaching',
                appointment: app,
                doctor: doc,
                hospital: hosp,
                nowMins,
                extra: { room: doc.roomNumber },
              })
            );
          }

          return { ...app, sent: Array.from(sent) };
        });

        if (newNotifications.length > 0) {
          playNotificationChime();
          triggerHapticVibration();
          // Toast for the current user's phone if relevant
          const userPhone = state.session.phone;
          const userNotif = newNotifications.find((n) => n.phone === userPhone);
          set({
            appointments: updatedAppointments,
            queues: queuesUpdated,
            notifications: [...newNotifications, ...state.notifications],
            activeToast: userNotif ? { title: userNotif.title, body: userNotif.body } : state.activeToast,
          });
        } else {
          set({
            appointments: updatedAppointments,
            queues: queuesUpdated,
          });
        }
      },

      // Patient: Book appointment
      bookAppointment: (params) => {
        const state = get();
        const doc = state.doctors.find((d) => d.id === params.doctorId);
        const hosp = state.hospitals.find((h) => h.id === params.hospitalId);
        const q = state.queues[params.doctorId] || {
          doctorId: params.doctorId,
          occupied: [],
          walkIns: [],
          current: 4,
          nextCallAt: '10:20',
        };

        // Determine token number in this slot
        // Slots are 20-min blocks; slot capacity = 20 / avgConsultMinutes (e.g. 4)
        const avg = doc?.avgConsultMinutes || 5;
        const capacity = Math.max(1, Math.floor(20 / avg));
        const slotBaseToken = 10 + params.slotIndex * capacity;

        // Find smallest free token in slot
        const usedTokens = new Set([...q.occupied, ...q.walkIns]);
        let assignedToken = slotBaseToken;
        for (let i = 0; i < capacity; i++) {
          if (!usedTokens.has(slotBaseToken + i)) {
            assignedToken = slotBaseToken + i;
            break;
          }
        }

        const appointmentId = `apt-${Date.now()}`;
        const newAppointment: Appointment = {
          id: appointmentId,
          token: assignedToken,
          patient: {
            name: params.patientName,
            age: params.patientAge,
            phone: params.phone,
            problemNote: params.problemNote,
            whatsappConsent: params.whatsappConsent,
          },
          lang: params.lang,
          distKm: params.distKm,
          hospitalId: params.hospitalId,
          doctorId: params.doctorId,
          date: params.date,
          slotIndex: params.slotIndex,
          slotStart: params.slotStart,
          slotEnd: params.slotEnd,
          status: 'booked',
          sent: ['booked'],
          createdAt: new Date().toISOString(),
        };

        // Update queue occupied list
        const updatedQueue: QueueState = {
          ...q,
          occupied: Array.from(new Set([...q.occupied, assignedToken])).sort((a, b) => a - b),
        };

        // Create booking confirmation notification
        if (doc && hosp) {
          const metrics = calculateQueueMetrics({
            doctor: doc,
            queue: updatedQueue,
            token: assignedToken,
            currentSimMins: state.simMinutes,
            patientDistanceKm: params.distKm,
          });

          const notif = createNotification({
            kind: 'booked',
            appointment: newAppointment,
            doctor: doc,
            hospital: hosp,
            nowMins: state.simMinutes,
            extra: {
              ahead: metrics.patientsAhead,
              waitMins: metrics.estimatedWaitMins,
              arriveBy: metrics.arriveByTime,
            },
          });

          playNotificationChime();
          triggerHapticVibration();

          set({
            appointments: [newAppointment, ...state.appointments],
            queues: { ...state.queues, [params.doctorId]: updatedQueue },
            notifications: [notif, ...state.notifications],
            activeToast: { title: notif.title, body: notif.body },
          });
        } else {
          set({
            appointments: [newAppointment, ...state.appointments],
            queues: { ...state.queues, [params.doctorId]: updatedQueue },
          });
        }

        return newAppointment;
      },

      // Patient: Cancel appointment
      cancelAppointment: (appointmentId) => {
        const state = get();
        const app = state.appointments.find((a) => a.id === appointmentId);
        if (!app) return;

        // Release token from queue
        const q = state.queues[app.doctorId];
        const updatedQueues = { ...state.queues };
        if (q) {
          updatedQueues[app.doctorId] = {
            ...q,
            occupied: q.occupied.filter((t) => t !== app.token),
          };
        }

        set({
          appointments: state.appointments.map((a) =>
            a.id === appointmentId ? { ...a, status: 'cancelled' } : a
          ),
          queues: updatedQueues,
        });
      },

      // Patient: Rebook to alternative doctor (e.g. when original doctor is unavailable)
      rebookToAlternativeDoctor: (appointmentId, newDoctorId, newHospitalId, slotIndex, slotStart, slotEnd) => {
        const state = get();
        const oldApp = state.appointments.find((a) => a.id === appointmentId);
        if (!oldApp) return null;

        const newDoc = state.doctors.find((d) => d.id === newDoctorId);
        const newHosp = state.hospitals.find((h) => h.id === newHospitalId);
        if (!newDoc || !newHosp) return null;

        // 1. Release old token from old doctor's queue (without sending cancellation message, as requested)
        const oldQ = state.queues[oldApp.doctorId];
        const updatedQueues = { ...state.queues };
        if (oldQ) {
          updatedQueues[oldApp.doctorId] = {
            ...oldQ,
            occupied: oldQ.occupied.filter((t) => t !== oldApp.token),
          };
        }

        // 2. Assign token in new doctor's queue
        const newQ = updatedQueues[newDoctorId] || {
          doctorId: newDoctorId,
          occupied: [],
          walkIns: [],
          current: 4,
          nextCallAt: '10:20',
        };
        const avg = newDoc.avgConsultMinutes || 5;
        const capacity = Math.max(1, Math.floor(20 / avg));
        const slotBaseToken = 10 + slotIndex * capacity;
        const usedTokens = new Set([...newQ.occupied, ...newQ.walkIns]);
        let assignedToken = slotBaseToken;
        for (let i = 0; i < capacity; i++) {
          if (!usedTokens.has(slotBaseToken + i)) {
            assignedToken = slotBaseToken + i;
            break;
          }
        }

        updatedQueues[newDoctorId] = {
          ...newQ,
          occupied: Array.from(new Set([...newQ.occupied, assignedToken])).sort((a, b) => a - b),
        };

        const updatedApp: Appointment = {
          ...oldApp,
          hospitalId: newHospitalId,
          doctorId: newDoctorId,
          slotIndex,
          slotStart,
          slotEnd,
          token: assignedToken,
          status: 'booked',
          sent: ['booked'], // reset sent triggers for new doctor
        };

        // Notify patient of new confirmed appointment
        const notif = createNotification({
          kind: 'booked',
          appointment: updatedApp,
          doctor: newDoc,
          hospital: newHosp,
          nowMins: state.simMinutes,
          extra: { ahead: 2, waitMins: 10, arriveBy: minutesToTime(state.simMinutes + 15) },
        });

        playNotificationChime();
        triggerHapticVibration();

        set({
          appointments: state.appointments.map((a) => (a.id === appointmentId ? updatedApp : a)),
          queues: updatedQueues,
          notifications: [notif, ...state.notifications],
          activeToast: { title: notif.title, body: notif.body },
        });

        return updatedApp;
      },

      markNotificationRead: (id) => {
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }));
      },

      markAllNotificationsRead: (phone) => {
        set((s) => ({
          notifications: s.notifications.map((n) => (n.phone === phone ? { ...n, read: true } : n)),
        }));
      },

      // Hospital Portal Action: Call Next Token
      hospitalCallNextToken: (hospitalId, doctorId) => {
        const state = get();
        const doc = state.doctors.find((d) => d.id === doctorId);
        // Ownership check
        if (!doc || doc.hospitalId !== hospitalId) return;

        const q = state.queues[doctorId] || {
          doctorId,
          occupied: [],
          walkIns: [],
          current: 4,
          nextCallAt: '10:20',
        };
        const nextServing = q.current + 1;
        const nextCallAt = minutesTo24(state.simMinutes + (doc.avgConsultMinutes || 5));

        const updatedQueue: QueueState = {
          ...q,
          current: nextServing,
          nextCallAt,
          lastCompletedAt: minutesTo24(state.simMinutes),
        };

        set({
          queues: { ...state.queues, [doctorId]: updatedQueue },
        });

        // Trigger queue notification recalculation
        get().tickSimClock();
      },

      // Hospital Portal Action: Issue Walk-In Token
      hospitalIssueWalkInToken: (hospitalId, doctorId) => {
        const state = get();
        const doc = state.doctors.find((d) => d.id === doctorId);
        if (!doc || doc.hospitalId !== hospitalId) return 0;

        const q = state.queues[doctorId] || {
          doctorId,
          occupied: [],
          walkIns: [],
          current: 4,
          nextCallAt: '10:20',
        };

        // Find next free token number
        const usedTokens = new Set([...q.occupied, ...q.walkIns]);
        let nextWalkIn = Math.max(q.current + 1, 1);
        while (usedTokens.has(nextWalkIn)) {
          nextWalkIn++;
        }

        const updatedQueue: QueueState = {
          ...q,
          walkIns: [...q.walkIns, nextWalkIn].sort((a, b) => a - b),
        };

        set({
          queues: { ...state.queues, [doctorId]: updatedQueue },
        });

        return nextWalkIn;
      },

      // Hospital Portal Action: Set Serving Token
      hospitalSetServingToken: (hospitalId, doctorId, token) => {
        const state = get();
        const doc = state.doctors.find((d) => d.id === doctorId);
        if (!doc || doc.hospitalId !== hospitalId) return;

        const q = state.queues[doctorId] || {
          doctorId,
          occupied: [],
          walkIns: [],
          current: token,
          nextCallAt: '10:20',
        };

        const updatedQueue: QueueState = {
          ...q,
          current: token,
          lastCompletedAt: minutesTo24(state.simMinutes),
        };

        set({
          queues: { ...state.queues, [doctorId]: updatedQueue },
        });

        get().tickSimClock();
      },

      // Hospital Portal Action: Set Doctor Status Override & Reason
      hospitalSetDoctorStatus: (hospitalId, doctorId, status, reason) => {
        const state = get();
        const doc = state.doctors.find((d) => d.id === doctorId);
        if (!doc || doc.hospitalId !== hospitalId) return { affectedCount: 0 };
        const hosp = state.hospitals.find((h) => h.id === hospitalId);
        if (!hosp) return { affectedCount: 0 };

        const updatedDoctors = state.doctors.map((d) => {
          if (d.id === doctorId) {
            return {
              ...d,
              runtime: {
                ...d.runtime,
                statusOverride: status,
                reason: reason ? String(reason) : undefined,
                updatedAt: new Date().toISOString(),
              },
            };
          }
          return d;
        });

        // Find all active booked appointments for this doctor
        const affectedAppointments = state.appointments.filter(
          (a) => a.doctorId === doctorId && a.status === 'booked'
        );

        const newNotifs: NotificationItem[] = [];
        affectedAppointments.forEach((app) => {
          let kind: NotificationItem['kind'] = 'doc_available';
          if (status === 'Busy') kind = 'doc_busy';
          else if (status === 'Unavailable') kind = 'doc_unavailable';

          const notif = createNotification({
            kind,
            appointment: app,
            doctor: { ...doc, runtime: { ...doc.runtime, statusOverride: status, reason } },
            hospital: hosp,
            nowMins: state.simMinutes,
            extra: { reason: reason || 'Hospital operational update' },
          });
          newNotifs.push(notif);
        });

        playNotificationChime();
        triggerHapticVibration();

        set({
          doctors: updatedDoctors,
          notifications: [...newNotifs, ...state.notifications],
        });

        return { affectedCount: affectedAppointments.length };
      },

      // Hospital Portal Action: Delay Consultation
      hospitalDelayDoctor: (hospitalId, doctorId, extraMinutes) => {
        const state = get();
        const doc = state.doctors.find((d) => d.id === doctorId);
        if (!doc || doc.hospitalId !== hospitalId) return { affectedCount: 0 };
        const hosp = state.hospitals.find((h) => h.id === hospitalId);
        if (!hosp) return { affectedCount: 0 };

        const newDelay = (doc.runtime.delayMin || 0) + extraMinutes;
        const updatedDoctors = state.doctors.map((d) => {
          if (d.id === doctorId) {
            return {
              ...d,
              runtime: {
                ...d.runtime,
                delayMin: newDelay,
                updatedAt: new Date().toISOString(),
              },
            };
          }
          return d;
        });

        const affectedAppointments = state.appointments.filter(
          (a) => a.doctorId === doctorId && a.status === 'booked'
        );

        const q = state.queues[doctorId] || {
          doctorId,
          occupied: [],
          walkIns: [],
          current: 4,
          nextCallAt: '10:20',
        };

        const newNotifs: NotificationItem[] = [];
        affectedAppointments.forEach((app) => {
          const metrics = calculateQueueMetrics({
            doctor: { ...doc, runtime: { ...doc.runtime, delayMin: newDelay } },
            queue: q,
            token: app.token,
            currentSimMins: state.simMinutes,
            patientDistanceKm: app.distKm,
          });

          const notif = createNotification({
            kind: 'doc_delayed',
            appointment: app,
            doctor: doc,
            hospital: hosp,
            nowMins: state.simMinutes,
            extra: {
              delayMin: extraMinutes,
              waitMins: metrics.estimatedWaitMins,
              arriveBy: metrics.arriveByTime,
            },
          });
          newNotifs.push(notif);
        });

        playNotificationChime();
        triggerHapticVibration();

        set({
          doctors: updatedDoctors,
          notifications: [...newNotifs, ...state.notifications],
        });

        return { affectedCount: affectedAppointments.length };
      },

      // Hospital Portal Action: Change Schedule
      hospitalUpdateDoctorSchedule: (hospitalId, doctorId, arrival, start, departure) => {
        const state = get();
        const doc = state.doctors.find((d) => d.id === doctorId);
        if (!doc || doc.hospitalId !== hospitalId) return { affectedCount: 0 };
        const hosp = state.hospitals.find((h) => h.id === hospitalId);
        if (!hosp) return { affectedCount: 0 };

        const updatedDoctors = state.doctors.map((d) => {
          if (d.id === doctorId) {
            return {
              ...d,
              runtime: {
                ...d.runtime,
                arrivalOverride: arrival || d.runtime.arrivalOverride,
                departureOverride: departure || d.runtime.departureOverride,
                updatedAt: new Date().toISOString(),
              },
            };
          }
          return d;
        });

        const affectedAppointments = state.appointments.filter(
          (a) => a.doctorId === doctorId && a.status === 'booked'
        );

        set({ doctors: updatedDoctors });
        return { affectedCount: affectedAppointments.length };
      },

      // Hospital Portal Action: Toggle Auto Run Queue
      hospitalToggleAutoRun: (hospitalId, enabled) => {
        set((s) => ({
          hospitals: s.hospitals.map((h) => (h.id === hospitalId ? { ...h, autoRunQueue: enabled } : h)),
        }));
      },

      // Hospital Account Registration
      registerHospitalAccount: (account) => {
        const state = get();
        // Check uniqueness
        if (state.hospitalAccounts.some((a) => a.username.toLowerCase() === account.username.toLowerCase())) {
          return false;
        }
        set({
          hospitalAccounts: [...state.hospitalAccounts, account],
        });
        return true;
      },
    }),
    {
      name: 'careconnect_world_state_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        hospitals: state.hospitals,
        doctors: state.doctors,
        queues: state.queues,
        appointments: state.appointments,
        notifications: state.notifications,
        hospitalAccounts: state.hospitalAccounts,
        simMinutes: state.simMinutes,
        simSpeed: state.simSpeed,
        simPaused: state.simPaused,
      }),
    }
  )
);

// Multi-Tab Sync and Simulation Leader Election
// Each tab registers a heartbeat in localStorage.
// The oldest active tab (lowest leader timestamp) acts as simulation clock leader.
const TAB_ID = `tab-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
const HEARTBEAT_KEY = 'careconnect_tabs_heartbeat';

function registerTabHeartbeat() {
  try {
    const raw = localStorage.getItem(HEARTBEAT_KEY);
    const tabs: Record<string, number> = raw ? JSON.parse(raw) : {};
    const now = Date.now();
    tabs[TAB_ID] = now;

    // Prune stale tabs (>5 seconds inactive)
    for (const [id, ts] of Object.entries(tabs)) {
      if (now - ts > 5000) {
        delete tabs[id];
      }
    }
    localStorage.setItem(HEARTBEAT_KEY, JSON.stringify(tabs));

    // Determine if this tab is the leader (lexicographically smallest active tabId)
    const activeIds = Object.keys(tabs).sort();
    return activeIds[0] === TAB_ID;
  } catch {
    return true;
  }
}

// Start background sync & leader clock ticker in browser
if (typeof window !== 'undefined') {
  // Listen for storage events across tabs to rehydrate store
  window.addEventListener('storage', (e) => {
    if (e.key === 'careconnect_world_state_v1') {
      try {
        useAppStore.persist.rehydrate();
      } catch (err) {
        console.warn('Rehydration error on storage event:', err);
      }
    }
  });

  // Clock tick interval
  let isLeader = registerTabHeartbeat();
  setInterval(() => {
    isLeader = registerTabHeartbeat();
  }, 2000);

  // Main sim clock timer (every 1 second real time)
  setInterval(() => {
    if (!isLeader) return;
    const store = useAppStore.getState();
    if (store.simPaused) return;

    // Advance clock according to simSpeed
    // At 1x: 1 real second = 1 sim second -> 60s per minute
    // At 30x: 1 real second = 30 sim seconds -> 2 real seconds = 1 sim minute
    const speed = store.simSpeed || 30;
    const minsPerSecond = speed / 60;

    // We advance simMinutes
    const nextMins = Math.round((store.simMinutes + minsPerSecond) * 100) / 100;
    useAppStore.setState({ simMinutes: nextMins });
    store.tickSimClock();
  }, 1000);
}
