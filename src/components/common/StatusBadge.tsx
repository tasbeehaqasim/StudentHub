import React from 'react';
import {
  OrderStatus,
  RushLevel,
  SlotCapacityStatus,
  InventoryStatus,
  StudentStatus,
  PaymentStatus
} from '../../types';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChefHat,
  PackageCheck,
  Flame,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface OrderBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export const OrderStatusBadge: React.FC<OrderBadgeProps> = ({ status, size = 'sm' }) => {
  const configs: Record<
    OrderStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    PLACED: {
      label: 'Order Placed',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <Clock className="w-3.5 h-3.5" />
    },
    PAYMENT_CONFIRMED: {
      label: 'Payment Confirmed',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />
    },
    ACCEPTED: {
      label: 'Accepted by Kitchen',
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200',
      icon: <ChefHat className="w-3.5 h-3.5" />
    },
    PREPARING: {
      label: 'Cooking / Preparing',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <Flame className="w-3.5 h-3.5 animate-pulse text-amber-600" />
    },
    READY_FOR_PICKUP: {
      label: 'Ready for Pickup',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-300',
      icon: <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
    },
    COLLECTED: {
      label: 'Collected',
      bg: 'bg-stone-100',
      text: 'text-stone-700',
      border: 'border-stone-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5" />
    },
    CANCELLED: {
      label: 'Cancelled',
      bg: 'bg-stone-100',
      text: 'text-stone-500',
      border: 'border-stone-300',
      icon: <XCircle className="w-3.5 h-3.5" />
    },
    DELAYED: {
      label: 'Delayed',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-300',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
    },
    REFUND_PENDING: {
      label: 'Refund Pending',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      icon: <RotateCcw className="w-3.5 h-3.5" />
    },
    REFUNDED: {
      label: 'Refunded',
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />
    },
    NO_SHOW: {
      label: 'No-Show',
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: <AlertCircle className="w-3.5 h-3.5" />
    }
  };

  const c = configs[status] || configs.PLACED;
  const padding = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${c.bg} ${c.text} ${c.border} ${padding}`}
    >
      {c.icon}
      <span>{c.label}</span>
    </span>
  );
};

export const RushLevelBadge: React.FC<{ level: RushLevel }> = ({ level }) => {
  const configs: Record<RushLevel, { label: string; bg: string; text: string; border: string }> = {
    LOW: {
      label: 'Normal Rush',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200'
    },
    MEDIUM: {
      label: 'Moderate Demand',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
    HIGH: {
      label: 'High Rush',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300'
    },
    CRITICAL: {
      label: 'Critical Peak Rush',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-300'
    }
  };
  const c = configs[level];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${c.bg} ${c.text} ${c.border}`}>
      <span className="w-2 h-2 rounded-full bg-current"></span>
      {c.label}
    </span>
  );
};

export const CapacityBadge: React.FC<{ booked: number; max: number }> = ({ booked, max }) => {
  let status: SlotCapacityStatus = 'AVAILABLE';
  if (booked >= max) {
    status = 'FULL';
  } else if (booked >= max * 0.75) {
    status = 'LIMITED';
  }

  const configs: Record<SlotCapacityStatus, { label: string; bg: string; text: string; border: string }> = {
    AVAILABLE: {
      label: 'AVAILABLE',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200'
    },
    LIMITED: {
      label: 'LIMITED',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300'
    },
    FULL: {
      label: 'FULL',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-300'
    }
  };

  const c = configs[status];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-stone-500">
        {booked} / {max}
      </span>
      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${c.bg} ${c.text} ${c.border}`}>
        {c.label}
      </span>
    </div>
  );
};

export const StudentStatusBadge: React.FC<{ status?: StudentStatus }> = ({ status = 'ACTIVE' }) => {
  const configs: Record<StudentStatus, { label: string; bg: string; text: string; border: string }> = {
    ACTIVE: { label: 'Good Standing', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    WARNING: { label: 'Reliability Warning', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
    RESTRICTED: { label: 'Temporary Restriction', bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-300' },
    SUSPENDED: { label: 'Suspended', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300' }
  };
  const c = (status && configs[status]) ? configs[status] : configs.ACTIVE;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
};

export const InventoryBadge: React.FC<{ status: InventoryStatus; quantity: number; unit: string }> = ({
  status,
  quantity,
  unit
}) => {
  const configs: Record<InventoryStatus, { label: string; bg: string; text: string; border: string }> = {
    NORMAL: { label: 'In Stock', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    IN_STOCK: { label: 'In Stock', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    LOW: { label: 'Low Stock', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
    LOW_STOCK: { label: 'Low Stock', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
    OUT_OF_STOCK: { label: 'Out of Stock', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300' }
  };
  const c = configs[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${c.bg} ${c.text} ${c.border}`}>
      <span>{quantity} {unit}</span>
      <span>•</span>
      <span>{c.label}</span>
    </span>
  );
};

export const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const configs: Record<PaymentStatus, { label: string; bg: string; text: string; border: string }> = {
    PENDING: { label: 'Pending at Counter', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    COMPLETED: { label: 'Paid', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    FAILED: { label: 'Failed', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    REFUNDED: { label: 'Refunded', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
  };
  const c = configs[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
};

export const ReliabilityBadge = StudentStatusBadge;
export const InventoryStatusBadge = InventoryBadge;
