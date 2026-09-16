import React, { useState, useEffect } from 'react';
import { StudentUser, Discount, PickupSlot, Order, OrderItem } from '../../types';
import { cart } from '../../services/cart';
import { db } from '../../services/db';
import { CapacityBadge, RushLevelBadge } from '../../components/common/StatusBadge';
import {
  Check,
  Clock,
  Wallet,
  Coins,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface StudentCheckoutProps {
  student: StudentUser;
  appliedDiscount?: Discount;
  onEditCart: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const StudentCheckout: React.FC<StudentCheckoutProps> = ({
  student,
  appliedDiscount,
  onEditCart,
  onOrderSuccess
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [slots, setSlots] = useState<PickupSlot[]>(db.getPickupSlots());
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'CASH'>('WALLET');
  const [confirmedCheckbox, setConfirmedCheckbox] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rush, setRush] = useState(db.calculateRushLevel());

  const cartItems = cart.getItems();
  const subtotal = cart.getSubtotal();

  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === 'PERCENTAGE') {
      discountAmount = Math.round((subtotal * appliedDiscount.value) / 100);
    } else {
      discountAmount = appliedDiscount.value;
    }
    discountAmount = Math.min(discountAmount, subtotal);
  }

  const total = Math.max(0, subtotal - discountAmount);

  useEffect(() => {
    const refresh = () => {
      setSlots(db.getPickupSlots());
      setRush(db.calculateRushLevel());
    };
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  // Pre-select first available slot if not selected
  useEffect(() => {
    if (!selectedSlotId) {
      const firstAvailable = slots.find((s) => !s.isDisabled && s.bookedCount < s.maxCapacity);
      if (firstAvailable) {
        setSelectedSlotId(firstAvailable.id);
      }
    }
  }, [slots, selectedSlotId]);

  const selectedSlot = slots.find((s) => s.id === selectedSlotId);

  const handlePlaceOrder = () => {
    setErrorMessage('');
    if (!selectedSlot) {
      setErrorMessage('Please select an available pickup time slot.');
      return;
    }
    if (selectedSlot.bookedCount >= selectedSlot.maxCapacity) {
      setErrorMessage('This slot just reached maximum capacity. Please choose another slot.');
      return;
    }
    if (paymentMethod === 'WALLET' && student.walletBalance < total) {
      setErrorMessage(
        `Insufficient wallet balance. You have Rs. ${student.walletBalance.toLocaleString()} but need Rs. ${total.toLocaleString()}. Please choose Cash at counter or top up your wallet.`
      );
      return;
    }
    if (!confirmedCheckbox) {
      setErrorMessage('Please check the confirmation box to verify your order details.');
      return;
    }

    setIsProcessing(true);

    const orderItems: OrderItem[] = cartItems.map((ci) => ({
      foodItemId: ci.foodItem.id,
      foodName: ci.foodItem.name,
      foodImageUrl: ci.foodItem.imageUrl,
      unitPrice: ci.foodItem.price,
      costPrice: ci.foodItem.cost,
      quantity: ci.quantity,
      specialInstructions: ci.specialInstructions,
      subtotal: ci.foodItem.price * ci.quantity
    }));

    setTimeout(() => {
      const res = db.placeOrder({
        studentId: student.id,
        items: orderItems,
        pickupSlotId: selectedSlot.id,
        paymentMethod,
        discountCode: appliedDiscount?.code
      });

      setIsProcessing(false);

      if (res.success && res.order) {
        cart.clearCart();
        onOrderSuccess(res.order);
      } else {
        setErrorMessage(res.error || 'Failed to place order. Please review your selection.');
      }
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      {/* Step Indicator Header */}
      <div className="border-b border-stone-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
          Checkout & Pickup Scheduling
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Complete these 4 quick steps to confirm your cafeteria pre-order.
        </p>

        {/* 4 Steps Pills */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          {[
            { num: 1, label: 'Review' },
            { num: 2, label: 'Pickup Slot' },
            { num: 3, label: 'Payment' },
            { num: 4, label: 'Confirm' }
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => {
                // allow clicking backwards
                if (s.num < step) setStep(s.num as any);
              }}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                step === s.num
                  ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                  : step > s.num
                  ? 'bg-amber-50 text-amber-900 border-amber-200 cursor-pointer font-semibold'
                  : 'bg-stone-50 text-stone-400 border-stone-200'
              }`}
            >
              <div className="text-[11px] uppercase tracking-wider">Step {s.num}</div>
              <div className="text-xs font-bold truncate">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* STEP 1: REVIEW ORDER */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-lg font-bold text-stone-900 font-['Outfit']">
              Step 1: Review Your Order
            </h2>
            <button
              onClick={onEditCart}
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              Edit Items in Cart
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {cartItems.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.foodItem.imageUrl}
                    alt={item.foodItem.name}
                    className="w-12 h-12 rounded-xl object-cover bg-stone-100"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs">{item.foodItem.name}</h4>
                    <p className="text-[11px] text-stone-500">
                      {item.quantity} x Rs. {item.foodItem.price.toLocaleString()}
                    </p>
                    {item.specialInstructions && (
                      <p className="text-[10px] text-amber-700">Note: "{item.specialInstructions}"</p>
                    )}
                  </div>
                </div>

                <span className="font-bold text-xs text-stone-900">
                  Rs. {(item.foodItem.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount ({appliedDiscount?.code})</span>
                <span>- Rs. {discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-900 font-extrabold text-base pt-2 border-t border-stone-200">
              <span>Total Payable</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Continue to Step 2: Pickup Slot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT PICKUP SLOT */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-['Outfit']">
                Step 2: Select Smart Pickup Slot
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>

            {/* Live Rush Guidance */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500">Live Cafeteria Rush:</span>
              <RushLevelBadge level={rush.level} />
            </div>
          </div>

          {rush.level === 'HIGH' || rush.level === 'CRITICAL' ? (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{rush.description}</span>
            </div>
          ) : null}

          {/* Slots Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {slots.map((slot) => {
              const isFull = slot.bookedCount >= slot.maxCapacity;
              const isSelected = selectedSlotId === slot.id;

              return (
                <div
                  key={slot.id}
                  onClick={() => {
                    if (!isFull && !slot.isDisabled) {
                      setSelectedSlotId(slot.id);
                      setErrorMessage('');
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    isFull || slot.isDisabled
                      ? 'bg-stone-50 border-stone-200 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-amber-50/60 border-amber-600 shadow-md cursor-pointer'
                      : 'bg-white border-stone-200 hover:border-amber-300 hover:bg-stone-50/50 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5 font-['Outfit']">
                      <Clock className="w-4 h-4 text-amber-600" />
                      {slot.label}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <span className="text-stone-500 flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      {slot.counterNumber}
                    </span>

                    <CapacityBadge booked={slot.bookedCount} max={slot.maxCapacity} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              onClick={() => setStep(1)}
              className="py-2.5 px-4 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 1</span>
            </button>

            <button
              onClick={() => {
                if (!selectedSlotId) {
                  setErrorMessage('Please select a pickup time slot.');
                  return;
                }
                setStep(3);
              }}
              className="py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Continue to Step 3: Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PAYMENT METHOD */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="pb-3 border-b border-stone-100">
            <h2 className="text-lg font-bold text-stone-900 font-['Outfit']">
              Step 3: Select Payment Method
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Choose Campus Wallet for contactless pickup or pay Cash at the counter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campus Wallet Option */}
            <div
              onClick={() => setPaymentMethod('WALLET')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                paymentMethod === 'WALLET'
                  ? 'bg-amber-50/60 border-amber-600 shadow-md'
                  : 'bg-white border-stone-200 hover:border-amber-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  {paymentMethod === 'WALLET' && (
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-stone-900 text-sm font-['Outfit']">
                  Campus Digital Wallet
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Fast, instant deduction. Zero cash handling at pickup.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">Available Balance:</span>
                <span
                  className={`font-extrabold ${
                    student.walletBalance >= total ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  Rs. {student.walletBalance.toLocaleString()}
                </span>
              </div>

              {student.walletBalance < total && (
                <div className="mt-2 text-[11px] text-rose-600 font-medium">
                  Insufficient balance (need Rs. {(total - student.walletBalance).toLocaleString()} more)
                </div>
              )}
            </div>

            {/* Cash at Counter Option */}
            <div
              onClick={() => setPaymentMethod('CASH')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                paymentMethod === 'CASH'
                  ? 'bg-amber-50/60 border-amber-600 shadow-md'
                  : 'bg-white border-stone-200 hover:border-amber-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                    <Coins className="w-5 h-5" />
                  </div>
                  {paymentMethod === 'CASH' && (
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-stone-900 text-sm font-['Outfit']">
                  Cash at Cafeteria Counter
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Pay at the cafeteria counter when collecting your order.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500">
                Exact change recommended at pickup counter.
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              onClick={() => setStep(2)}
              className="py-2.5 px-4 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 2</span>
            </button>

            <button
              onClick={() => setStep(4)}
              className="py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Continue to Step 4: Final Confirmation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: FINAL CONFIRMATION */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="pb-3 border-b border-stone-100">
            <h2 className="text-lg font-bold text-stone-900 font-['Outfit']">
              Step 4: Final Order Confirmation
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Please double check your pickup slot and meal summary before placing pre-order.
            </p>
          </div>

          {/* Details Summary Card */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-stone-200/60 text-xs">
              <div>
                <span className="text-stone-400 uppercase font-bold text-[10px] block">
                  Pickup Slot
                </span>
                <span className="font-bold text-stone-900 text-sm mt-0.5 block">
                  {selectedSlot?.label}
                </span>
              </div>

              <div>
                <span className="text-stone-400 uppercase font-bold text-[10px] block">
                  Pickup Counter
                </span>
                <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
                  {selectedSlot?.counterNumber}
                </span>
              </div>

              <div>
                <span className="text-stone-400 uppercase font-bold text-[10px] block">
                  Payment Method
                </span>
                <span className="font-bold text-stone-900 text-sm mt-0.5 block">
                  {paymentMethod === 'WALLET' ? 'Campus Wallet' : 'Cash at Counter'}
                </span>
              </div>
            </div>

            {/* Items review */}
            <div>
              <span className="text-stone-400 uppercase font-bold text-[10px] block mb-2">
                Order Items ({cartItems.length})
              </span>
              <div className="space-y-1.5 text-xs text-stone-700">
                {cartItems.map((ci, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {ci.quantity}x {ci.foodItem.name}{' '}
                      {ci.specialInstructions && (
                        <span className="text-amber-700">({ci.specialInstructions})</span>
                      )}
                    </span>
                    <span className="font-semibold">
                      Rs. {(ci.foodItem.price * ci.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-stone-900">
              <span className="font-bold text-sm">Total Payable</span>
              <span className="font-extrabold text-xl font-['Outfit'] text-amber-600">
                Rs. {total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Mandatory Checkbox */}
          <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <input
              type="checkbox"
              id="confirm-order-checkbox"
              checked={confirmedCheckbox}
              onChange={(e) => setConfirmedCheckbox(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
            <label
              htmlFor="confirm-order-checkbox"
              className="text-xs text-stone-700 font-semibold cursor-pointer select-none leading-relaxed"
            >
              I confirm that my order details and pickup time ({selectedSlot?.label}) are correct. I understand uncollected meals may trigger a no-show reliability notification.
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              onClick={() => setStep(3)}
              disabled={isProcessing}
              className="py-2.5 px-4 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl flex items-center gap-1.5 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Step 3</span>
            </button>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing || !confirmedCheckbox}
              className="py-3.5 px-8 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-extrabold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Placing your order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Place Pre-Order • Rs. {total.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
