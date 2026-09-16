import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import { db } from '../../services/db';
import { OrderStatusBadge } from '../../components/common/StatusBadge';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const AdminLiveOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(db.getOrders());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Cancel order modal
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);

  useEffect(() => {
    const refresh = () => {
      setOrders(db.getOrders());
    };
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    db.updateOrderStatus(orderId, newStatus, 'ADMIN');
  };

  const handleConfirmCancel = () => {
    if (!cancelModalOrder) return;
    db.cancelOrder(cancelModalOrder.id, 'Administrative intervention / cancellation');
    setCancelModalOrder(null);
  };

  const filteredOrders = orders.filter((order) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !order.orderNumber.toLowerCase().includes(q) &&
        !order.studentName.toLowerCase().includes(q) &&
        !order.studentEnrollmentId.toLowerCase().includes(q) &&
        !order.pickupVerificationCode.includes(q)
      ) {
        return false;
      }
    }
    if (statusFilter !== 'ALL' && order.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
            University Pre-Orders Terminal
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor, inspect, and administratively manage all student dining pre-orders in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-stone-100 text-stone-800 px-3 py-1.5 rounded-xl border border-stone-200">
            {orders.length} Total Records
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by order #, student name, ID, or 4-digit code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white text-stone-700"
        >
          <option value="ALL">All Statuses</option>
          <option value="PLACED">Placed / Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="PREPARING">Preparing</option>
          <option value="READY_FOR_PICKUP">Ready for Pickup</option>
          <option value="COLLECTED">Collected</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REJECTED">Rejected</option>
          <option value="NO_SHOW">No Show</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-3">Student</th>
                <th className="py-3.5 px-3">Items</th>
                <th className="py-3.5 px-3">Slot / Counter</th>
                <th className="py-3.5 px-3">Total (Rs.)</th>
                <th className="py-3.5 px-3">Code</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">
                    {order.orderNumber}
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-bold text-stone-900 block">{order.studentName}</span>
                    <span className="text-[10px] font-mono text-stone-500">
                      {order.studentEnrollmentId}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-xs font-semibold text-stone-800 line-clamp-1 max-w-[200px]">
                      {order.items.map((i) => `${i.quantity}x ${i.foodName}`).join(', ')}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-bold text-stone-800 block text-[11px]">
                      {order.pickupSlotLabel}
                    </span>
                    <span className="text-[10px] text-stone-400">{order.pickupCounter}</span>
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-stone-900">
                    Rs. {order.total.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-amber-700 bg-amber-50/50 px-2 py-0.5 rounded text-center">
                    {order.pickupVerificationCode}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <OrderStatusBadge status={order.status} />
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {order.status !== 'COLLECTED' &&
                        order.status !== 'CANCELLED' &&
                        order.status !== 'REJECTED' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'COLLECTED')}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-[11px] transition-colors"
                              title="Force mark collected"
                            >
                              Collect
                            </button>
                            <button
                              onClick={() => setCancelModalOrder(order)}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-[11px] transition-colors"
                              title="Cancel & Refund"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!cancelModalOrder}
        onClose={() => setCancelModalOrder(null)}
        onConfirm={handleConfirmCancel}
        title="Admin Order Cancellation"
        description={`Cancel order ${cancelModalOrder?.orderNumber} placed by ${cancelModalOrder?.studentName}? If paid via Campus Wallet, Rs. ${cancelModalOrder?.total.toLocaleString()} will be automatically refunded.`}
        confirmText="Confirm Cancellation & Refund"
        variant="danger"
      />
    </div>
  );
};
