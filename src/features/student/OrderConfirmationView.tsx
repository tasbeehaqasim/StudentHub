import React from 'react';
import { Order } from '../../types';
import {
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  UtensilsCrossed,
  Copy,
  Check
} from 'lucide-react';

interface OrderConfirmationViewProps {
  order: Order;
  onTrackOrder: (orderId: string) => void;
  onBackToMenu: () => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  order,
  onTrackOrder,
  onBackToMenu
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyCode = () => {
    navigator.clipboard?.writeText(order.pickupVerificationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-stone-200 shadow-xl text-center space-y-6">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Pre-Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 font-['Outfit']">
            Your Order Has Been Placed!
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Order Reference: <span className="font-mono font-bold text-stone-800">{order.orderNumber}</span>
          </p>
        </div>

        {/* 4-Digit Pickup Verification Code Display */}
        <div className="bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-3xl p-6 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
            Your 4-Digit Pickup Verification Code
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl sm:text-5xl font-extrabold text-amber-700 tracking-widest font-mono">
              {order.pickupVerificationCode}
            </span>
            <button
              onClick={copyCode}
              className="p-2 text-amber-700 hover:bg-amber-100 rounded-xl transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-amber-800 mt-2 max-w-sm mx-auto leading-relaxed">
            Show this 4-digit code to the counter staff when collecting your food to confirm instant handoff.
          </p>
        </div>

        {/* Key Slot Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Scheduled Pickup Time
            </span>
            <p className="font-bold text-stone-900 text-sm mt-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              {order.pickupSlotLabel}
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Pickup Counter
            </span>
            <p className="font-bold text-emerald-700 text-sm mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              {order.pickupCounter}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onTrackOrder(order.id)}
            className="w-full sm:w-auto py-3 px-6 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Track Live Order Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onBackToMenu}
            className="w-full sm:w-auto py-3 px-5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Browse More Food</span>
          </button>
        </div>
      </div>
    </div>
  );
};
