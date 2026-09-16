import React, { useState } from 'react';
import { Logo } from '../components/common/Logo';
import { Footer } from '../components/common/Footer';
import { auth } from '../services/auth';
import { ChefHat, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface StaffAuthViewProps {
  onBackToRoles: () => void;
  onLoginSuccess: () => void;
}

export const StaffAuthView: React.FC<StaffAuthViewProps> = ({
  onBackToRoles,
  onLoginSuccess
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your Staff ID or Cafeteria Email.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your staff password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = auth.loginStaff(identifier, password);
      setLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please verify staff credentials.');
      }
    }, 300);
  };

  const fillStaffDemo = (id: string) => {
    setIdentifier(id);
    setPassword('Staff@123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-900 text-stone-100">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <Logo size="sm" onClick={onBackToRoles} />
        <button
          onClick={onBackToRoles}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 border border-stone-700 px-3 py-1.5 rounded-full hover:bg-stone-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Role Selection</span>
        </button>
      </header>

      {/* Main Form */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 flex flex-col justify-center">
        <div className="bg-stone-800/90 rounded-3xl p-7 sm:p-9 border border-stone-700 shadow-2xl backdrop-blur-md">
          {/* Top Badge */}
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center mb-4">
            <ChefHat className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
            Cafeteria Staff Portal
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Kitchen queue management & counter order pickup verification.
          </p>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Staff ID or Email
              </label>
              <input
                type="text"
                required
                placeholder="e.g. STAFF-101 or staff@cafeteria.edu"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-white placeholder:text-stone-500"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Staff must use authorized cafeteria credentials (not student IDs).
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-white placeholder:text-stone-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying Staff Access...' : 'Sign In to Kitchen Terminal'}
            </button>
          </form>

          {/* Demo Helper */}
          <div className="mt-6 pt-5 border-t border-stone-700">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
              Staff Test Logins (Password: Staff@123)
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fillStaffDemo('STAFF-101')}
                className="text-xs px-2.5 py-1 bg-stone-900 hover:bg-emerald-950 text-stone-300 hover:text-emerald-300 border border-stone-700 rounded-lg font-mono transition-colors"
              >
                Tariq (STAFF-101 Supervisor)
              </button>
              <button
                type="button"
                onClick={() => fillStaffDemo('STAFF-102')}
                className="text-xs px-2.5 py-1 bg-stone-900 hover:bg-emerald-950 text-stone-300 hover:text-emerald-300 border border-stone-700 rounded-lg font-mono transition-colors"
              >
                Bilal (STAFF-102 Kitchen)
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
