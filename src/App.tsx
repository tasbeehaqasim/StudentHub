import React, { useState, useEffect } from 'react';
import { authService, AuthSession } from './services/auth';
import { db } from './services/db';
import { StudentUser, StaffUser, AdminUser, Order } from './types';

// Common Components
import { ConfirmationModal } from './components/common/ConfirmationModal';
import { Footer } from './components/common/Footer';

// Headers
import { StudentHeader } from './components/headers/StudentHeader';
import { StaffHeader } from './components/headers/StaffHeader';
import { AdminHeader } from './components/headers/AdminHeader';

// Auth Views
import { RoleSelectionView } from './views/RoleSelectionView';
import { StudentAuthView } from './views/StudentAuthView';
import { StaffAuthView } from './views/StaffAuthView';
import { AdminAuthView } from './views/AdminAuthView';

// Student Features
import { StudentDashboard } from './features/student/StudentDashboard';
import { StudentMenu } from './features/student/StudentMenu';
import { StudentCart } from './features/student/StudentCart';
import { StudentCheckout } from './features/student/StudentCheckout';
import { StudentOrders } from './features/student/StudentOrders';
import { OrderConfirmationView } from './features/student/OrderConfirmationView';
import { StudentWallet } from './features/student/StudentWallet';
import { StudentFavorites } from './features/student/StudentFavorites';
import { StudentNotifications } from './features/student/StudentNotifications';
import { StudentProfile } from './features/student/StudentProfile';
import { StudentSupport } from './features/student/StudentSupport';

// Staff Features
import { StaffDashboard } from './features/staff/StaffDashboard';
import { StaffOrdersQueue } from './features/staff/StaffOrdersQueue';
import { StaffPickupVerification } from './features/staff/StaffPickupVerification';
import { StaffNotifications } from './features/staff/StaffNotifications';
import { StaffProfile } from './features/staff/StaffProfile';

// Admin Features
import { AdminDashboard } from './features/admin/AdminDashboard';
import { AdminMenuManager } from './features/admin/AdminMenuManager';
import { AdminCategoriesManager } from './features/admin/AdminCategoriesManager';
import { AdminLiveOrders } from './features/admin/AdminLiveOrders';
import { AdminStudentsManager } from './features/admin/AdminStudentsManager';
import { AdminStaffManager } from './features/admin/AdminStaffManager';
import { AdminPickupSlotsManager } from './features/admin/AdminPickupSlotsManager';
import { AdminDiscountsManager } from './features/admin/AdminDiscountsManager';
import { AdminAnalytics } from './features/admin/AdminAnalytics';
import { AdminAuditLogs } from './features/admin/AdminAuditLogs';
import { AdminSettings } from './features/admin/AdminSettings';

export default function App() {
  const [session, setSession] = useState<AuthSession | null>(authService.getSession());
  const [authView, setAuthView] = useState<'ROLE_SELECTION' | 'STUDENT_AUTH' | 'STAFF_AUTH' | 'ADMIN_AUTH'>(
    'ROLE_SELECTION'
  );

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Recently completed order for order confirmation view
  const [latestConfirmedOrder, setLatestConfirmedOrder] = useState<Order | null>(null);

  // Logout modal
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    let currentUserId = authService.getSession()?.user?.id;
    const unsub = authService.subscribe((s) => {
      setSession(s);
      if (s && s.user?.id !== currentUserId) {
        currentUserId = s.user?.id;
        setActiveTab('dashboard');
      }
    });
    return unsub;
  }, []);

  const handleLogout = () => {
    authService.logout();
    setLogoutModalOpen(false);
    setAuthView('ROLE_SELECTION');
    setActiveTab('dashboard');
  };

  const handleOrderConfirmed = (order: Order) => {
    setLatestConfirmedOrder(order);
    setActiveTab('order-confirmation');
  };

  // If not authenticated, render auth views
  if (!session) {
    if (authView === 'STUDENT_AUTH') {
      return (
        <StudentAuthView
          onSuccess={() => setActiveTab('dashboard')}
          onBack={() => setAuthView('ROLE_SELECTION')}
        />
      );
    }

    if (authView === 'STAFF_AUTH') {
      return (
        <StaffAuthView
          onSuccess={() => setActiveTab('dashboard')}
          onBack={() => setAuthView('ROLE_SELECTION')}
        />
      );
    }

    if (authView === 'ADMIN_AUTH') {
      return (
        <AdminAuthView
          onSuccess={() => setActiveTab('dashboard')}
          onBack={() => setAuthView('ROLE_SELECTION')}
        />
      );
    }

    return (
      <RoleSelectionView
        onSelectRole={(role) => {
          if (role === 'STUDENT') setAuthView('STUDENT_AUTH');
          else if (role === 'STAFF') setAuthView('STAFF_AUTH');
          else if (role === 'ADMIN') setAuthView('ADMIN_AUTH');
        }}
      />
    );
  }

  // Authenticated layout
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-['Plus_Jakarta_Sans'] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Role-Specific Header */}
      {session.role === 'STUDENT' && (
        <StudentHeader
          student={session.user as StudentUser}
          activeTab={activeTab}
          onNavigate={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLogoutRequest={() => setLogoutModalOpen(true)}
        />
      )}

      {session.role === 'STAFF' && (
        <StaffHeader
          staff={session.user as StaffUser}
          activeTab={activeTab}
          onNavigate={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLogoutRequest={() => setLogoutModalOpen(true)}
        />
      )}

      {session.role === 'ADMIN' && (
        <AdminHeader
          admin={session.user as AdminUser}
          activeTab={activeTab}
          onNavigate={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLogoutRequest={() => setLogoutModalOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* STUDENT PORTAL VIEWS */}
        {session.role === 'STUDENT' && (
          <>
            {activeTab === 'dashboard' && (
              <StudentDashboard
                student={session.user as StudentUser}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'menu' && (
              <StudentMenu
                student={session.user as StudentUser}
                onViewCart={() => setActiveTab('cart')}
              />
            )}

            {activeTab === 'cart' && (
              <StudentCart
                onProceedToCheckout={() => setActiveTab('checkout')}
                onContinueShopping={() => setActiveTab('menu')}
              />
            )}

            {activeTab === 'checkout' && (
              <StudentCheckout
                student={session.user as StudentUser}
                onOrderSuccess={handleOrderConfirmed}
                onBackToCart={() => setActiveTab('cart')}
              />
            )}

            {activeTab === 'order-confirmation' && (
              <OrderConfirmationView
                order={latestConfirmedOrder || db.getOrders().find((o) => o.studentId === session.user.id) || null}
                onViewOrders={() => setActiveTab('orders')}
                onContinueShopping={() => setActiveTab('menu')}
              />
            )}

            {activeTab === 'orders' && (
              <StudentOrders
                student={session.user as StudentUser}
                onReorderSuccess={() => setActiveTab('cart')}
              />
            )}

            {activeTab === 'wallet' && (
              <StudentWallet student={session.user as StudentUser} />
            )}

            {activeTab === 'favorites' && (
              <StudentFavorites
                student={session.user as StudentUser}
                onNavigateToMenu={() => setActiveTab('menu')}
              />
            )}

            {activeTab === 'notifications' && (
              <StudentNotifications
                student={session.user as StudentUser}
                onNavigateToOrder={() => setActiveTab('orders')}
              />
            )}

            {activeTab === 'profile' && (
              <StudentProfile
                student={session.user as StudentUser}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onLogoutRequest={() => setLogoutModalOpen(true)}
              />
            )}

            {activeTab === 'support' && (
              <StudentSupport student={session.user as StudentUser} />
            )}
          </>
        )}

        {/* STAFF PORTAL VIEWS */}
        {session.role === 'STAFF' && (
          <>
            {activeTab === 'dashboard' && (
              <StaffDashboard
                staff={session.user as StaffUser}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'orders' && (
              <StaffOrdersQueue staff={session.user as StaffUser} />
            )}

            {activeTab === 'pickup' && (
              <StaffPickupVerification staff={session.user as StaffUser} />
            )}

            {activeTab === 'notifications' && (
              <StaffNotifications staff={session.user as StaffUser} />
            )}

            {activeTab === 'profile' && (
              <StaffProfile staff={session.user as StaffUser} />
            )}
          </>
        )}

        {/* ADMIN PORTAL VIEWS */}
        {session.role === 'ADMIN' && (
          <>
            {activeTab === 'dashboard' && (
              <AdminDashboard
                admin={session.user as AdminUser}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'menu' && <AdminMenuManager />}

            {activeTab === 'categories' && <AdminCategoriesManager />}

            {activeTab === 'orders' && <AdminLiveOrders />}

            {activeTab === 'students' && <AdminStudentsManager />}

            {activeTab === 'staff' && <AdminStaffManager />}

            {activeTab === 'pickup-slots' && <AdminPickupSlotsManager />}

            {activeTab === 'discounts' && <AdminDiscountsManager />}

            {activeTab === 'analytics' && <AdminAnalytics />}

            {activeTab === 'audit-logs' && <AdminAuditLogs />}

            {activeTab === 'settings' && <AdminSettings />}
          </>
        )}
      </main>

      {/* Global University Footer */}
      <Footer />

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Log Out"
        description="Are you sure you want to log out of your session? Any unsaved checkout progress will remain stored on this device."
        confirmText="Log Out"
        cancelLabel="Stay Logged In"
        variant="warning"
      />
    </div>
  );
}
