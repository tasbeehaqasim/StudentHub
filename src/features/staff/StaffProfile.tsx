import React from 'react';
import { StaffUser } from '../../types';
import { ChefHat, Mail, Phone, Clock, ShieldCheck, MapPin } from 'lucide-react';

interface StaffProfileProps {
  staff: StaffUser;
}

export const StaffProfile: React.FC<StaffProfileProps> = ({ staff }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
          Staff Operator Profile
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Authorized cafeteria staff credentials and assigned cooking counter station.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-2xl font-['Outfit'] border border-emerald-200">
            {staff.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-['Outfit']">
              {staff.fullName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {staff.staffId}
              </span>
              <span className="text-xs text-stone-500">• {staff.position}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-stone-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Assigned Station
              </span>
              <span className="text-xs font-bold text-stone-900">{staff.station}</span>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center gap-3">
            <Clock className="w-4 h-4 text-stone-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Shift Schedule
              </span>
              <span className="text-xs font-bold text-stone-900">{staff.shift}</span>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center gap-3">
            <Mail className="w-4 h-4 text-stone-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Cafeteria Email
              </span>
              <span className="text-xs font-bold text-stone-900">{staff.email}</span>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center gap-3">
            <Phone className="w-4 h-4 text-stone-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Contact Phone
              </span>
              <span className="text-xs font-bold text-stone-900">{staff.phone}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Staff access authorized for Food Safety Level II and Counter Verification protocols. Please adhere to university hygiene standards during all active shifts.
          </p>
        </div>
      </div>
    </div>
  );
};
