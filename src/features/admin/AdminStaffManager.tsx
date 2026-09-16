import React, { useState, useEffect } from 'react';
import { StaffUser } from '../../types';
import { db } from '../../services/db';
import { Modal } from '../../components/common/Modal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { ChefHat, Plus, Edit2, Trash2, Shield, CheckCircle2 } from 'lucide-react';

export const AdminStaffManager: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffUser[]>(db.getStaffList());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);
  const [deleteStaff, setDeleteStaff] = useState<StaffUser | null>(null);

  // Form
  const [staffId, setStaffId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('Head Chef');
  const [station, setStation] = useState('Station A (Hot Kitchen)');
  const [shift, setShift] = useState('Morning (7:30 AM - 3:30 PM)');

  useEffect(() => {
    const refresh = () => setStaffList(db.getStaffList());
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const openCreate = () => {
    setEditingStaff(null);
    setStaffId(`STF-${Math.floor(100 + Math.random() * 900)}`);
    setFullName('');
    setEmail('');
    setPhone('+92 300 1234567');
    setPosition('Line Cook');
    setStation('Station B (Fast Food & Fry)');
    setShift('Morning (7:30 AM - 3:30 PM)');
    setIsModalOpen(true);
  };

  const openEdit = (staff: StaffUser) => {
    setEditingStaff(staff);
    setStaffId(staff.staffId);
    setFullName(staff.fullName);
    setEmail(staff.email);
    setPhone(staff.phone);
    setPosition(staff.position);
    setStation(staff.station);
    setShift(staff.shift);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    if (editingStaff) {
      db.updateStaff(editingStaff.id, {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        position,
        station,
        shift
      });
    } else {
      db.addStaff({
        staffId,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        position,
        station,
        shift,
        isActive: true
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteStaff) return;
    db.removeStaff(deleteStaff.id);
    setDeleteStaff(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
            Cafeteria Staff Roster
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage kitchen crew, counter verification operators, shifts, and station assignments.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {staffList.map((staff) => (
          <div
            key={staff.id}
            className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {staff.staffId}
                </span>

                <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded-full">
                  {staff.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h3 className="font-bold text-stone-900 text-base font-['Outfit']">
                {staff.fullName}
              </h3>
              <p className="text-xs font-semibold text-stone-500">{staff.position}</p>

              <div className="mt-4 space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Station:</span>
                  <span className="font-semibold text-stone-900">{staff.station}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Shift:</span>
                  <span className="font-semibold text-stone-900">{staff.shift}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Phone:</span>
                  <span className="font-mono text-stone-800">{staff.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEdit(staff)}
                className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-stone-50 rounded-lg transition-colors"
                title="Edit staff details"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteStaff(staff)}
                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-50 rounded-lg transition-colors"
                title="Remove staff member"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStaff ? 'Edit Staff Operator' : 'Add Kitchen / Counter Staff'}
        subtitle="Staff authorization credentials"
        maxWidth="sm"
      >
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Staff ID
            </label>
            <input
              type="text"
              required
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Master Chef Tariq"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Position
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
            >
              <option value="Head Chef">Head Chef</option>
              <option value="Sous Chef">Sous Chef</option>
              <option value="Line Cook">Line Cook</option>
              <option value="Counter Cashier / Verifier">Counter Cashier / Verifier</option>
              <option value="Kitchen Assistant">Kitchen Assistant</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Assigned Station
            </label>
            <input
              type="text"
              value={station}
              onChange={(e) => setStation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Shift Schedule
            </label>
            <input
              type="text"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors mt-2"
          >
            {editingStaff ? 'Save Changes' : 'Add Staff Member'}
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deleteStaff}
        onClose={() => setDeleteStaff(null)}
        onConfirm={handleDelete}
        title="Remove Staff Operator?"
        description={`Remove ${deleteStaff?.fullName} (${deleteStaff?.staffId}) from active staff roster?`}
        confirmText="Confirm Removal"
        variant="danger"
      />
    </div>
  );
};
