import React, { useState } from 'react';
import { Bell, MessageSquare, Check, ExternalLink, ShieldCheck, Volume2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { playNotificationChime, triggerHapticVibration } from '../../utils/audio';

export const AlertsView: React.FC = () => {
  const {
    currentLanguage,
    session,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    simpleMode,
  } = useAppStore();

  const t = translations[currentLanguage];
  const [activeTab, setActiveTab] = useState<'inapp' | 'whatsapp'>('inapp');

  const userPhone = session.phone;
  const userNotifications = notifications.filter((n) => n.phone === userPhone);

  const handleTestSound = () => {
    playNotificationChime();
    triggerHapticVibration();
  };

  return (
    <div className={`max-w-2xl mx-auto px-4 py-4 pb-24 space-y-4 ${simpleMode ? 'text-lg' : 'text-sm'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-extrabold text-slate-900 text-lg md:text-xl">
            {t.alerts.title}
          </h1>
          <p className="text-xs text-slate-500">
            Real-time updates delivered in your preferred language
          </p>
        </div>

        {userNotifications.length > 0 && (
          <button
            onClick={() => userPhone && markAllNotificationsRead(userPhone)}
            className="text-xs font-semibold text-teal-700 hover:underline"
          >
            {t.alerts.markAllRead}
          </button>
        )}
      </div>

      {/* Tabs: In-App Feed vs WhatsApp Thread */}
      <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('inapp')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'inapp'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-teal-600" />
          <span>{t.alerts.tabInApp} ({userNotifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'whatsapp'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.alerts.tabWhatsapp}</span>
        </button>
      </div>

      {/* Device Notification Sound & Vibration Test */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-teal-50 text-teal-700 rounded-lg">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">{t.alerts.enableNotifications}</div>
            <div className="text-[11px] text-slate-500">Audio chime & haptics active</div>
          </div>
        </div>
        <button
          onClick={handleTestSound}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
        >
          Test Alert
        </button>
      </div>

      {/* Tab Content: In-App Feed */}
      {activeTab === 'inapp' && (
        <div className="space-y-3">
          {userNotifications.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              {t.alerts.noAlerts}
            </div>
          ) : (
            userNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all ${
                  notif.read
                    ? 'bg-white border-slate-200 text-slate-700'
                    : 'bg-teal-50/50 border-teal-300 text-slate-900 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.body}</p>
                    <div className="text-[10px] text-slate-400 mt-2 font-mono">{notif.at}</div>
                  </div>

                  {notif.link && (
                    <a
                      href={`#${notif.link}`}
                      className="px-2.5 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-xs shrink-0 flex items-center gap-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Simulated WhatsApp Chat Thread */}
      {activeTab === 'whatsapp' && (
        <div className="rounded-3xl border border-slate-200 bg-[#E5DDD5] overflow-hidden shadow-sm">
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-800 flex items-center justify-center font-bold text-sm">
              CC
            </div>
            <div>
              <div className="font-bold text-sm leading-tight">CareConnect Vizag Verified</div>
              <div className="text-[10px] text-teal-200">Official Health Updates · Automated Channel</div>
            </div>
          </div>

          {/* WhatsApp Disclaimer Banner */}
          <div className="bg-[#FFF9C4] text-[#827717] px-3 py-1.5 text-[11px] text-center font-medium border-b border-amber-200">
            {t.alerts.simulatedDisclaimer}
          </div>

          {/* Message bubbles */}
          <div className="p-4 space-y-3 min-h-[300px] max-h-[500px] overflow-y-auto">
            {userNotifications.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-10">
                No WhatsApp messages received yet. Book a doctor slot to receive tokens here.
              </div>
            ) : (
              userNotifications
                .slice()
                .reverse()
                .map((notif) => (
                  <div key={notif.id} className="flex flex-col items-end">
                    <div className="max-w-[85%] p-3.5 rounded-2xl rounded-tr-none bg-[#DCF8C6] shadow-xs text-slate-900 text-xs font-sans whitespace-pre-line leading-relaxed border border-emerald-100">
                      {notif.whatsapp}
                      <div className="text-right text-[10px] text-slate-400 mt-1 font-mono">
                        {notif.at} ✓✓
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
