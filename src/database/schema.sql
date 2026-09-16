-- Student Hub — Smart University Cafeteria Pre-Order & Management System
-- Supabase / PostgreSQL Relational Database Schema & Row Level Security (RLS)

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('STUDENT', 'STAFF', 'ADMIN');
CREATE TYPE order_status AS ENUM (
  'PLACED', 'PAYMENT_CONFIRMED', 'ACCEPTED', 'PREPARING',
  'READY_FOR_PICKUP', 'COLLECTED', 'REJECTED', 'CANCELLED',
  'DELAYED', 'REFUND_PENDING', 'REFUNDED', 'NO_SHOW'
);
CREATE TYPE payment_method AS ENUM ('WALLET', 'CASH');
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
CREATE TYPE student_status AS ENUM ('ACTIVE', 'WARNING', 'RESTRICTED', 'SUSPENDED');
CREATE TYPE inventory_status AS ENUM ('NORMAL', 'LOW', 'OUT_OF_STOCK');

-- 3. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  department VARCHAR(100) NOT NULL,
  program VARCHAR(100) NOT NULL,
  semester INT NOT NULL DEFAULT 1,
  phone VARCHAR(25) NOT NULL,
  status student_status NOT NULL DEFAULT 'ACTIVE',
  no_show_count INT NOT NULL DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. STAFF TABLE
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  staff_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(25) NOT NULL,
  position VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role_title VARCHAR(100) NOT NULL DEFAULT 'Cafeteria Administrator',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  current_quantity DECIMAL(10,2) NOT NULL CHECK (current_quantity >= 0),
  unit VARCHAR(20) NOT NULL,
  minimum_threshold DECIMAL(10,2) NOT NULL DEFAULT 5,
  cost_per_unit DECIMAL(10,2) NOT NULL CHECK (cost_per_unit >= 0),
  last_restocked TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status inventory_status NOT NULL DEFAULT 'NORMAL'
);

-- 8. FOOD ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  cost DECIMAL(10,2) NOT NULL CHECK (cost >= 0),
  image_url TEXT,
  rating DECIMAL(3,2) NOT NULL DEFAULT 4.5,
  review_count INT NOT NULL DEFAULT 0,
  preparation_minutes INT NOT NULL DEFAULT 10,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  tags TEXT[],
  allergens TEXT[],
  is_deactivated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. WALLETS TABLE
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID UNIQUE NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. WALLET TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('TOP_UP', 'ORDER_PAYMENT', 'REFUND')),
  amount DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2) NOT NULL CHECK (balance_after >= 0),
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
  related_order_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. PICKUP SLOTS TABLE
CREATE TABLE IF NOT EXISTS public.pickup_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  label VARCHAR(50) NOT NULL,
  max_capacity INT NOT NULL DEFAULT 20,
  booked_count INT NOT NULL DEFAULT 0 CHECK (booked_count >= 0 AND booked_count <= max_capacity),
  counter_number VARCHAR(20) NOT NULL DEFAULT 'Counter 1',
  is_disabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(30) UNIQUE NOT NULL,
  pickup_code VARCHAR(10) NOT NULL,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE RESTRICT,
  pickup_slot_id UUID NOT NULL REFERENCES public.pickup_slots(id),
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  total_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method payment_method NOT NULL DEFAULT 'WALLET',
  payment_status payment_status NOT NULL DEFAULT 'PENDING',
  status order_status NOT NULL DEFAULT 'PLACED',
  pickup_counter VARCHAR(50) NOT NULL DEFAULT 'Counter 1',
  rejection_reason TEXT,
  delay_minutes INT DEFAULT 0,
  delay_reason TEXT,
  can_be_cancelled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  preparing_at TIMESTAMPTZ,
  ready_at TIMESTAMPTZ,
  collected_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- 13. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  food_item_id UUID NOT NULL REFERENCES public.food_items(id),
  food_name VARCHAR(150) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  special_instructions TEXT,
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0)
);

-- 14. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Students can read & update only their own profile
CREATE POLICY "Students own profile read" ON public.students
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Students own profile update" ON public.students
  FOR UPDATE USING (auth.uid() = id);

-- Students can only read and create their own orders
CREATE POLICY "Students read own orders" ON public.orders
  FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Students can only read their own wallet
CREATE POLICY "Students read own wallet" ON public.wallets
  FOR SELECT USING (auth.uid() = student_id);

-- Staff & Admins can access operational orders
CREATE POLICY "Staff read orders" ON public.orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );
