#!/usr/bin/env node

/**
 * seed-test-receipt — quick script to inject a test receipt using the
 * Firebase JS SDK (same config as the mobile app).
 *
 * Usage:
 *   1. Sign into the app on your phone first (so the user doc exists)
 *   2. Copy your UID from Firebase Console → Authentication → Users
 *   3. Run: node firebase/scripts/seed-test-receipt.mjs <uid>
 *
 * NOTE: This uses the web SDK without authentication, so Firestore
 * security rules will BLOCK the write. To use this script, either:
 *   a) Temporarily open rules in Firebase Console (set allow write: if true
 *      for users/{uid}/receipts, then revert after seeding), OR
 *   b) Use the Firebase Admin version: simulate-receipt.mjs (needs service
 *      account key), OR
 *   c) Seed via the Firebase Console data viewer manually.
 *
 * Requires: npm install firebase  (run from repo root)
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  writeBatch,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';

// ── Firebase config (same as mobile app) ──

const firebaseConfig = {
  apiKey: 'AIzaSyBZF5ANzIYa9TbHvv6tqRPCNgizRSB6cNY',
  authDomain: 'receipto-2026.firebaseapp.com',
  projectId: 'receipto-2026',
  storageBucket: 'receipto-2026.firebasestorage.app',
  messagingSenderId: '1049597990347',
  appId: '1:1049597990347:web:7fd786541103db22c5d24e',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── Sample items ──

const SAMPLE_ITEMS = [
  { name: 'Semi Skimmed Milk 2L', pricePence: 135 },
  { name: 'Hovis Wholemeal 800g', pricePence: 135 },
  { name: 'Free Range Eggs 6pk', pricePence: 198 },
  { name: 'Bananas Loose', pricePence: 79 },
  { name: 'Chicken Breast 500g', pricePence: 399 },
  { name: 'Basmati Rice 1kg', pricePence: 189 },
  { name: 'Heinz Baked Beans 415g', pricePence: 110 },
  { name: 'Cathedral City Cheddar 350g', pricePence: 350 },
  { name: 'Lurpak Butter 250g', pricePence: 299 },
  { name: 'Broccoli 350g', pricePence: 85 },
  { name: 'Carrots 1kg', pricePence: 65 },
  { name: 'Pasta Penne 500g', pricePence: 95 },
];

// ── Main ──

const uid = process.argv[2];
if (!uid) {
  console.error('Usage: node seed-test-receipt.mjs <firebase-uid>');
  console.error('  Find your uid in Firebase Console → Authentication → Users');
  process.exit(1);
}

// Pick 6-8 random items
const count = 6 + Math.floor(Math.random() * 3);
const items = [...SAMPLE_ITEMS].sort(() => Math.random() - 0.5).slice(0, count);
const totalPence = items.reduce((s, i) => s + i.pricePence, 0);

const retailers = ['Tesco', "Sainsbury's", 'Aldi', 'Lidl'];
const retailer = retailers[Math.floor(Math.random() * retailers.length)];

const daysAgo = Math.floor(Math.random() * 14);
const purchasedAt = new Date(Date.now() - daysAgo * 86400000);

const rawText = [
  retailer.toUpperCase(),
  purchasedAt.toLocaleDateString('en-GB'),
  ...items.map((i) => `${i.name}  £${(i.pricePence / 100).toFixed(2)}`),
  `TOTAL  £${(totalPence / 100).toFixed(2)}`,
].join('\n');

// Write to Firestore
const receiptRef = doc(collection(db, `users/${uid}/receipts`));
const receiptId = receiptRef.id;

const batch = writeBatch(db);

batch.set(receiptRef, {
  retailerName: retailer,
  purchasedAt: Timestamp.fromDate(purchasedAt),
  totalPence,
  itemCount: items.length,
  imageUrl: null,
  rawText,
  status: 'pending_categorisation',
  source: 'simulated',
  createdAt: serverTimestamp(),
});

items.forEach((item, i) => {
  const itemRef = doc(collection(db, `users/${uid}/receipts/${receiptId}/items`));
  batch.set(itemRef, {
    rawName: item.name,
    qty: 1,
    unit: 'each',
    pricePence: item.pricePence,
    position: i,
    canonicalItemId: null,
    categoryId: null,
    co2Grams: null,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
});

batch
  .commit()
  .then(() => {
    console.log(`✅ Seeded receipt: ${receiptId}`);
    console.log(`   Retailer: ${retailer}`);
    console.log(`   Items: ${items.length}`);
    console.log(`   Total: £${(totalPence / 100).toFixed(2)}`);
    console.log(`   Path: users/${uid}/receipts/${receiptId}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    console.error('   Make sure Firestore rules allow writes for this user.');
    process.exit(1);
  });
