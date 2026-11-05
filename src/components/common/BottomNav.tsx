import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Building2, Clock, Bell, Settings } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';

export const BottomNav: React.FC = () => {
  const { currentLanguage, appointments, notifications, session } = useAppStore();
  const t = translations[currentLanguage];

  // Check active booking for logged in patient
  const userPhone = session.phone;
  const userAppointments = appointments.filter((a) => a.patient.phone === userPhone);
  const activeAppointment = userAppointments.find(
    (a) => a.status === 'booked' || a.status === 'serving'
  );

  // Unread alerts for this user
  const unreadAlertsCount = notifications.filter(
    (n) => n.phone === userPhone && !n.read
  ).length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
        {/* 1. Home */}
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors ${
              isActive ? 'text-teal-700 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">{t.nav.home}</span>
        </NavLink>

        {/* 2. Hospitals */}
        <NavLink
          to="/hospitals"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors ${
              isActive ? 'text-teal-700 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`
          }
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">{t.nav.hospitals}</span>
        </NavLink>

        {/* 3. Live Queue */}
        <NavLink
          to="/queue"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors ${
              isActive ? 'text-teal-700 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`
          }
        >
          <div className="relative">
            <Clock className="w-5 h-5" />
            {activeAppointment && (
              <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white ring-2 ring-white">
                #{activeAppointment.token}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">{t.nav.queue}</span>
        </NavLink>

        {/* 4. Alerts */}
        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors ${
              isActive ? 'text-teal-700 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`
          }
        >
          <div className="relative">
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadAlertsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">{t.nav.alerts}</span>
        </NavLink>

        {/* 5. Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors ${
              isActive ? 'text-teal-700 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">{t.nav.settings}</span>
        </NavLink>
      </div>
    </nav>
  );
};
