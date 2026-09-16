export type Role = 'STUDENT' | 'STAFF' | 'ADMIN';

export type OrderStatus =
  | 'PLACED'
  | 'PAYMENT_CONFIRMED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'COLLECTED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'DELAYED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'NO_SHOW';

export type PaymentMethod = 'WALLET' | 'CASH';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export type RushLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type InventoryStatus = 'NORMAL' | 'LOW' | 'OUT_OF_STOCK' | 'LOW_STOCK' | 'IN_STOCK';

export type StudentStatus = 'ACTIVE' | 'WARNING' | 'RESTRICTED' | 'SUSPENDED';

export type ReliabilityStatus = StudentStatus;

export type StaffPosition =
  | 'Kitchen Staff'
  | 'Counter Staff'
  | 'Order Manager'
  | 'Supervisor';

export type SlotCapacityStatus = 'AVAILABLE' | 'LIMITED' | 'FULL';

export type DiscountType = 'PERCENTAGE' | 'FIXED' | 'FIXED_AMOUNT';

export type RefundStatus = 'REQUESTED' | 'PROCESSING' | 'REFUNDED' | 'FAILED';

export interface StudentUser {
  id: string;
  role: 'STUDENT';
  enrollmentId: string; // e.g. 2024-CS-123
  fullName: string;
  email: string;
  department: string;
  program: string;
  semester: number | string;
  phone: string;
  status: StudentStatus;
  noShowCount: number;
  walletBalance: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface StaffUser {
  id: string;
  role: 'STAFF';
  staffId: string; // e.g. STAFF-101
  fullName: string;
  email: string;
  phone: string;
  position: StaffPosition;
  status: 'ACTIVE' | 'INACTIVE';
  station?: string;
  shift?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  role: 'ADMIN';
  adminId: string; // e.g. ADMIN-01
  fullName: string;
  email: string;
  roleTitle: string;
  createdAt: string;
}

export type AuthUser = StudentUser | StaffUser | AdminUser;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  icon?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface FoodIngredientLink {
  ingredientId: string;
  quantityRequired: number; // e.g. 0.1 kg or 1 bun
}

export interface FoodItem {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  price: number; // in PKR (Rs.)
  cost: number; // cost to make in PKR
  imageUrl: string;
  rating: number;
  reviewCount: number;
  preparationMinutes: number;
  isAvailable: boolean;
  tags: ('Popular' | 'Chef Special' | 'New' | 'Discounted' | 'Spicy' | 'Vegetarian')[];
  ingredients: string[]; // text description for student
  ingredientLinks?: FoodIngredientLink[]; // linked inventory items
  allergens: string[];
  calories?: number;
  proteinGrams?: number;
  carbsGrams?: number;
  isDeactivated?: boolean;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  specialInstructions?: string;
}

export interface OrderItem {
  foodItemId: string;
  foodName: string;
  foodImageUrl: string;
  unitPrice: number;
  costPrice: number;
  quantity: number;
  specialInstructions?: string;
  subtotal: number;
}

export interface PickupSlot {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  label: string; // e.g. "11:30 AM – 11:45 AM"
  maxCapacity: number;
  bookedCount: number;
  currentBookings?: number;
  counterNumber: string;
  counterAssigned?: string;
  isDisabled?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. CB-10024
  pickupCode: string; // 4-digit secure code e.g. 5832
  pickupVerificationCode?: string;
  studentId: string;
  studentEnrollmentId: string;
  studentName: string;
  studentPhone: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  total: number;
  totalCost: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  pickupSlotId: string;
  pickupSlotLabel: string;
  pickupDate: string;
  pickupCounter: string;
  createdAt: string;
  acceptedAt?: string;
  preparingAt?: string;
  readyAt?: string;
  collectedAt?: string;
  cancelledAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  delayMinutes?: number;
  delayReason?: string;
  noShowReason?: string;
  canBeCancelled: boolean;
}

export interface WalletTransaction {
  id: string;
  studentId: string;
  type: 'TOP_UP' | 'ORDER_PAYMENT' | 'REFUND';
  amount: number;
  balanceAfter: number;
  description: string;
  status: 'COMPLETED' | 'FAILED';
  relatedOrderId?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  itemName?: string;
  category?: string;
  currentQuantity: number;
  currentStock?: number;
  unit: string; // kg, liter, pieces, packets
  minimumThreshold: number;
  costPerUnit: number; // in PKR
  unitCost?: number;
  lastRestocked: string;
  lastRestockedAt?: string;
  status: InventoryStatus;
}

export interface NotificationItem {
  id: string;
  userId: string; // studentId, staffId, or 'ALL_STAFF' or 'ALL_ADMIN'
  title: string;
  message: string;
  type: 'ORDER' | 'PICKUP' | 'PAYMENT' | 'INVENTORY' | 'SYSTEM' | 'WARNING';
  isRead: boolean;
  relatedOrderId?: string;
  createdAt: string;
}

export type AppNotification = NotificationItem;

export interface Review {
  id: string;
  studentId: string;
  studentName: string;
  foodItemId: string;
  orderId: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface Discount {
  id: string;
  code: string;
  name: string;
  type: DiscountType;
  value: number; // percentage or PKR amount
  minimumOrder: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
  discountType?: 'PERCENTAGE' | 'FIXED' | 'FIXED_AMOUNT';
  discountValue?: number;
  minimumOrderAmount?: number;
  expiresAt?: string;
}

export type DiscountCode = Discount;

export interface RefundRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  studentId: string;
  studentName: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
}

export interface NoShowRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEnrollmentId: string;
  orderId: string;
  orderNumber: string;
  pickupSlotLabel: string;
  date: string;
  amount: number;
  reason?: string;
  actionTaken: 'WARNING' | 'RELIABILITY_WARNING' | 'RESTRICTED';
  createdAt: string;
}

export interface Expense {
  id: string;
  title: string;
  category: 'Ingredients' | 'Utilities' | 'Maintenance' | 'Packaging' | 'Staff' | 'Other';
  amount: number;
  date: string;
  description: string;
  recordedBy: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  entity: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}

export interface CafeteriaSettings {
  isOpen: boolean; // default: true
  isOrderingEnabled: boolean; // default: true
  openingTime: string; // "08:00"
  closingTime: string; // "20:00"
  slotDurationMinutes: number; // 15
  maxOrdersPerSlot: number; // 20
  noShowGraceMinutes: number; // 20
  maxActiveOrdersPerStudent: number; // 3
  announcements: {
    id: string;
    title: string;
    message: string;
    isActive: boolean;
    createdAt: string;
  }[];
}

export interface SupportTicket {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  subject: string;
  category: 'Order Issue' | 'Payment Issue' | 'Pickup Issue' | 'Account Issue' | 'Other';
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  response?: string;
}
