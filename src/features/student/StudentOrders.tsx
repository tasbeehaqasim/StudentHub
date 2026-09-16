import React, { useState, useEffect } from 'react';
import { StudentUser, Order } from '../../types';
import { db } from '../../services/db';
import { cart } from '../../services/cart';
import { OrderStatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import {
  Clock,
  MapPin,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Star,
  Copy,
  Check,
  ShoppingBag,
  Info
} from 'lucide-react';

interface StudentOrdersProps {
  student: StudentUser;
  highlightOrderId?: string;
  onNavigateToCart: () => void;
  onNavigateToMenu: () => void;
}

export const StudentOrders: React.FC<StudentOrdersProps> = ({
  student,
  highlightOrderId,
  onNavigateToCart,
  onNavigateToMenu
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'>('ALL');
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of schedule / class moved');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Review modal
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const studentOrders = db.getOrders().filter((o) => o.studentId === student.id);
      setOrders(studentOrders);
    };
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, [student.id]);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleCancelOrder = () => {
    if (!orderToCancel) return;
    db.cancelOrder(orderToCancel.id, student.id, cancelReason);
    setCancelModalOpen(false);
    setOrderToCancel(null);
  };

  const handleReorder = (order: Order) => {
    const foods = db.getFoodItems();
    let addedCount = 0;

    order.items.forEach((item) => {
      const liveFood = foods.find((f) => f.id === item.foodItemId);
      if (liveFood && liveFood.isAvailable && !liveFood.isDeactivated) {
        cart.addItem(liveFood, item.quantity, item.specialInstructions);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      onNavigateToCart();
    } else {
      alert('The items in this order are currently unavailable for reordering.');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewOrder) return;

    // Record review for the first item
    const firstItem = reviewOrder.items[0];
    if (firstItem) {
      db.submitFoodReview(
        firstItem.foodItemId,
        student.id,
        student.fullName,
        reviewRating,
        reviewComment
      );
    }

    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setReviewOrder(null);
      setReviewComment('');
    }, 1000);
  };

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'ACTIVE') {
      return ['PLACED', 'PAYMENT_CONFIRMED', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'DELAYED'].includes(
        o.status
      );
    }
    if (activeFilter === 'COMPLETED') {
      return o.status === 'COLLECTED';
    }
    if (activeFilter === 'CANCELLED') {
      return o.status === 'CANCELLED' || o.status === 'REJECTED';
    }
    if (activeFilter === 'NO_SHOW') {
      return o.status === 'NO_SHOW';
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
          My Cafeteria Orders
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Track active kitchen progress, view pickup codes, and review past meals.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'ALL', label: `All Orders (${orders.length})` },
          {
            id: 'ACTIVE',
            label: `Active (${
              orders.filter((o) =>
                ['PLACED', 'PAYMENT_CONFIRMED', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'DELAYED'].includes(
                  o.status
                )
              ).length
            })`
          },
          {
            id: 'COMPLETED',
            label: `Completed (${orders.filter((o) => o.status === 'COLLECTED').length})`
          },
          {
            id: 'CANCELLED',
            label: `Cancelled (${orders.filter((o) => o.status === 'CANCELLED' || o.status === 'REJECTED').length})`
          },
          {
            id: 'NO_SHOW',
            label: `No-Show (${orders.filter((o) => o.status === 'NO_SHOW').length})`
          }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeFilter === tab.id
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">No orders found</h3>
          <p className="text-xs text-stone-500 mt-1 mb-4">
            You don't have any orders matching this category.
          </p>
          <button
            onClick={onNavigateToMenu}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl"
          >
            Order Food Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isHighlight = highlightOrderId === order.id;
            const canCancel = ['PLACED', 'PAYMENT_CONFIRMED', 'ACCEPTED'].includes(order.status);
            const isPreparingOrBeyond = ['PREPARING', 'READY_FOR_PICKUP'].includes(order.status);

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl p-6 border transition-all ${
                  isHighlight ? 'border-2 border-amber-500 shadow-lg' : 'border-stone-200 shadow-sm'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-extrabold font-mono text-stone-900">
                      {order.orderNumber}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400 font-medium">Placed:</span>
                    <span className="text-xs text-stone-700 font-semibold">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* Pickup details & 4-digit code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Scheduled Pickup
                    </span>
                    <p className="font-bold text-xs text-stone-900 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {order.pickupSlotLabel}
                    </p>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Pickup Counter
                    </span>
                    <p className="font-bold text-xs text-emerald-700 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {order.pickupCounter}
                    </p>
                  </div>

                  {/* 4-digit Verification Code Card */}
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                        Pickup Code
                      </span>
                      <span className="text-lg font-extrabold text-amber-800 font-mono tracking-wider">
                        {order.pickupVerificationCode}
                      </span>
                    </div>
                    <button
                      onClick={() => copyCode(order.pickupVerificationCode)}
                      className="p-1.5 bg-white text-amber-700 hover:bg-amber-100 rounded-lg border border-amber-200 text-xs flex items-center gap-1"
                    >
                      {copiedCode === order.pickupVerificationCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-1.5 py-2 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-stone-700">
                      <span>
                        <strong className="text-stone-900">{item.quantity}x</strong> {item.foodName}
                        {item.specialInstructions && (
                          <span className="text-amber-700 ml-1.5 italic">
                            ({item.specialInstructions})
                          </span>
                        )}
                      </span>
                      <span className="font-semibold text-stone-900">
                        Rs. {item.subtotal.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Visual Progress Timeline (for active / regular orders) */}
                {order.status !== 'CANCELLED' && order.status !== 'REJECTED' && order.status !== 'NO_SHOW' && (
                  <div className="mt-4 pt-4 border-t border-stone-100">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                      Live Kitchen Status Tracker
                    </span>
                    <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-bold">
                      <div className="text-amber-700">✓ Placed</div>
                      <div className={['ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'COLLECTED'].includes(order.status) ? 'text-amber-700' : 'text-stone-400'}>
                        ✓ Accepted
                      </div>
                      <div className={['PREPARING', 'READY_FOR_PICKUP', 'COLLECTED'].includes(order.status) ? 'text-amber-700 font-extrabold' : 'text-stone-400'}>
                        {order.status === 'PREPARING' ? '● Preparing' : 'Preparing'}
                      </div>
                      <div className={['READY_FOR_PICKUP', 'COLLECTED'].includes(order.status) ? 'text-emerald-700 font-extrabold' : 'text-stone-400'}>
                        {order.status === 'READY_FOR_PICKUP' ? '● Ready' : 'Ready'}
                      </div>
                      <div className={order.status === 'COLLECTED' ? 'text-emerald-700' : 'text-stone-400'}>
                        {order.status === 'COLLECTED' ? '✓ Collected' : 'Collected'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Total and Actions Bar */}
                <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block">Total</span>
                      <span className="font-extrabold text-stone-900 text-sm">
                        Rs. {order.total.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Payment</span>
                      <span className="font-semibold text-stone-700">
                        {order.paymentMethod === 'WALLET' ? 'Campus Wallet' : 'Cash at Counter'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Cancel Order Button */}
                    {canCancel && (
                      <button
                        onClick={() => {
                          setOrderToCancel(order);
                          setCancelModalOpen(true);
                        }}
                        className="py-1.5 px-3 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700 text-xs font-bold rounded-xl transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}

                    {isPreparingOrBeyond && (
                      <span
                        className="text-[11px] text-stone-400 flex items-center gap-1"
                        title="Kitchen is actively preparing this order"
                      >
                        <Info className="w-3.5 h-3.5 text-stone-400" />
                        In kitchen prep (cannot cancel)
                      </span>
                    )}

                    {/* Reorder Button */}
                    {order.status === 'COLLECTED' && (
                      <>
                        <button
                          onClick={() => {
                            setReviewOrder(order);
                            setReviewRating(5);
                            setReviewComment('');
                          }}
                          className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>Rate Food</span>
                        </button>

                        <button
                          onClick={() => handleReorder(order)}
                          className="py-1.5 px-3 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reorder</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Order Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelOrder}
        title="Cancel This Pre-Order?"
        description="Are you sure you want to cancel this order? If you paid via Campus Wallet, the full amount will be immediately refunded to your wallet balance."
        confirmText="Yes, Cancel & Refund"
        variant="danger"
      >
        <div className="mt-3">
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Reason for cancellation
          </label>
          <select
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
          >
            <option value="Change of schedule / class moved">Change of schedule / class moved</option>
            <option value="Selected wrong pickup time slot">Selected wrong pickup time slot</option>
            <option value="Ordered duplicate items by mistake">Ordered duplicate items by mistake</option>
            <option value="Other personal reason">Other personal reason</option>
          </select>
        </div>
      </ConfirmationModal>

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewOrder}
        onClose={() => setReviewOrder(null)}
        title="Rate & Review Meal"
        subtitle={reviewOrder?.items.map((i) => i.foodName).join(', ')}
        maxWidth="sm"
      >
        {reviewSuccess ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-stone-900 text-base">Thank you for your review!</h3>
            <p className="text-xs text-stone-500">
              Your feedback helps our cafeteria chefs maintain high culinary standards.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 text-center">
                Star Rating
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-amber-500 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        reviewRating >= star ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Your Review & Taste Feedback
              </label>
              <textarea
                rows={3}
                required
                placeholder="How was the freshness, taste, and temperature of the food?"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
            >
              Submit Cafeteria Review
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};
