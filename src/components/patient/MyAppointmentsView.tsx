import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, XCircle, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';

export const MyAppointmentsView: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage, session, appointments, doctors, hospitals, cancelAppointment, simpleMode } = useAppStore();
  const t = translations[currentLanguage];

  const userPhone = session.phone;
  const userAppointments = appointments.filter((a) => a.patient.phone === userPhone);

  const handleCancel = (id: string) => {
    if (window.confirm(t.appointments.confirmCancel)) {
      cancelAppointment(id);
    }
  };

  return (
    <div className={`max-w-2xl mx-auto px-4 py-4 pb-24 space-y-4 ${simpleMode ? 'text-lg' : 'text-sm'}`}>
      <h1 className="font-extrabold text-slate-900 text-lg md:text-xl">
        {t.appointments.title}
      </h1>

      {userAppointments.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-xs">{t.appointments.emptyAppointments}</p>
          <button
            onClick={() => navigate('/hospitals')}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700"
          >
            Find a Doctor
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {userAppointments.map((app) => {
            const doc = doctors.find((d) => d.id === app.doctorId);
            const hosp = hospitals.find((h) => h.id === app.hospitalId);

            const statusBadge = {
              booked: 'bg-teal-50 text-teal-800 border-teal-200',
              serving: 'bg-emerald-50 text-emerald-800 border-emerald-300 animate-pulse',
              completed: 'bg-slate-100 text-slate-600 border-slate-200',
              cancelled: 'bg-rose-50 text-rose-700 border-rose-200 line-through',
            }[app.status];

            return (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-black text-slate-900">
                        TOKEN #{app.token}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge}`}>
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="font-bold text-slate-800 text-sm mt-1">{doc?.name}</div>
                    <div className="text-xs text-teal-700 font-semibold">{doc?.specialty} · Room {doc?.roomNumber}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{hosp?.name}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-slate-900">{app.slotStart}</div>
                    <div className="text-[11px] text-slate-500">{app.date}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                  {app.status === 'booked' && (
                    <button
                      onClick={() => handleCancel(app.id)}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{t.appointments.cancelAppointment}</span>
                    </button>
                  )}

                  <button
                    onClick={() => navigate(`/queue?appointmentId=${app.id}`)}
                    className="ml-auto px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <span>{t.booking.trackQueueBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
