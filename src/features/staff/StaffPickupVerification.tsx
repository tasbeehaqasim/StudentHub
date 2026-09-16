import React, { useState } from 'react';
import { StaffUser, Order } from '../../types';
import { db } from '../../services/db';
import { OrderStatusBadge } from '../../components/common/StatusBadge';
import {
  ScanLine,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Coins,
  ShieldCheck,
  Check,
  User,
  ShoppingBag
} from 'lucide-react';

interface StaffPickupVerificationProps {
  staff: StaffUser;
}

export const StaffPickupVerification: React.FC<StaffPickupVerificationProps> = ({ staff }) => {
  const [codeInput, setCodeInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState('');
  const [handoverSuccess, setHandoverSuccess] = useState(false);

  const handleVerifyLookup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchError('');
    setHandoverSuccess(false);

    if (!codeInput.trim()) {
      setSearchError('Please enter a 4-digit pickup code or order number.');
      setSearchedOrder(null);
      return;
    }

    const trimmed = codeInput.trim().toUpperCase();
    const orders = db.getOrders();

    // Match either 4-digit verification code or orderNumber
    const match = orders.find(
      (o) =>
        o.pickupVerificationCode === trimmed ||
        o.orderNumber.toUpperCase() === trimmed
    );

    if (match) {
      setSearchedOrder(match);
    } else {
      setSearchError(`No active order found matching code or reference "${trimmed}".`);
      setSearchedOrder(null);
    }
  };

  const handleCompleteHandover = () => {
    if (!searchedOrder) return;
    const res = db.verifyAndCollectOrder(searchedOrder.id, staff.id);
    if (res.success && res.order) {
      setSearchedOrder(res.order);
      setHandoverSuccess(true);
      setTimeout(() => {
        setHandoverSuccess(false);
        setCodeInput('');
        setSearchedOrder(null);
      }, 2500);
    } else {
      setSearchError(res.error || 'Failed to complete order handover.');
    }
  };

  // Quick numpad click
  const handleNumpad = (num: string) => {
    if (codeInput.length < 4) {
      const next = codeInput + num;
      setCodeInput(next);
      if (next.length === 4) {
        // Auto trigger search on 4 digits
        setTimeout(() => {
          const orders = db.getOrders();
          const match = orders.find((o) => o.pickupVerificationCode === next);
          if (match) {
            setSearchedOrder(match);
            setSearchError('');
          } else {
            setSearchError(`No order with pickup code "${next}".`);
            setSearchedOrder(null);
          }
        }, 100);
      }
    }
  };

  const handleClearCode = () => {
    setCodeInput('');
    setSearchedOrder(null);
    setSearchError('');
    setHandoverSuccess(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
          Counter Pickup Verification Terminal
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Verify student 4-digit codes, inspect meal packaging, and validate payment status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Input & Numpad */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <form onSubmit={handleVerifyLookup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Enter Student 4-Digit Pickup Code or Order #
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={10}
                  placeholder="e.g. 8391 or CB-10024"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-3 rounded-2xl border-2 border-stone-300 text-center font-mono font-extrabold text-xl tracking-widest text-stone-900 focus:outline-none focus:border-amber-500 uppercase"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-stone-900 hover:bg-black text-white font-bold rounded-2xl text-xs shadow-md transition-colors"
                >
                  Verify
                </button>
              </div>
            </div>
          </form>

          {/* Quick On-Screen Touch Numpad */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2 text-center">
              Touch Numpad
            </span>
            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    if (k === 'C') handleClearCode();
                    else if (k === '⌫') setCodeInput((prev) => prev.slice(0, -1));
                    else handleNumpad(k);
                  }}
                  className="py-3.5 bg-stone-100 hover:bg-stone-200 active:bg-amber-100 text-stone-800 font-extrabold text-base rounded-2xl transition-all shadow-2xs"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Validation Card / Result */}
        <div className="flex flex-col justify-center">
          {handoverSuccess ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-8 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold text-emerald-900 font-['Outfit']">
                Order Handover Completed!
              </h3>
              <p className="text-xs text-emerald-700 leading-relaxed max-w-xs mx-auto">
                Status updated to <span className="font-bold">COLLECTED</span>. Student notified and kitchen ticket archived.
              </p>
            </div>
          ) : searchedOrder ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500 shadow-xl space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <span className="text-lg font-extrabold font-mono text-stone-900">
                    {searchedOrder.orderNumber}
                  </span>
                  <span className="text-xs text-stone-400 block font-mono">
                    Code: {searchedOrder.pickupVerificationCode}
                  </span>
                </div>
                <OrderStatusBadge status={searchedOrder.status} />
              </div>

              {/* Student info */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">
                    Student Details
                  </span>
                  <p className="font-bold text-stone-900 text-sm">{searchedOrder.studentName}</p>
                  <p className="font-mono text-stone-500">{searchedOrder.studentEnrollmentId}</p>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">
                    Pickup Slot
                  </span>
                  <p className="font-bold text-amber-700">{searchedOrder.pickupSlotLabel}</p>
                  <p className="text-stone-500">{searchedOrder.pickupCounter}</p>
                </div>
              </div>

              {/* Items Packed list */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                  Items to Hand Over ({searchedOrder.items.length})
                </span>
                <div className="space-y-1.5 text-xs text-stone-800">
                  {searchedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-b border-stone-50">
                      <span>
                        <strong className="text-stone-900">{item.quantity}x</strong> {item.foodName}
                        {item.specialInstructions && (
                          <span className="text-amber-700 ml-1 italic">
                            ({item.specialInstructions})
                          </span>
                        )}
                      </span>
                      <span className="font-mono font-bold">
                        Rs. {item.subtotal.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Verification Banner */}
              {searchedOrder.paymentMethod === 'WALLET' ? (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="block font-bold">PAID VIA CAMPUS WALLET</strong>
                    <span>No cash collection required. Safe to hand over.</span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-center gap-2.5 text-amber-900 text-xs">
                  <Coins className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <strong className="block font-bold">
                      CASH DUE: Rs. {searchedOrder.total.toLocaleString()}
                    </strong>
                    <span>Collect payment before handing over meal box.</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {searchedOrder.status === 'COLLECTED' ? (
                <div className="p-3 bg-stone-100 rounded-2xl text-center text-xs font-bold text-stone-500">
                  This order has already been collected and verified.
                </div>
              ) : searchedOrder.status === 'CANCELLED' || searchedOrder.status === 'REJECTED' ? (
                <div className="p-3 bg-rose-50 rounded-2xl text-center text-xs font-bold text-rose-700">
                  This order was cancelled and cannot be handed over.
                </div>
              ) : (
                <button
                  onClick={handleCompleteHandover}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  <span>Verify 4-Digit Code & Complete Handover</span>
                </button>
              )}
            </div>
          ) : searchError ? (
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-2">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <h4 className="font-bold text-rose-900 text-sm">{searchError}</h4>
              <p className="text-xs text-rose-600">
                Please ask the student to re-verify their 4-digit code in their Student Hub app.
              </p>
            </div>
          ) : (
            <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-3xl p-8 text-center text-stone-400 space-y-2">
              <ScanLine className="w-10 h-10 mx-auto text-stone-300" />
              <h4 className="font-bold text-stone-700 text-sm">Awaiting Code Verification</h4>
              <p className="text-xs text-stone-500">
                Type the student's 4-digit code using the numpad to load the order ticket.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
