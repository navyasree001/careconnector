import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Check, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';
import { useAppStore, deriveDoctorStatus, timeToMinutes, minutesToTime, getTodayDateString } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { calculateDistance } from '../../utils/geo';

export const DoctorDetailView: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { currentLanguage, userLocation, doctors, hospitals, queues, simMinutes, simpleMode } = useAppStore();
  const t = translations[currentLanguage];

  const doctor = doctors.find((d) => d.id === doctorId) || doctors[0];
  const hospital = hospitals.find((h) => h.id === doctor.hospitalId) || hospitals[0];
  const queue = queues[doctor.id] || { current: 4, occupied: [], walkIns: [], nextCallAt: '10:20', doctorId: doctor.id };

  const statusInfo = deriveDoctorStatus(doctor, simMinutes, queue.occupied.length);
  const distanceKm = calculateDistance(userLocation.lat, userLocation.lng, hospital.lat, hospital.lng);

  // 3-Day tabs: Today, Tomorrow, Day after
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  const dates = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 3; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const str = d.toISOString().split('T')[0];
      const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      arr.push({ offset: i, dateStr: str, label: dayLabel });
    }
    return arr;
  }, []);

  // 20-minute slots generation for the doctor's shift
  const shiftStartMins = timeToMinutes(doctor.defaultSchedule.start) + doctor.runtime.delayMin;
  const shiftEndMins = timeToMinutes(doctor.runtime.departureOverride || doctor.defaultSchedule.departure);

  const slots = useMemo(() => {
    const list = [];
    let idx = 0;
    for (let m = shiftStartMins; m + 20 <= shiftEndMins; m += 20) {
      const startStr = minutesToTime(m);
      const endStr = minutesToTime(m + 20);
      const windowStr = `${startStr} – ${endStr}`;

      // Rule: Same-day slot is bookable only if it starts at least 20 minutes from now
      const isPastOrTooSoon = selectedDayOffset === 0 && m < simMinutes + 20;

      // Check capacity: capacity = 20 / avg
      const avg = doctor.avgConsultMinutes || 5;
      const capacity = Math.max(1, Math.floor(20 / avg));
      const slotBaseToken = 10 + idx * capacity;

      // Check how many booked
      const bookedCount = (queue.occupied || []).filter(
        (token) => token >= slotBaseToken && token < slotBaseToken + capacity
      ).length;
      const isFull = bookedCount >= capacity;

      list.push({
        index: idx,
        startMins: m,
        startStr,
        endStr,
        windowStr,
        isPastOrTooSoon,
        isFull,
        capacity,
        bookedCount,
      });
      idx++;
    }
    return list;
  }, [shiftStartMins, shiftEndMins, selectedDayOffset, simMinutes, doctor.avgConsultMinutes, queue.occupied]);

  const selectedSlot = slots.find((s) => s.index === selectedSlotIndex);

  const handleProceedBooking = () => {
    if (!selectedSlot) return;
    const chosenDate = dates[selectedDayOffset].dateStr;
    navigate('/booking', {
      state: {
        hospitalId: hospital.id,
        doctorId: doctor.id,
        slotIndex: selectedSlot.index,
        slotStart: selectedSlot.startStr,
        slotEnd: selectedSlot.endStr,
        date: chosenDate,
        windowStr: selectedSlot.windowStr,
      },
    });
  };

  const statusBadgeColor = {
    Available: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    Busy: 'bg-amber-50 text-amber-800 border-amber-300',
    Unavailable: 'bg-rose-50 text-rose-800 border-rose-300',
  }[statusInfo.status];

  return (
    <div className={`max-w-2xl mx-auto px-4 py-4 pb-28 space-y-4 ${simpleMode ? 'text-lg' : 'text-sm'}`}>
      {/* Back Button */}
      <button
        onClick={() => navigate(`/hospital/${hospital.id}`)}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.common.back} to {hospital.name}</span>
      </button>

      {/* Doctor Summary Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h1 className="font-extrabold text-slate-900 text-lg md:text-xl">
              {doctor.name}
            </h1>
            <div className="text-xs font-bold text-teal-700 mt-0.5">
              {doctor.specialty} · Room {doctor.roomNumber}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {doctor.qualification} · {doctor.experienceYears} years experience
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{hospital.name} ({hospital.locality})</span>
              <span>·</span>
              <span className="font-semibold text-teal-700">{distanceKm} km</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusBadgeColor}`}>
              <span className="w-2 h-2 rounded-full bg-current"></span>
              <span>{statusInfo.status}</span>
            </span>
            <div className="text-xs font-extrabold text-slate-900 mt-1">
              {doctor.consultationFee === 0 ? 'Free OPD' : `Fee: ₹${doctor.consultationFee}`}
            </div>
          </div>
        </div>

        {/* Delay Banner if doctor is running late */}
        {doctor.runtime.delayMin > 0 && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              {t.doctorDetail.runningLateBanner
                .replace('{doctor}', doctor.name)
                .replace('{min}', String(doctor.runtime.delayMin))}
            </span>
          </div>
        )}

        {/* Timeline schedule: arrival, start, departure with struck-through original times */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {t.doctorDetail.timelineTitle}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500">{t.doctorDetail.arrivesAt}</div>
              <div className="font-bold text-slate-900 mt-0.5">
                {doctor.runtime.arrivalOverride ? (
                  <>
                    <span className="line-through text-slate-400 mr-1">{doctor.defaultSchedule.arrival}</span>
                    <span className="text-teal-700">{doctor.runtime.arrivalOverride}</span>
                  </>
                ) : (
                  doctor.defaultSchedule.arrival
                )}
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500">{t.doctorDetail.consultStarts}</div>
              <div className="font-bold text-slate-900 mt-0.5">
                {doctor.runtime.delayMin > 0 ? (
                  <>
                    <span className="line-through text-slate-400 mr-1">{doctor.defaultSchedule.start}</span>
                    <span className="text-amber-700 font-bold">
                      {minutesToTime(timeToMinutes(doctor.defaultSchedule.start) + doctor.runtime.delayMin)}
                    </span>
                  </>
                ) : (
                  doctor.defaultSchedule.start
                )}
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500">{t.doctorDetail.expectedDeparture}</div>
              <div className="font-bold text-slate-900 mt-0.5">
                {doctor.runtime.departureOverride ? (
                  <>
                    <span className="line-through text-slate-400 mr-1">{doctor.defaultSchedule.departure}</span>
                    <span className="text-teal-700">{doctor.runtime.departureOverride}</span>
                  </>
                ) : (
                  doctor.defaultSchedule.departure
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slot Selection Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="font-extrabold text-slate-900 text-base">
            {t.doctorDetail.selectSlotTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.doctorDetail.slotWindowRule
              .replace('{avg}', String(doctor.avgConsultMinutes))
              .replace('{fee}', String(doctor.consultationFee))}
          </p>
        </div>

        {/* 3-Day Tabs */}
        <div className="flex gap-2">
          {dates.map((d) => (
            <button
              key={d.offset}
              onClick={() => {
                setSelectedDayOffset(d.offset);
                setSelectedSlotIndex(null);
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                selectedDayOffset === d.offset
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Rule Notice */}
        <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-700 shrink-0" />
          <span>{t.doctorDetail.slotRuleNote}</span>
        </div>

        {/* 20-min Slots Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {slots.map((slot) => {
            const isSelected = selectedSlotIndex === slot.index;
            const isBlocked = slot.isPastOrTooSoon || slot.isFull;

            let badgeClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-teal-400';
            if (isSelected) {
              badgeClass = 'bg-teal-600 text-white border-teal-600 ring-2 ring-teal-200 shadow-sm';
            } else if (slot.isFull) {
              badgeClass = 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed';
            } else if (slot.isPastOrTooSoon) {
              badgeClass = 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60';
            }

            return (
              <button
                key={slot.index}
                disabled={isBlocked}
                onClick={() => setSelectedSlotIndex(slot.index)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all min-h-[64px] ${badgeClass}`}
              >
                <div className="font-bold text-xs">{slot.windowStr}</div>
                <div className="flex items-center justify-between text-[11px] mt-2">
                  <span>
                    {slot.isFull
                      ? t.doctorDetail.slotFull
                      : slot.isPastOrTooSoon
                      ? 'Past'
                      : isSelected
                      ? t.doctorDetail.slotSelected
                      : t.doctorDetail.slotAvailable}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Arrive 15 min early notice */}
        <div className="text-xs text-slate-600 italic text-center pt-1">
          {t.doctorDetail.arriveEarlyNotice}
        </div>
      </div>

      {/* Sticky Bottom Booking Confirmation Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500">Selected Slot</div>
            <div className="text-sm font-bold text-slate-900">
              {selectedSlot ? selectedSlot.windowStr : 'Please select a slot above'}
            </div>
          </div>

          <button
            disabled={!selectedSlot}
            onClick={handleProceedBooking}
            className={`px-5 py-3 rounded-xl font-bold text-xs md:text-sm shadow-md transition-all ${
              selectedSlot
                ? 'bg-teal-600 hover:bg-teal-700 text-white active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {t.doctorDetail.bookSlotBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
