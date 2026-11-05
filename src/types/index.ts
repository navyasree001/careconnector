export type Language = 'en' | 'te' | 'hi';

export type UrgencyLevel = 'Emergency' | 'Urgent' | 'Routine';

export type DoctorStatus = 'Available' | 'Busy' | 'Unavailable';

export type DoctorReason = 
  | 'emergency case'
  | 'procedure or surgery'
  | 'ward rounds'
  | 'left the hospital'
  | 'on leave'
  | 'other';

export interface DoctorSchedule {
  arrival: string; // e.g. "09:30"
  start: string; // consultation starts, e.g. "10:00"
  departure: string; // expected departure, e.g. "14:00"
}

export interface DoctorSlot {
  index: number;
  timeWindow: string; // "10:20 AM – 10:40 AM"
  start: string; // "10:20"
  end: string; // "10:40"
  date: string; // YYYY-MM-DD
  capacity: number; // typically 4-5
  assignedTokens: number[];
}

export interface DoctorRuntime {
  statusOverride?: DoctorStatus;
  reason?: string;
  delayMin: number;
  arrivalOverride?: string;
  departureOverride?: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  hospitalId: string;
  name: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  languages: string[];
  consultationFee: number;
  avgConsultMinutes: number; // e.g. 5
  roomNumber: string;
  defaultSchedule: DoctorSchedule;
  runtime: DoctorRuntime;
}

export interface Hospital {
  id: string;
  name: string;
  locality: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  emergency24x7: boolean;
  icuAvailable: boolean;
  type: 'Private' | 'Government';
  opdHours: string;
  rating: number;
  reviewCount: number;
  facilities: string[];
  departments: string[];
  spokenLanguages: string[];
  autoRunQueue: boolean; // hospital level auto-run toggle
}

export interface QueueState {
  doctorId: string;
  occupied: number[]; // tokens booked online
  walkIns: number[]; // tokens issued at hospital
  current: number; // now serving token
  nextCallAt: string; // ISO string or HH:MM
  lastCompletedAt?: string;
}

export interface Appointment {
  id: string;
  token: number;
  patient: {
    name: string;
    age: number;
    phone: string;
    problemNote: string;
    whatsappConsent: boolean;
  };
  lang: Language;
  distKm: number;
  hospitalId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  slotIndex: number;
  slotStart: string; // e.g. "10:20 AM"
  slotEnd: string; // e.g. "10:40 AM"
  status: 'booked' | 'serving' | 'completed' | 'cancelled';
  sent: string[]; // trigger keys that have already fired
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  kind: 
    | 'booked'
    | 'doc_arrival_expected'
    | 'doc_arrived'
    | 'reminder_60m'
    | 'ahead_5'
    | 'start_now'
    | 'turn_approaching'
    | 'now_serving'
    | 'completed'
    | 'doc_delayed'
    | 'doc_busy'
    | 'doc_unavailable'
    | 'doc_available';
  appointmentId: string;
  phone: string;
  hospitalId: string;
  title: string;
  body: string;
  whatsapp: string;
  at: string;
  read: boolean;
  link?: string;
}

export interface HospitalAccount {
  hospitalId: string;
  username: string;
  salt: string;
  hash: string;
  contactPerson?: string;
}

export interface SessionState {
  type: 'none' | 'user' | 'hospital';
  phone?: string;
  patientName?: string;
  hospitalId?: string;
  username?: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  name: string;
  isCustom?: boolean;
}

export interface TriageResult {
  specialty: string;
  urgency: UrgencyLevel;
  symptoms: string[];
  explanation: string;
  followUpQuestion?: string;
  source: 'gemini' | 'rules';
}

export interface RankedHospital {
  hospital: Hospital;
  reasons: string[];
  score: number;
  distanceKm: number;
  availableDoctorsCount: number;
  nextSlotTime?: string;
  specialistFound: boolean;
}
