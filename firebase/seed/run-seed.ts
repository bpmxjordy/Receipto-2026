/**
 * Seed runner — populates Firestore with categories and canonical items.
 *
 * Usage:
 *   # Against emulators (default):
 *   npx tsx firebase/seed/run-seed.ts
 *
 *   # Against cloud (production/staging):
 *   FIRESTORE_EMULATOR_HOST= npx tsx firebase/seed/run-seed.ts
 *
 * The script is idempotent — it uses set() which overwrites existing docs.
 * Safe to re-run after updating seed data.
 */

import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { CATEGORIES } from './categories';
import { CANONICAL_ITEMS } from './canonical-items';

// When FIRESTORE_EMULATOR_HOST is set (default for local dev),
// firebase-admin connects to the emulator automatically.
// No service account needed for emulator usage.
const isEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;

if (isEmulator) {
  console.log(`🔧 Using Firestore emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
  initializeApp({ projectId: 'receipto-2026' });
} else {
  // For cloud usage, you need a service account key.
  // Place it at firebase/service-account.json (git-ignored).
  console.log('☁️  Connecting to cloud Firestore...');
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const serviceAccount = require('../service-account.json') as ServiceAccount;
    initializeApp({ credential: cert(serviceAccount) });
  } catch {
    // If no service account, try application default credentials
    initializeApp();
  }
}

const db = getFirestore();

async function seedCategories() {
  console.log(`\n📂 Seeding ${CATEGORIES.length} categories...`);
  const batch = db.batch();

  for (const cat of CATEGORIES) {
    const ref = db.collection('categories').doc(cat.categoryId);
    batch.set(ref, {
      categoryId: cat.categoryId,
      parentId: cat.parentId,
      displayName: cat.displayName,
      colorHex: cat.colorHex,
      sortOrder: cat.sortOrder,
    });
  }

  await batch.commit();
  console.log(`   ✅ ${CATEGORIES.length} categories written.`);
}

async function seedCanonicalItems() {
  console.log(`\n🏷️  Seeding ${CANONICAL_ITEMS.length} canonical items...`);

  // Firestore batches are limited to 500 writes
  const batchSize = 450;
  for (let i = 0; i < CANONICAL_ITEMS.length; i += batchSize) {
    const chunk = CANONICAL_ITEMS.slice(i, i + batchSize);
    const batch = db.batch();

    for (const ci of chunk) {
      const ref = db.collection('canonicalItems').doc(ci.normalisedName);
      batch.set(ref, {
        normalisedName: ci.normalisedName,
        displayName: ci.displayName,
        categoryId: ci.categoryId,
        co2KgPerKg: ci.co2KgPerKg,
        co2KgPerUnit: ci.co2KgPerUnit,
        source: ci.source,
        approved: ci.approved,
        firstSeenAt: ci.firstSeenAt,
      });
    }

    await batch.commit();
    console.log(`   ✅ Batch ${Math.floor(i / batchSize) + 1}: ${chunk.length} items written.`);
  }

  console.log(`   ✅ ${CANONICAL_ITEMS.length} total canonical items written.`);
}

async function main() {
  console.log('🌱 Receipto seed runner\n');
  console.log(`   Mode: ${isEmulator ? 'EMULATOR' : 'CLOUD'}`);

  try {
    await seedCategories();
    await seedCanonicalItems();
    console.log('\n🎉 Seeding complete!\n');
  } catch (err) {
    console.error('\n❌ Seeding failed:', err);
    process.exit(1);
  }
}

main();
