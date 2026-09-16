import React, { useState } from 'react';
import { Logo } from '../components/common/Logo';
import { Footer } from '../components/common/Footer';
import { auth } from '../services/auth';
import { db } from '../services/db';
import {
  GraduationCap,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

interface StudentAuthViewProps {
  onBackToRoles: () => void;
  onLoginSuccess: () => void;
}

export const StudentAuthView: React.FC<StudentAuthViewProps> = ({
  onBackToRoles,
  onLoginSuccess
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form state
  const [enrollmentId, setEnrollmentId] = useState('');
  const [password, setPassword] = useState('');

  // Forgot password modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  // Registration form state (9 required fields)
  const [regEnrollmentId, setRegEnrollmentId] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDepartment, setRegDepartment] = useState('Computer Science');
  const [regProgram, setRegProgram] = useState('BS Computer Science');
  const [regSemester, setRegSemester] = useState('4');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!enrollmentId.trim()) {
      setErrorMsg('Please enter your University Enrollment ID.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = auth.loginStudent(enrollmentId, password);
      setLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.error || 'Unable to sign in. Please check your credentials.');
      }
    }, 300);
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validation
    if (!regEnrollmentId.trim()) {
      setErrorMsg('University Enrollment ID is required (e.g. 2024-CS-123).');
      return;
    }
    if (!regFullName.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@') || !regEmail.includes('.')) {
      setErrorMsg('Please enter a valid university email address.');
      return;
    }
    if (!regDepartment.trim()) {
      setErrorMsg('Department is required.');
      return;
    }
    if (!regProgram.trim()) {
      setErrorMsg('Program / Degree is required.');
      return;
    }
    if (!regPhone.trim()) {
      setErrorMsg('Phone Number is required.');
      return;
    }
    if (regPassword.length < 8) {
      setErrorMsg('Password must contain at least 8 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = db.registerStudent(
        {
          enrollmentId: regEnrollmentId.trim().toUpperCase(),
          fullName: regFullName.trim(),
          email: regEmail.trim(),
          department: regDepartment.trim(),
          program: regProgram.trim(),
          semester: parseInt(regSemester, 10) || 1,
          phone: regPhone.trim()
        },
        regPassword
      );

      setLoading(false);
      if (res.success && res.student) {
        setSuccessMsg('Account registered successfully! Signing you in...');
        setTimeout(() => {
          auth.loginStudent(regEnrollmentId, regPassword);
          onLoginSuccess();
        }, 600);
      } else {
        setErrorMsg(res.error || 'Failed to create student account.');
      }
    }, 400);
  };

  const fillDemoStudent = (id: string) => {
    setEnrollmentId(id);
    setPassword('Student@123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <Logo size="sm" onClick={onBackToRoles} />
        <button
          onClick={onBackToRoles}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-1.5 rounded-full hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Role Selection</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-7 sm:p-9 border border-stone-200 shadow-xl">
          {/* Top Icon */}
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6" />
          </div>

          {!isRegistering ? (
            /* ---- LOGIN VIEW ---- */
            <div>
              <h2 className="text-2xl font-extrabold text-stone-900 font-['Outfit']">
                Welcome back
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Sign in to your Student Hub student account.
              </p>

              {errorMsg && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    University Enrollment ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024-CS-123"
                    value={enrollmentId}
                    onChange={(e) => setEnrollmentId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium uppercase placeholder:normal-case placeholder:font-normal"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Use your official campus enrollment card number
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-xl text-sm shadow-md transition-colors disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {/* Demo Credentials Helper Pill */}
              <div className="mt-6 pt-5 border-t border-stone-100">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                  Quick Demo Accounts (Password: Student@123)
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoStudent('2024-CS-123')}
                    className="text-xs px-2.5 py-1 bg-stone-100 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 border border-stone-200 rounded-lg font-mono font-medium transition-colors"
                  >
                    Ali (2024-CS-123)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoStudent('2024-SE-105')}
                    className="text-xs px-2.5 py-1 bg-stone-100 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 border border-stone-200 rounded-lg font-mono font-medium transition-colors"
                  >
                    Sara (2024-SE-105)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoStudent('2023-EE-089')}
                    className="text-xs px-2.5 py-1 bg-stone-100 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 border border-stone-200 rounded-lg font-mono font-medium transition-colors"
                  >
                    Hamza (2023-EE-089)
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center text-xs text-stone-500">
                New to Student Hub?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setErrorMsg('');
                  }}
                  className="font-bold text-amber-700 hover:text-amber-800 underline ml-1"
                >
                  Create Student Account
                </button>
              </div>
            </div>
          ) : (
            /* ---- REGISTRATION VIEW ---- */
            <div>
              <h2 className="text-2xl font-extrabold text-stone-900 font-['Outfit']">
                Create Student Account
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Register your university enrollment to pre-order meals.
              </p>

              {errorMsg && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleRegistrationSubmit} className="mt-5 space-y-3.5 max-h-[62vh] overflow-y-auto pr-1">
                {/* 1. Enrollment ID */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    1. University Enrollment ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024-CS-123"
                    value={regEnrollmentId}
                    onChange={(e) => setRegEnrollmentId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium uppercase"
                  />
                </div>

                {/* 2. Full Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    2. Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ali Khan"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                {/* 3. University Email */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    3. University Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ali@university.edu"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                {/* 4. Department & 5. Program */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      4. Department *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Computer Science"
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      5. Program *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="BS CS"
                      value={regProgram}
                      onChange={(e) => setRegProgram(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    />
                  </div>
                </div>

                {/* 6. Semester & 7. Phone */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      6. Semester (1-8) *
                    </label>
                    <select
                      value={regSemester}
                      onChange={(e) => setRegSemester(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Semester {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      7. Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 1234567"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    />
                  </div>
                </div>

                {/* 8. Password & 9. Confirm Password */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      8. Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Min 8 chars"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      9. Confirm Pass *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat pass"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-xl text-sm shadow-md transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Complete Student Registration'}
                </button>
              </form>

              <div className="mt-4 text-center text-xs text-stone-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setErrorMsg('');
                  }}
                  className="font-bold text-amber-700 hover:text-amber-800 underline ml-1"
                >
                  Sign in here
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => {
          setForgotModalOpen(false);
          setForgotMsg('');
        }}
        title="Reset Student Password"
        subtitle="We will send a reset link to your university email"
        maxWidth="sm"
      >
        <div className="space-y-4">
          {forgotMsg ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{forgotMsg}</span>
            </div>
          ) : (
            <>
              <p className="text-xs text-stone-600">
                Enter your registered University Enrollment ID or official university email.
              </p>
              <input
                type="text"
                placeholder="2024-CS-123 or email@university.edu"
                value={forgotInput}
                onChange={(e) => setForgotInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  if (forgotInput.trim()) {
                    const res = auth.resetPassword(forgotInput);
                    setForgotMsg(res.message);
                  }
                }}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Send Password Reset Request
              </button>
            </>
          )}
        </div>
      </Modal>

      {/* Footer */}
      <Footer />
    </div>
  );
};
