import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, UserCheck, Clock, MapPin } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { calculateDistance } from '../../utils/geo';
import { Doctor } from '../../types';

interface DoctorUnavailableRebookModalProps {
  isOpen: boolean;
  appointmentId: string;
  onClose: () => void;
}

export const DoctorUnavailableRebookModal: React.FC<DoctorUnavailableRebookModalProps> = ({
  isOpen,
  appointmentId,
  onClose,
}) => {
  const navigate = useNavigate();
  const {
    currentLanguage,
    appointments,
    doctors,
    hospitals,
    userLocation,
    rebookToAlternativeDoctor,
  } = useAppStore();

  const t = translations[currentLanguage];

  if (!isOpen) return null;

  const appointment = appointments.find((a) => a.id === appointmentId);
  if (!appointment) return null;

  const currentDoctor = doctors.find((d) => d.id === appointment.doctorId);
  const currentHospital = hospitals.find((h) => h.id === appointment.hospitalId);

  // Find same-specialty alternative doctors across Vizag
  const targetSpecialty = currentDoctor?.specialty || 'General Medicine';

  const alternatives: { doctor: Doctor; hospitalName: string; distanceKm: number }[] = doctors
    .filter(
      (d) =>
        d.id !== appointment.doctorId &&
        d.specialty.toLowerCase() === targetSpecialty.toLowerCase() &&
        d.runtime.statusOverride !== 'Unavailable'
    )
    .map((d) => {
      const h = hospitals.find((hosp) => hosp.id === d.hospitalId);
      const dist = h ? calculateDistance(userLocation.lat, userLocation.lng, h.lat, h.lng) : 5;
      return {
        doctor: d,
        hospitalName: h?.name || 'Vizag Hospital',
        distanceKm: dist,
      };
    })
    .sort((a, b) => {
      // Same hospital first, then distance
      if (a.doctor.hospitalId === appointment.hospitalId && b.doctor.hospitalId !== appointment.hospitalId) {
        return -1;
      }
      if (b.doctor.hospitalId === appointment.hospitalId && a.doctor.hospitalId !== appointment.hospitalId) {
        return 1;
      }
      return a.distanceKm - b.distanceKm;
    });

  const handleSelectAlternative = (alt: { doctor: Doctor; hospitalName: string }) => {
    // 1-Tap move to a new slot (e.g. next slot index 1)
    const slotStart = '10:40 AM';
    const slotEnd = '11:00 AM';
    const updated = rebookToAlternativeDoctor(
      appointment.id,
      alt.doctor.id,
      alt.doctor.hospitalId,
      1,
      slotStart,
      slotEnd
    );
    if (updated) {
      onClose();
      navigate(`/queue?appointmentId=${updated.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Banner */}
        <div className="bg-amber-600 px-5 py-4 text-white">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-white shrink-0" />
            <h3 className="font-extrabold text-base leading-tight">
              {t.rebook.title}
            </h3>
          </div>
          <p className="text-xs text-amber-100 mt-1 leading-relaxed">
            {t.rebook.doctorUnavailableDesc
              .replace('{doctor}', currentDoctor?.name || 'Your doctor')
              .replace('{reason}', currentDoctor?.runtime.reason || 'Unexpected emergency duty')}
          </p>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t.rebook.alternativeDoctorsTitle} ({targetSpecialty})
          </div>

          {alternatives.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 text-slate-600 text-xs text-center">
              No immediate alternative found for this exact specialty. You can keep your appointment or visit general emergency.
            </div>
          ) : (
            <div className="space-y-3">
              {alternatives.map((alt) => (
                <div
                  key={alt.doctor.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 bg-white hover:bg-teal-50/30 transition-all flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{alt.doctor.name}</span>
                      {alt.doctor.hospitalId === appointment.hospitalId && (
                        <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
                          Same Hospital
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">{alt.hospitalName}</div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1 font-medium text-teal-700">
                        <Clock className="w-3.5 h-3.5" />
                        Next slot: 10:40 AM
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3.5 h-3.5" />
                        {alt.distanceKm} km
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectAlternative(alt)}
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform shrink-0"
                  >
                    <span>Switch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium text-xs hover:bg-slate-100 transition-colors"
          >
            {t.rebook.keepWaitBtn}
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/hospitals');
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors"
          >
            Browse All Hospitals
          </button>
        </div>
      </div>
    </div>
  );
};
