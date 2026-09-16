import React, { useState, useEffect } from 'react';
import { StudentUser, StudentStatus } from '../../types';
import { db } from '../../services/db';
import { StudentStatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Search,
  Wallet,
  Plus,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Edit2,
  Phone,
  Mail,
  ShieldAlert,
  X,
  ArrowUpDown
} from 'lucide-react';

export const AdminStudentsManager: React.FC = () => {
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Wallet adjustment modal
  const [adjustStudent, setAdjustStudent] = useState<StudentUser | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(500);
  const [adjustNote, setAdjustNote] = useState('Counter cash deposit');
  const [adjustSuccess, setAdjustSuccess] = useState(false);

  // Edit Student modal
  const [editingStudent, setEditingStudent] = useState<StudentUser | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editProgram, setEditProgram] = useState('');
  const [editSemester, setEditSemester] = useState<number>(1);
  const [editStatus, setEditStatus] = useState<StudentStatus>('ACTIVE');
  const [editSuccess, setEditSuccess] = useState(false);

  // Register New Student modal
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regEnrollmentId, setRegEnrollmentId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDepartment, setRegDepartment] = useState('Computer Science');
  const [regProgram, setRegProgram] = useState('BS Computer Science');
  const [regSemester, setRegSemester] = useState<number>(1);
  const [regInitialBalance, setRegInitialBalance] = useState<number>(500);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Load students
  useEffect(() => {
    const loadData = () => {
      try {
        const list = db.getStudents();
        setStudents(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Failed to load students:', err);
      }
    };
    loadData();
    const unsub = db.subscribe(loadData);
    return unsub;
  }, []);

  // Quick cycle status on badge click
  const handleCycleStatus = (studentId: string, currentStatus?: StudentStatus) => {
    const current = currentStatus || 'ACTIVE';
    const sequence: StudentStatus[] = ['ACTIVE', 'WARNING', 'RESTRICTED', 'SUSPENDED'];
    const currentIndex = sequence.indexOf(current);
    const nextStatus = sequence[(currentIndex + 1) % sequence.length];
    db.updateStudentReliability(studentId, nextStatus);
  };

  // Open Edit Modal
  const openEdit = (student: StudentUser) => {
    setEditingStudent(student);
    setEditFullName(student.fullName || '');
    setEditPhone(student.phone || '');
    setEditDepartment(student.department || 'Computer Science');
    setEditProgram(student.program || 'BS Computer Science');
    setEditSemester(typeof student.semester === 'number' ? student.semester : 1);
    setEditStatus(student.status || 'ACTIVE');
    setEditSuccess(false);
  };

  // Save Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    db.updateStudentProfile(editingStudent.id, {
      fullName: editFullName.trim(),
      phone: editPhone.trim(),
      department: editDepartment.trim(),
      program: editProgram.trim(),
      semester: editSemester
    });

    if (editStatus !== editingStudent.status) {
      db.updateStudentReliability(editingStudent.id, editStatus);
    }

    setEditSuccess(true);
    setTimeout(() => {
      setEditSuccess(false);
      setEditingStudent(null);
    }, 800);
  };

  // Handle Wallet Adjustment
  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustStudent || adjustAmount <= 0) return;

    db.topUpWallet(adjustStudent.id, adjustAmount, `Admin Adjustment: ${adjustNote.trim() || 'Counter Deposit'}`);
    setAdjustSuccess(true);
    setTimeout(() => {
      setAdjustSuccess(false);
      setAdjustStudent(null);
    }, 900);
  };

  // Handle Register Student
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regFullName.trim() || !regEnrollmentId.trim() || !regEmail.trim()) {
      setRegError('Full Name, Enrollment ID, and Email are required.');
      return;
    }

    const res = db.registerStudent(
      {
        fullName: regFullName.trim(),
        enrollmentId: regEnrollmentId.trim().toUpperCase(),
        email: regEmail.trim().toLowerCase(),
        phone: regPhone.trim() || '+92 300 0000000',
        department: regDepartment.trim(),
        program: regProgram.trim(),
        semester: regSemester
      },
      'student123'
    );

    if (!res.success || !res.student) {
      setRegError(res.error || 'Failed to register student account.');
      return;
    }

    if (regInitialBalance > 0) {
      db.topUpWallet(res.student.id, regInitialBalance, 'Initial Registration Deposit');
    }

    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setIsRegisterOpen(false);
      // Reset form
      setRegFullName('');
      setRegEnrollmentId('');
      setRegEmail('');
      setRegPhone('');
      setRegDepartment('Computer Science');
      setRegProgram('BS Computer Science');
      setRegSemester(1);
      setRegInitialBalance(500);
    }, 900);
  };

  // Computed metrics
  const totalStudents = students.length;
  const goodStandingCount = students.filter((s) => s.status === 'ACTIVE' || !s.status).length;
  const totalWalletFloat = students.reduce((acc, s) => acc + (s.walletBalance || 0), 0);
  const flaggedCount = students.filter((s) => s.status && s.status !== 'ACTIVE').length;

  // Departments for dropdown
  const departments = Array.from(
    new Set(students.map((s) => s.department).filter((d): d is string => Boolean(d)))
  );

  // Filtered students list
  const filteredStudents = students.filter((s) => {
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const nameMatch = (s.fullName || '').toLowerCase().includes(q);
      const enrollMatch = (s.enrollmentId || '').toLowerCase().includes(q);
      const emailMatch = (s.email || '').toLowerCase().includes(q);
      const phoneMatch = (s.phone || '').toLowerCase().includes(q);
      if (!nameMatch && !enrollMatch && !emailMatch && !phoneMatch) {
        return false;
      }
    }
    if (departmentFilter !== 'ALL' && s.department !== departmentFilter) {
      return false;
    }
    if (statusFilter !== 'ALL') {
      const currentStatus = s.status || 'ACTIVE';
      if (currentStatus !== statusFilter) {
        return false;
      }
    }
    return true;
  });

  const clearFilters = () => {
    setSearch('');
    setDepartmentFilter('ALL');
    setStatusFilter('ALL');
  };

  const hasActiveFilters = search.trim() !== '' || departmentFilter !== 'ALL' || statusFilter !== 'ALL';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
            Enrolled Student Accounts
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage university student profiles, dining wallet balances, and attendance reliability standing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold bg-stone-100 text-stone-800 px-3 py-1.5 rounded-xl border border-stone-200">
            {totalStudents} Registered Accounts
          </span>
          <button
            type="button"
            id="register-student-btn"
            onClick={() => {
              setRegError('');
              setIsRegisterOpen(true);
            }}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Student</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Total Accounts */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[11px] font-bold uppercase tracking-wider">
              Total Students
            </span>
            <div className="p-2 rounded-xl bg-stone-100 text-stone-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-['Outfit']">
            {totalStudents}
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">Enrolled campus diner accounts</p>
        </div>

        {/* Card 2: In Good Standing */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[11px] font-bold uppercase tracking-wider">
              Good Standing
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-2 font-['Outfit']">
            {goodStandingCount}
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">Full ordering & slot privileges</p>
        </div>

        {/* Card 3: Dining Float / Balance */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[11px] font-bold uppercase tracking-wider">
              Total Wallet Float
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-mono">
            Rs. {totalWalletFloat.toLocaleString()}
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">Active dining balance in circulation</p>
        </div>

        {/* Card 4: Reliability Alerts */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[11px] font-bold uppercase tracking-wider">
              Flagged Accounts
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-700 mt-2 font-['Outfit']">
            {flaggedCount}
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">Warnings, restricted, or suspended</p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            id="students-search-input"
            placeholder="Search by student name, enrollment ID, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50 focus:bg-white transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Department Filter */}
          <select
            id="students-dept-filter"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            id="students-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Standings</option>
            <option value="ACTIVE">Good Standing (Active)</option>
            <option value="WARNING">Reliability Warning</option>
            <option value="RESTRICTED">Temporary Restriction</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-2 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-3">Enrollment ID</th>
                <th className="py-3.5 px-3">Academic Program</th>
                <th className="py-3.5 px-3">Semester & Contact</th>
                <th className="py-3.5 px-3">Wallet Balance</th>
                <th className="py-3.5 px-3 text-center">Reliability Standing</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <GraduationCap className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-stone-600">No student accounts found</p>
                    <p className="text-xs text-stone-400 mt-1">
                      {hasActiveFilters
                        ? 'Try adjusting your search query or filters.'
                        : 'No student accounts are currently registered in the database.'}
                    </p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-3 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-lg font-bold text-xs hover:bg-amber-100"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const currentStatus = student.status || 'ACTIVE';
                  const initials = (student.fullName || 'ST')
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <tr key={student.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Student Name & Email */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block">{student.fullName || 'Student'}</span>
                            <span className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-2.5 h-2.5" />
                              {student.email || 'No email'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Enrollment ID */}
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                          {student.enrollmentId || 'N/A'}
                        </span>
                      </td>

                      {/* Program & Department */}
                      <td className="py-3 px-3">
                        <span className="font-semibold text-stone-800 block">
                          {student.department || 'General'}
                        </span>
                        <span className="text-[10px] text-stone-400 block">
                          {student.program || 'Undergraduate'}
                        </span>
                      </td>

                      {/* Semester & Phone */}
                      <td className="py-3 px-3">
                        <span className="inline-block px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded text-[10px] font-bold">
                          Sem {student.semester || 1}
                        </span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          {student.phone || 'No phone'}
                        </span>
                      </td>

                      {/* Wallet Balance */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900 text-sm">
                            Rs. {(student.walletBalance || 0).toLocaleString()}
                          </span>
                        </div>
                      </td>

                      {/* Reliability Standing with Quick Toggle */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleCycleStatus(student.id, student.status)}
                          title="Click to cycle reliability standing (Active / Warning / Restricted / Suspended)"
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <StudentStatusBadge status={currentStatus} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setAdjustStudent(student);
                              setAdjustAmount(500);
                              setAdjustNote('Counter cash deposit');
                              setAdjustSuccess(false);
                            }}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-bold text-[11px] transition-colors inline-flex items-center gap-1 border border-amber-200/50"
                            title="Adjust student wallet balance"
                          >
                            <Wallet className="w-3 h-3" />
                            <span>Top Up</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openEdit(student)}
                            className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                            title="Edit student details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Wallet Modal */}
      <Modal
        isOpen={!!adjustStudent}
        onClose={() => setAdjustStudent(null)}
        title="Manual Wallet Adjustment"
        subtitle={`Student: ${adjustStudent?.fullName} (${adjustStudent?.enrollmentId})`}
        maxWidth="sm"
      >
        {adjustSuccess ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-stone-900 text-sm">Wallet Updated Successfully!</h4>
            <p className="text-xs text-stone-500">
              Rs. {adjustAmount.toLocaleString()} added. Balance updated immediately.
            </p>
          </div>
        ) : (
          <form onSubmit={handleWalletSubmit} className="space-y-4">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <span className="text-stone-400 uppercase font-bold block text-[10px]">
                Current Student Balance
              </span>
              <span className="text-base font-extrabold font-mono text-stone-900">
                Rs. {(adjustStudent?.walletBalance || 0).toLocaleString()}
              </span>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Quick Amount Shortcuts
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[200, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAdjustAmount(amt)}
                    className={`py-1.5 text-xs font-bold font-mono rounded-lg border transition-colors ${
                      adjustAmount === amt
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    +{amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Amount to Deposit (Rs.) *
              </label>
              <input
                type="number"
                step="50"
                min="10"
                required
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Reason / Reference Note
              </label>
              <input
                type="text"
                required
                value={adjustNote}
                onChange={(e) => setAdjustNote(e.target.value)}
                placeholder="e.g. Counter cash deposit, Bursary credit..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
              >
                Deposit Funds to Student Wallet
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        title="Edit Student Account"
        subtitle={`Enrollment ID: ${editingStudent?.enrollmentId}`}
        maxWidth="md"
      >
        {editSuccess ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-stone-900 text-sm">Account Updated!</h4>
            <p className="text-xs text-stone-500">Student information has been saved.</p>
          </div>
        ) : (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Semester
                </label>
                <select
                  value={editSemester}
                  onChange={(e) => setEditSemester(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Program
                </label>
                <input
                  type="text"
                  required
                  value={editProgram}
                  onChange={(e) => setEditProgram(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Reliability Status Setting */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Reliability Standing / Account Privilege
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as StudentStatus)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              >
                <option value="ACTIVE">Good Standing (Active - Normal Access)</option>
                <option value="WARNING">Reliability Warning (High No-Shows)</option>
                <option value="RESTRICTED">Temporary Restriction (Slots Limited)</option>
                <option value="SUSPENDED">Suspended (Ordering Disabled)</option>
              </select>
              <p className="text-[11px] text-stone-400 mt-1">
                Setting to Good Standing clears accumulated no-show penalty flags.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Register New Student Modal */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Register New Student Account"
        subtitle="Create a university dining account with wallet access"
        maxWidth="md"
      >
        {regSuccess ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-stone-900 text-sm">Student Registered!</h4>
            <p className="text-xs text-stone-500">
              Account created and initial dining credit credited.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            {regError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Zainab Malik"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Enrollment ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2024-CS-155"
                  value={regEnrollmentId}
                  onChange={(e) => setRegEnrollmentId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  University Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. zainab.malik@university.edu"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+92 300 1234567"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Semester
                </label>
                <select
                  value={regSemester}
                  onChange={(e) => setRegSemester(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Degree Program
                </label>
                <input
                  type="text"
                  required
                  value={regProgram}
                  onChange={(e) => setRegProgram(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Initial Wallet Deposit (Rs.)
              </label>
              <input
                type="number"
                step="50"
                min="0"
                value={regInitialBalance}
                onChange={(e) => setRegInitialBalance(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <p className="text-[10px] text-stone-400 mt-1">
                Default starting dining balance for cafeteria orders.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRegisterOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
              >
                Register Student
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
