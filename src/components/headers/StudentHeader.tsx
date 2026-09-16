import React, { useState, useEffect } from 'react';
import { Logo } from '../common/Logo';
import { StudentUser, NotificationItem } from '../../types';
import { cart } from '../../services/cart';
import { db } from '../../services/db';
import {
  ShoppingBag,
  Bell,
  User,
  LogOut,
  Utensils,
  Receipt,
  Wallet,
  BookmarkCheck,
  HelpCircle,
  Menu as MenuIcon,
  X
} from 'lucide-react';

interface StudentHeaderProps {
  student: StudentUser;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onLogoutRequest: () => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  student,
  activeTab,
  onNavigate,
  onLogoutRequest
}) => {
  const [cartCount, setCartCount] = useState(cart.getTotalItemCount());
  const [unreadNotifs, setUnreadNotifs] = useState<NotificationItem[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubCart = cart.subscribe(() => {
      setCartCount(cart.getTotalItemCount());
    });
    const updateNotifs = () => {
      const notifs = db.getNotifications(student.id, 'STUDENT');
      setUnreadNotifs(notifs.filter((n) => !n.isRead));
    };
    updateNotifs();
    const unsubDb = db.subscribe(updateNotifs);
    return () => {
      unsubCart();
      unsubDb();
    };
  }, [student.id]);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: <Utensils className="w-4 h-4" /> },
    { id: 'menu', label: 'Menu', icon: <Utensils className="w-4 h-4" /> },
    { id: 'orders', label: 'My Orders', icon: <Receipt className="w-4 h-4" /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4" /> },
    { id: 'favorites', label: 'Favorites', icon: <BookmarkCheck className="w-4 h-4" /> },
    { id: 'support', label: 'Help', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Logo onClick={() => onNavigate('dashboard')} size="sm" />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-50 text-amber-800 font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wallet Quick Pill */}
          <button
            onClick={() => onNavigate('wallet')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50/80 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-full text-xs font-semibold transition-colors"
          >
            <Wallet className="w-3.5 h-3.5 text-amber-600" />
            <span>Rs. {student.walletBalance.toLocaleString()}</span>
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => onNavigate('cart')}
            className="relative p-2 text-stone-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
            title="View Cart"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
              }}
              className="relative p-2 text-stone-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown preview */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">Notifications</span>
                    {unreadNotifs.length > 0 && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unreadNotifs.length} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      db.markAllNotificationsAsRead(student.id);
                      setShowNotifDropdown(false);
                    }}
                    className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                  {unreadNotifs.length === 0 ? (
                    <div className="p-6 text-center text-xs text-stone-500">
                      You're all caught up! No unread notifications.
                    </div>
                  ) : (
                    unreadNotifs.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          db.markNotificationAsRead(n.id);
                          if (n.relatedOrderId) onNavigate('orders');
                          setShowNotifDropdown(false);
                        }}
                        className="p-3 hover:bg-stone-50 cursor-pointer transition-colors text-xs"
                      >
                        <p className="font-semibold text-stone-900">{n.title}</p>
                        <p className="text-stone-600 mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-stone-400 mt-1">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 bg-stone-50 border-t border-stone-200 text-center">
                  <button
                    onClick={() => {
                      setShowNotifDropdown(false);
                      onNavigate('notifications');
                    }}
                    className="text-xs font-bold text-amber-700 hover:underline"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Pill */}
          <div
            onClick={() => onNavigate('profile')}
            className="hidden sm:flex items-center gap-2 pl-2 cursor-pointer border-l border-stone-200"
          >
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {student.fullName.charAt(0)}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-stone-800 leading-tight max-w-[110px] truncate">
                {student.fullName}
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                {student.enrollmentId}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogoutRequest}
            className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1"
            title="Log Out"
            aria-label="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
            <span className="text-xs font-bold text-stone-600">
              {student.fullName} ({student.enrollmentId})
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Wallet: Rs. {student.walletBalance.toLocaleString()}
            </span>
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold ${
                activeTab === item.id
                  ? 'bg-amber-50 text-amber-800'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onLogoutRequest();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 mt-2 pt-2 border-t border-stone-100"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      )}
    </header>
  );
};
