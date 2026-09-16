import React, { useState, useEffect } from 'react';
import { StudentUser, ReliabilityStatus } from '../../types';
import { db } from '../../services/db';
import { ReliabilityBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Search,
  Wallet,
  Shield,
  Edit2,
  Plus,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

export const AdminStudentsManager: React.FC = () => {
  const [students, setStudents] = useState<StudentUser[]>(db.getStudents());
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Wallet adjustment modal
  const [adjustStudent, setAdjustStudent] = useState<StudentUser | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(500);
  const [adjustNote, setAdjustNote] = useState('Counter cash deposit');
  const [adjustSuccess, setAdjustSuccess] = useState(false);

  useEffect(() => {
    const refresh = () => setStudents(db.getStudents());
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustStudent || adjustAmount === 0) return;

    db.topUpWallet(adjustStudent.id, adjustAmount, `Admin Adjustment: ${adjustNote}`);
    setAdjustSuccess(true);
    setTimeout(() => {
      setAdjustSuccess(false);
      setAdjustStudent(null);
    }, 1000);
  };

  const handleCycleReliability = (studentId: string, current: ReliabilityStatus) => {
    const next: ReliabilityStatus =
      current === 'GOOD' ? 'WARNING' : current === 'WARNING' ? 'SUSPENDED' : 'GOOD';
    db.updateStudentReliability(studentId, next);
  };

  const departments = Array.from(new Set(students.map((s) => s.department)));

  const filteredStudents = students.filter((s) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !s.fullName.toLowerCase().includes(q) &&
        !s.enrollmentId.toLowerCase().includes(q) &&
        !s.email.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (departmentFilter !== 'ALL' && s.department !== departmentFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
            Enrolled Student Accounts
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage university student profiles, dining wallet balances, and reliability standing.
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-stone-100 text-stone-800 px-3 py-1.5 rounded-xl border border-stone-200">
          {students.length} Registered Accounts
        </span>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, enrollment ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white text-stone-700"
        >
          <option value="ALL">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
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
                <th className="py-3.5 px-3">Semester</th>
                <th className="py-3.5 px-3">Wallet Balance</th>
                <th className="py-3.5 px-3 text-center">Reliability</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-stone-900 block">{student.fullName}</span>
                    <span className="text-[10px] text-stone-400">{student.email}</span>
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-amber-800">
                    {student.enrollmentId}
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-semibold text-stone-800 block">{student.department}</span>
                    <span className="text-[10px] text-stone-400">{student.program}</span>
                  </td>

                  <td className="py-3 px-3 text-stone-600 font-medium">
                    Sem {student.semester}
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-stone-900">
                    Rs. {student.walletBalance.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleCycleReliability(student.id, student.reliabilityStatus)}
                      title="Click to change standing"
                    >
                      <ReliabilityBadge status={student.reliabilityStatus} />
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setAdjustStudent(student);
                        setAdjustAmount(500);
                        setAdjustNote('Counter cash deposit');
                      }}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Adjust Wallet</span>
                    </button>
                  </td>
                </tr>
              ))}
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
            <h4 className="font-bold text-stone-900 text-sm">Wallet Updated!</h4>
            <p className="text-xs text-stone-500">New balance reflected immediately.</p>
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

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Amount to Add (Rs.) *
              </label>
              <input
                type="number"
                step="100"
                min="50"
                required
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold font-mono"
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
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
            >
              Deposit Funds to Student Wallet
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};
