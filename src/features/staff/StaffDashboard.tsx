import React, { useState, useEffect } from 'react';
import { StaffUser, Order } from '../../types';
import { db } from '../../services/db';
import { RushLevelBadge } from '../../components/common/StatusBadge';
import {
  ChefHat,
  ScanLine,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Users,
  UtensilsCrossed
} from 'lucide-react';

interface StaffDashboardProps {
  staff: StaffUser;
  onNavigate: (tab: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  staff,
  onNavigate
}) => {
  const [orders, setOrders] = useState<Order[]>(db.getOrders());
  const [rush, setRush] = useState(db.calculateRushLevel());

  useEffect(() => {
    const refresh = () => {
      setOrders(db.getOrders());
      setRush(db.calculateRushLevel());
    };
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const pendingOrders = orders.filter((o) =>
    ['PLACED', 'PAYMENT_CONFIRMED', 'ACCEPTED'].includes(o.status)
  );
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY_FOR_PICKUP');
  const completedToday = orders.filter((o) => o.status === 'COLLECTED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      {/* Staff Hero Banner */}
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <ChefHat className="w-3.5 h-3.5" />
            Kitchen Terminal • {staff.station}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
            Welcome, {staff.fullName}
          </h1>

          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            Role: <span className="text-stone-200 font-semibold">{staff.position}</span> • Shift Active
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700 flex items-center gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Current Kitchen Rush
              </span>
              <p className="text-xs font-semibold text-stone-200 mt-0.5">{rush.description}</p>
            </div>
            <RushLevelBadge level={rush.level} />
          </div>
        </div>
      </div>

      {/* 4 Operations KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Acceptance */}
        <div
          onClick={() => onNavigate('orders')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:border-amber-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Pending Orders
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-3xl font-extrabold text-stone-900 font-['Outfit']">
            {pendingOrders.length}
          </span>
          <p className="text-[11px] text-stone-500 mt-1">Awaiting kitchen acceptance</p>
        </div>

        {/* In Preparation */}
        <div
          onClick={() => onNavigate('orders')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:border-amber-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              In Preparation
            </span>
            <ChefHat className="w-4 h-4 text-orange-600" />
          </div>
          <span className="text-3xl font-extrabold text-orange-600 font-['Outfit']">
            {preparingOrders.length}
          </span>
          <p className="text-[11px] text-stone-500 mt-1">Cooking on stove / fry station</p>
        </div>

        {/* Ready for Pickup */}
        <div
          onClick={() => onNavigate('pickup')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:border-emerald-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Ready at Counter
            </span>
            <ScanLine className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-extrabold text-emerald-600 font-['Outfit']">
            {readyOrders.length}
          </span>
          <p className="text-[11px] text-stone-500 mt-1">Awaiting 4-digit code handover</p>
        </div>

        {/* Completed Today */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Completed Today
            </span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-3xl font-extrabold text-stone-900 font-['Outfit']">
            {completedToday.length}
          </span>
          <p className="text-[11px] text-stone-500 mt-1">Successfully collected meals</p>
        </div>
      </div>

      {/* Main Operations Split: Kitchen Queue & Counter Verification Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shortcut 1: Kitchen Display System */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-4">
              <ChefHat className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-stone-900 font-['Outfit']">
              Kitchen Display System (KDS)
            </h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Real-time incoming orders, preparation timers, special dietary customization notes, and delayed order management.
            </p>

            <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-700 flex items-center justify-between">
              <span>Active queue load:</span>
              <span className="font-extrabold font-mono text-stone-900">
                {pendingOrders.length + preparingOrders.length} tickets active
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('orders')}
            className="mt-6 w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <span>Open Kitchen Queue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcut 2: Counter Pickup Terminal */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-4">
              <ScanLine className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-stone-900 font-['Outfit']">
              Pickup Code Verification Terminal
            </h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Verify student 4-digit codes when they arrive at the counter. Confirms payment status, marks meals collected, and prevents unauthorized pickups.
            </p>

            <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-700 flex items-center justify-between">
              <span>Ready for collection:</span>
              <span className="font-extrabold font-mono text-emerald-700">
                {readyOrders.length} orders waiting
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('pickup')}
            className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <span>Open Pickup Terminal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
