import React from 'react';
import { Logo } from '../components/common/Logo';
import { Footer } from '../components/common/Footer';
import { GraduationCap, ChefHat, ShieldAlert, ArrowRight, Sparkles, Clock, Smartphone, ShieldCheck } from 'lucide-react';
import { Role } from '../types';

interface RoleSelectionViewProps {
  onSelectRole: (role: Role) => void;
}

export const RoleSelectionView: React.FC<RoleSelectionViewProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-stone-50 via-amber-50/20 to-stone-100">
      {/* Top Banner Navigation */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <Logo size="md" />
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 bg-white/80 border border-stone-200/80 px-3 py-1.5 rounded-full shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Campus Cafeteria System Online</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center text-center">
        {/* Hero Section */}
        <div className="max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Smart University Cafeteria
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight font-['Outfit'] leading-tight sm:leading-none">
            Pre-Order & Management System
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-600 font-medium">
            "Pre-order your meal. Skip the queue. Pick it up on time."
          </p>

          <div className="mt-8 pt-6 border-t border-stone-200/60 flex items-center justify-center gap-2 text-stone-700 text-sm font-semibold">
            <span>How would you like to continue?</span>
          </div>
        </div>

        {/* 3 Large Role Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl">
          {/* 1. STUDENT CARD */}
          <div
            id="role-card-student"
            className="group relative bg-white rounded-3xl p-7 border-2 border-stone-200 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col text-left text-stone-800"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-8 h-8" />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold tracking-wider text-amber-600 uppercase">
                Student Portal
              </span>
            </div>

            <h3 className="text-xl font-bold text-stone-900 font-['Outfit'] mb-2 flex items-center gap-2">
              🎓 STUDENT
            </h3>

            <p className="text-xs font-semibold text-stone-500 mb-3">
              For university students
            </p>

            <p className="text-sm text-stone-600 leading-relaxed flex-1 mb-6">
              Browse cafeteria menu, place pre-orders, choose pickup slots and track your meals.
            </p>

            <button
              id="continue-as-student-btn"
              onClick={() => onSelectRole('STUDENT')}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3"
            >
              <span>Continue as Student</span>
              <ArrowRight className="w-4 h-4 transition-transform" />
            </button>
          </div>

          {/* 2. CAFETERIA STAFF CARD */}
          <div
            id="role-card-staff"
            className="group relative bg-white rounded-3xl p-7 border-2 border-stone-200 hover:border-emerald-600 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col text-left text-stone-800"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ChefHat className="w-8 h-8" />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold tracking-wider text-emerald-600 uppercase">
                Kitchen & Counter
              </span>
            </div>

            <h3 className="text-xl font-bold text-stone-900 font-['Outfit'] mb-2 flex items-center gap-2">
              👨‍🍳 CAFETERIA STAFF
            </h3>

            <p className="text-xs font-semibold text-stone-500 mb-3">
              For cafeteria staff and kitchen operators
            </p>

            <p className="text-sm text-stone-600 leading-relaxed flex-1 mb-6">
              Manage incoming orders, preparation, pickup and cafeteria operations.
            </p>

            <button
              id="continue-as-staff-btn"
              onClick={() => onSelectRole('STAFF')}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 active:bg-black text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3"
            >
              <span>Continue as Staff</span>
              <ArrowRight className="w-4 h-4 transition-transform" />
            </button>
          </div>

          {/* 3. ADMIN / OWNER CARD */}
          <div
            id="role-card-admin"
            className="group relative bg-white rounded-3xl p-7 border-2 border-stone-200 hover:border-stone-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col text-left text-stone-800"
          >
            <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-800 border border-stone-300 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold tracking-wider text-stone-600 uppercase">
                Executive Control
              </span>
            </div>

            <h3 className="text-xl font-bold text-stone-900 font-['Outfit'] mb-2 flex items-center gap-2">
              👑 ADMIN / OWNER
            </h3>

            <p className="text-xs font-semibold text-stone-500 mb-3">
              For cafeteria management
            </p>

            <p className="text-sm text-stone-600 leading-relaxed flex-1 mb-6">
              Manage menu, students, staff, finances, reports and settings.
            </p>

            <button
              id="continue-as-admin-btn"
              onClick={() => onSelectRole('ADMIN')}
              className="w-full py-3 px-4 bg-stone-800 hover:bg-stone-900 active:bg-black text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3"
            >
              <span>Continue as Admin</span>
              <ArrowRight className="w-4 h-4 transition-transform" />
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-14 max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-stone-600 text-xs">
          <div className="flex items-center gap-3 p-3.5 bg-white/70 rounded-2xl border border-stone-200/80">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-left">
              <p className="font-bold text-stone-800">15-Min Pickup Slots</p>
              <p className="text-stone-500">Smart crowd prevention and instant counter pickup</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-white/70 rounded-2xl border border-stone-200/80">
            <Smartphone className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-left">
              <p className="font-bold text-stone-800">Digital Campus Wallet</p>
              <p className="text-stone-500">Instant top-ups, zero cash friction, automated refunds</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-white/70 rounded-2xl border border-stone-200/80">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="text-left">
              <p className="font-bold text-stone-800">KDS & Live Inventory</p>
              <p className="text-stone-500">Real-time kitchen orders with atomic stock synchronization</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
