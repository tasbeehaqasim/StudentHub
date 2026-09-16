import React, { useState, useEffect } from 'react';
import { Order, FoodItem } from '../../types';
import { db } from '../../services/db';
import {
  TrendingUp,
  BarChart3,
  Flame,
  Award,
  DollarSign,
  PieChart,
  ShoppingBag
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(db.getOrders());
  const [foods, setFoods] = useState<FoodItem[]>(db.getFoodItems());

  useEffect(() => {
    const refresh = () => {
      setOrders(db.getOrders());
      setFoods(db.getFoodItems());
    };
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED' && o.status !== 'REJECTED')
    .reduce((sum, o) => sum + o.total, 0);

  const totalFoodCost = orders
    .filter((o) => o.status !== 'CANCELLED' && o.status !== 'REJECTED')
    .reduce((sum, o) => {
      return (
        sum +
        o.items.reduce((cSum, i) => cSum + i.costPrice * i.quantity, 0)
      );
    }, 0);

  const grossProfit = Math.max(0, totalRevenue - totalFoodCost);
  const profitMargin = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0;

  // Item counts
  const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
  orders.forEach((o) => {
    if (o.status === 'CANCELLED' || o.status === 'REJECTED') return;
    o.items.forEach((item) => {
      if (!itemCounts[item.foodItemId]) {
        itemCounts[item.foodItemId] = {
          name: item.foodName,
          count: 0,
          revenue: 0
        };
      }
      itemCounts[item.foodItemId].count += item.quantity;
      itemCounts[item.foodItemId].revenue += item.subtotal;
    });
  });

  const popularItems = Object.values(itemCounts).sort((a, b) => b.count - a.count);

  // Status breakdown
  const statusCounts = {
    collected: orders.filter((o) => o.status === 'COLLECTED').length,
    preparing: orders.filter((o) => ['PREPARING', 'READY_FOR_PICKUP'].includes(o.status)).length,
    pending: orders.filter((o) => ['PLACED', 'PAYMENT_CONFIRMED', 'ACCEPTED'].includes(o.status)).length,
    cancelled: orders.filter((o) => ['CANCELLED', 'REJECTED', 'NO_SHOW'].includes(o.status)).length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
          Cafeteria Business Intelligence & Analytics
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Real-time profitability insights, order velocity, item popularity, and peak rush congestion.
        </p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Total Revenue
            </span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-3xl font-extrabold text-stone-900 font-['Outfit']">
            Rs. {totalRevenue.toLocaleString()}
          </span>
          <p className="text-xs text-stone-500 mt-1">From all confirmed orders today</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Raw Ingredients Cost
            </span>
            <BarChart3 className="w-4 h-4 text-stone-400" />
          </div>
          <span className="text-3xl font-extrabold text-stone-700 font-['Outfit']">
            Rs. {totalFoodCost.toLocaleString()}
          </span>
          <p className="text-xs text-stone-500 mt-1">Actual food procurement cost</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Net Gross Profit
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-extrabold text-emerald-600 font-['Outfit']">
            Rs. {grossProfit.toLocaleString()}
          </span>
          <p className="text-xs text-emerald-700 font-bold mt-1">
            {profitMargin}% Gross Margin Achieved
          </p>
        </div>
      </div>

      {/* Split: Popular Dishes Ranking & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Ordered Dishes */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-stone-900 text-base font-['Outfit'] pb-2 border-b border-stone-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span>Top Dishes by Demand</span>
          </h3>

          {popularItems.length === 0 ? (
            <div className="py-8 text-center text-stone-400 text-xs">No sales data yet.</div>
          ) : (
            <div className="space-y-3">
              {popularItems.slice(0, 6).map((item, index) => {
                const maxCount = popularItems[0]?.count || 1;
                const widthPct = Math.round((item.count / maxCount) * 100);

                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900">
                        #{index + 1}. {item.name}
                      </span>
                      <span className="font-mono font-bold text-stone-700">
                        {item.count} orders (Rs. {item.revenue.toLocaleString()})
                      </span>
                    </div>

                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Fulfillment Status Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-stone-900 text-base font-['Outfit'] pb-2 border-b border-stone-100 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-amber-600" />
            <span>Fulfillment Status Distribution</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                Collected
              </span>
              <span className="text-2xl font-extrabold text-emerald-900 font-['Outfit']">
                {statusCounts.collected}
              </span>
              <p className="text-[11px] text-emerald-700 mt-1">Successfully picked up</p>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                In Kitchen / Ready
              </span>
              <span className="text-2xl font-extrabold text-amber-900 font-['Outfit']">
                {statusCounts.preparing}
              </span>
              <p className="text-[11px] text-amber-700 mt-1">Active on line</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                Pending Acceptance
              </span>
              <span className="text-2xl font-extrabold text-blue-900 font-['Outfit']">
                {statusCounts.pending}
              </span>
              <p className="text-[11px] text-blue-700 mt-1">Awaiting kitchen start</p>
            </div>

            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                Cancelled / No Show
              </span>
              <span className="text-2xl font-extrabold text-rose-900 font-['Outfit']">
                {statusCounts.cancelled}
              </span>
              <p className="text-[11px] text-rose-700 mt-1">Refunded or uncollected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
