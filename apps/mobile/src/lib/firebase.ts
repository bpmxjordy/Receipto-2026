/**
 * Firebase client — JS SDK wrapper.
 *
 * This module initialises the Firebase JS SDK (modular v9+ API) and
 * exports the service instances used throughout the app.
 *
 * WHY JS SDK first, RN Firebase later:
 * RN Firebase needs custom native modules and won't run in Expo Go.
 * JS SDK works in Expo Go and custom builds. We swap to RN Firebase at
 * Phase 4 when we drop Expo Go — this wrapper means call sites don't
 * change.
 *
 * IMPORTANT: Replace the firebaseConfig values below with your actual
 * Firebase project config from the Firebase Console → Project Settings
 * → General → Your apps → Web app.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your actual Firebase config from the console.
// Firebase Console → Project Settings → General → Your apps → Web app
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'receipto-2026.firebaseapp.com',
  projectId: 'receipto-2026',
  storageBucket: 'receipto-2026.firebasestorage.app',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Initialise only once (important for hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { app };
