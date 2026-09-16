import React, { useState } from 'react';
import { db } from '../../services/db';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import {
  Settings,
  Bell,
  Clock,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Building,
  Flame
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [announcementText, setAnnouncementText] = useState(
    'Special Friday Biryani & Kheer buffet available today! Order in advance to skip queue.'
  );
  const [announcementActive, setAnnouncementActive] = useState(true);
  const [rushThreshold, setRushThreshold] = useState(12);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    db.addAuditLog(
      'UPDATE_SETTINGS',
      'ADMIN',
      `Updated cafeteria operational settings: Announcement: "${announcementText}", Rush threshold: ${rushThreshold}`
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetDatabase = () => {
    db.resetToDefaults();
    setResetModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
          Cafeteria System Settings
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Configure campus announcements, rush congestion thresholds, and database maintenance.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Campus Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-stone-900 text-base font-['Outfit'] pb-2 border-b border-stone-100 flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-600" />
            <span>University Facility Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-700 font-bold uppercase tracking-wider mb-1">
                Cafeteria Facility Name
              </label>
              <input
                type="text"
                disabled
                value="Central Campus Dining Hall — Student Hub"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold uppercase tracking-wider mb-1">
                University Campus
              </label>
              <input
                type="text"
                disabled
                value="Main Academic Quadrangle, Block C"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-600 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Live Announcement Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="font-bold text-stone-900 text-base font-['Outfit'] flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <span>Student Broadcast Announcement</span>
            </h3>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-stone-700">Display on Student Menu</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Banner Message
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-900"
            />
          </div>
        </div>

        {/* Rush Threshold */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-stone-900 text-base font-['Outfit'] pb-2 border-b border-stone-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-600" />
            <span>Kitchen Rush Sensitivity</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Active Orders Triggering "High Rush" Status ({rushThreshold} orders)
            </label>
            <input
              type="range"
              min="5"
              max="30"
              value={rushThreshold}
              onChange={(e) => setRushThreshold(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>5 Orders (Sensitive)</span>
              <span>15 Orders (Standard)</span>
              <span>30 Orders (Peak)</span>
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
          >
            Save Cafeteria Configurations
          </button>

          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation */}
      <ConfirmationModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleResetDatabase}
        title="Reset Entire Database to Demo Seed?"
        description="This will restore all default dishes, inventory levels, demo students, and staff accounts. Any custom orders placed will be cleared."
        confirmText="Confirm Factory Reset"
        variant="danger"
      />
    </div>
  );
};
