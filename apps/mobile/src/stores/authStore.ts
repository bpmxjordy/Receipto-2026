/**
 * Auth Zustand store.
 *
 * Tracks the current user, loading state, and provides actions.
 * The auth listener is started once from the root layout.
 */

import { create } from 'zustand';
import type { User } from 'firebase/auth';

import { signIn, signUp, signOut, onAuthChanged } from '../lib/auth';

interface AuthState {
  /** The currently signed-in Firebase user, or null */
  user: User | null;
  /** True while we're resolving the initial auth state on app start */
  initialising: boolean;
  /** True during a sign-in / sign-up / sign-out call */
  loading: boolean;
  /** Last auth error message (cleared on next attempt) */
  error: string | null;

  /** Start listening to auth state. Call once from the root layout. */
  init: () => () => void;

  /** Sign in with email + password */
  login: (email: string, password: string) => Promise<void>;

  /** Create a new account */
  register: (email: string, password: string, displayName: string) => Promise<void>;

  /** Sign out */
  logout: () => Promise<void>;

  /** Clear any displayed error */
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialising: true,
  loading: false,
  error: null,

  init: () => {
    const unsubscribe = onAuthChanged((user) => {
      set({ user, initialising: false });
    });
    return unsubscribe;
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await signIn(email, password);
    } catch (err: unknown) {
      set({ error: friendlyError(err) });
    } finally {
      set({ loading: false });
    }
  },

  register: async (email, password, displayName) => {
    set({ loading: true, error: null });
    try {
      await signUp(email, password, displayName);
    } catch (err: unknown) {
      set({ error: friendlyError(err) });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await signOut();
    } catch (err: unknown) {
      set({ error: friendlyError(err) });
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

/** Convert Firebase error codes into user-friendly messages */
function friendlyError(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code;
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection.';
      default:
        return `Something went wrong (${code}).`;
    }
  }
  return 'An unexpected error occurred.';
}
