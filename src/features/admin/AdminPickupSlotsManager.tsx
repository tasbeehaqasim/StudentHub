import React, { useState, useEffect } from 'react';
import { PickupSlot } from '../../types';
import { db } from '../../services/db';
import { Modal } from '../../components/common/Modal';
import { Clock, Plus, Edit2, AlertCircle, CheckCircle2, MapPin } from 'lucide-react';

export const AdminPickupSlotsManager: React.FC = () => {
  const [slots, setSlots] = useState<PickupSlot[]>(db.getPickupSlots());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<PickupSlot | null>(null);

  // Form
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('14:15');
  const [maxCapacity, setMaxCapacity] = useState<number>(30);
  const [counter, setCounter] = useState('Counter 1 (Main Hall)');

  useEffect(() => {
    const refresh = () => setSlots(db.getPickupSlots());
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const openCreate = () => {
    setEditingSlot(null);
    setStartTime('14:00');
    setEndTime('14:15');
    setMaxCapacity(30);
    setCounter('Counter 1 (Main Hall)');
    setIsModalOpen(true);
  };

  const openEdit = (slot: PickupSlot) => {
    setEditingSlot(slot);
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setMaxCapacity(slot.maxCapacity);
    setCounter(slot.counterAssigned);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const label = `${startTime} – ${endTime}`;

    if (editingSlot) {
      db.updatePickupSlot(editingSlot.id, {
        startTime,
        endTime,
        label,
        maxCapacity: Number(maxCapacity),
        counterAssigned: counter
      });
    } else {
      db.addPickupSlot({
        startTime,
        endTime,
        label,
        maxCapacity: Number(maxCapacity),
        counterAssigned: counter,
        currentBookings: 0,
        isDisabled: false
      });
    }

    setIsModalOpen(false);
  };

  const handleToggleDisabled = (slotId: string, current: boolean) => {
    db.updatePickupSlot(slotId, { isDisabled: !current });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
            Pickup Time Slots & Capacity Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Prevent counter crowding by strictly capping pre-order pickup windows.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Time Window</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {slots.map((slot) => {
          const isFull = slot.currentBookings >= slot.maxCapacity;
          const pct = Math.round((slot.currentBookings / slot.maxCapacity) * 100);

          return (
            <div
              key={slot.id}
              className={`rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                slot.isDisabled
                  ? 'bg-stone-50 border-stone-200 opacity-60'
                  : isFull
                  ? 'bg-rose-50/50 border-rose-300'
                  : 'bg-white border-stone-200 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-stone-900 text-sm font-['Outfit']">
                      {slot.label}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleDisabled(slot.id, slot.isDisabled)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      slot.isDisabled
                        ? 'bg-stone-200 text-stone-600'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {slot.isDisabled ? 'Locked' : 'Active'}
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Assigned Counter:</span>
                    <span className="font-semibold text-stone-800">{slot.counterAssigned}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-stone-400">Bookings / Capacity:</span>
                    <span className="font-mono font-bold text-stone-900">
                      {slot.currentBookings} / {slot.maxCapacity} ({pct}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pct >= 100 ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-400">
                  {isFull ? 'CAPACITY REACHED' : `${slot.maxCapacity - slot.currentBookings} slots left`}
                </span>

                <button
                  onClick={() => openEdit(slot)}
                  className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition-colors"
                  title="Edit capacity or time"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSlot ? 'Edit Pickup Time Window' : 'Create New Pickup Slot'}
        subtitle="Control counter traffic distribution"
        maxWidth="sm"
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                End Time
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Max Order Capacity
            </label>
            <input
              type="number"
              required
              min="5"
              max="100"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Counter Assigned
            </label>
            <input
              type="text"
              required
              value={counter}
              onChange={(e) => setCounter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors mt-2"
          >
            {editingSlot ? 'Update Time Slot' : 'Add Pickup Slot'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
