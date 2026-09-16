import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { AdminUser } from '../../types';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  Boxes,
  ShoppingBag,
  Users,
  Briefcase,
  Clock,
  TicketPercent,
  RotateCcw,
  BarChart3,
  ReceiptText,
  History,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface AdminHeaderProps {
  admin: AdminUser;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onLogoutRequest: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  admin,
  activeTab,
  onNavigate,
  onLogoutRequest
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'menu', label: 'Menu Items', icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
    { id: 'inventory', label: 'Inventory', icon: <Boxes className="w-3.5 h-3.5" /> },
    { id: 'orders', label: 'Live Orders', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { id: 'students', label: 'Students', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'staff', label: 'Staff Team', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'pickup-slots', label: 'Slots', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-3.5 h-3.5" /> }
  ];

  const secondaryNav = [
    { id: 'categories', label: 'Food Categories', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'discounts', label: 'Discounts & Promos', icon: <TicketPercent className="w-3.5 h-3.5" /> },
    { id: 'refunds', label: 'Refund Audits', icon: <RotateCcw className="w-3.5 h-3.5" /> },
    { id: 'expenses', label: 'Cafeteria Expenses', icon: <ReceiptText className="w-3.5 h-3.5" /> },
    { id: 'audit-logs', label: 'System Audit Logs', icon: <History className="w-3.5 h-3.5" /> }
  ];

  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-900 border-b border-stone-800 text-stone-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Logo onClick={() => onNavigate('dashboard')} size="sm" />
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Admin Console
          </span>
        </div>

        {/* Primary Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-1">
          {mainNav.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-600 text-white font-bold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}

          {/* More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                secondaryNav.some((n) => n.id === activeTab)
                  ? 'bg-amber-600/30 text-amber-300'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <span>More</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {moreOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-stone-800 rounded-xl shadow-2xl border border-stone-700 py-1 z-50 animate-in fade-in">
                {secondaryNav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMoreOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-left ${
                      activeTab === item.id
                        ? 'bg-amber-600 text-white font-bold'
                        : 'text-stone-300 hover:bg-stone-700 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-stone-100">{admin.fullName}</span>
            <span className="text-[10px] text-amber-400 font-mono">Owner / Admin</span>
          </div>

          <button
            onClick={onLogoutRequest}
            className="p-2 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-xl transition-colors"
            title="Log Out of Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-stone-300 hover:bg-stone-800 rounded-lg text-xs"
          >
            Menu
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-800 bg-stone-900 px-4 py-3 grid grid-cols-2 gap-1 max-h-96 overflow-y-auto">
          {[...mainNav, ...secondaryNav].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left ${
                activeTab === item.id
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
