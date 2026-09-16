import { AuthUser, Role, StudentUser, StaffUser, AdminUser } from '../types';
import { db } from './db';

const SESSION_KEY = 'campusbite_auth_session';

export type AuthSession = { user: AuthUser; role: Role };

type AuthListener = (session: AuthSession | null) => void;

class AuthService {
  private currentUser: AuthUser | null = null;
  private listeners: AuthListener[] = [];

  constructor() {
    this.restoreSession();
  }

  public getSession(): AuthSession | null {
    if (!this.currentUser) return null;
    return { user: this.currentUser, role: this.currentUser.role };
  }

  private restoreSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Verify user still exists in database
        if (parsed.role === 'STUDENT') {
          const student = db.getStudentById(parsed.id);
          this.currentUser = student || null;
        } else if (parsed.role === 'STAFF') {
          const staff = db.getStaff().find((s) => s.id === parsed.id);
          this.currentUser = staff || null;
        } else if (parsed.role === 'ADMIN') {
          const admin = db.getAdmin();
          this.currentUser = admin.id === parsed.id ? admin : null;
        }
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
      this.currentUser = null;
    }
  }

  public subscribe(listener: AuthListener): () => void {
    this.listeners.push(listener);
    listener(this.getSession());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.getSession()));
  }

  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  public refreshCurrentUser(): void {
    if (this.currentUser && this.currentUser.role === 'STUDENT') {
      const student = db.getStudentById(this.currentUser.id);
      if (student) {
        this.currentUser = student;
        localStorage.setItem(SESSION_KEY, JSON.stringify(student));
        this.notify();
      }
    }
  }

  public getCurrentRole(): Role | null {
    return this.currentUser?.role || null;
  }

  public loginStudent(enrollmentId: string, password: string): { success: boolean; error?: string; user?: StudentUser } {
    const cleanId = enrollmentId.trim().toUpperCase();
    const student = db.getStudentByEnrollmentId(cleanId);

    if (!student) {
      return { success: false, error: 'Unknown University Enrollment ID. Please check or register.' };
    }

    if (student.status === 'SUSPENDED') {
      return { success: false, error: 'Your student account is suspended. Please contact the university cafeteria administration.' };
    }

    // Verify password from stored credentials
    const creds = JSON.parse(localStorage.getItem('campusbite_credentials') || '{}');
    const storedPass = creds[cleanId] || creds[student.email];
    if (storedPass && storedPass !== password) {
      return { success: false, error: 'Incorrect password. Please try again or use Forgot Password.' };
    }

    this.currentUser = student;
    localStorage.setItem(SESSION_KEY, JSON.stringify(student));
    this.notify();
    return { success: true, user: student };
  }

  public loginStaff(identifier: string, password: string): { success: boolean; error?: string; user?: StaffUser } {
    const cleanId = identifier.trim().toLowerCase();
    const staffList = db.getStaff();
    const staff = staffList.find(
      (s) => s.staffId.toLowerCase() === cleanId || s.email.toLowerCase() === cleanId
    );

    if (!staff) {
      return { success: false, error: 'No staff record found with this Staff ID or Email.' };
    }

    if (staff.status !== 'ACTIVE') {
      return { success: false, error: 'This staff account has been deactivated. Please contact administration.' };
    }

    const creds = JSON.parse(localStorage.getItem('campusbite_credentials') || '{}');
    const storedPass = creds[staff.staffId] || creds[staff.email];
    if (storedPass && storedPass !== password) {
      return { success: false, error: 'Incorrect staff password.' };
    }

    this.currentUser = staff;
    localStorage.setItem(SESSION_KEY, JSON.stringify(staff));
    this.notify();
    return { success: true, user: staff };
  }

  public loginAdmin(identifier: string, password: string): { success: boolean; error?: string; user?: AdminUser } {
    const cleanId = identifier.trim().toLowerCase();
    const admin = db.getAdmin();

    if (admin.adminId.toLowerCase() !== cleanId && admin.email.toLowerCase() !== cleanId) {
      return { success: false, error: 'Invalid Administrator credentials.' };
    }

    const creds = JSON.parse(localStorage.getItem('campusbite_credentials') || '{}');
    const storedPass = creds[admin.adminId] || creds[admin.email];
    if (storedPass && storedPass !== password) {
      return { success: false, error: 'Incorrect administrator password.' };
    }

    this.currentUser = admin;
    localStorage.setItem(SESSION_KEY, JSON.stringify(admin));
    this.notify();
    return { success: true, user: admin };
  }

  public logout(): void {
    this.currentUser = null;
    localStorage.removeItem(SESSION_KEY);
    this.notify();
  }

  public resetPassword(emailOrId: string): { success: boolean; message: string } {
    return {
      success: true,
      message: `Password reset instructions have been sent to the university email on file for "${emailOrId}".`
    };
  }
}

export const auth = new AuthService();
export const authService = auth;
