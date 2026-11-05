import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { EmergencySheet } from './components/common/EmergencySheet';
import { LocationPickerModal } from './components/common/LocationPickerModal';
import { DoctorUnavailableRebookModal } from './components/common/DoctorUnavailableRebookModal';
import { WelcomePage } from './pages/WelcomePage';
import { PatientAuthPage } from './pages/PatientAuthPage';
import { HospitalAuthPage } from './pages/HospitalAuthPage';
import { HomeView } from './components/patient/HomeView';
import { TriageResultView } from './components/patient/TriageResultView';
import { HospitalsView } from './components/patient/HospitalsView';
import { HospitalDetailView } from './components/patient/HospitalDetailView';
import { DoctorDetailView } from './components/patient/DoctorDetailView';
import { BookingView } from './components/patient/BookingView';
import { LiveQueueView } from './components/patient/LiveQueueView';
import { AlertsView } from './components/patient/AlertsView';
import { MyAppointmentsView } from './components/patient/MyAppointmentsView';
import { SettingsView } from './components/patient/SettingsView';
import { HospitalDashboard } from './components/hospital/HospitalDashboard';
import { ShieldAlert, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const { session, activeToast, dismissToast, appointments } = useAppStore();

  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState<string | undefined>();
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);

  const isHospital = session.type === 'hospital';
  const isPublicAuth = location.pathname === '/' || location.pathname.startsWith('/auth');

  // Find active appointment for rebook modal if needed
  const userPhone = session.phone;
  const userAppointments = appointments.filter((a) => a.patient.phone === userPhone);
  const activeAppointment = userAppointments.find(
    (a) => a.status === 'booked' || a.status === 'serving'
  );

  const openEmergency = (reason?: string) => {
    setEmergencyReason(reason);
    setEmergencyOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Real-time Global In-App Toast Banner */}
      {activeToast && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-md text-white shadow-2xl border border-teal-500/80 flex items-start justify-between gap-3 animate-bounce-short">
          <div className="flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 mt-1.5 shrink-0 animate-ping" />
            <div>
              <div className="font-extrabold text-xs text-teal-300 leading-tight">
                {activeToast.title}
              </div>
              <div className="text-xs text-slate-200 mt-0.5 leading-snug">
                {activeToast.body}
              </div>
            </div>
          </div>
          <button
            onClick={dismissToast}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      {!isPublicAuth && (
        <Header
          onOpenEmergency={() => openEmergency()}
          onOpenLocationPicker={() => setLocationPickerOpen(true)}
        />
      )}

      {/* Main Content Viewport */}
      <main className="flex-1">
        <Routes>
          {/* Public / Auth routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/auth/patient" element={<PatientAuthPage />} />
          <Route path="/auth/hospital" element={<HospitalAuthPage />} />

          {/* Patient Authenticated routes */}
          <Route
            path="/home"
            element={
              session.type === 'user' ? (
                <HomeView
                  onOpenEmergency={openEmergency}
                  onOpenLocationPicker={() => setLocationPickerOpen(true)}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/triage-result"
            element={
              session.type === 'user' ? (
                <TriageResultView onOpenEmergency={openEmergency} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/hospitals"
            element={
              session.type === 'user' ? (
                <HospitalsView />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/hospital/:hospitalId"
            element={
              session.type === 'user' ? (
                <HospitalDetailView />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/doctor/:doctorId"
            element={
              session.type === 'user' ? (
                <DoctorDetailView />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/booking"
            element={
              session.type === 'user' ? (
                <BookingView />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/queue"
            element={
              session.type === 'user' ? (
                <LiveQueueView />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/alerts"
            element={
              session.type === 'user' ? (
                <AlertsView />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/appointments"
            element={
              session.type === 'user' ? (
                <MyAppointmentsView />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/settings"
            element={
              session.type === 'user' ? (
                <SettingsView
                  onOpenLocationPicker={() => setLocationPickerOpen(true)}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/rebook"
            element={
              session.type === 'user' ? (
                <LiveQueueView />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Hospital Management Portal Route */}
          <Route
            path="/portal"
            element={
              session.type === 'hospital' ? (
                <HospitalDashboard />
              ) : (
                <Navigate to="/auth/hospital" replace />
              )
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Floating Emergency Button on Patient screens */}
      {session.type === 'user' && !isPublicAuth && (
        <button
          onClick={() => openEmergency()}
          className="fixed bottom-20 right-4 z-40 flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xl active:scale-95 transition-all border-2 border-white ring-4 ring-rose-100"
          title="Emergency Help: 108 Ambulance"
        >
          <ShieldAlert className="w-4 h-4 text-white" />
          <span>Emergency 108</span>
        </button>
      )}

      {/* Patient Bottom Navigation */}
      {session.type === 'user' && !isPublicAuth && <BottomNav />}

      {/* Emergency Sheet Modal */}
      <EmergencySheet
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        reasonText={emergencyReason}
      />

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={locationPickerOpen}
        onClose={() => setLocationPickerOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <MainLayout />
    </HashRouter>
  );
}
