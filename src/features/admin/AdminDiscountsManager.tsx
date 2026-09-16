import React, { useState, useEffect } from 'react';
import { DiscountCode } from '../../types';
import { db } from '../../services/db';
import { Modal } from '../../components/common/Modal';
import { Tag, Plus, CheckCircle2, Trash2 } from 'lucide-react';

export const AdminDiscountsManager: React.FC = () => {
  const [discounts, setDiscounts] = useState<DiscountCode[]>(db.getDiscounts());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT'>('PERCENTAGE');
  const [value, setValue] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(300);
  const [expiresAt, setExpiresAt] = useState('2026-12-31');

  useEffect(() => {
    const refresh = () => setDiscounts(db.getDiscounts());
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    db.addDiscount({
      code: code.trim().toUpperCase(),
      discountType: type,
      discountValue: Number(value),
      minimumOrderAmount: Number(minOrder),
      expiresAt,
      isActive: true
    });

    setIsModalOpen(false);
    setCode('');
  };

  const handleToggle = (id: string, current: boolean) => {
    db.toggleDiscount(id, !current);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
            Promo Codes & Student Discounts
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure promotional voucher campaigns for university events and orientation weeks.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Promo Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {discounts.map((disc) => (
          <div
            key={disc.id}
            className={`rounded-3xl p-5 border flex flex-col justify-between ${
              disc.isActive ? 'bg-white border-stone-200 shadow-sm' : 'bg-stone-50 border-stone-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-extrabold text-base text-stone-900 bg-amber-50 text-amber-800 px-3 py-1 rounded-xl border border-amber-200">
                  {disc.code}
                </span>

                <button
                  onClick={() => handleToggle(disc.id, disc.isActive)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    disc.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {disc.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Discount Value:</span>
                  <span className="font-bold text-stone-900">
                    {disc.discountType === 'PERCENTAGE'
                      ? `${disc.discountValue}% OFF`
                      : `Rs. ${disc.discountValue} OFF`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Min. Order Total:</span>
                  <span className="font-mono text-stone-800">
                    Rs. {disc.minimumOrderAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Valid Until:</span>
                  <span className="text-stone-700">{disc.expiresAt}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Student Discount Code"
        subtitle="Vouchers are redeemable at checkout"
        maxWidth="sm"
      >
        <form onSubmit={handleCreate} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Promo Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. EXAMBOOST"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED_AMOUNT">Fixed (Rs.)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Discount Amount
              </label>
              <input
                type="number"
                required
                min="1"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Min Order (Rs.)
              </label>
              <input
                type="number"
                required
                min="0"
                value={minOrder}
                onChange={(e) => setMinOrder(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                required
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors mt-2"
          >
            Create Promo Code
          </button>
        </form>
      </Modal>
    </div>
  );
};
