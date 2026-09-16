import React, { useState, useEffect } from 'react';
import { Logo } from '../common/Logo';
import { StaffUser } from '../../types';
import { db } from '../../services/db';
import { RushLevelBadge } from '../common/StatusBadge';
import {
  ChefHat,
  ScanLine,
  Bell,
  User,
  LogOut,
  Flame,
  LayoutDashboard
} from 'lucide-react';

interface StaffHeaderProps {
  staff: StaffUser;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onLogoutRequest: () => void;
}

export const StaffHeader: React.FC<StaffHeaderProps> = ({
  staff,
  activeTab,
  onNavigate,
  onLogoutRequest
}) => {
  const [rush, setRush] = useState(db.calculateRushLevel());
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const update = () => {
      setRush(db.calculateRushLevel());
      const notifs = db.getNotifications(staff.id, 'STAFF');
      setUnreadCount(notifs.filter((n) => !n.isRead).length);
    };
    update();
    const unsub = db.subscribe(update);
    return unsub;
  }, [staff.id]);

  const navItems = [
    { id: 'dashboard', label: 'Operations Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'orders', label: 'Kitchen Display (KDS)', icon: <ChefHat className="w-4 h-4" /> },
    { id: 'pickup', label: 'Pickup Verification', icon: <ScanLine className="w-4 h-4" /> },
    { id: 'notifications', label: 'Alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'profile', label: 'My Station', icon: <User className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Logo onClick={() => onNavigate('dashboard')} size="sm" />
          <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            Kitchen & Staff Ops
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Info */}
        <div className="flex items-center gap-3">
          {/* Rush status */}
          <div className="hidden sm:block">
            <RushLevelBadge level={rush.level} />
          </div>

          {/* Quick tab icons on mobile */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              onClick={() => onNavigate('orders')}
              className={`p-2 rounded-lg text-xs font-semibold ${
                activeTab === 'orders' ? 'bg-amber-500/20 text-amber-300' : 'text-stone-300'
              }`}
              title="Kitchen Queue"
            >
              <ChefHat className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('pickup')}
              className={`p-2 rounded-lg text-xs font-semibold ${
                activeTab === 'pickup' ? 'bg-amber-500/20 text-amber-300' : 'text-stone-300'
              }`}
              title="Pickup Verification"
            >
              <ScanLine className="w-4 h-4" />
            </button>
          </div>

          {/* Notification bell */}
          <button
            onClick={() => onNavigate('notifications')}
            className="relative p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-xl"
            title="Kitchen Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-900 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Staff Profile badge */}
          <div
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 pl-2 border-l border-stone-800 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              {staff.fullName.charAt(0)}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-stone-100">{staff.fullName}</span>
              <span className="text-[10px] text-stone-400 font-mono">{staff.position}</span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogoutRequest}
            className="p-2 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-xl transition-colors"
            title="Staff Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
