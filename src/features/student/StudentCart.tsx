import React, { useState, useEffect } from 'react';
import { cart } from '../../services/cart';
import { CartItem, Discount } from '../../types';
import { db } from '../../services/db';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  Tag,
  CheckCircle2,
  AlertCircle,
  UtensilsCrossed
} from 'lucide-react';

interface StudentCartProps {
  onProceedToCheckout: (appliedDiscount?: Discount) => void;
  onBrowseMenu: () => void;
}

export const StudentCart: React.FC<StudentCartProps> = ({
  onProceedToCheckout,
  onBrowseMenu
}) => {
  const [items, setItems] = useState<CartItem[]>(cart.getItems());
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [discountError, setDiscountError] = useState('');

  useEffect(() => {
    const unsub = cart.subscribe((newItems) => {
      setItems(newItems);
    });
    return unsub;
  }, []);

  const subtotal = cart.getSubtotal();

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    setDiscountError('');

    if (!discountCode.trim()) return;

    const code = discountCode.trim().toUpperCase();
    const discounts = db.getDiscounts();
    const match = discounts.find((d) => d.code.toUpperCase() === code && d.isActive);

    if (!match) {
      setDiscountError('Invalid or expired discount code.');
      setAppliedDiscount(null);
      return;
    }

    if (subtotal < match.minimumOrder) {
      setDiscountError(`Requires a minimum order of Rs. ${match.minimumOrder.toLocaleString()}.`);
      setAppliedDiscount(null);
      return;
    }

    setAppliedDiscount(match);
  };

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

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-in fade-in">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-stone-900 font-['Outfit']">
          Your cart is empty.
        </h2>
        <p className="text-sm text-stone-500 mt-1 mb-6">
          Find something delicious from today's menu.
        </p>
        <button
          onClick={onBrowseMenu}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-xl text-sm shadow-md transition-all inline-flex items-center gap-2"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Browse Menu</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
            Your Cart
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Review your pre-order items before scheduling pickup.
          </p>
        </div>
        <button
          onClick={() => cart.clearCart()}
          className="text-xs font-semibold text-stone-400 hover:text-rose-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item, idx) => (
            <div
              key={`${item.foodItem.id}-${idx}`}
              className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-4"
            >
              <img
                src={item.foodItem.imageUrl}
                alt={item.foodItem.name}
                className="w-20 h-20 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-100"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-stone-900 text-sm truncate font-['Outfit']">
                    {item.foodItem.name}
                  </h3>
                  <button
                    onClick={() => cart.removeItem(idx)}
                    className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {item.specialInstructions && (
                  <p className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-1 font-medium">
                    Note: "{item.specialInstructions}"
                  </p>
                )}

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100">
                  <span className="text-xs text-stone-500 font-medium">
                    Rs. {item.foodItem.price.toLocaleString()} each
                  </span>

                  <div className="flex items-center gap-3">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 p-0.5">
                      <button
                        onClick={() => cart.updateQuantity(idx, item.quantity - 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-bold text-xs text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => cart.updateQuantity(idx, item.quantity + 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-white"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-extrabold text-stone-900 w-20 text-right">
                      Rs. {(item.foodItem.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <button
              onClick={onBrowseMenu}
              className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
            >
              <span>+ Add more food from menu</span>
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-bold text-stone-900 text-base font-['Outfit'] pb-2 border-b border-stone-100">
              Order Summary
            </h3>

            {/* Discount Code Form */}
            <div>
              <form onSubmit={handleApplyDiscount} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>

              {appliedDiscount && (
                <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Coupon '{appliedDiscount.code}' applied (-Rs. {discountAmount.toLocaleString()})
                  </span>
                </div>
              )}

              {discountError && (
                <div className="mt-2 text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{discountError}</span>
                </div>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs pt-2 border-t border-stone-100">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({appliedDiscount?.name})</span>
                  <span>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-900 font-extrabold text-base pt-3 border-t border-stone-200 font-['Outfit']">
                <span>Total Amount</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => onProceedToCheckout(appliedDiscount || undefined)}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
