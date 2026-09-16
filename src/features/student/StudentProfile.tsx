import React, { useState, useEffect } from 'react';
import { StudentUser } from '../../types';
import { db } from '../../services/db';
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
  Edit2
} from 'lucide-react';

interface StudentProfileProps {
  student: StudentUser;
  onUpdateSuccess?: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({
  student,
  onUpdateSuccess
}) => {
  const [currentStudent, setCurrentStudent] = useState<StudentUser>(student);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [fullName, setFullName] = useState(student.fullName);
  const [phone, setPhone] = useState(student.phone);
  const [department, setDepartment] = useState(student.department);
  const [program, setProgram] = useState(student.program);
  const [semester, setSemester] = useState(student.semester.toString());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const s = db.getStudentById(student.id);
    if (s) setCurrentStudent(s);
  }, [student.id]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = db.updateStudentProfile(student.id, {
      fullName: fullName.trim(),
      phone: phone.trim(),
      department: department.trim(),
      program: program.trim(),
      semester: parseInt(semester, 10) || 1
    });

    if (updated) {
      setCurrentStudent(updated);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setEditModalOpen(false);
        if (onUpdateSuccess) onUpdateSuccess();
      }, 700);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
          Student Profile
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Your official university enrollment and dining credentials.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-2xl font-['Outfit'] border border-amber-200">
              {currentStudent.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 font-['Outfit']">
                {currentStudent.fullName}
              </h2>
              <p className="text-xs font-mono font-bold text-amber-700 mt-0.5">
                {currentStudent.enrollmentId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ReliabilityBadge status={currentStudent.reliabilityStatus} />
            <button
              onClick={() => {
                setFullName(currentStudent.fullName);
                setPhone(currentStudent.phone);
                setDepartment(currentStudent.department);
                setProgram(currentStudent.program);
                setSemester(currentStudent.semester.toString());
                setEditModalOpen(true);
              }}
              className="py-2 px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center gap-3">
            <Mail className="w-4 h-4 text-stone-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                University Email
              </span>
              <span className="text-xs font-bold text-stone-900">{currentStudent.email}</span>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center gap-3">
            <Phone className="w-4 h-4 text-stone-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Phone Number
              </span>
              <span className="text-xs font-bold text-stone-900">{currentStudent.phone}</span>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center gap-3">
            <GraduationCap className="w-4 h-4 text-stone-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Department
              </span>
              <span className="text-xs font-bold text-stone-900">{currentStudent.department}</span>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-stone-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Degree Program & Semester
              </span>
              <span className="text-xs font-bold text-stone-900">
                {currentStudent.program} (Semester {currentStudent.semester})
              </span>
            </div>
          </div>
        </div>

        {/* Reliability Note */}
        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
          <span className="font-bold flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-600" />
            Reliability Status Guidelines
          </span>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Student Hub tracks on-time pickup rate. Uncollected orders mark a no-show. Repeated no-shows may limit pre-order privileges during high-rush slots.
          </p>
        </div>
      </div>

      {/* Edit Modal */}
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
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
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
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
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
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Semester (1-8)
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors mt-2"
            >
              Save Profile Changes
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};
