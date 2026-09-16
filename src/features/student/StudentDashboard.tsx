import React, { useState, useEffect } from 'react';
import { StudentUser, Order, FoodItem, PickupSlot, CafeteriaSettings } from '../../types';
import { db } from '../../services/db';
import { cart } from '../../services/cart';
import { OrderStatusBadge, CapacityBadge, RushLevelBadge } from '../../components/common/StatusBadge';
import { FoodDetailsModal } from './FoodDetailsModal';
import {
  UtensilsCrossed,
  Clock,
  ArrowRight,
  Wallet,
  Bell,
  Star,
  Plus,
  ShoppingBag,
  Sparkles,
  MapPin,
  Megaphone,
  CheckCircle2
} from 'lucide-react';

interface StudentDashboardProps {
  student: StudentUser;
  onNavigate: (tab: string, param?: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  onNavigate
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [settings, setSettings] = useState<CafeteriaSettings>(db.getSettings());
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [rush, setRush] = useState(db.calculateRushLevel());

  useEffect(() => {
    const refreshData = () => {
      const studentOrders = db.getOrders().filter((o) => o.studentId === student.id);
      setOrders(studentOrders);
      setFoodItems(db.getFoodItems());
      setSlots(db.getPickupSlots());
      setSettings(db.getSettings());
      setRush(db.calculateRushLevel());
    };
    refreshData();
    const unsub = db.subscribe(refreshData);
    return unsub;
  }, [student.id]);

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good Morning, ${student.fullName}`;
    if (hour < 17) return `Good Afternoon, ${student.fullName}`;
    return `Good Evening, ${student.fullName}`;
  };

  // Find active order (not yet collected or cancelled)
  const activeOrder = orders.find((o) =>
    ['PLACED', 'PAYMENT_CONFIRMED', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'DELAYED'].includes(
      o.status
    )
  );

  const popularFoods = foodItems
    .filter((f) => !f.isDeactivated && f.isAvailable && f.tags?.includes('Popular'))
    .slice(0, 4);

  const availableSlots = slots.filter((s) => !s.isDisabled && s.bookedCount < s.maxCapacity).slice(0, 3);

  const unreadNotifs = db.getNotifications(student.id, 'STUDENT').filter((n) => !n.isRead).slice(0, 3);
  const activeAnnouncements = settings.announcements.filter((a) => a.isActive);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      {/* 8. Cafeteria Announcement Banner */}
      {activeAnnouncements.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-300/80 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
          <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5 shadow-2xs">
            <Megaphone className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Cafeteria Announcement • {activeAnnouncements[0].title}
            </h4>
            <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
              {activeAnnouncements[0].message}
            </p>
          </div>
        </div>
      )}

      {/* Hero Greeting & Main CTA */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white rounded-3xl p-6 sm:p-9 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8 pointer-events-none">
          <UtensilsCrossed className="w-80 h-80" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            {student.department} • Semester {student.semester}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Outfit']">
            {getGreeting()}
          </h1>

          <p className="text-amber-100 text-sm sm:text-base mt-2 font-medium leading-relaxed">
            Ready to skip the cafeteria queue? Pre-order fresh hot meals and pick them up at your chosen time slot.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('menu')}
              className="py-3 px-6 bg-white hover:bg-stone-50 active:bg-stone-100 text-amber-900 font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-600" />
              <span>Browse Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('wallet')}
              className="py-3 px-5 bg-amber-900/40 hover:bg-amber-900/60 text-white border border-white/20 font-bold rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              <Wallet className="w-4 h-4 text-amber-300" />
              <span>Campus Wallet: Rs. {student.walletBalance.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Current Active Order & Upcoming Pickup & Wallet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Current Active Order */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Current Order Status
                </span>
                {activeOrder && <OrderStatusBadge status={activeOrder.status} />}
              </div>
              {activeOrder && (
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {activeOrder.orderNumber}
                </span>
              )}
            </div>

            {activeOrder ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-stone-50 p-4 rounded-2xl border border-stone-200/70">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">
                      {activeOrder.items.map((i) => `${i.quantity}x ${i.foodName}`).join(', ')}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                      <span className="flex items-center gap-1 font-medium text-stone-700">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Slot: {activeOrder.pickupSlotLabel}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium text-stone-700">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {activeOrder.pickupCounter}
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-xs text-stone-400 block">Total Amount</span>
                    <span className="text-base font-extrabold text-stone-900">
                      Rs. {activeOrder.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress bar steps */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 mb-1.5">
                    <span className="text-amber-700">Order Placed</span>
                    <span className={['ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'COLLECTED'].includes(activeOrder.status) ? 'text-amber-700' : ''}>
                      Accepted
                    </span>
                    <span className={['PREPARING', 'READY_FOR_PICKUP', 'COLLECTED'].includes(activeOrder.status) ? 'text-amber-700' : ''}>
                      Preparing
                    </span>
                    <span className={['READY_FOR_PICKUP', 'COLLECTED'].includes(activeOrder.status) ? 'text-emerald-700' : ''}>
                      Ready for Pickup
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-amber-600 h-full transition-all duration-500"
                      style={{
                        width:
                          activeOrder.status === 'PLACED' || activeOrder.status === 'PAYMENT_CONFIRMED'
                            ? '25%'
                            : activeOrder.status === 'ACCEPTED'
                            ? '50%'
                            : activeOrder.status === 'PREPARING'
                            ? '75%'
                            : '100%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center flex flex-col items-center justify-center text-stone-400">
                <UtensilsCrossed className="w-12 h-12 text-stone-300 stroke-1 mb-2" />
                <p className="text-sm font-semibold text-stone-600">No active order</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  Pick a meal from today's menu to place your pre-order.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
            {activeOrder ? (
              <button
                onClick={() => onNavigate('orders')}
                className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Track Order Details & Pickup Code</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('menu')}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Browse Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Upcoming Pickup / 6. Wallet Balance */}
        <div className="space-y-6">
          {/* Wallet Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Campus Wallet Balance
                </span>
                <Wallet className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-3xl font-extrabold text-stone-900 font-['Outfit']">
                Rs. {student.walletBalance.toLocaleString()}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Linked to {student.enrollmentId} • Zero cash queue
              </p>
            </div>

            <button
              onClick={() => onNavigate('wallet')}
              className="mt-4 w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Top Up / View Wallet</span>
            </button>
          </div>

          {/* Rush Alert Pill */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Cafeteria Rush Status
              </span>
              <p className="text-xs font-semibold text-stone-700 mt-0.5">
                {rush.description}
              </p>
            </div>
            <RushLevelBadge level={rush.level} />
          </div>
        </div>
      </div>

      {/* 3. Quick Categories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-stone-900 font-['Outfit']">Quick Categories</h3>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
          >
            <span>See all food</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { name: 'Breakfast', slug: 'breakfast', emoji: '🍳', count: 'Sandwiches & Chai' },
            { name: 'Meals', slug: 'meals', emoji: '🍛', count: 'Biryani & Burgers' },
            { name: 'Snacks', slug: 'snacks', emoji: '🥟', count: 'Samosas & Fries' },
            { name: 'Beverages', slug: 'beverages', emoji: '☕', count: 'Chai & Cold Drinks' },
            { name: 'Desserts', slug: 'desserts', emoji: '🍰', count: 'Brownies & Cakes' }
          ].map((cat) => (
            <div
              key={cat.slug}
              onClick={() => onNavigate('menu', cat.slug)}
              className="group bg-white hover:bg-amber-50/50 p-4 rounded-2xl border border-stone-200 hover:border-amber-400 cursor-pointer shadow-2xs hover:shadow-md transition-all text-center"
            >
              <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">
                {cat.emoji}
              </span>
              <p className="font-bold text-stone-900 text-sm">{cat.name}</p>
              <p className="text-[11px] text-stone-400 mt-0.5">{cat.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Popular Today Food Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-['Outfit']">Popular Today</h3>
            <p className="text-xs text-stone-500">Student favorites with lightning fast pickup</p>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-bold text-amber-700 hover:underline"
          >
            View Full Menu
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularFoods.map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div
                className="relative h-44 overflow-hidden bg-stone-100 cursor-pointer"
                onClick={() => setSelectedFood(food)}
              >
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                    Popular
                  </span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{food.rating}</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4
                    onClick={() => setSelectedFood(food)}
                    className="font-bold text-stone-900 text-sm hover:text-amber-600 cursor-pointer line-clamp-1"
                  >
                    {food.name}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {food.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-stone-900 font-['Outfit']">
                    Rs. {food.price.toLocaleString()}
                  </span>

                  <button
                    onClick={() => setSelectedFood(food)}
                    className="py-1.5 px-3 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Recommended Pickup Slots */}
      <div className="bg-stone-100/60 rounded-3xl p-6 border border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-['Outfit']">
              Recommended Pickup Slots Today
            </h3>
            <p className="text-xs text-stone-500">
              Slots with low congestion for instant counter collection
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Counters 1 & 2 Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {availableSlots.map((slot) => (
            <div
              key={slot.id}
              className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-xs text-stone-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  {slot.label}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">{slot.counterNumber}</p>
              </div>
              <CapacityBadge booked={slot.bookedCount} max={slot.maxCapacity} />
            </div>
          ))}
        </div>
      </div>

      {/* Food Details Modal */}
      <FoodDetailsModal
        foodItem={selectedFood}
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
        onAddToCartSuccess={() => {
          // Can notify
        }}
      />
    </div>
  );
};
