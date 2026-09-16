import React, { useState } from 'react';
import { Logo } from '../components/common/Logo';
import { Footer } from '../components/common/Footer';
import { auth } from '../services/auth';
import { ShieldAlert, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AdminAuthViewProps {
  onBackToRoles: () => void;
  onLoginSuccess: () => void;
}

export const AdminAuthView: React.FC<AdminAuthViewProps> = ({
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
      setErrorMsg('Please enter your Administrator ID or Email.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter administrator password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = auth.loginAdmin(identifier, password);
      setLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.error || 'Access denied: Invalid administrator credentials.');
      }
    }, 300);
  };

  const fillAdminDemo = () => {
    setIdentifier('ADMIN-01');
    setPassword('Admin@123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <Logo size="sm" onClick={onBackToRoles} />
        <button
          onClick={onBackToRoles}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-full hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Role Selection</span>
        </button>
      </header>

      {/* Main Form */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 flex flex-col justify-center">
        <div className="bg-stone-900 rounded-3xl p-7 sm:p-9 border border-stone-800 shadow-2xl">
          {/* Top Badge */}
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
            Cafeteria Management Admin
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Menu management, inventory sync, staff, and financial controls.
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
                Admin ID or Email
              </label>
              <input
                type="text"
                required
                placeholder="ADMIN-01 or admin@campusbite.edu"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium text-white placeholder:text-stone-600"
              />
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
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium text-white placeholder:text-stone-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating Executive...' : 'Sign In as Administrator'}
            </button>
          </form>

          {/* Demo Helper */}
          <div className="mt-6 pt-5 border-t border-stone-800">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
              Default Administrator (Password: Admin@123)
            </span>
            <button
              type="button"
              onClick={fillAdminDemo}
              className="text-xs px-3 py-1.5 bg-stone-950 hover:bg-amber-950/30 text-stone-300 hover:text-amber-300 border border-stone-800 rounded-lg font-mono transition-colors"
            >
              ADMIN-01 (Dr. Kamran Siddiqui)
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
