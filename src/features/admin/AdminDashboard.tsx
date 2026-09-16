import React, { useState, useEffect } from 'react';
import { AdminUser, Order, FoodItem, InventoryItem } from '../../types';
import { db } from '../../services/db';
import { RushLevelBadge, OrderStatusBadge } from '../../components/common/StatusBadge';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  Plus,
  UtensilsCrossed,
  Boxes,
  Settings,
  ArrowRight,
  Clock,
  DollarSign
} from 'lucide-react';

interface AdminDashboardProps {
  admin: AdminUser;
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ admin, onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>(db.getOrders());
  const [foodItems, setFoodItems] = useState<FoodItem[]>(db.getFoodItems());
  const [inventory, setInventory] = useState<InventoryItem[]>(db.getInventory());
  const [students, setStudents] = useState(db.getStudents());
  const [rush, setRush] = useState(db.calculateRushLevel());

  useEffect(() => {
    const refresh = () => {
      setOrders(db.getOrders());
      setFoodItems(db.getFoodItems());
      setInventory(db.getInventory());
      setStudents(db.getStudents());
      setRush(db.calculateRushLevel());
    };
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  // Today's total revenue
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED' && o.status !== 'REJECTED')
    .reduce((sum, o) => sum + o.total, 0);

  // Today's total food cost
  const totalCost = orders
    .filter((o) => o.status !== 'CANCELLED' && o.status !== 'REJECTED')
    .reduce((sum, o) => {
      const orderCost = o.items.reduce((cSum, i) => cSum + i.costPrice * i.quantity, 0);
      return sum + orderCost;
    }, 0);

  const estimatedProfit = Math.max(0, totalRevenue - totalCost);

  const completedOrders = orders.filter((o) => o.status === 'COLLECTED').length;
  const completionRate = orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 100;

  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minimumThreshold).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      {/* Admin Executive Header */}
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Executive Management Control</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
            Cafeteria Operations Dashboard
          </h1>

          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            Logged in as <span className="text-amber-400 font-bold">{admin.fullName}</span> • Financial & operational overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-stone-800 rounded-2xl border border-stone-700 flex items-center gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Cafeteria Rush Level
              </span>
              <p className="text-xs font-semibold text-stone-200 mt-0.5">{rush.description}</p>
            </div>
            <RushLevelBadge level={rush.level} />
          </div>
        </div>
      </div>

      {/* 4 Financial & Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Today's Gross Sales
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-stone-900 font-['Outfit']">
              Rs. {totalRevenue.toLocaleString()}
            </span>
            <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
              <span>Est. Gross Margin:</span>
              <span className="font-bold text-emerald-700">
                Rs. {estimatedProfit.toLocaleString()} ({totalRevenue > 0 ? Math.round((estimatedProfit / totalRevenue) * 100) : 0}%)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Orders & Completion Rate */}
        <div
          onClick={() => onNavigate('orders')}
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-amber-400 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Total Pre-Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-stone-900 font-['Outfit']">
              {orders.length}
            </span>
            <p className="text-[11px] text-stone-500 mt-1">
              {completedOrders} completed ({completionRate}% collection rate)
            </p>
          </div>
        </div>

        {/* 3. Students Registered */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-amber-400 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Enrolled Students
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-stone-900 font-['Outfit']">
              {students.length}
            </span>
            <p className="text-[11px] text-stone-500 mt-1">
              Total students with active dining wallets
            </p>
          </div>
        </div>

        {/* 4. Low Stock Alerts */}
        <div
          onClick={() => onNavigate('inventory')}
          className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-rose-400 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Low Stock Warnings
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                lowStockCount > 0 ? 'bg-rose-50 text-rose-700' : 'bg-stone-50 text-stone-500'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span
              className={`text-3xl font-extrabold font-['Outfit'] ${
                lowStockCount > 0 ? 'text-rose-600' : 'text-stone-900'
              }`}
            >
              {lowStockCount}
            </span>
            <p className="text-[11px] text-stone-500 mt-1">
              {lowStockCount > 0 ? 'Items below reorder threshold' : 'All items sufficiently stocked'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-stone-100/70 p-5 rounded-3xl border border-stone-200">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-3">
          Quick Administrative Actions
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('menu')}
            className="p-3.5 bg-white hover:bg-stone-50 text-stone-800 rounded-2xl border border-stone-200 text-xs font-bold shadow-2xs flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 text-amber-600" />
            <span>Add / Edit Menu</span>
          </button>

          <button
            onClick={() => onNavigate('inventory')}
            className="p-3.5 bg-white hover:bg-stone-50 text-stone-800 rounded-2xl border border-stone-200 text-xs font-bold shadow-2xs flex items-center justify-center gap-2 transition-colors"
          >
            <Boxes className="w-4 h-4 text-emerald-600" />
            <span>Update Inventory</span>
          </button>

          <button
            onClick={() => onNavigate('orders')}
            className="p-3.5 bg-white hover:bg-stone-50 text-stone-800 rounded-2xl border border-stone-200 text-xs font-bold shadow-2xs flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-blue-600" />
            <span>Live Kitchen Orders</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="p-3.5 bg-white hover:bg-stone-50 text-stone-800 rounded-2xl border border-stone-200 text-xs font-bold shadow-2xs flex items-center justify-center gap-2 transition-colors"
          >
            <Settings className="w-4 h-4 text-purple-600" />
            <span>Cafeteria Settings</span>
          </button>
        </div>
      </div>

      {/* Recent Live Orders Feed */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-bold text-stone-900 text-base font-['Outfit']">
              Recent Live Orders Feed
            </h3>
            <p className="text-xs text-stone-500">
              Real-time synchronization across all counters and kitchen stations
            </p>
          </div>
          <button
            onClick={() => onNavigate('orders')}
            className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
          >
            <span>View All Live Orders</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-stone-100">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs text-stone-900">
                  {order.orderNumber}
                </span>
                <div>
                  <p className="font-bold text-xs text-stone-800">
                    {order.studentName} ({order.studentEnrollmentId})
                  </p>
                  <p className="text-[11px] text-stone-400">
                    {order.items.map((i) => `${i.quantity}x ${i.foodName}`).join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-xs text-stone-900">
                  Rs. {order.total.toLocaleString()}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
