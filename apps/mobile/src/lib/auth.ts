/**
 * Auth utilities — wraps Firebase Auth for the app.
 *
 * Provides sign-in, sign-up, sign-out, and an auth state listener.
 * All Firebase Auth calls go through here so we can swap the SDK later.
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import { auth, db } from './firebase';

export type AuthUser = User;

/** Sign in with email + password */
export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await ensureProfile(credential.user);
  return credential.user;
}

/** Create a new account */
export async function signUp(
  email: string,
  password: string,
  displayName: string,
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  // Set display name on the Firebase Auth user
  await updateProfile(credential.user, { displayName });

  // Create the Firestore profile doc
  await ensureProfile(credential.user, displayName);

  return credential.user;
}

/** Sign out */
export async function signOut() {
  await firebaseSignOut(auth);
}

/** Subscribe to auth state changes. Returns an unsubscribe function. */
export function onAuthChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Create or merge the `users/{uid}` profile doc.
 * Idempotent — safe to call on every sign-in.
 */
async function ensureProfile(user: User, nameOverride?: string) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: nameOverride ?? user.displayName ?? 'User',
      avatarUrl: user.photoURL ?? null,
      createdAt: new Date(),
    });
  }
}
