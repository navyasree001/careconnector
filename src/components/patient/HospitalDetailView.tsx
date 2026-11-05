import React, { useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, Navigation, ArrowLeft, Star, Clock, CheckCircle2, AlertCircle, ChevronRight, Info } from 'lucide-react';
import { useAppStore, deriveDoctorStatus } from '../../store/useAppStore';
import { translations } from '../../i18n/translations';
import { calculateDistance } from '../../utils/geo';

export const HospitalDetailView: React.FC = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const [searchParams] = useSearchParams();
  const highlightSpecialty = searchParams.get('specialty');
  const navigate = useNavigate();

  const { currentLanguage, userLocation, hospitals, doctors, queues, simMinutes, simpleMode } = useAppStore();
  const t = translations[currentLanguage];

  const hospital = hospitals.find((h) => h.id === hospitalId) || hospitals[0];
  const distanceKm = calculateDistance(userLocation.lat, userLocation.lng, hospital.lat, hospital.lng);

  // Doctors for this hospital
  const hospitalDoctors = useMemo(() => {
    return doctors.filter((d) => d.hospitalId === hospital.id);
  }, [doctors, hospital.id]);

  return (
    <div className={`max-w-3xl mx-auto px-4 py-4 pb-24 space-y-5 ${simpleMode ? 'text-lg' : 'text-sm'}`}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/hospitals')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.common.back} to Hospitals</span>
      </button>

      {/* Hospital Hero Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-lg md:text-xl leading-tight">
                {hospital.name}
              </h1>
              <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                {hospital.type}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{hospital.address}</div>
            <div className="flex items-center gap-2 text-xs mt-2 text-slate-600">
              <span className="font-bold text-teal-700">{distanceKm} km away</span>
              <span>·</span>
              <span className="flex items-center text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                {hospital.rating} ({hospital.reviewCount} reviews)
              </span>
              <span>·</span>
              <span className="text-slate-500">OPD: {hospital.opdHours}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Call & Directions */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <a
            href={`tel:${hospital.phone.replace(/\s+/g, '')}`}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>{t.common.call} {hospital.phone}</span>
          </a>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${hospital.name} ${hospital.address}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 transition-colors"
          >
            <Navigation className="w-4 h-4 text-teal-700" />
            <span>{t.common.directions}</span>
          </a>
        </div>

        {/* Facilities tags */}
        <div className="space-y-1.5 pt-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t.hospitalDetail.facilities}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {hospital.facilities.map((fac, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
              >
                {fac}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* "How Booking Works" 3-Step Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-teal-700" />
          <h2 className="font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wide">
            {t.hospitalDetail.howBookingWorksTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <div className="p-2.5 rounded-xl bg-white border border-teal-100 shadow-xs">
            <div className="font-bold text-xs text-teal-900">{t.hospitalDetail.step1Title}</div>
            <div className="text-[11px] text-slate-600 mt-1 leading-snug">{t.hospitalDetail.step1Desc}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-teal-100 shadow-xs">
            <div className="font-bold text-xs text-teal-900">{t.hospitalDetail.step2Title}</div>
            <div className="text-[11px] text-slate-600 mt-1 leading-snug">{t.hospitalDetail.step2Desc}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-teal-100 shadow-xs">
            <div className="font-bold text-xs text-teal-900">{t.hospitalDetail.step3Title}</div>
            <div className="text-[11px] text-slate-600 mt-1 leading-snug">{t.hospitalDetail.step3Desc}</div>
          </div>
        </div>
      </div>

      {/* Doctors List with LIVE status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-slate-900 text-base">
            {t.hospitalDetail.doctorsHeader}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {hospitalDoctors.length} doctors
          </span>
        </div>

        <div className="space-y-3">
          {hospitalDoctors.map((doc) => {
            const q = queues[doc.id] || { current: 4, occupied: [], walkIns: [], nextCallAt: '10:20', doctorId: doc.id };
            const statusInfo = deriveDoctorStatus(doc, simMinutes, q.occupied.length);
            const isHighlight = highlightSpecialty && doc.specialty.toLowerCase() === highlightSpecialty.toLowerCase();

            const statusColors = {
              Available: 'bg-emerald-50 text-emerald-800 border-emerald-300',
              Busy: 'bg-amber-50 text-amber-800 border-amber-300',
              Unavailable: 'bg-rose-50 text-rose-800 border-rose-300',
            }[statusInfo.status];

            return (
              <div
                key={doc.id}
                onClick={() => navigate(`/doctor/${doc.id}`)}
                className={`cursor-pointer p-4 rounded-2xl bg-white border transition-all hover:shadow-md ${
                  isHighlight ? 'border-teal-500 ring-2 ring-teal-100' : 'border-slate-200 hover:border-teal-400'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{doc.name}</h3>
                      {isHighlight && (
                        <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded">
                          Specialist Match
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-teal-700 mt-0.5">
                      {doc.specialty} · Room {doc.roomNumber}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {doc.qualification} ({doc.experienceYears} yrs exp)
                    </div>

                    {/* Spoken Languages & Fee */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
                      <span>Languages: {doc.languages.join(', ')}</span>
                      <span>·</span>
                      <span className="font-bold text-slate-900">
                        {doc.consultationFee === 0 ? 'Free OPD' : `₹${doc.consultationFee}`}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge & Arrow */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 ${statusColors}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>{statusInfo.status}</span>
                    </span>

                    <span className="text-xs font-bold text-teal-700 flex items-center gap-0.5 mt-2">
                      <span>Book Slot</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Delay or Reason Banner if any */}
                {doc.runtime.delayMin > 0 && (
                  <div className="mt-2.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                    ⚠️ Running {doc.runtime.delayMin} min late today.
                  </div>
                )}
                {statusInfo.reason && statusInfo.status !== 'Available' && (
                  <div className="mt-1 text-[11px] text-slate-500 italic">
                    Status note: {statusInfo.reason}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
