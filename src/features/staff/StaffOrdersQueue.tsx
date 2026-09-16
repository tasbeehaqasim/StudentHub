import React, { useState, useEffect } from 'react';
import { StaffUser, Order, OrderStatus } from '../../types';
import { db } from '../../services/db';
import { OrderStatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import {
  ChefHat,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  User,
  Sparkles,
  Info
} from 'lucide-react';

interface StaffOrdersQueueProps {
  staff: StaffUser;
}

export const StaffOrdersQueue: React.FC<StaffOrdersQueueProps> = ({ staff }) => {
  const [orders, setOrders] = useState<Order[]>(db.getOrders());
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'PREPARING' | 'READY' | 'DELAYED' | 'CANCELLED'>('PENDING');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Reject / Delay modal states
  const [rejectOrderModal, setRejectOrderModal] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('Out of stock / kitchen capacity full');
  const [delayOrderModal, setDelayOrderModal] = useState<Order | null>(null);
  const [delayMinutes, setDelayMinutes] = useState(10);
  const [delayReason, setDelayReason] = useState('High order volume / deep fryer queue');

  useEffect(() => {
    const refresh = () => {
      setOrders(db.getOrders());
    };
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    db.updateOrderStatus(orderId, newStatus, staff.id);
  };

  const handleConfirmReject = () => {
    if (!rejectOrderModal) return;
    db.rejectOrder(rejectOrderModal.id, rejectReason, staff.id);
    setRejectOrderModal(null);
  };

  const handleConfirmDelay = () => {
    if (!delayOrderModal) return;
    db.delayOrder(delayOrderModal.id, delayMinutes, delayReason, staff.id);
    setDelayOrderModal(null);
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'PENDING') {
      return ['PLACED', 'PAYMENT_CONFIRMED', 'ACCEPTED'].includes(o.status);
    }
    if (activeTab === 'PREPARING') {
      return o.status === 'PREPARING';
    }
    if (activeTab === 'READY') {
      return o.status === 'READY_FOR_PICKUP';
    }
    if (activeTab === 'DELAYED') {
      return o.status === 'DELAYED';
    }
    if (activeTab === 'CANCELLED') {
      return o.status === 'CANCELLED' || o.status === 'REJECTED' || o.status === 'NO_SHOW';
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      {/* Title & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
            Kitchen Display System (KDS)
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Station: <span className="font-bold text-stone-800">{staff.station}</span> • Real-time order dispatch and preparation
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Alert Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              soundEnabled
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-stone-100 text-stone-500 border-stone-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-600" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Kitchen Chime: {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          {
            id: 'PENDING',
            label: `To Accept (${
              orders.filter((o) => ['PLACED', 'PAYMENT_CONFIRMED', 'ACCEPTED'].includes(o.status)).length
            })`
          },
          {
            id: 'PREPARING',
            label: `In Prep (${orders.filter((o) => o.status === 'PREPARING').length})`
          },
          {
            id: 'READY',
            label: `Ready for Pickup (${orders.filter((o) => o.status === 'READY_FOR_PICKUP').length})`
          },
          {
            id: 'DELAYED',
            label: `Delayed (${orders.filter((o) => o.status === 'DELAYED').length})`
          },
          {
            id: 'ALL',
            label: `All Orders (${orders.length})`
          },
          {
            id: 'CANCELLED',
            label: `Cancelled / No-Show (${
              orders.filter((o) => ['CANCELLED', 'REJECTED', 'NO_SHOW'].includes(o.status)).length
            })`
          }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders KDS Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <ChefHat className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">No orders in this station</h3>
          <p className="text-xs text-stone-500 mt-1">
            New orders placed by students will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order) => {
            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Top Ticket Header */}
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                    <div>
                      <span className="text-base font-extrabold font-mono text-stone-900">
                        {order.orderNumber}
                      </span>
                      <span className="text-[11px] text-stone-400 block">
                        Placed:{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <OrderStatusBadge status={order.status} />
                  </div>

                  {/* Student Info Pill */}
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 mb-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-[10px]">
                        {order.studentName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-stone-900 block leading-tight">
                          {order.studentName}
                        </span>
                        <span className="text-[10px] font-mono text-stone-500">
                          {order.studentEnrollmentId}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block">Slot</span>
                      <span className="font-bold text-amber-700 text-xs">
                        {order.pickupSlotLabel}
                      </span>
                    </div>
                  </div>

                  {/* Food Items with Special Instructions */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-amber-50/30 border border-amber-100 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold text-stone-900">
                          <span>
                            <span className="text-amber-800 text-sm font-extrabold mr-1.5">
                              {item.quantity}x
                            </span>
                            {item.foodName}
                          </span>
                        </div>

                        {item.specialInstructions && (
                          <div className="mt-1 p-1 bg-amber-100/70 rounded text-[11px] font-bold text-amber-900 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-700" />
                            <span>Custom: "{item.specialInstructions}"</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions based on status */}
                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span>
                      Payment:{' '}
                      <strong className="text-stone-800">
                        {order.paymentMethod === 'WALLET' ? 'Paid (Wallet)' : 'Cash at Counter'}
                      </strong>
                    </span>
                    <span className="font-mono font-bold text-stone-900">
                      Rs. {order.total.toLocaleString()}
                    </span>
                  </div>

                  {/* Actions for PLACED / PAYMENT_CONFIRMED */}
                  {['PLACED', 'PAYMENT_CONFIRMED'].includes(order.status) && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>

                      <button
                        onClick={() => setRejectOrderModal(order)}
                        className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {/* Actions for ACCEPTED */}
                  {order.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Cooking / Preparation</span>
                    </button>
                  )}

                  {/* Actions for PREPARING or DELAYED */}
                  {(order.status === 'PREPARING' || order.status === 'DELAYED') && (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'READY_FOR_PICKUP')}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Ready for Pickup (Alert Student)</span>
                      </button>

                      <button
                        onClick={() => setDelayOrderModal(order)}
                        className="w-full py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                      >
                        <Clock className="w-3 h-3 text-stone-500" />
                        <span>Mark Delayed (+10 min)</span>
                      </button>
                    </div>
                  )}

                  {/* Actions for READY_FOR_PICKUP */}
                  {order.status === 'READY_FOR_PICKUP' && (
                    <div className="space-y-1.5">
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs text-emerald-800 font-semibold">
                        Awaiting 4-Digit Code at Counter
                      </div>
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'NO_SHOW')}
                        className="w-full py-1 text-[11px] text-stone-400 hover:text-rose-600 font-medium transition-colors"
                      >
                        Uncollected past window? Mark No-Show
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Order Modal */}
      <ConfirmationModal
        isOpen={!!rejectOrderModal}
        onClose={() => setRejectOrderModal(null)}
        onConfirm={handleConfirmReject}
        title="Reject Incoming Pre-Order?"
        description="Are you sure you want to reject this order? If paid via wallet, the student will be immediately refunded."
        confirmText="Confirm Rejection & Refund"
        variant="danger"
      >
        <div className="mt-3">
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Reason for Rejection
          </label>
          <select
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
          >
            <option value="Out of stock / ingredients depleted">Out of stock / ingredients depleted</option>
            <option value="Kitchen queue overloaded">Kitchen queue overloaded</option>
            <option value="Closing station early">Closing station early</option>
            <option value="Special request cannot be accommodated">Special request cannot be accommodated</option>
          </select>
        </div>
      </ConfirmationModal>

      {/* Delay Order Modal */}
      <Modal
        isOpen={!!delayOrderModal}
        onClose={() => setDelayOrderModal(null)}
        title="Notify Student of Order Delay"
        subtitle={`Order ${delayOrderModal?.orderNumber}`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Estimated Delay (Minutes)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDelayMinutes(m)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    delayMinutes === m
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  +{m} Mins
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Reason / Status Note
            </label>
            <input
              type="text"
              value={delayReason}
              onChange={(e) => setDelayReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <button
            onClick={handleConfirmDelay}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
          >
            Send Delay Notification to Student
          </button>
        </div>
      </Modal>
    </div>
  );
};
