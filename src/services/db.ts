import {
  AuthUser,
  StudentUser,
  StaffUser,
  AdminUser,
  Category,
  FoodItem,
  PickupSlot,
  Order,
  OrderItem,
  WalletTransaction,
  InventoryItem,
  NotificationItem,
  Review,
  Discount,
  RefundRecord,
  NoShowRecord,
  Expense,
  AuditLog,
  CafeteriaSettings,
  SupportTicket,
  RushLevel,
  SlotCapacityStatus,
  StudentStatus,
  InventoryStatus,
  PaymentMethod,
  OrderStatus,
  Role
} from '../types';

const STORAGE_KEY_PREFIX = 'campusbite_';

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading localStorage key:', key, e);
    return defaultVal;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing localStorage key:', key, e);
  }
}

// ---------------- INITIAL SEED DATA ----------------

const SEED_STUDENTS: StudentUser[] = [
  {
    id: 'student-1',
    role: 'STUDENT',
    enrollmentId: '2024-CS-123',
    fullName: 'Ali Khan',
    email: 'ali.khan@university.edu',
    department: 'Computer Science',
    program: 'BS Computer Science',
    semester: 4,
    phone: '+92 300 1234567',
    status: 'ACTIVE',
    noShowCount: 0,
    walletBalance: 1450,
    createdAt: '2024-09-01T08:00:00.000Z'
  },
  {
    id: 'student-2',
    role: 'STUDENT',
    enrollmentId: '2024-SE-105',
    fullName: 'Sara Ahmed',
    email: 'sara.ahmed@university.edu',
    department: 'Software Engineering',
    program: 'BS Software Engineering',
    semester: 3,
    phone: '+92 321 9876543',
    status: 'ACTIVE',
    noShowCount: 0,
    walletBalance: 820,
    createdAt: '2024-09-05T09:30:00.000Z'
  },
  {
    id: 'student-3',
    role: 'STUDENT',
    enrollmentId: '2023-EE-089',
    fullName: 'Hamza Tariq',
    email: 'hamza.tariq@university.edu',
    department: 'Electrical Engineering',
    program: 'BS Electrical Engineering',
    semester: 6,
    phone: '+92 333 4567890',
    status: 'WARNING',
    noShowCount: 1,
    walletBalance: 310,
    createdAt: '2023-09-12T10:15:00.000Z'
  }
];

const SEED_STAFF: StaffUser[] = [
  {
    id: 'staff-1',
    role: 'STAFF',
    staffId: 'STAFF-101',
    fullName: 'Tariq Mehmood',
    email: 'tariq.staff@cafeteria.edu',
    phone: '+92 312 3456789',
    position: 'Supervisor',
    status: 'ACTIVE',
    createdAt: '2023-01-10T08:00:00.000Z'
  },
  {
    id: 'staff-2',
    role: 'STAFF',
    staffId: 'STAFF-102',
    fullName: 'Bilal Aslam',
    email: 'bilal.kitchen@cafeteria.edu',
    phone: '+92 345 6789012',
    position: 'Kitchen Staff',
    status: 'ACTIVE',
    createdAt: '2023-04-15T08:00:00.000Z'
  }
];

const SEED_ADMIN: AdminUser = {
  id: 'admin-1',
  role: 'ADMIN',
  adminId: 'ADMIN-01',
  fullName: 'Dr. Kamran Siddiqui',
  email: 'admin@campusbite.edu',
  roleTitle: 'Cafeteria General Manager & Director',
  createdAt: '2022-08-01T08:00:00.000Z'
};

const SEED_CATEGORIES: Category[] = [
  { id: 'cat-breakfast', name: 'Breakfast', slug: 'breakfast', description: 'Fresh morning parathas, eggs, and sandwiches', isActive: true, displayOrder: 1 },
  { id: 'cat-meals', name: 'Meals', slug: 'meals', description: 'Hearty rice platters, curries, and burgers', isActive: true, displayOrder: 2 },
  { id: 'cat-snacks', name: 'Snacks', slug: 'snacks', description: 'Crispy samosas, pakoras, rolls, and fries', isActive: true, displayOrder: 3 },
  { id: 'cat-beverages', name: 'Beverages', slug: 'beverages', description: 'Chai, espresso, fresh juices, and chilled soft drinks', isActive: true, displayOrder: 4 },
  { id: 'cat-desserts', name: 'Desserts', slug: 'desserts', description: 'Brownies, cakes, fruit bowls, and sweets', isActive: true, displayOrder: 5 }
];

const SEED_INVENTORY: InventoryItem[] = [
  { id: 'inv-chicken', name: 'Boneless Fresh Chicken', currentQuantity: 24.5, unit: 'kg', minimumThreshold: 8.0, costPerUnit: 650, lastRestocked: '2026-09-14T06:00:00.000Z', status: 'NORMAL' },
  { id: 'inv-rice', name: 'Super Basmati Rice', currentQuantity: 40.0, unit: 'kg', minimumThreshold: 10.0, costPerUnit: 340, lastRestocked: '2026-09-12T07:00:00.000Z', status: 'NORMAL' },
  { id: 'inv-buns', name: 'Sesame Burger Buns', currentQuantity: 65, unit: 'pieces', minimumThreshold: 20, costPerUnit: 35, lastRestocked: '2026-09-15T05:30:00.000Z', status: 'NORMAL' },
  { id: 'inv-potatoes', name: 'Fresh Potatoes', currentQuantity: 35.0, unit: 'kg', minimumThreshold: 10.0, costPerUnit: 90, lastRestocked: '2026-09-13T06:00:00.000Z', status: 'NORMAL' },
  { id: 'inv-oil', name: 'Refined Cooking Oil', currentQuantity: 18.0, unit: 'liter', minimumThreshold: 6.0, costPerUnit: 480, lastRestocked: '2026-09-10T08:00:00.000Z', status: 'NORMAL' },
  { id: 'inv-tea', name: 'Premium Black Tea Leaves', currentQuantity: 8.5, unit: 'kg', minimumThreshold: 2.0, costPerUnit: 1200, lastRestocked: '2026-09-11T09:00:00.000Z', status: 'NORMAL' },
  { id: 'inv-milk', name: 'Fresh Dairy Milk', currentQuantity: 25.0, unit: 'liter', minimumThreshold: 5.0, costPerUnit: 220, lastRestocked: '2026-09-15T05:00:00.000Z', status: 'NORMAL' },
  { id: 'inv-cheese', name: 'Cheddar Cheese Slices', currentQuantity: 45, unit: 'pieces', minimumThreshold: 15, costPerUnit: 45, lastRestocked: '2026-09-14T10:00:00.000Z', status: 'NORMAL' },
  { id: 'inv-choc', name: 'Dark Baking Chocolate', currentQuantity: 6.0, unit: 'kg', minimumThreshold: 2.0, costPerUnit: 1400, lastRestocked: '2026-09-08T11:00:00.000Z', status: 'NORMAL' },
  { id: 'inv-boxes', name: 'Eco Meal Packaging Boxes', currentQuantity: 120, unit: 'pieces', minimumThreshold: 30, costPerUnit: 18, lastRestocked: '2026-09-10T12:00:00.000Z', status: 'NORMAL' }
];

const SEED_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'food-biryani',
    name: 'Special Chicken Dum Biryani',
    categoryId: 'cat-meals',
    description: 'Aromatic long-grain basmati rice layered with tender marinated chicken, saffron, mint, and traditional spices. Served with fresh mint raita.',
    price: 280,
    cost: 165,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 142,
    preparationMinutes: 10,
    isAvailable: true,
    tags: ['Popular', 'Chef Special', 'Spicy'],
    ingredients: ['Basmati Rice', 'Chicken', 'Yogurt', 'Saffron', 'Mint', 'Garam Masala'],
    ingredientLinks: [
      { ingredientId: 'inv-chicken', quantityRequired: 0.15 },
      { ingredientId: 'inv-rice', quantityRequired: 0.2 },
      { ingredientId: 'inv-oil', quantityRequired: 0.02 }
    ],
    allergens: ['Dairy'],
    calories: 580,
    proteinGrams: 32,
    carbsGrams: 74
  },
  {
    id: 'food-zinger',
    name: 'Crispy Zinger Burger',
    categoryId: 'cat-meals',
    description: 'Golden crispy fried spicy chicken breast topped with crunchy iceberg lettuce and signature garlic mayo inside a toasted sesame bun.',
    price: 420,
    cost: 230,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 98,
    preparationMinutes: 12,
    isAvailable: true,
    tags: ['Popular'],
    ingredients: ['Crispy Chicken Patty', 'Sesame Bun', 'Iceberg Lettuce', 'Garlic Mayo Sauce'],
    ingredientLinks: [
      { ingredientId: 'inv-chicken', quantityRequired: 0.14 },
      { ingredientId: 'inv-buns', quantityRequired: 1 },
      { ingredientId: 'inv-oil', quantityRequired: 0.04 }
    ],
    allergens: ['Gluten', 'Eggs'],
    calories: 620,
    proteinGrams: 28,
    carbsGrams: 55
  },
  {
    id: 'food-chicken-burger',
    name: 'Classic Grilled Chicken Burger',
    categoryId: 'cat-meals',
    description: 'Juicy herb-seasoned grilled chicken patty with tomato, fresh onions, cucumber pickles, and mild thousand-island dressing.',
    price: 350,
    cost: 190,
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 64,
    preparationMinutes: 10,
    isAvailable: true,
    tags: ['Popular'],
    ingredients: ['Grilled Chicken Patty', 'Burger Bun', 'Fresh Vegetables', 'Sauce'],
    ingredientLinks: [
      { ingredientId: 'inv-chicken', quantityRequired: 0.12 },
      { ingredientId: 'inv-buns', quantityRequired: 1 }
    ],
    allergens: ['Gluten', 'Dairy'],
    calories: 490,
    proteinGrams: 30,
    carbsGrams: 42
  },
  {
    id: 'food-chicken-roll',
    name: 'Karachi Style Chicken Paratha Roll',
    categoryId: 'cat-snacks',
    description: 'Charcoal-grilled chicken boti wrapped in a crispy golden paratha with thinly sliced onions and tangy imli garlic chutney.',
    price: 220,
    cost: 120,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 110,
    preparationMinutes: 8,
    isAvailable: true,
    tags: ['Popular', 'Chef Special'],
    ingredients: ['Crispy Paratha', 'BBQ Chicken', 'Chutney', 'Onions'],
    ingredientLinks: [
      { ingredientId: 'inv-chicken', quantityRequired: 0.1 },
      { ingredientId: 'inv-oil', quantityRequired: 0.02 }
    ],
    allergens: ['Gluten'],
    calories: 430,
    proteinGrams: 22,
    carbsGrams: 38
  },
  {
    id: 'food-veg-sandwich',
    name: 'Toasted Garden Vegetable Sandwich',
    categoryId: 'cat-breakfast',
    description: 'Wholesome layered whole-wheat bread loaded with cucumber, tomato, capsicum, mint chutney, and mild pepper seasoning.',
    price: 180,
    cost: 85,
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
    rating: 4.4,
    reviewCount: 42,
    preparationMinutes: 6,
    isAvailable: true,
    tags: ['Vegetarian', 'New'],
    ingredients: ['Toasted Bread', 'Cucumber', 'Tomato', 'Bell Pepper', 'Mint Chutney'],
    allergens: ['Gluten'],
    calories: 280,
    proteinGrams: 8,
    carbsGrams: 48
  },
  {
    id: 'food-fries',
    name: 'Peri-Peri Masala French Fries',
    categoryId: 'cat-snacks',
    description: 'Crispy skin-on potato fries tossed in zesty peri-peri masala seasoning. Served with creamy dip.',
    price: 150,
    cost: 65,
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 125,
    preparationMinutes: 7,
    isAvailable: true,
    tags: ['Popular', 'Vegetarian'],
    ingredients: ['Potatoes', 'Peri Masala', 'Vegetable Oil', 'Dip'],
    ingredientLinks: [
      { ingredientId: 'inv-potatoes', quantityRequired: 0.25 },
      { ingredientId: 'inv-oil', quantityRequired: 0.03 }
    ],
    allergens: [],
    calories: 340,
    proteinGrams: 4,
    carbsGrams: 46
  },
  {
    id: 'food-samosa',
    name: 'Crispy Samosa Platter (2 Pcs)',
    categoryId: 'cat-snacks',
    description: 'Traditional spiced potato and green pea filling wrapped in flaky pastry crust, deep-fried to golden perfection. Served with sweet tamarind chutney.',
    price: 120,
    cost: 50,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 180,
    preparationMinutes: 5,
    isAvailable: true,
    tags: ['Popular', 'Vegetarian'],
    ingredients: ['Flour Dough', 'Potatoes', 'Green Peas', 'Spices', 'Chutney'],
    ingredientLinks: [
      { ingredientId: 'inv-potatoes', quantityRequired: 0.15 },
      { ingredientId: 'inv-oil', quantityRequired: 0.02 }
    ],
    allergens: ['Gluten'],
    calories: 290,
    proteinGrams: 6,
    carbsGrams: 40
  },
  {
    id: 'food-pakora',
    name: 'Hot Mixed Veg Pakora Basket',
    categoryId: 'cat-snacks',
    description: 'Assorted onion, potato, and spinach fritters dipped in spiced gram-flour batter and fried fresh upon order.',
    price: 140,
    cost: 60,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewCount: 76,
    preparationMinutes: 8,
    isAvailable: true,
    tags: ['Vegetarian'],
    ingredients: ['Gram Flour', 'Onions', 'Potatoes', 'Spinach', 'Coriander'],
    ingredientLinks: [
      { ingredientId: 'inv-potatoes', quantityRequired: 0.12 },
      { ingredientId: 'inv-oil', quantityRequired: 0.03 }
    ],
    allergens: [],
    calories: 310,
    proteinGrams: 8,
    carbsGrams: 36
  },
  {
    id: 'food-tea',
    name: 'Special Doodh Patti Karak Chai',
    categoryId: 'cat-beverages',
    description: 'Strong, aromatic university favorite slow-brewed with fresh dairy milk, cracked cardamom, and dark tea leaves.',
    price: 80,
    cost: 32,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 310,
    preparationMinutes: 4,
    isAvailable: true,
    tags: ['Popular'],
    ingredients: ['Dairy Milk', 'Black Tea Leaves', 'Green Cardamom', 'Sugar'],
    ingredientLinks: [
      { ingredientId: 'inv-milk', quantityRequired: 0.18 },
      { ingredientId: 'inv-tea', quantityRequired: 0.015 }
    ],
    allergens: ['Dairy'],
    calories: 120,
    proteinGrams: 4,
    carbsGrams: 14
  },
  {
    id: 'food-coffee',
    name: 'Rich Espresso Hot Coffee',
    categoryId: 'cat-beverages',
    description: 'Freshly pulled double-shot espresso topped with velvety steamed milk foam and light cocoa dusting.',
    price: 200,
    cost: 80,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 88,
    preparationMinutes: 5,
    isAvailable: true,
    tags: ['Popular'],
    ingredients: ['Roasted Coffee Beans', 'Steamed Milk', 'Cocoa Powder'],
    ingredientLinks: [
      { ingredientId: 'inv-milk', quantityRequired: 0.2 }
    ],
    allergens: ['Dairy'],
    calories: 140,
    proteinGrams: 6,
    carbsGrams: 12
  },
  {
    id: 'food-juice',
    name: 'Fresh Seasonal Fruit Juice',
    categoryId: 'cat-beverages',
    description: 'Pure 100% freshly pressed juice made to order without added sugar or preservatives. High in Vitamin C.',
    price: 180,
    cost: 85,
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 52,
    preparationMinutes: 5,
    isAvailable: true,
    tags: ['New'],
    ingredients: ['Fresh Seasonal Fruits', 'Black Salt', 'Crushed Ice'],
    allergens: [],
    calories: 130,
    proteinGrams: 2,
    carbsGrams: 30
  },
  {
    id: 'food-cold-drink',
    name: 'Chilled Soft Drink Can (330ml)',
    categoryId: 'cat-beverages',
    description: 'Ice-cold carbonated beverage can (choice of Cola, Lemon, or Orange).',
    price: 90,
    cost: 55,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewCount: 95,
    preparationMinutes: 2,
    isAvailable: true,
    tags: [],
    ingredients: ['Carbonated Soft Drink Can'],
    allergens: [],
    calories: 140,
    proteinGrams: 0,
    carbsGrams: 35
  },
  {
    id: 'food-brownie',
    name: 'Warm Fudge Brownie with Ice Cream',
    categoryId: 'cat-desserts',
    description: 'Decadent warm chocolate brownie with melted chocolate core, served with a scoop of vanilla bean ice cream.',
    price: 280,
    cost: 130,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 115,
    preparationMinutes: 5,
    isAvailable: true,
    tags: ['Popular', 'Chef Special'],
    ingredients: ['Cocoa', 'Dark Chocolate', 'Butter', 'Vanilla Ice Cream', 'Walnuts'],
    ingredientLinks: [
      { ingredientId: 'inv-choc', quantityRequired: 0.05 }
    ],
    allergens: ['Dairy', 'Gluten', 'Nuts', 'Eggs'],
    calories: 460,
    proteinGrams: 7,
    carbsGrams: 58
  },
  {
    id: 'food-cake',
    name: 'Belgian Chocolate Fudge Cake Slice',
    categoryId: 'cat-desserts',
    description: 'Triple-layered soft chocolate sponge soaked in chocolate ganache and decorated with chocolate flakes.',
    price: 250,
    cost: 110,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 78,
    preparationMinutes: 3,
    isAvailable: true,
    tags: ['Discounted'],
    ingredients: ['Flour', 'Belgian Chocolate', 'Cream', 'Sugar'],
    ingredientLinks: [
      { ingredientId: 'inv-choc', quantityRequired: 0.04 }
    ],
    allergens: ['Dairy', 'Gluten', 'Eggs'],
    calories: 410,
    proteinGrams: 6,
    carbsGrams: 52
  },
  {
    id: 'food-chaat',
    name: 'Fresh Spicy Fruit Chaat Bowl',
    categoryId: 'cat-desserts',
    description: 'A vibrant bowl of freshly diced seasonal apples, bananas, guava, and pomegranate tossed in orange juice and spicy chaat masala.',
    price: 190,
    cost: 85,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 62,
    preparationMinutes: 5,
    isAvailable: true,
    tags: ['Vegetarian', 'New'],
    ingredients: ['Fresh Diced Fruits', 'Orange Glaze', 'Special Chaat Masala'],
    allergens: [],
    calories: 180,
    proteinGrams: 3,
    carbsGrams: 42
  }
];

function generatePickupSlots(): PickupSlot[] {
  const today = new Date().toISOString().split('T')[0];
  return [
    { id: 'slot-1', date: today, startTime: '11:30', endTime: '11:45', label: '11:30 AM – 11:45 AM', maxCapacity: 20, bookedCount: 8, counterNumber: 'Counter 1' },
    { id: 'slot-2', date: today, startTime: '11:45', endTime: '12:00', label: '11:45 AM – 12:00 PM', maxCapacity: 20, bookedCount: 14, counterNumber: 'Counter 1' },
    { id: 'slot-3', date: today, startTime: '12:00', endTime: '12:15', label: '12:00 PM – 12:15 PM', maxCapacity: 20, bookedCount: 19, counterNumber: 'Counter 2' },
    { id: 'slot-4', date: today, startTime: '12:15', endTime: '12:30', label: '12:15 PM – 12:30 PM', maxCapacity: 20, bookedCount: 20, counterNumber: 'Counter 2' }, // FULL
    { id: 'slot-5', date: today, startTime: '12:30', endTime: '12:45', label: '12:30 PM – 12:45 PM', maxCapacity: 20, bookedCount: 7, counterNumber: 'Counter 1' },
    { id: 'slot-6', date: today, startTime: '12:45', endTime: '13:00', label: '12:45 PM – 01:00 PM', maxCapacity: 20, bookedCount: 5, counterNumber: 'Counter 1' },
    { id: 'slot-7', date: today, startTime: '13:00', endTime: '13:15', label: '01:00 PM – 01:15 PM', maxCapacity: 20, bookedCount: 12, counterNumber: 'Counter 2' },
    { id: 'slot-8', date: today, startTime: '13:15', endTime: '13:30', label: '01:15 PM – 01:30 PM', maxCapacity: 20, bookedCount: 4, counterNumber: 'Counter 2' },
    { id: 'slot-9', date: today, startTime: '13:30', endTime: '13:45', label: '01:30 PM – 01:45 PM', maxCapacity: 20, bookedCount: 2, counterNumber: 'Counter 1' }
  ];
}

const SEED_DISCOUNTS: Discount[] = [
  { id: 'disc-1', code: 'STUDENT10', name: 'Student 10% Off', type: 'PERCENTAGE', value: 10, minimumOrder: 250, startDate: '2026-01-01', endDate: '2026-12-31', usageLimit: 500, timesUsed: 84, isActive: true },
  { id: 'disc-2', code: 'WELCOME50', name: 'Welcome Rs. 50 Off', type: 'FIXED', value: 50, minimumOrder: 300, startDate: '2026-01-01', endDate: '2026-12-31', usageLimit: 200, timesUsed: 62, isActive: true }
];

const SEED_SETTINGS: CafeteriaSettings = {
  isOpen: true,
  isOrderingEnabled: true,
  openingTime: '08:00',
  closingTime: '20:00',
  slotDurationMinutes: 15,
  maxOrdersPerSlot: 20,
  noShowGraceMinutes: 20,
  maxActiveOrdersPerStudent: 3,
  announcements: [
    {
      id: 'ann-1',
      title: 'Chef Special Friday Dum Biryani',
      message: 'Fresh hot batches ready at Counter 1 & 2. Please book your slots in advance to avoid rush.',
      isActive: true,
      createdAt: '2026-09-15T08:00:00.000Z'
    },
    {
      id: 'ann-2',
      title: 'Digital Campus Wallet Cashback',
      message: 'Get 5% instant bonus credit on wallet top-ups over Rs. 1,000 this week.',
      isActive: true,
      createdAt: '2026-09-14T09:00:00.000Z'
    }
  ]
};

const SEED_ORDERS: Order[] = [
  {
    id: 'order-10021',
    orderNumber: 'CB-10021',
    pickupCode: '4912',
    studentId: 'student-1',
    studentEnrollmentId: '2024-CS-123',
    studentName: 'Ali Khan',
    studentPhone: '+92 300 1234567',
    items: [
      {
        foodItemId: 'food-biryani',
        foodName: 'Special Chicken Dum Biryani',
        foodImageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
        unitPrice: 280,
        costPrice: 165,
        quantity: 1,
        specialInstructions: 'Extra raita please',
        subtotal: 280
      },
      {
        foodItemId: 'food-tea',
        foodName: 'Special Doodh Patti Karak Chai',
        foodImageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
        unitPrice: 80,
        costPrice: 32,
        quantity: 1,
        specialInstructions: 'Less sugar',
        subtotal: 80
      }
    ],
    subtotal: 360,
    discountAmount: 0,
    total: 360,
    totalCost: 197,
    paymentMethod: 'WALLET',
    paymentStatus: 'COMPLETED',
    status: 'COLLECTED',
    pickupSlotId: 'slot-1',
    pickupSlotLabel: '11:30 AM – 11:45 AM',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupCounter: 'Counter 1',
    createdAt: '2026-09-15T07:15:00.000Z',
    acceptedAt: '2026-09-15T07:20:00.000Z',
    preparingAt: '2026-09-15T07:25:00.000Z',
    readyAt: '2026-09-15T07:35:00.000Z',
    collectedAt: '2026-09-15T07:42:00.000Z',
    canBeCancelled: false
  },
  {
    id: 'order-10022',
    orderNumber: 'CB-10022',
    pickupCode: '8204',
    studentId: 'student-2',
    studentEnrollmentId: '2024-SE-105',
    studentName: 'Sara Ahmed',
    studentPhone: '+92 321 9876543',
    items: [
      {
        foodItemId: 'food-zinger',
        foodName: 'Crispy Zinger Burger',
        foodImageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
        unitPrice: 420,
        costPrice: 230,
        quantity: 1,
        subtotal: 420
      },
      {
        foodItemId: 'food-cold-drink',
        foodName: 'Chilled Soft Drink Can (330ml)',
        foodImageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80',
        unitPrice: 90,
        costPrice: 55,
        quantity: 1,
        subtotal: 90
      }
    ],
    subtotal: 510,
    discountAmount: 50,
    discountCode: 'WELCOME50',
    total: 460,
    totalCost: 285,
    paymentMethod: 'WALLET',
    paymentStatus: 'COMPLETED',
    status: 'READY_FOR_PICKUP',
    pickupSlotId: 'slot-2',
    pickupSlotLabel: '11:45 AM – 12:00 PM',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupCounter: 'Counter 1',
    createdAt: '2026-09-15T08:10:00.000Z',
    acceptedAt: '2026-09-15T08:14:00.000Z',
    preparingAt: '2026-09-15T08:20:00.000Z',
    readyAt: '2026-09-15T08:35:00.000Z',
    canBeCancelled: false
  },
  {
    id: 'order-10023',
    orderNumber: 'CB-10023',
    pickupCode: '1738',
    studentId: 'student-3',
    studentEnrollmentId: '2023-EE-089',
    studentName: 'Hamza Tariq',
    studentPhone: '+92 333 4567890',
    items: [
      {
        foodItemId: 'food-chicken-roll',
        foodName: 'Karachi Style Chicken Paratha Roll',
        foodImageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
        unitPrice: 220,
        costPrice: 120,
        quantity: 1,
        subtotal: 220
      }
    ],
    subtotal: 220,
    discountAmount: 0,
    total: 220,
    totalCost: 120,
    paymentMethod: 'CASH',
    paymentStatus: 'PENDING',
    status: 'PREPARING',
    pickupSlotId: 'slot-3',
    pickupSlotLabel: '12:00 PM – 12:15 PM',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupCounter: 'Counter 2',
    createdAt: '2026-09-15T08:25:00.000Z',
    acceptedAt: '2026-09-15T08:28:00.000Z',
    preparingAt: '2026-09-15T08:32:00.000Z',
    canBeCancelled: false
  }
];

const SEED_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-1',
    studentId: 'student-1',
    type: 'TOP_UP',
    amount: 2000,
    balanceAfter: 2000,
    description: 'Campus Card Online Top-Up',
    status: 'COMPLETED',
    createdAt: '2026-09-10T10:00:00.000Z'
  },
  {
    id: 'tx-2',
    studentId: 'student-1',
    type: 'ORDER_PAYMENT',
    amount: 360,
    balanceAfter: 1640,
    description: 'Pre-Order CB-10021 Payment',
    status: 'COMPLETED',
    relatedOrderId: 'order-10021',
    createdAt: '2026-09-15T07:15:00.000Z'
  },
  {
    id: 'tx-3',
    studentId: 'student-2',
    type: 'TOP_UP',
    amount: 1500,
    balanceAfter: 1500,
    description: 'Easypaisa / JazzCash Top-Up',
    status: 'COMPLETED',
    createdAt: '2026-09-14T11:00:00.000Z'
  },
  {
    id: 'tx-4',
    studentId: 'student-2',
    type: 'ORDER_PAYMENT',
    amount: 460,
    balanceAfter: 1040,
    description: 'Pre-Order CB-10022 Payment',
    status: 'COMPLETED',
    relatedOrderId: 'order-10022',
    createdAt: '2026-09-15T08:10:00.000Z'
  }
];

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'student-1',
    title: 'Order Completed',
    message: 'Your order CB-10021 was collected at Counter 1. Thank you!',
    type: 'ORDER',
    isRead: true,
    relatedOrderId: 'order-10021',
    createdAt: '2026-09-15T07:42:00.000Z'
  },
  {
    id: 'notif-2',
    userId: 'student-2',
    title: 'Your Order is Ready!',
    message: 'Order CB-10022 is packed and ready for pickup at Counter 1. Please show your code 8204.',
    type: 'PICKUP',
    isRead: false,
    relatedOrderId: 'order-10022',
    createdAt: '2026-09-15T08:35:00.000Z'
  },
  {
    id: 'notif-3',
    userId: 'ALL_STAFF',
    title: 'New Order Received',
    message: 'New order CB-10023 received for slot 12:00 PM – 12:15 PM.',
    type: 'ORDER',
    isRead: false,
    relatedOrderId: 'order-10023',
    createdAt: '2026-09-15T08:25:00.000Z'
  }
];

const SEED_EXPENSES: Expense[] = [
  { id: 'exp-1', title: 'Daily Poultry Supplies (Chicken)', category: 'Ingredients', amount: 12500, date: '2026-09-14', description: 'Fresh boneless chicken 20kg supplied by Al-Madina Farms', recordedBy: 'Dr. Kamran Siddiqui', createdAt: '2026-09-14T07:00:00.000Z' },
  { id: 'exp-2', title: 'Kitchen Gas & Cylinder Refill', category: 'Utilities', amount: 4800, date: '2026-09-13', description: 'Commercial gas cylinders refill', recordedBy: 'Dr. Kamran Siddiqui', createdAt: '2026-09-13T09:30:00.000Z' },
  { id: 'exp-3', title: 'Biodegradable Takeaway Boxes & Cups', category: 'Packaging', amount: 3500, date: '2026-09-12', description: 'Pack of 300 boxes and 500 hot cups', recordedBy: 'Dr. Kamran Siddiqui', createdAt: '2026-09-12T11:00:00.000Z' }
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-15T06:00:00.000Z',
    userId: 'admin-1',
    userName: 'Dr. Kamran Siddiqui',
    userRole: 'ADMIN',
    action: 'Cafeteria Opened',
    entity: 'CafeteriaSettings',
    details: 'Cafeteria morning operations opened and pre-ordering enabled.',
    previousValue: 'CLOSED',
    newValue: 'OPEN'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-14T14:00:00.000Z',
    userId: 'admin-1',
    userName: 'Dr. Kamran Siddiqui',
    userRole: 'ADMIN',
    action: 'Inventory Restocked',
    entity: 'InventoryItem',
    details: 'Added 15kg Boneless Chicken to inventory stock.'
  }
];

// ---------------- DATABASE SERVICE CLASS ----------------

type ChangeListener = () => void;

class DatabaseService {
  private listeners: ChangeListener[] = [];

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (!localStorage.getItem(STORAGE_KEY_PREFIX + 'initialized')) {
      this.resetToSeed();
    }
  }

  public resetToSeed() {
    setStored('students', SEED_STUDENTS);
    setStored('staff', SEED_STAFF);
    setStored('admin', SEED_ADMIN);
    setStored('categories', SEED_CATEGORIES);
    setStored('inventory', SEED_INVENTORY);
    setStored('food_items', SEED_FOOD_ITEMS);
    setStored('pickup_slots', generatePickupSlots());
    setStored('orders', SEED_ORDERS);
    setStored('transactions', SEED_TRANSACTIONS);
    setStored('notifications', SEED_NOTIFICATIONS);
    setStored('discounts', SEED_DISCOUNTS);
    setStored('settings', SEED_SETTINGS);
    setStored('expenses', SEED_EXPENSES);
    setStored('audit_logs', SEED_AUDIT_LOGS);
    setStored('favorites', [
      { studentId: 'student-1', foodItemId: 'food-biryani' },
      { studentId: 'student-1', foodItemId: 'food-tea' },
      { studentId: 'student-2', foodItemId: 'food-zinger' }
    ]);
    setStored('reviews', [
      {
        id: 'rev-1',
        studentId: 'student-1',
        studentName: 'Ali Khan',
        foodItemId: 'food-biryani',
        orderId: 'order-10021',
        rating: 5,
        comment: 'Fresh, piping hot and the raita was delicious. Picked up right on time at Counter 1!',
        createdAt: '2026-09-15T07:45:00.000Z'
      }
    ]);
    setStored('no_shows', []);
    setStored('refunds', []);
    setStored('support_tickets', []);
    setStored('credentials', {
      // Simple stored password hashes for demo accounts:
      '2024-CS-123': 'Student@123',
      '2024-SE-105': 'Student@123',
      '2023-EE-089': 'Student@123',
      'STAFF-101': 'Staff@123',
      'tariq.staff@cafeteria.edu': 'Staff@123',
      'STAFF-102': 'Staff@123',
      'bilal.kitchen@cafeteria.edu': 'Staff@123',
      'ADMIN-01': 'Admin@123',
      'admin@campusbite.edu': 'Admin@123'
    });
    setStored('initialized', true);
    this.notify();
  }

  public subscribe(listener: ChangeListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // ---- GETTERS ----

  public getStudents(): StudentUser[] {
    return getStored<StudentUser[]>('students', []);
  }

  public getStudentById(id: string): StudentUser | undefined {
    return this.getStudents().find((s) => s.id === id);
  }

  public getStudentByEnrollmentId(enrollmentId: string): StudentUser | undefined {
    return this.getStudents().find(
      (s) => s.enrollmentId.trim().toUpperCase() === enrollmentId.trim().toUpperCase()
    );
  }

  public getStaff(): StaffUser[] {
    return getStored<StaffUser[]>('staff', []);
  }

  public getAdmin(): AdminUser {
    return getStored<AdminUser>('admin', SEED_ADMIN);
  }

  public getCategories(): Category[] {
    return getStored<Category[]>('categories', []);
  }

  public getInventory(): InventoryItem[] {
    return getStored<InventoryItem[]>('inventory', []);
  }

  public getFoodItems(): FoodItem[] {
    return getStored<FoodItem[]>('food_items', []);
  }

  public getPickupSlots(): PickupSlot[] {
    return getStored<PickupSlot[]>('pickup_slots', []);
  }

  public getOrders(): Order[] {
    return getStored<Order[]>('orders', []);
  }

  public getTransactions(studentId?: string): WalletTransaction[] {
    const list = getStored<WalletTransaction[]>('transactions', []);
    if (!studentId) return list;
    return list.filter((t) => t.studentId === studentId);
  }

  public getNotifications(userId: string, role?: string): NotificationItem[] {
    const list = getStored<NotificationItem[]>('notifications', []);
    return list.filter((n) => {
      if (n.userId === userId) return true;
      if (role === 'STAFF' && (n.userId === 'ALL_STAFF' || n.userId === 'STAFF')) return true;
      if (role === 'ADMIN' && (n.userId === 'ALL_ADMIN' || n.userId === 'ADMIN')) return true;
      return false;
    });
  }

  public getDiscounts(): Discount[] {
    return getStored<Discount[]>('discounts', []);
  }

  public getSettings(): CafeteriaSettings {
    return getStored<CafeteriaSettings>('settings', SEED_SETTINGS);
  }

  public getExpenses(): Expense[] {
    return getStored<Expense[]>('expenses', []);
  }

  public getAuditLogs(): AuditLog[] {
    return getStored<AuditLog[]>('audit_logs', []);
  }

  public getFavorites(studentId: string): string[] {
    const all = getStored<{ studentId: string; foodItemId: string }[]>('favorites', []);
    return all.filter((f) => f.studentId === studentId).map((f) => f.foodItemId);
  }

  public getReviews(foodItemId?: string): Review[] {
    const all = getStored<Review[]>('reviews', []);
    if (!foodItemId) return all;
    return all.filter((r) => r.foodItemId === foodItemId);
  }

  public getRefunds(): RefundRecord[] {
    return getStored<RefundRecord[]>('refunds', []);
  }

  public getNoShows(): NoShowRecord[] {
    return getStored<NoShowRecord[]>('no_shows', []);
  }

  public getSupportTickets(studentId?: string): SupportTicket[] {
    const all = getStored<SupportTicket[]>('support_tickets', []);
    if (!studentId) return all;
    return all.filter((t) => t.studentId === studentId);
  }

  // ---- SMART RUSH LEVEL CALCULATION ----
  public calculateRushLevel(): { level: RushLevel; description: string; activeCount: number } {
    const orders = this.getOrders();
    const activeOrders = orders.filter((o) =>
      ['PLACED', 'PAYMENT_CONFIRMED', 'ACCEPTED', 'PREPARING'].includes(o.status)
    );
    const count = activeOrders.length;
    const slots = this.getPickupSlots();
    const fullOrLimitedSlots = slots.filter((s) => s.bookedCount >= s.maxCapacity * 0.75).length;

    if (count > 25 || fullOrLimitedSlots >= 5) {
      return {
        level: 'CRITICAL',
        description: 'Very high cafeteria kitchen rush. Later pickup slots strongly recommended.',
        activeCount: count
      };
    } else if (count > 12 || fullOrLimitedSlots >= 3) {
      return {
        level: 'HIGH',
        description: 'Busy cafeteria period. We suggest booking slots 30+ minutes out.',
        activeCount: count
      };
    } else if (count > 5 || fullOrLimitedSlots >= 1) {
      return {
        level: 'MEDIUM',
        description: 'Moderate cafeteria demand. Kitchen is moving efficiently.',
        activeCount: count
      };
    } else {
      return {
        level: 'LOW',
        description: 'Normal cafeteria activity. Quick preparation times available.',
        activeCount: count
      };
    }
  }

  // ---- STUDENT ACTIONS ----

  public registerStudent(studentData: Omit<StudentUser, 'id' | 'role' | 'status' | 'noShowCount' | 'walletBalance' | 'createdAt'>, password: string): { success: boolean; error?: string; student?: StudentUser } {
    const students = this.getStudents();
    const existingEnrollment = students.find(
      (s) => s.enrollmentId.trim().toUpperCase() === studentData.enrollmentId.trim().toUpperCase()
    );
    if (existingEnrollment) {
      return { success: false, error: 'University Enrollment ID is already registered.' };
    }

    const existingEmail = students.find(
      (s) => s.email.trim().toLowerCase() === studentData.email.trim().toLowerCase()
    );
    if (existingEmail) {
      return { success: false, error: 'University Email is already registered.' };
    }

    const newStudent: StudentUser = {
      ...studentData,
      id: 'student-' + Date.now(),
      role: 'STUDENT',
      status: 'ACTIVE',
      noShowCount: 0,
      walletBalance: 0, // Starts at 0
      createdAt: new Date().toISOString()
    };

    students.push(newStudent);
    setStored('students', students);

    // Save credentials
    const creds = getStored<Record<string, string>>('credentials', {});
    creds[newStudent.enrollmentId] = password;
    creds[newStudent.email] = password;
    setStored('credentials', creds);

    this.notify();
    return { success: true, student: newStudent };
  }

  public updateStudentProfile(studentId: string, updates: Partial<StudentUser>): { success: boolean; error?: string } {
    const students = this.getStudents();
    const idx = students.findIndex((s) => s.id === studentId);
    if (idx === -1) return { success: false, error: 'Student not found.' };

    // Prevent changing enrollmentId without admin
    const current = students[idx];
    students[idx] = {
      ...current,
      fullName: updates.fullName ?? current.fullName,
      phone: updates.phone ?? current.phone,
      department: updates.department ?? current.department,
      program: updates.program ?? current.program,
      semester: updates.semester ?? current.semester
    };
    setStored('students', students);
    this.notify();
    return { success: true };
  }

  public toggleFavorite(studentId: string, foodItemId: string): boolean {
    const all = getStored<{ studentId: string; foodItemId: string }[]>('favorites', []);
    const exists = all.some((f) => f.studentId === studentId && f.foodItemId === foodItemId);
    let updated;
    if (exists) {
      updated = all.filter((f) => !(f.studentId === studentId && f.foodItemId === foodItemId));
    } else {
      updated = [...all, { studentId, foodItemId }];
    }
    setStored('favorites', updated);
    this.notify();
    return !exists;
  }

  public topUpWallet(studentId: string, amount: number, methodDescription: string = 'Campus Card / EasyPaisa'): { success: boolean; newBalance: number; error?: string } {
    if (amount <= 0) return { success: false, newBalance: 0, error: 'Top-up amount must be greater than zero.' };

    const students = this.getStudents();
    const student = students.find((s) => s.id === studentId);
    if (!student) return { success: false, newBalance: 0, error: 'Student account not found.' };

    student.walletBalance += amount;
    setStored('students', students);

    const tx: WalletTransaction = {
      id: 'tx-' + Date.now(),
      studentId,
      type: 'TOP_UP',
      amount,
      balanceAfter: student.walletBalance,
      description: `Wallet Top-Up via ${methodDescription}`,
      status: 'COMPLETED',
      createdAt: new Date().toISOString()
    };

    const transactions = getStored<WalletTransaction[]>('transactions', []);
    transactions.unshift(tx);
    setStored('transactions', transactions);

    // Notification
    this.addNotification({
      userId: studentId,
      title: 'Wallet Topped Up',
      message: `Rs. ${amount.toLocaleString()} was successfully credited to your Student Hub wallet. New balance: Rs. ${student.walletBalance.toLocaleString()}.`,
      type: 'PAYMENT'
    });

    this.notify();
    return { success: true, newBalance: student.walletBalance };
  }

  // ---- ATOMIC ORDER CREATION ----
  public placeOrder(orderData: {
    studentId: string;
    items: OrderItem[];
    pickupSlotId: string;
    paymentMethod: 'WALLET' | 'CASH';
    discountCode?: string;
  }): { success: boolean; error?: string; order?: Order } {
    const settings = this.getSettings();

    // 1. Cafeteria status checks
    if (!settings.isOpen) {
      return { success: false, error: 'The cafeteria is currently closed for the day.' };
    }
    if (!settings.isOrderingEnabled) {
      return { success: false, error: 'Pre-ordering is currently paused by cafeteria management.' };
    }

    // 2. Student status & active order limits
    const students = this.getStudents();
    const student = students.find((s) => s.id === orderData.studentId);
    if (!student) return { success: false, error: 'Student record not found.' };

    if (student.status === 'RESTRICTED' || student.status === 'SUSPENDED') {
      return {
        success: false,
        error: `Your account is currently in '${student.status}' status due to past uncollected orders. Please visit cafeteria administration to restore ordering access.`
      };
    }

    const allOrders = this.getOrders();
    const activeStudentOrders = allOrders.filter(
      (o) =>
        o.studentId === student.id &&
        ['PLACED', 'PAYMENT_CONFIRMED', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'].includes(o.status)
    );
    if (activeStudentOrders.length >= settings.maxActiveOrdersPerStudent) {
      return {
        success: false,
        error: `You already have ${activeStudentOrders.length} active orders. Maximum allowed active orders is ${settings.maxActiveOrdersPerStudent}.`
      };
    }

    // 3. Pickup slot validation & capacity lock
    const slots = this.getPickupSlots();
    const slotIndex = slots.findIndex((s) => s.id === orderData.pickupSlotId);
    if (slotIndex === -1) return { success: false, error: 'Selected pickup slot was not found.' };

    const targetSlot = slots[slotIndex];
    if (targetSlot.isDisabled) {
      return { success: false, error: 'The selected pickup slot has been temporarily disabled.' };
    }
    if (targetSlot.bookedCount >= targetSlot.maxCapacity) {
      // Find recommendation
      const availableAlternative = slots.find((s) => !s.isDisabled && s.bookedCount < s.maxCapacity);
      const recMsg = availableAlternative ? ` Recommended alternative: ${availableAlternative.label}` : '';
      return { success: false, error: `This pickup slot just reached maximum capacity (20/20).${recMsg}` };
    }

    // 4. Validate items & calculate totals
    const foodItems = this.getFoodItems();
    let subtotal = 0;
    let totalCost = 0;

    for (const orderItem of orderData.items) {
      const food = foodItems.find((f) => f.id === orderItem.foodItemId);
      if (!food || !food.isAvailable || food.isDeactivated) {
        return { success: false, error: `"${orderItem.foodName}" is currently out of stock or unavailable.` };
      }
      subtotal += food.price * orderItem.quantity;
      totalCost += food.cost * orderItem.quantity;
    }

    // 5. Apply discount if provided
    let discountAmount = 0;
    if (orderData.discountCode) {
      const discounts = this.getDiscounts();
      const disc = discounts.find(
        (d) => d.code.toUpperCase() === orderData.discountCode?.trim().toUpperCase() && d.isActive
      );
      if (disc) {
        if (subtotal >= disc.minimumOrder) {
          if (disc.type === 'PERCENTAGE') {
            discountAmount = Math.round((subtotal * disc.value) / 100);
          } else {
            discountAmount = disc.value;
          }
          // Cap discount at subtotal
          discountAmount = Math.min(discountAmount, subtotal);
          disc.timesUsed += 1;
          setStored('discounts', discounts);
        }
      }
    }

    const total = Math.max(0, subtotal - discountAmount);

    // 6. Payment validation
    let paymentStatus: 'PENDING' | 'COMPLETED' = 'PENDING';
    if (orderData.paymentMethod === 'WALLET') {
      if (student.walletBalance < total) {
        return {
          success: false,
          error: `Insufficient wallet balance. You have Rs. ${student.walletBalance.toLocaleString()}, but order total is Rs. ${total.toLocaleString()}. Please top up your wallet or select Cash at counter.`
        };
      }
      // Atomic deduction
      student.walletBalance -= total;
      setStored('students', students);
      paymentStatus = 'COMPLETED';
    }

    // 7. Update pickup slot capacity
    targetSlot.bookedCount += 1;
    setStored('pickup_slots', slots);

    // 8. Generate unique order number and pickup code
    const orderCount = allOrders.length;
    const orderNumber = `CB-${10000 + orderCount + 1}`;
    const pickupCode = Math.floor(1000 + Math.random() * 9000).toString();

    // 9. Consume inventory linked to ingredients
    const inventory = this.getInventory();
    for (const item of orderData.items) {
      const food = foodItems.find((f) => f.id === item.foodItemId);
      if (food?.ingredientLinks) {
        for (const link of food.ingredientLinks) {
          const invItem = inventory.find((i) => i.id === link.ingredientId);
          if (invItem) {
            const deduction = link.quantityRequired * item.quantity;
            invItem.currentQuantity = Math.max(0, Math.round((invItem.currentQuantity - deduction) * 100) / 100);
            if (invItem.currentQuantity <= 0) {
              invItem.status = 'OUT_OF_STOCK';
            } else if (invItem.currentQuantity <= invItem.minimumThreshold) {
              invItem.status = 'LOW';
            }
          }
        }
      }
    }
    setStored('inventory', inventory);

    // 10. Create Order object
    const newOrder: Order = {
      id: 'order-' + Date.now(),
      orderNumber,
      pickupCode,
      studentId: student.id,
      studentEnrollmentId: student.enrollmentId,
      studentName: student.fullName,
      studentPhone: student.phone,
      items: orderData.items,
      subtotal,
      discountAmount,
      discountCode: orderData.discountCode,
      total,
      totalCost,
      paymentMethod: orderData.paymentMethod,
      paymentStatus,
      status: paymentStatus === 'COMPLETED' ? 'PAYMENT_CONFIRMED' : 'PLACED',
      pickupSlotId: targetSlot.id,
      pickupSlotLabel: targetSlot.label,
      pickupDate: targetSlot.date,
      pickupCounter: targetSlot.counterNumber,
      createdAt: new Date().toISOString(),
      canBeCancelled: true
    };

    allOrders.unshift(newOrder);
    setStored('orders', allOrders);

    // 11. Record wallet transaction if wallet was used
    if (orderData.paymentMethod === 'WALLET') {
      const tx: WalletTransaction = {
        id: 'tx-' + Date.now(),
        studentId: student.id,
        type: 'ORDER_PAYMENT',
        amount: total,
        balanceAfter: student.walletBalance,
        description: `Pre-Order ${orderNumber} Payment`,
        status: 'COMPLETED',
        relatedOrderId: newOrder.id,
        createdAt: new Date().toISOString()
      };
      const transactions = getStored<WalletTransaction[]>('transactions', []);
      transactions.unshift(tx);
      setStored('transactions', transactions);
    }

    // 12. Create notifications for Student and Staff
    this.addNotification({
      userId: student.id,
      title: 'Order Confirmed',
      message: `Your order ${orderNumber} is confirmed! Pickup slot: ${targetSlot.label} at ${targetSlot.counterNumber}. Pickup Code: ${pickupCode}`,
      type: 'ORDER',
      relatedOrderId: newOrder.id
    });

    this.addNotification({
      userId: 'ALL_STAFF',
      title: 'New Incoming Order',
      message: `New Order ${orderNumber} (${orderData.items.length} items) for pickup slot ${targetSlot.label}.`,
      type: 'ORDER',
      relatedOrderId: newOrder.id
    });

    this.notify();
    return { success: true, order: newOrder };
  }

  // ---- CANCELLATION & REFUNDS ----
  public cancelOrder(orderId: string, studentId: string, reason: string = 'Cancelled by student'): { success: boolean; error?: string } {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found.' };

    if (order.studentId !== studentId) {
      return { success: false, error: 'Unauthorized: you can only cancel your own orders.' };
    }

    // Cancellation business rule: before preparation only
    if (['PREPARING', 'READY_FOR_PICKUP', 'COLLECTED', 'NO_SHOW'].includes(order.status)) {
      return {
        success: false,
        error: 'This order can no longer be cancelled because kitchen preparation has already started.'
      };
    }

    if (['CANCELLED', 'REJECTED'].includes(order.status)) {
      return { success: false, error: 'This order has already been cancelled or rejected.' };
    }

    // Update order status
    order.status = 'CANCELLED';
    order.cancelledAt = new Date().toISOString();
    order.canBeCancelled = false;

    // Release pickup slot capacity
    const slots = this.getPickupSlots();
    const slot = slots.find((s) => s.id === order.pickupSlotId);
    if (slot && slot.bookedCount > 0) {
      slot.bookedCount -= 1;
      setStored('pickup_slots', slots);
    }

    // Refund if paid via wallet
    if (order.paymentMethod === 'WALLET' && order.paymentStatus === 'COMPLETED') {
      this.processAutomaticRefund(order, `Student cancellation: ${reason}`);
    }

    setStored('orders', orders);

    this.addNotification({
      userId: studentId,
      title: 'Order Cancelled',
      message: `Order ${order.orderNumber} was successfully cancelled.${order.paymentMethod === 'WALLET' ? ' A full refund has been credited to your wallet.' : ''}`,
      type: 'ORDER',
      relatedOrderId: order.id
    });

    this.addNotification({
      userId: 'ALL_STAFF',
      title: 'Order Cancelled',
      message: `Order ${order.orderNumber} was cancelled by the student.`,
      type: 'ORDER',
      relatedOrderId: order.id
    });

    this.notify();
    return { success: true };
  }

  private processAutomaticRefund(order: Order, reason: string) {
    const students = this.getStudents();
    const student = students.find((s) => s.id === order.studentId);
    if (!student) return;

    student.walletBalance += order.total;
    setStored('students', students);

    order.paymentStatus = 'REFUNDED';

    const tx: WalletTransaction = {
      id: 'tx-' + Date.now(),
      studentId: student.id,
      type: 'REFUND',
      amount: order.total,
      balanceAfter: student.walletBalance,
      description: `Refund for Order ${order.orderNumber} (${reason})`,
      status: 'COMPLETED',
      relatedOrderId: order.id,
      createdAt: new Date().toISOString()
    };
    const transactions = getStored<WalletTransaction[]>('transactions', []);
    transactions.unshift(tx);
    setStored('transactions', transactions);

    const refundRec: RefundRecord = {
      id: 'ref-' + Date.now(),
      orderId: order.id,
      orderNumber: order.orderNumber,
      studentId: student.id,
      studentName: student.fullName,
      amount: order.total,
      reason,
      status: 'REFUNDED',
      requestedAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      processedBy: 'System Auto-Refund'
    };
    const refunds = getStored<RefundRecord[]>('refunds', []);
    refunds.unshift(refundRec);
    setStored('refunds', refunds);

    this.addNotification({
      userId: student.id,
      title: 'Refund Processed',
      message: `Rs. ${order.total.toLocaleString()} has been credited back to your Student Hub wallet for Order ${order.orderNumber}.`,
      type: 'PAYMENT',
      relatedOrderId: order.id
    });
  }

  // ---- STAFF ACTIONS ----

  public staffAcceptOrder(orderId: string): { success: boolean; error?: string } {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found.' };

    order.status = 'ACCEPTED';
    order.acceptedAt = new Date().toISOString();
    setStored('orders', orders);

    this.addNotification({
      userId: order.studentId,
      title: 'Order Accepted by Kitchen',
      message: `Your order ${order.orderNumber} has been accepted and queued for preparation.`,
      type: 'ORDER',
      relatedOrderId: order.id
    });

    this.notify();
    return { success: true };
  }

  public staffRejectOrder(orderId: string, reason: string): { success: boolean; error?: string } {
    if (!reason.trim()) return { success: false, error: 'A rejection reason is required.' };
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found.' };

    order.status = 'REJECTED';
    order.rejectedAt = new Date().toISOString();
    order.rejectionReason = reason;
    order.canBeCancelled = false;

    // Release pickup slot
    const slots = this.getPickupSlots();
    const slot = slots.find((s) => s.id === order.pickupSlotId);
    if (slot && slot.bookedCount > 0) {
      slot.bookedCount -= 1;
      setStored('pickup_slots', slots);
    }

    // Auto refund if paid
    if (order.paymentMethod === 'WALLET' && order.paymentStatus === 'COMPLETED') {
      this.processAutomaticRefund(order, `Cafeteria rejection: ${reason}`);
    }

    setStored('orders', orders);

    this.addNotification({
      userId: order.studentId,
      title: 'Order Rejected',
      message: `Order ${order.orderNumber} could not be accepted. Reason: ${reason}.${order.paymentMethod === 'WALLET' ? ' A full refund was returned to your wallet.' : ''}`,
      type: 'ORDER',
      relatedOrderId: order.id
    });

    this.notify();
    return { success: true };
  }

  public staffStartPreparing(orderId: string): { success: boolean; error?: string } {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found.' };

    order.status = 'PREPARING';
    order.preparingAt = new Date().toISOString();
    order.canBeCancelled = false; // lock cancellation!
    setStored('orders', orders);

    this.addNotification({
      userId: order.studentId,
      title: 'Cooking in Progress',
      message: `Kitchen staff has started preparing your meal for order ${order.orderNumber}.`,
      type: 'ORDER',
      relatedOrderId: order.id
    });

    this.notify();
    return { success: true };
  }

  public staffReportDelay(orderId: string, minutes: number, reason: string): { success: boolean; error?: string } {
    if (!reason.trim()) return { success: false, error: 'A delay reason is required.' };
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found.' };

    order.status = 'DELAYED';
    order.delayMinutes = minutes;
    order.delayReason = reason;
    setStored('orders', orders);

    this.addNotification({
      userId: order.studentId,
      title: 'Order Delayed',
      message: `Your order ${order.orderNumber} is delayed by approx. ${minutes} minutes. Reason: ${reason}. Thank you for your patience!`,
      type: 'WARNING',
      relatedOrderId: order.id
    });

    this.notify();
    return { success: true };
  }

  public staffMarkReady(orderId: string): { success: boolean; error?: string } {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found.' };

    order.status = 'READY_FOR_PICKUP';
    order.readyAt = new Date().toISOString();
    setStored('orders', orders);

    this.addNotification({
      userId: order.studentId,
      title: 'Your Order is Ready for Pickup!',
      message: `Order ${order.orderNumber} is hot & ready! Collect it at ${order.pickupCounter}. Show your Pickup Code: ${order.pickupCode}.`,
      type: 'PICKUP',
      relatedOrderId: order.id
    });

    this.notify();
    return { success: true };
  }

  public verifyPickup(searchQuery: string): { success: boolean; error?: string; order?: Order } {
    const cleanQuery = searchQuery.trim().toUpperCase();
    if (!cleanQuery) return { success: false, error: 'Please enter an Order Number or 4-digit Pickup Code.' };

    const orders = this.getOrders();
    const order = orders.find(
      (o) => o.orderNumber.toUpperCase() === cleanQuery || o.pickupCode === cleanQuery
    );

    if (!order) {
      return { success: false, error: 'Pickup verification failed: No matching order found.' };
    }

    if (order.status === 'COLLECTED') {
      return {
        success: false,
        error: `Order ${order.orderNumber} has ALREADY been collected on ${new Date(order.collectedAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Double pickup prevented.`
      };
    }

    if (order.status === 'CANCELLED' || order.status === 'REJECTED') {
      return { success: false, error: `Order ${order.orderNumber} was previously ${order.status.toLowerCase()}. Cannot collect.` };
    }

    // Success: mark as collected
    order.status = 'COLLECTED';
    order.collectedAt = new Date().toISOString();
    if (order.paymentMethod === 'CASH') {
      order.paymentStatus = 'COMPLETED';
    }
    setStored('orders', orders);

    this.addNotification({
      userId: order.studentId,
      title: 'Order Picked Up',
      message: `Order ${order.orderNumber} was successfully collected. Enjoy your meal! Please leave a review on the menu.`,
      type: 'ORDER',
      relatedOrderId: order.id
    });

    this.notify();
    return { success: true, order };
  }

  // ---- NO-SHOW LOGIC ----
  public markOrderNoShow(orderId: string, reason: string = 'Did not collect within grace period'): { success: boolean; error?: string } {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found.' };

    if (order.status === 'COLLECTED' || order.status === 'CANCELLED') {
      return { success: false, error: 'Cannot mark completed or cancelled order as no-show.' };
    }

    order.status = 'NO_SHOW';
    order.noShowReason = reason;
    setStored('orders', orders);

    // Update student no-show record and status
    const students = this.getStudents();
    const student = students.find((s) => s.id === order.studentId);
    let actionTaken: 'WARNING' | 'RELIABILITY_WARNING' | 'RESTRICTED' = 'WARNING';

    if (student) {
      student.noShowCount = (student.noShowCount || 0) + 1;
      if (student.noShowCount === 1) {
        student.status = 'WARNING';
        actionTaken = 'WARNING';
      } else if (student.noShowCount === 2) {
        student.status = 'WARNING';
        actionTaken = 'RELIABILITY_WARNING';
      } else {
        student.status = 'RESTRICTED';
        actionTaken = 'RESTRICTED';
      }
      setStored('students', students);

      // Record no-show entry
      const noShows = getStored<NoShowRecord[]>('no_shows', []);
      noShows.unshift({
        id: 'ns-' + Date.now(),
        studentId: student.id,
        studentName: student.fullName,
        studentEnrollmentId: student.enrollmentId,
        orderId: order.id,
        orderNumber: order.orderNumber,
        pickupSlotLabel: order.pickupSlotLabel,
        date: order.pickupDate,
        amount: order.total,
        reason,
        actionTaken,
        createdAt: new Date().toISOString()
      });
      setStored('no_shows', noShows);

      // Notification
      const warningText =
        student.noShowCount >= 3
          ? 'Due to repeated missed pickups, your ordering privileges are temporarily restricted. Please contact cafeteria management.'
          : 'You missed your scheduled pickup slot. Please ensure timely collection to prevent food wastage.';

      this.addNotification({
        userId: student.id,
        title: 'Missed Pickup Notice',
        message: `Order ${order.orderNumber} was marked as No-Show. ${warningText}`,
        type: 'WARNING',
        relatedOrderId: order.id
      });
    }

    this.notify();
    return { success: true };
  }

  // ---- REVIEWS ----
  public submitReview(reviewData: {
    studentId: string;
    studentName: string;
    foodItemId: string;
    orderId: string;
    rating: number;
    comment: string;
  }): { success: boolean; error?: string } {
    // Check if order was collected
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === reviewData.orderId);
    if (!order || order.status !== 'COLLECTED') {
      return { success: false, error: 'You can only review food after your order has been collected.' };
    }

    // Check duplicate review
    const reviews = getStored<Review[]>('reviews', []);
    const existing = reviews.find(
      (r) => r.orderId === reviewData.orderId && r.foodItemId === reviewData.foodItemId
    );
    if (existing) {
      return { success: false, error: 'You have already submitted a review for this item from this order.' };
    }

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      ...reviewData,
      createdAt: new Date().toISOString()
    };
    reviews.unshift(newReview);
    setStored('reviews', reviews);

    // Update food item average rating
    const foodItems = this.getFoodItems();
    const food = foodItems.find((f) => f.id === reviewData.foodItemId);
    if (food) {
      const itemReviews = reviews.filter((r) => r.foodItemId === food.id);
      const avg = itemReviews.reduce((acc, curr) => acc + curr.rating, 0) / itemReviews.length;
      food.rating = Math.round(avg * 10) / 10;
      food.reviewCount = itemReviews.length;
      setStored('food_items', foodItems);
    }

    this.notify();
    return { success: true };
  }

  // ---- NOTIFICATIONS ----
  public addNotification(notif: Omit<NotificationItem, 'id' | 'isRead' | 'createdAt'>): void {
    const list = getStored<NotificationItem[]>('notifications', []);
    const newNotif: NotificationItem = {
      ...notif,
      id: 'notif-' + Date.now() + Math.floor(Math.random() * 1000),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    list.unshift(newNotif);
    setStored('notifications', list);
    this.notify();
  }

  public markNotificationAsRead(id: string): void {
    const list = getStored<NotificationItem[]>('notifications', []);
    const item = list.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
      setStored('notifications', list);
      this.notify();
    }
  }

  public markAllNotificationsAsRead(userId: string): void {
    const list = getStored<NotificationItem[]>('notifications', []);
    list.forEach((n) => {
      if (n.userId === userId || n.userId === 'ALL_STAFF' || n.userId === 'ALL_ADMIN') {
        n.isRead = true;
      }
    });
    setStored('notifications', list);
    this.notify();
  }

  // ---- ADMIN MANAGEMENT ----

  public addFoodItem(food: Omit<FoodItem, 'id' | 'rating' | 'reviewCount'>, adminUser?: AdminUser): { success: boolean; error?: string } {
    const admin = adminUser || this.getAdmin();
    const foods = this.getFoodItems();
    const newFood: FoodItem = {
      ...food,
      id: 'food-' + Date.now(),
      rating: 5.0,
      reviewCount: 0
    };
    foods.push(newFood);
    setStored('food_items', foods);

    this.logAudit({
      userId: admin.id,
      userName: admin.fullName,
      userRole: 'ADMIN',
      action: 'Food Item Added',
      entity: 'FoodItem',
      details: `Added new food item "${newFood.name}" (Rs. ${newFood.price})`
    });

    this.notify();
    return { success: true };
  }

  public updateFoodItem(id: string, updates: Partial<FoodItem>, adminUser?: AdminUser): { success: boolean; error?: string } {
    const admin = adminUser || this.getAdmin();
    const foods = this.getFoodItems();
    const idx = foods.findIndex((f) => f.id === id);
    if (idx === -1) return { success: false, error: 'Food item not found.' };

    const old = foods[idx];
    foods[idx] = { ...old, ...updates };
    setStored('food_items', foods);

    this.logAudit({
      userId: admin.id,
      userName: admin.fullName,
      userRole: 'ADMIN',
      action: 'Food Item Updated',
      entity: 'FoodItem',
      details: `Updated "${old.name}"`,
      previousValue: `Price: Rs. ${old.price}, Available: ${old.isAvailable}`,
      newValue: `Price: Rs. ${foods[idx].price}, Available: ${foods[idx].isAvailable}`
    });

    this.notify();
    return { success: true };
  }

  public toggleFoodDeactivated(id: string, adminUser: AdminUser): { success: boolean; isDeactivated: boolean } {
    const foods = this.getFoodItems();
    const food = foods.find((f) => f.id === id);
    if (!food) return { success: false, isDeactivated: false };

    food.isDeactivated = !food.isDeactivated;
    if (food.isDeactivated) {
      food.isAvailable = false;
    }
    setStored('food_items', foods);

    this.logAudit({
      userId: adminUser.id,
      userName: adminUser.fullName,
      userRole: 'ADMIN',
      action: food.isDeactivated ? 'Food Item Deactivated' : 'Food Item Reactivated',
      entity: 'FoodItem',
      details: `${food.name} was ${food.isDeactivated ? 'deactivated' : 'reactivated'}`
    });

    this.notify();
    return { success: true, isDeactivated: food.isDeactivated };
  }

  public restockInventory(id: string, addedQty: number, adminUser: AdminUser): { success: boolean; error?: string } {
    if (addedQty <= 0) return { success: false, error: 'Restock quantity must be positive.' };
    const inv = this.getInventory();
    const item = inv.find((i) => i.id === id);
    if (!item) return { success: false, error: 'Inventory item not found.' };

    const prevQty = item.currentQuantity;
    item.currentQuantity += addedQty;
    item.lastRestocked = new Date().toISOString();
    if (item.currentQuantity > item.minimumThreshold) {
      item.status = 'NORMAL';
    } else {
      item.status = 'LOW';
    }
    setStored('inventory', inv);

    this.logAudit({
      userId: adminUser.id,
      userName: adminUser.fullName,
      userRole: 'ADMIN',
      action: 'Inventory Restocked',
      entity: 'InventoryItem',
      details: `Restocked ${item.name} by +${addedQty} ${item.unit}. (Total: ${item.currentQuantity} ${item.unit})`,
      previousValue: `${prevQty} ${item.unit}`,
      newValue: `${item.currentQuantity} ${item.unit}`
    });

    this.notify();
    return { success: true };
  }

  public updateStudentStatus(studentId: string, status: StudentStatus, adminUser: AdminUser): { success: boolean; error?: string } {
    const students = this.getStudents();
    const student = students.find((s) => s.id === studentId);
    if (!student) return { success: false, error: 'Student not found.' };

    const prev = student.status;
    student.status = status;
    if (status === 'ACTIVE') {
      student.noShowCount = 0; // reset on full restore
    }
    setStored('students', students);

    this.logAudit({
      userId: adminUser.id,
      userName: adminUser.fullName,
      userRole: 'ADMIN',
      action: 'Student Status Changed',
      entity: 'StudentUser',
      details: `Student ${student.fullName} (${student.enrollmentId}) status set to ${status}`,
      previousValue: prev,
      newValue: status
    });

    this.addNotification({
      userId: student.id,
      title: 'Account Status Updated',
      message: `Your Student Hub student account status has been updated to '${status}' by administration.`,
      type: 'SYSTEM'
    });

    this.notify();
    return { success: true };
  }

  public addStaffMember(staffData: Omit<StaffUser, 'id' | 'createdAt'>, password: string, adminUser: AdminUser): { success: boolean; error?: string } {
    const staffList = this.getStaff();
    if (staffList.some((s) => s.staffId.toUpperCase() === staffData.staffId.toUpperCase())) {
      return { success: false, error: 'Staff ID is already in use.' };
    }
    if (staffList.some((s) => s.email.toLowerCase() === staffData.email.toLowerCase())) {
      return { success: false, error: 'Staff Email is already in use.' };
    }

    const newStaff: StaffUser = {
      ...staffData,
      id: 'staff-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    staffList.push(newStaff);
    setStored('staff', staffList);

    const creds = getStored<Record<string, string>>('credentials', {});
    creds[newStaff.staffId] = password;
    creds[newStaff.email] = password;
    setStored('credentials', creds);

    this.logAudit({
      userId: adminUser.id,
      userName: adminUser.fullName,
      userRole: 'ADMIN',
      action: 'Staff Member Added',
      entity: 'StaffUser',
      details: `Added ${newStaff.fullName} (${newStaff.staffId}, ${newStaff.position})`
    });

    this.notify();
    return { success: true };
  }

  public updateStaffStatus(staffId: string, status: 'ACTIVE' | 'INACTIVE', adminUser: AdminUser): { success: boolean } {
    const staffList = this.getStaff();
    const staff = staffList.find((s) => s.id === staffId);
    if (!staff) return { success: false };

    staff.status = status;
    setStored('staff', staffList);

    this.logAudit({
      userId: adminUser.id,
      userName: adminUser.fullName,
      userRole: 'ADMIN',
      action: status === 'ACTIVE' ? 'Staff Activated' : 'Staff Deactivated',
      entity: 'StaffUser',
      details: `${staff.fullName} (${staff.staffId}) status set to ${status}`
    });

    this.notify();
    return { success: true };
  }

  public addExpense(expense: Omit<Expense, 'id' | 'createdAt'>, adminUser: AdminUser): { success: boolean } {
    const expenses = this.getExpenses();
    const newExp: Expense = {
      ...expense,
      id: 'exp-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    expenses.unshift(newExp);
    setStored('expenses', expenses);

    this.logAudit({
      userId: adminUser.id,
      userName: adminUser.fullName,
      userRole: 'ADMIN',
      action: 'Expense Recorded',
      entity: 'Expense',
      details: `Recorded Rs. ${newExp.amount.toLocaleString()} for ${newExp.title} (${newExp.category})`
    });

    this.notify();
    return { success: true };
  }

  public updateSettings(updates: Partial<CafeteriaSettings>, adminUser: AdminUser): { success: boolean } {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    setStored('settings', updated);

    this.logAudit({
      userId: adminUser.id,
      userName: adminUser.fullName,
      userRole: 'ADMIN',
      action: 'Cafeteria Settings Updated',
      entity: 'CafeteriaSettings',
      details: `Cafeteria status: ${updated.isOpen ? 'OPEN' : 'CLOSED'}, Ordering: ${updated.isOrderingEnabled ? 'ENABLED' : 'DISABLED'}`
    });

    this.notify();
    return { success: true };
  }

  public addDiscount(discount: any, adminUser?: AdminUser): { success: boolean; error?: string } {
    const admin = adminUser || this.getAdmin();
    const discounts = this.getDiscounts();
    const code = (discount.code || '').toUpperCase().trim();
    if (discounts.some((d) => d.code.toUpperCase() === code)) {
      return { success: false, error: 'Discount code already exists.' };
    }
    const newDisc: Discount = {
      ...discount,
      code,
      name: discount.name || code,
      type: discount.discountType === 'PERCENTAGE' || discount.type === 'PERCENTAGE' ? 'PERCENTAGE' : 'FIXED',
      value: discount.discountValue ?? discount.value ?? 10,
      minimumOrder: discount.minimumOrderAmount ?? discount.minimumOrder ?? 0,
      startDate: discount.startDate || new Date().toISOString().split('T')[0],
      endDate: discount.expiresAt ?? discount.endDate ?? '2026-12-31',
      usageLimit: discount.usageLimit || 1000,
      timesUsed: 0,
      isActive: discount.isActive !== undefined ? discount.isActive : true,
      id: 'disc-' + Date.now()
    };
    discounts.unshift(newDisc);
    setStored('discounts', discounts);

    this.logAudit({
      userId: admin.id,
      userName: admin.fullName,
      userRole: 'ADMIN',
      action: 'Discount Created',
      entity: 'Discount',
      details: `Created promo code "${newDisc.code}" (${newDisc.value}${newDisc.type === 'PERCENTAGE' ? '%' : ' Rs.'})`
    });

    this.notify();
    return { success: true };
  }

  public toggleDiscountActive(id: string, adminUser: AdminUser): { success: boolean } {
    const discounts = this.getDiscounts();
    const d = discounts.find((disc) => disc.id === id);
    if (!d) return { success: false };
    d.isActive = !d.isActive;
    setStored('discounts', discounts);

    this.logAudit({
      userId: adminUser.id,
      userName: adminUser.fullName,
      userRole: 'ADMIN',
      action: d.isActive ? 'Discount Activated' : 'Discount Deactivated',
      entity: 'Discount',
      details: `Discount "${d.code}" is now ${d.isActive ? 'active' : 'inactive'}`
    });

    this.notify();
    return { success: true };
  }

  public updateSlotCapacity(slotId: string, maxCapacity: number, adminUser: AdminUser): { success: boolean; error?: string } {
    if (maxCapacity <= 0) return { success: false, error: 'Capacity must be greater than zero.' };
    const slots = this.getPickupSlots();
    const slot = slots.find((s) => s.id === slotId);
    if (!slot) return { success: false, error: 'Slot not found.' };

    const oldCap = slot.maxCapacity;
    slot.maxCapacity = maxCapacity;
    setStored('pickup_slots', slots);

    this.logAudit({
      userId: adminUser.id,
      userName: adminUser.fullName,
      userRole: 'ADMIN',
      action: 'Pickup Slot Capacity Updated',
      entity: 'PickupSlot',
      details: `Slot "${slot.label}" capacity changed from ${oldCap} to ${maxCapacity}`
    });

    this.notify();
    return { success: true };
  }

  public toggleSlotDisabled(slotId: string, adminUser: AdminUser): { success: boolean } {
    const slots = this.getPickupSlots();
    const slot = slots.find((s) => s.id === slotId);
    if (!slot) return { success: false };

    slot.isDisabled = !slot.isDisabled;
    setStored('pickup_slots', slots);

    this.logAudit({
      userId: adminUser.id,
      userName: adminUser.fullName,
      userRole: 'ADMIN',
      action: slot.isDisabled ? 'Pickup Slot Disabled' : 'Pickup Slot Enabled',
      entity: 'PickupSlot',
      details: `Slot "${slot.label}" was ${slot.isDisabled ? 'disabled' : 'enabled'}`
    });

    this.notify();
    return { success: true };
  }

  public addAnnouncement(title: string, message: string, adminUser: AdminUser): { success: boolean } {
    const settings = this.getSettings();
    const newAnn = {
      id: 'ann-' + Date.now(),
      title,
      message,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    settings.announcements.unshift(newAnn);
    setStored('settings', settings);

    this.logAudit({
      userId: adminUser.id,
      userName: adminUser.fullName,
      userRole: 'ADMIN',
      action: 'Announcement Published',
      entity: 'CafeteriaSettings',
      details: `Published announcement: "${title}"`
    });

    this.notify();
    return { success: true };
  }

  public toggleAnnouncement(id: string): { success: boolean } {
    const settings = this.getSettings();
    const ann = settings.announcements.find((a) => a.id === id);
    if (!ann) return { success: false };
    ann.isActive = !ann.isActive;
    setStored('settings', settings);
    this.notify();
    return { success: true };
  }

  public submitSupportTicket(ticket: Omit<SupportTicket, 'id' | 'status' | 'createdAt'>): { success: boolean } {
    const tickets = getStored<SupportTicket[]>('support_tickets', []);
    tickets.unshift({
      ...ticket,
      id: 'ticket-' + Date.now(),
      status: 'OPEN',
      createdAt: new Date().toISOString()
    });
    setStored('support_tickets', tickets);
    this.notify();
    return { success: true };
  }

  private logAudit(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const logs = getStored<AuditLog[]>('audit_logs', []);
    logs.unshift({
      ...entry,
      id: 'log-' + Date.now() + Math.floor(Math.random() * 100),
      timestamp: new Date().toISOString()
    });
    setStored('audit_logs', logs.slice(0, 100)); // retain last 100
  }

  // --- Convenience API & Aliases ---
  public updateOrderStatus(orderId: string, status: OrderStatus, reason?: string): { success: boolean; error?: string } {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found' };
    order.status = status;
    if (status === 'READY_FOR_PICKUP') order.readyAt = new Date().toISOString();
    if (status === 'COLLECTED') order.collectedAt = new Date().toISOString();
    if (status === 'PREPARING') order.preparingAt = new Date().toISOString();
    if (status === 'ACCEPTED') order.acceptedAt = new Date().toISOString();
    if (status === 'CANCELLED') order.cancelledAt = new Date().toISOString();
    if (status === 'REJECTED') {
      order.rejectedAt = new Date().toISOString();
      if (reason) order.rejectionReason = reason;
    }
    setStored('orders', orders);
    this.notify();
    return { success: true };
  }

  public rejectOrder(orderId: string, reason: string): { success: boolean; error?: string } {
    return this.updateOrderStatus(orderId, 'REJECTED', reason);
  }

  public delayOrder(orderId: string, minutes: number, reason: string): { success: boolean; error?: string } {
    return this.staffReportDelay(orderId, minutes, reason);
  }

  public verifyAndCollectOrder(searchQuery: string): { success: boolean; error?: string; order?: Order } {
    return this.verifyPickup(searchQuery);
  }

  public updateCategory(id: string, updates: Partial<Category>): { success: boolean } {
    const cats = this.getCategories();
    const idx = cats.findIndex((c) => c.id === id);
    if (idx !== -1) {
      cats[idx] = { ...cats[idx], ...updates };
      setStored('categories', cats);
      this.notify();
    }
    return { success: true };
  }

  public createCategory(category: Omit<Category, 'id'>): { success: boolean; category: Category } {
    const cats = this.getCategories();
    const newCat: Category = {
      ...category,
      id: 'cat-' + Date.now()
    };
    cats.push(newCat);
    setStored('categories', cats);
    this.notify();
    return { success: true, category: newCat };
  }

  public deleteCategory(id: string): { success: boolean } {
    let cats = this.getCategories();
    cats = cats.filter((c) => c.id !== id);
    setStored('categories', cats);
    this.notify();
    return { success: true };
  }

  public createFoodItem(item: Omit<FoodItem, 'id' | 'rating' | 'reviewCount'>, adminUser?: AdminUser): { success: boolean; item: FoodItem } {
    const foods = this.getFoodItems();
    const newItem: FoodItem = {
      ...item,
      id: 'food-' + Date.now(),
      rating: 5.0,
      reviewCount: 0
    };
    foods.unshift(newItem);
    setStored('food_items', foods);
    this.notify();
    return { success: true, item: newItem };
  }

  public deleteFoodItem(id: string, adminUser?: AdminUser): { success: boolean } {
    let foods = this.getFoodItems();
    foods = foods.filter((f) => f.id !== id);
    setStored('food_items', foods);
    this.notify();
    return { success: true };
  }

  public addInventoryItem(item: Omit<InventoryItem, 'id' | 'lastRestocked'>): { success: boolean; item: InventoryItem } {
    const inventory = this.getInventory();
    const newItem: InventoryItem = {
      ...item,
      id: 'inv-' + Date.now(),
      lastRestocked: new Date().toISOString()
    };
    inventory.push(newItem);
    setStored('inventory', inventory);
    this.notify();
    return { success: true, item: newItem };
  }

  public updatePickupSlot(id: string, updates: Partial<PickupSlot>): { success: boolean } {
    const slots = this.getPickupSlots();
    const idx = slots.findIndex((s) => s.id === id);
    if (idx !== -1) {
      slots[idx] = { ...slots[idx], ...updates };
      setStored('pickup_slots', slots);
      this.notify();
    }
    return { success: true };
  }

  public addPickupSlot(slot: Omit<PickupSlot, 'id'>): { success: boolean; slot: PickupSlot } {
    const slots = this.getPickupSlots();
    const newSlot: PickupSlot = {
      ...slot,
      id: 'slot-' + Date.now()
    };
    slots.push(newSlot);
    setStored('pickup_slots', slots);
    this.notify();
    return { success: true, slot: newSlot };
  }

  public toggleDiscount(id: string, isActive: boolean): { success: boolean } {
    const discounts = this.getDiscounts();
    const disc = discounts.find((d) => d.id === id);
    if (disc) {
      disc.isActive = isActive;
      setStored('discounts', discounts);
      this.notify();
    }
    return { success: true };
  }

  public getStaffList(): StaffUser[] {
    return this.getStaff();
  }

  public addStaff(staff: Omit<StaffUser, 'id' | 'role' | 'createdAt'>): { success: boolean; staff: StaffUser } {
    const list = this.getStaff();
    const newStaff: StaffUser = {
      ...staff,
      id: 'staff-' + Date.now(),
      role: 'STAFF',
      createdAt: new Date().toISOString()
    };
    list.push(newStaff);
    setStored('staff', list);
    this.notify();
    return { success: true, staff: newStaff };
  }

  public updateStaff(id: string, updates: Partial<StaffUser>): { success: boolean } {
    const list = this.getStaff();
    const idx = list.findIndex((s) => s.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      setStored('staff', list);
      this.notify();
    }
    return { success: true };
  }

  public removeStaff(id: string): { success: boolean } {
    let list = this.getStaff();
    list = list.filter((s) => s.id !== id);
    setStored('staff', list);
    this.notify();
    return { success: true };
  }

  public updateStudentReliability(studentId: string, status: StudentStatus): { success: boolean } {
    const admin = this.getAdmin();
    return this.updateStudentStatus(studentId, status, admin);
  }

  public addAuditLog(action: string, actor: string, details: string): void {
    this.logAudit({
      userId: actor,
      userName: actor,
      userRole: 'ADMIN',
      action,
      entity: 'SYSTEM',
      details
    });
  }

  public resetToDefaults(): void {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(k);
      }
    });
    this.notify();
  }

  public submitFoodReview(review: Omit<Review, 'id' | 'createdAt'>): { success: boolean; error?: string } {
    return this.submitReview(review);
  }

  public getWalletTransactions(studentId: string): WalletTransaction[] {
    return this.getTransactions(studentId);
  }
}

export const db = new DatabaseService();
