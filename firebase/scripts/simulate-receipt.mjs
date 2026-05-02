#!/usr/bin/env node

/**
 * simulate-receipt — inject a fake receipt into Firestore for testing.
 *
 * Usage:
 *   node firebase/scripts/simulate-receipt.mjs <uid>
 *
 * Generates a random Tesco receipt with 5-10 items and writes it to
 * /users/{uid}/receipts/{id} + subcollection items.
 *
 * Requires: firebase-admin (install once with `npm i -g firebase-admin`
 * or add to a local package.json). Uses Application Default Credentials
 * — run `gcloud auth application-default login` or set
 * GOOGLE_APPLICATION_CREDENTIALS to a service account key.
 *
 * Alternatively, set FIRESTORE_EMULATOR_HOST=localhost:8080 to write
 * to the local emulator.
 */

import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';

// ── Config ──

const uid = process.argv[2];
if (!uid) {
  console.error('Usage: node simulate-receipt.mjs <firebase-uid>');
  console.error('  Find your uid in Firebase Console → Authentication → Users');
  process.exit(1);
}

// Initialise Firebase Admin
initializeApp({ credential: applicationDefault() });
const db = getFirestore();

// ── Sample data ──

const RETAILERS = ['Tesco', "Sainsbury's", 'Aldi', 'Lidl', 'Morrisons', 'Asda'];

const SAMPLE_ITEMS = [
  { name: 'Semi Skimmed Milk 2L', pricePence: 135, unit: 'each' },
  { name: 'Hovis Wholemeal 800g', pricePence: 135, unit: 'each' },
  { name: 'Free Range Eggs 6pk', pricePence: 198, unit: 'each' },
  { name: 'Bananas Loose', pricePence: 79, unit: 'kg' },
  { name: 'Chicken Breast 500g', pricePence: 399, unit: 'each' },
  { name: 'Basmati Rice 1kg', pricePence: 189, unit: 'each' },
  { name: 'Heinz Baked Beans 415g', pricePence: 110, unit: 'each' },
  { name: 'Cathedral City Cheddar 350g', pricePence: 350, unit: 'each' },
  { name: 'Coca Cola 2L', pricePence: 219, unit: 'each' },
  { name: 'Warburtons Crumpets 6pk', pricePence: 100, unit: 'each' },
  { name: 'Lurpak Butter 250g', pricePence: 299, unit: 'each' },
  { name: 'PG Tips 80 Bags', pricePence: 289, unit: 'each' },
  { name: 'Nescafe Gold Blend 200g', pricePence: 599, unit: 'each' },
  { name: 'Fairy Liquid 433ml', pricePence: 149, unit: 'each' },
  { name: 'Andrex Toilet Roll 9pk', pricePence: 499, unit: 'each' },
  { name: 'Walkers Ready Salted 6pk', pricePence: 189, unit: 'each' },
  { name: 'Broccoli 350g', pricePence: 85, unit: 'each' },
  { name: 'Carrots 1kg', pricePence: 65, unit: 'each' },
  { name: 'Onions 1kg', pricePence: 89, unit: 'each' },
  { name: 'Pasta Penne 500g', pricePence: 95, unit: 'each' },
  { name: 'Dolmio Bolognese 500g', pricePence: 179, unit: 'each' },
  { name: 'Muller Corner Yoghurt', pricePence: 75, unit: 'each' },
  { name: 'Richmond Pork Sausages 8pk', pricePence: 249, unit: 'each' },
  { name: 'Kingsmill 50/50 800g', pricePence: 130, unit: 'each' },
];

// ── Generate receipt ──

function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function randomDate() {
  const now = Date.now();
  const daysAgo = Math.floor(Math.random() * 30);
  const d = new Date(now - daysAgo * 86400000);
  d.setHours(10 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));
  return d;
}

async function main() {
  const retailer = RETAILERS[Math.floor(Math.random() * RETAILERS.length)];
  const itemCount = 5 + Math.floor(Math.random() * 6); // 5-10 items
  const selectedItems = pickRandom(SAMPLE_ITEMS, itemCount);
  const purchasedAt = randomDate();

  // Calculate total
  const totalPence = selectedItems.reduce((sum, i) => sum + i.pricePence, 0);

  // Build raw text (simulates OCR output)
  const rawLines = [
    retailer.toUpperCase(),
    `STORE 1234`,
    purchasedAt.toLocaleDateString('en-GB') + ' ' +
      purchasedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    '',
    ...selectedItems.map(
      (i) => `${i.name.toUpperCase().padEnd(30)} £${(i.pricePence / 100).toFixed(2)}`,
    ),
    '',
    `TOTAL   £${(totalPence / 100).toFixed(2)}`,
    '',
    'VISA CONTACTLESS',
    'THANK YOU FOR SHOPPING',
  ];

  // Write receipt doc
  const receiptRef = db.collection(`users/${uid}/receipts`).doc();
  const receiptId = receiptRef.id;

  await receiptRef.set({
    retailerName: retailer,
    purchasedAt: Timestamp.fromDate(purchasedAt),
    totalPence,
    itemCount: selectedItems.length,
    imageUrl: null,
    rawText: rawLines.join('\n'),
    status: 'pending_categorisation',
    source: 'simulated',
    createdAt: FieldValue.serverTimestamp(),
  });

  // Write items
  const batch = db.batch();
  selectedItems.forEach((item, i) => {
    const itemRef = db.collection(`users/${uid}/receipts/${receiptId}/items`).doc();
    batch.set(itemRef, {
      rawName: item.name,
      qty: 1,
      unit: item.unit,
      pricePence: item.pricePence,
      position: i,
      canonicalItemId: null,
      categoryId: null,
      co2Grams: null,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();

  console.log(`✅ Created simulated receipt: ${receiptId}`);
  console.log(`   Retailer: ${retailer}`);
  console.log(`   Date: ${purchasedAt.toLocaleDateString('en-GB')}`);
  console.log(`   Items: ${selectedItems.length}`);
  console.log(`   Total: £${(totalPence / 100).toFixed(2)}`);
  console.log(`   Path: users/${uid}/receipts/${receiptId}`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
