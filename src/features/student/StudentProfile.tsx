import React, { useState, useEffect } from 'react';
import { StudentUser } from '../../types';
import { db } from '../../services/db';
import { authService } from '../../services/auth';
import { ReliabilityBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Shield,
  CheckCircle2,
  Edit2,
  ArrowLeft,
  Wallet,
  Receipt,
  BookmarkCheck,
  HelpCircle,
  UtensilsCrossed,
  Lock,
  Bell,
  Copy,
  Check,
  LogOut,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export interface StudentProfileProps {
  student: StudentUser;
  onNavigate?: (tab: string) => void;
  onLogoutRequest?: () => void;
  onUpdateSuccess?: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({
  student,
  onNavigate,
  onLogoutRequest,
  onUpdateSuccess
}) => {
  const [currentStudent, setCurrentStudent] = useState<StudentUser>(student);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalFavorites, setTotalFavorites] = useState<number>(0);

  // Edit details modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [fullName, setFullName] = useState(student.fullName);
  const [phone, setPhone] = useState(student.phone);
  const [department, setDepartment] = useState(student.department);
  const [program, setProgram] = useState(student.program);
  const [semester, setSemester] = useState(student.semester.toString());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Change password modal state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Preferences state
  const [dietaryPref, setDietaryPref] = useState<'STANDARD' | 'VEGETARIAN' | 'HALAL'>(() => {
    return (localStorage.getItem('studenthub_dietary_pref') as any) || 'HALAL';
  });
  const [orderReadyAlerts, setOrderReadyAlerts] = useState<boolean>(() => {
    return localStorage.getItem('studenthub_notif_ready') !== 'false';
  });
  const [dailySpecialsAlerts, setDailySpecialsAlerts] = useState<boolean>(() => {
    return localStorage.getItem('studenthub_notif_specials') !== 'false';
  });
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const s = db.getStudentById(student.id);
      if (s) setCurrentStudent(s);

      const orders = db.getOrders().filter((o) => o.studentId === student.id);
      setTotalOrders(orders.length);

      const favorites = db.getFavorites(student.id);
      setTotalFavorites(favorites.length);
    };

    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, [student.id]);

  const handleCopyEnrollmentId = () => {
    navigator.clipboard?.writeText(currentStudent.enrollmentId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const result = db.updateStudentProfile(student.id, {
      fullName: fullName.trim(),
      phone: phone.trim(),
      department: department.trim(),
      program: program.trim(),
      semester: parseInt(semester, 10) || 1
    });

    if (result.success) {
      const refreshed = db.getStudentById(student.id);
      if (refreshed) {
        setCurrentStudent(refreshed);
      }
      authService.refreshCurrentUser();
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setEditModalOpen(false);
        if (onUpdateSuccess) onUpdateSuccess();
      }, 700);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      const creds = JSON.parse(localStorage.getItem('campusbite_credentials') || '{}');
      const cleanId = currentStudent.enrollmentId.trim().toUpperCase();
      const currentStored = creds[cleanId] || creds[currentStudent.email] || 'Student@123';

      if (currentPassword !== currentStored) {
        setPasswordError('Current password is incorrect.');
        return;
      }

      creds[cleanId] = newPassword;
      creds[currentStudent.email] = newPassword;
      localStorage.setItem('campusbite_credentials', JSON.stringify(creds));

      setPasswordSuccess(true);
      setTimeout(() => {
        setPasswordSuccess(false);
        setPasswordModalOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 900);
    } catch {
      setPasswordError('Failed to update password. Please try again.');
    }
  };

  const handleToggleDietary = (pref: 'STANDARD' | 'VEGETARIAN' | 'HALAL') => {
    setDietaryPref(pref);
    localStorage.setItem('studenthub_dietary_pref', pref);
  };

  const handleToggleReadyAlerts = () => {
    const next = !orderReadyAlerts;
    setOrderReadyAlerts(next);
    localStorage.setItem('studenthub_notif_ready', String(next));
  };

  const handleToggleSpecialsAlerts = () => {
    const next = !dailySpecialsAlerts;
    setDailySpecialsAlerts(next);
    localStorage.setItem('studenthub_notif_specials', String(next));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Return Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate?.('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-amber-700 bg-white hover:bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-xl shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="hidden sm:inline">Current Portal:</span>
          <span className="font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
            Student Account
          </span>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
            Student Profile
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your official university cafeteria credentials, dining preferences, and account security.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setFullName(currentStudent.fullName);
              setPhone(currentStudent.phone);
              setDepartment(currentStudent.department);
              setProgram(currentStudent.program);
              setSemester(currentStudent.semester.toString());
              setEditModalOpen(true);
            }}
            className="py-2 px-3.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          {onLogoutRequest && (
            <button
              onClick={onLogoutRequest}
              className="py-2 px-3.5 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 hover:border-rose-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              title="Log out of account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Student Identity Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl font-['Outfit'] shadow-md border-2 border-white">
              {currentStudent.fullName.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-['Outfit'] leading-snug">
                  {currentStudent.fullName}
                </h2>
                <ReliabilityBadge status={currentStudent.status || 'ACTIVE'} />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                  {currentStudent.enrollmentId}
                </span>
                <button
                  onClick={handleCopyEnrollmentId}
                  className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
                  title="Copy enrollment ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="text-xs text-stone-500 font-medium">
                {currentStudent.department} • {currentStudent.program} • Semester {currentStudent.semester}
              </p>
            </div>
          </div>

          {/* Quick Balance Preview */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-4 sm:p-0 bg-stone-50 sm:bg-transparent rounded-2xl border sm:border-0 border-stone-200/80">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Campus Wallet
            </span>
            <span className="text-lg sm:text-2xl font-extrabold text-amber-900 font-['Outfit'] mt-0.5">
              Rs. {currentStudent.walletBalance.toLocaleString()}
            </span>
            <button
              onClick={() => onNavigate?.('wallet')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline mt-1 inline-flex items-center gap-1"
            >
              Top Up Wallet <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Academic & Contact Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-3">
            <div className="p-2 bg-white rounded-xl border border-stone-200 text-amber-600 shrink-0 mt-0.5">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                University Email
              </span>
              <span className="text-xs font-bold text-stone-900 truncate block mt-0.5" title={currentStudent.email}>
                {currentStudent.email}
              </span>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-3">
            <div className="p-2 bg-white rounded-xl border border-stone-200 text-amber-600 shrink-0 mt-0.5">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Phone Number
              </span>
              <span className="text-xs font-bold text-stone-900 block mt-0.5">
                {currentStudent.phone || 'Not provided'}
              </span>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-3">
            <div className="p-2 bg-white rounded-xl border border-stone-200 text-amber-600 shrink-0 mt-0.5">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Academic Department
              </span>
              <span className="text-xs font-bold text-stone-900 block mt-0.5">
                {currentStudent.department}
              </span>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-3">
            <div className="p-2 bg-white rounded-xl border border-stone-200 text-amber-600 shrink-0 mt-0.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Degree Program
              </span>
              <span className="text-xs font-bold text-stone-900 block mt-0.5">
                {currentStudent.program}
              </span>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-3">
            <div className="p-2 bg-white rounded-xl border border-stone-200 text-amber-600 shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Current Semester
              </span>
              <span className="text-xs font-bold text-stone-900 block mt-0.5">
                Semester {currentStudent.semester} (Undergraduate)
              </span>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-3">
            <div className="p-2 bg-white rounded-xl border border-stone-200 text-amber-600 shrink-0 mt-0.5">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Account Status
              </span>
              <span className="text-xs font-bold text-emerald-700 block mt-0.5">
                {currentStudent.status === 'ACTIVE' ? 'Verified Student (Active)' : currentStudent.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Activity Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Orders Stat Card */}
        <div
          onClick={() => onNavigate?.('orders')}
          className="p-4 sm:p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs hover:border-amber-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="p-2 rounded-xl bg-amber-50 group-hover:bg-amber-100 text-amber-700 transition-colors">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-stone-900 font-['Outfit'] mt-2">
            {totalOrders}
          </div>
          <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1 group-hover:text-amber-700 font-medium">
            <span>View order history</span>
            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </p>
        </div>

        {/* Wallet Balance Stat Card */}
        <div
          onClick={() => onNavigate?.('wallet')}
          className="p-4 sm:p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs hover:border-amber-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Wallet Balance
            </span>
            <div className="p-2 rounded-xl bg-amber-50 group-hover:bg-amber-100 text-amber-700 transition-colors">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-900 font-['Outfit'] mt-2">
            Rs. {currentStudent.walletBalance.toLocaleString()}
          </div>
          <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1 group-hover:text-amber-700 font-medium">
            <span>Manage & top up</span>
            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </p>
        </div>

        {/* Saved Favorites Stat Card */}
        <div
          onClick={() => onNavigate?.('favorites')}
          className="p-4 sm:p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs hover:border-amber-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Favorites
            </span>
            <div className="p-2 rounded-xl bg-amber-50 group-hover:bg-amber-100 text-amber-700 transition-colors">
              <BookmarkCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-stone-900 font-['Outfit'] mt-2">
            {totalFavorites}
          </div>
          <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1 group-hover:text-amber-700 font-medium">
            <span>View favorite dishes</span>
            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </p>
        </div>

        {/* Reliability Score */}
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Pickup Rate
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-['Outfit'] mt-2">
            {currentStudent.noShowCount === 0 ? '100%' : `${Math.max(0, 100 - currentStudent.noShowCount * 15)}%`}
          </div>
          <p className="text-[11px] text-stone-500 mt-1 font-medium">
            {currentStudent.noShowCount === 0 ? 'Zero missed pickups' : `${currentStudent.noShowCount} missed pickups`}
          </p>
        </div>
      </div>

      {/* Quick Navigation to Other Sections */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-['Outfit']">
              Quick Hub Navigation
            </h3>
            <p className="text-xs text-stone-500">
              Jump directly to any section of the university cafeteria portal.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate?.('menu')}
            className="p-4 rounded-2xl border border-stone-200/90 hover:border-amber-400 bg-stone-50/50 hover:bg-amber-50/40 text-left transition-all group flex items-start gap-3.5"
          >
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-stone-900 text-xs block group-hover:text-amber-900">
                Browse Cafeteria Menu
              </span>
              <span className="text-[11px] text-stone-500 block mt-0.5 leading-snug">
                Pre-order fresh meals, specials & drinks.
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-0.5 shrink-0 mt-2" />
          </button>

          <button
            onClick={() => onNavigate?.('orders')}
            className="p-4 rounded-2xl border border-stone-200/90 hover:border-amber-400 bg-stone-50/50 hover:bg-amber-50/40 text-left transition-all group flex items-start gap-3.5"
          >
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Receipt className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-stone-900 text-xs block group-hover:text-amber-900">
                My Orders & History
              </span>
              <span className="text-[11px] text-stone-500 block mt-0.5 leading-snug">
                View prep progress & 4-digit pickup code.
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-0.5 shrink-0 mt-2" />
          </button>

          <button
            onClick={() => onNavigate?.('wallet')}
            className="p-4 rounded-2xl border border-stone-200/90 hover:border-amber-400 bg-stone-50/50 hover:bg-amber-50/40 text-left transition-all group flex items-start gap-3.5"
          >
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-stone-900 text-xs block group-hover:text-amber-900">
                Campus Wallet
              </span>
              <span className="text-[11px] text-stone-500 block mt-0.5 leading-snug">
                Instant top-ups & cashless transactions.
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-0.5 shrink-0 mt-2" />
          </button>

          <button
            onClick={() => onNavigate?.('favorites')}
            className="p-4 rounded-2xl border border-stone-200/90 hover:border-amber-400 bg-stone-50/50 hover:bg-amber-50/40 text-left transition-all group flex items-start gap-3.5"
          >
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <BookmarkCheck className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-stone-900 text-xs block group-hover:text-amber-900">
                Saved Favorites
              </span>
              <span className="text-[11px] text-stone-500 block mt-0.5 leading-snug">
                Re-order your favorite dishes in one click.
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-0.5 shrink-0 mt-2" />
          </button>

          <button
            onClick={() => onNavigate?.('support')}
            className="p-4 rounded-2xl border border-stone-200/90 hover:border-amber-400 bg-stone-50/50 hover:bg-amber-50/40 text-left transition-all group flex items-start gap-3.5"
          >
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-stone-900 text-xs block group-hover:text-amber-900">
                Cafeteria Help & Support
              </span>
              <span className="text-[11px] text-stone-500 block mt-0.5 leading-snug">
                FAQs, feedback & kitchen desk assistance.
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-0.5 shrink-0 mt-2" />
          </button>

          <button
            onClick={() => onNavigate?.('dashboard')}
            className="p-4 rounded-2xl border border-stone-200/90 hover:border-amber-400 bg-stone-50/50 hover:bg-amber-50/40 text-left transition-all group flex items-start gap-3.5"
          >
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-stone-900 text-xs block group-hover:text-amber-900">
                Student Dashboard
              </span>
              <span className="text-[11px] text-stone-500 block mt-0.5 leading-snug">
                Return to home recommendations & active status.
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-0.5 shrink-0 mt-2" />
          </button>
        </div>
      </div>

      {/* Account Settings & Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dining Preferences Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-['Outfit']">
              Dining Preferences
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Customize meal tags and cafeteria notification alerts.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                Dietary Filter Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleDietary('HALAL')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                    dietaryPref === 'HALAL'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Halal Only
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleDietary('VEGETARIAN')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                    dietaryPref === 'VEGETARIAN'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Vegetarian
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleDietary('STANDARD')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                    dietaryPref === 'STANDARD'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  All Items
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-xs font-bold text-stone-800 block">
                      Kitchen Pickup Alerts
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      Notify when meals are marked Ready at the counter.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleReadyAlerts}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    orderReadyAlerts ? 'bg-amber-600' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      orderReadyAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-xs font-bold text-stone-800 block">
                      Chef Specials & Announcements
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      Receive daily menu highlights and cafeteria discounts.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleSpecialsAlerts}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    dailySpecialsAlerts ? 'bg-amber-600' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      dailySpecialsAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Password Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-['Outfit']">
              Security & Credentials
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Keep your student dining credentials protected.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl border border-stone-200 text-stone-600">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    Account Password
                  </span>
                  <span className="text-[11px] text-stone-500 block">
                    Last updated recently
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPasswordModalOpen(true)}
                className="py-1.5 px-3 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold rounded-xl transition-colors shadow-2xs"
              >
                Change Password
              </button>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <span className="font-bold flex items-center gap-1.5 text-amber-900">
                <Shield className="w-4 h-4 text-amber-600" />
                Reliability Guidelines & Standing
              </span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Student Hub cafeteria orders are prepared live to maintain freshness. Uncollected pre-orders mark a no-show. Repeated no-shows may temporarily limit high-demand lunch slot reservations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Student Information"
        subtitle="Update contact and academic information"
        maxWidth="sm"
      >
        {savedSuccess ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <p className="font-bold text-stone-900 text-sm">Profile updated successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Semester (1-8)
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium bg-white focus:outline-hidden focus:border-amber-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Degree Program
              </label>
              <input
                type="text"
                required
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false);
          setPasswordError('');
        }}
        title="Change Account Password"
        subtitle="Update your student login password"
        maxWidth="sm"
      >
        {passwordSuccess ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <p className="font-bold text-stone-900 text-sm">Password changed successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-3.5">
            {passwordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{passwordError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                New Password (Min 6 chars)
              </label>
              <input
                type="password"
                required
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
