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
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Replace with your actual Firebase config from the console.
// Firebase Console → Project Settings → General → Your apps → Web app
const firebaseConfig = {
  apiKey: "AIzaSyBZF5ANzIYa9TbHvv6tqRPCNgizRSB6cNY",
  authDomain: "receipto-2026.firebaseapp.com",
  projectId: "receipto-2026",
  storageBucket: "receipto-2026.firebasestorage.app",
  messagingSenderId: "1049597990347",
  appId: "1:1049597990347:web:7fd786541103db22c5d24e",
  measurementId: "G-6NQJNEWC1R"
};

// Initialise only once (important for hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use initializeAuth with AsyncStorage persistence so sessions survive
// app restarts. getAuth() defaults to in-memory on React Native.
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
export { app };
