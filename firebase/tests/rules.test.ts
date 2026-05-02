/**
 * Firestore security rules unit tests.
 *
 * These tests verify that:
 *   - Anonymous users cannot read anything
 *   - User A cannot read User B's data
 *   - Any authenticated user can read categories and canonical items
 *   - No client can write categories, canonicalItems, or canonicalItemAliases
 *   - Users can only write receipts under their own uid
 *   - Monthly aggregates are read-only for users
 *
 * Usage:
 *   1. Start emulators: firebase emulators:start
 *   2. Run tests:       npx tsx firebase/tests/rules.test.ts
 *
 * Note: This is a simple assertion-based test runner (no Jest/Vitest
 * dependency). For a real CI pipeline, wrap in your preferred framework.
 */

import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';

const PROJECT_ID = 'receipto-2026';
const RULES_PATH = resolve(__dirname, '../firestore.rules');

let testEnv: RulesTestEnvironment;

// ── Helpers ──

async function setup() {
  const rules = readFileSync(RULES_PATH, 'utf8');
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules,
      host: '127.0.0.1',
      port: 8180,
    },
  });
}

async function teardown() {
  await testEnv.cleanup();
}

function getFirestore(uid: string | null) {
  if (uid === null) {
    return testEnv.unauthenticatedContext().firestore();
  }
  return testEnv.authenticatedContext(uid).firestore();
}

// ── Test runner ──

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try {
    await testEnv.clearFirestore();
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${(err as Error).message}`);
    failed++;
  }
}

// ── Tests ──

async function runTests() {
  console.log('\n🔒 Firestore Security Rules Tests\n');

  // === User profile access ===
  console.log('  📁 User profiles');

  await test('Anonymous cannot read user profile', async () => {
    const db = getFirestore(null);
    await assertFails(getDoc(doc(db, 'users/user-a')));
  });

  await test('User A can read own profile', async () => {
    const db = getFirestore('user-a');
    // Reading a non-existent doc should succeed (permission-wise)
    await assertSucceeds(getDoc(doc(db, 'users/user-a')));
  });

  await test('User A cannot read User B profile', async () => {
    const db = getFirestore('user-a');
    await assertFails(getDoc(doc(db, 'users/user-b')));
  });

  await test('User A can write own profile', async () => {
    const db = getFirestore('user-a');
    await assertSucceeds(
      setDoc(doc(db, 'users/user-a'), { displayName: 'Alice', createdAt: new Date() })
    );
  });

  await test('User A cannot write User B profile', async () => {
    const db = getFirestore('user-a');
    await assertFails(
      setDoc(doc(db, 'users/user-b'), { displayName: 'Hacked' })
    );
  });

  // === Receipts ===
  console.log('\n  🧾 Receipts');

  await test('User can write own receipts', async () => {
    const db = getFirestore('user-a');
    await assertSucceeds(
      setDoc(doc(db, 'users/user-a/receipts/r1'), {
        retailerName: 'Tesco',
        totalPence: 1500,
        purchasedAt: new Date(),
        source: 'manual_photo',
        createdAt: new Date(),
      })
    );
  });

  await test('User can read own receipts', async () => {
    const db = getFirestore('user-a');
    await assertSucceeds(getDocs(collection(db, 'users/user-a/receipts')));
  });

  await test('User cannot read another user receipts', async () => {
    const db = getFirestore('user-a');
    await assertFails(getDocs(collection(db, 'users/user-b/receipts')));
  });

  await test('User can write own receipt items', async () => {
    const db = getFirestore('user-a');
    await assertSucceeds(
      setDoc(doc(db, 'users/user-a/receipts/r1/items/i1'), {
        rawName: 'MILK 2L',
        pricePence: 150,
        qty: 1,
        position: 0,
      })
    );
  });

  await test('User cannot write another user receipt items', async () => {
    const db = getFirestore('user-a');
    await assertFails(
      setDoc(doc(db, 'users/user-b/receipts/r1/items/i1'), {
        rawName: 'HACKED',
        pricePence: 0,
        qty: 1,
        position: 0,
      })
    );
  });

  // === Monthly aggregates ===
  console.log('\n  📊 Monthly aggregates');

  await test('User can read own monthly aggregates', async () => {
    const db = getFirestore('user-a');
    await assertSucceeds(getDoc(doc(db, 'users/user-a/monthly/2026-05')));
  });

  await test('User cannot write monthly aggregates', async () => {
    const db = getFirestore('user-a');
    await assertFails(
      setDoc(doc(db, 'users/user-a/monthly/2026-05'), {
        totalSpendPence: 9999,
        totalCo2Kg: 50,
        receiptCount: 10,
      })
    );
  });

  await test('User cannot read another user monthly aggregates', async () => {
    const db = getFirestore('user-a');
    await assertFails(getDoc(doc(db, 'users/user-b/monthly/2026-05')));
  });

  // === Categories ===
  console.log('\n  📂 Categories');

  await test('Authenticated user can read categories', async () => {
    const db = getFirestore('user-a');
    await assertSucceeds(getDoc(doc(db, 'categories/groceries')));
  });

  await test('Anonymous cannot read categories', async () => {
    const db = getFirestore(null);
    await assertFails(getDoc(doc(db, 'categories/groceries')));
  });

  await test('No user can write categories', async () => {
    const db = getFirestore('user-a');
    await assertFails(
      setDoc(doc(db, 'categories/hacked'), {
        displayName: 'Hacked',
        colorHex: '#FF0000',
        sortOrder: 999,
      })
    );
  });

  // === Canonical Items ===
  console.log('\n  🏷️  Canonical Items');

  await test('Authenticated user can read canonical items', async () => {
    const db = getFirestore('user-a');
    await assertSucceeds(getDoc(doc(db, 'canonicalItems/banana')));
  });

  await test('Anonymous cannot read canonical items', async () => {
    const db = getFirestore(null);
    await assertFails(getDoc(doc(db, 'canonicalItems/banana')));
  });

  await test('No user can write canonical items', async () => {
    const db = getFirestore('user-a');
    await assertFails(
      setDoc(doc(db, 'canonicalItems/hacked'), {
        normalisedName: 'hacked',
        displayName: 'Hacked',
        categoryId: 'other',
      })
    );
  });

  await test('No user can delete canonical items', async () => {
    const db = getFirestore('user-a');
    await assertFails(deleteDoc(doc(db, 'canonicalItems/banana')));
  });

  // === Canonical Item Aliases ===
  console.log('\n  🔗 Canonical Item Aliases');

  await test('Authenticated user can read aliases', async () => {
    const db = getFirestore('user-a');
    await assertSucceeds(getDoc(doc(db, 'canonicalItemAliases/bananas')));
  });

  await test('No user can write aliases', async () => {
    const db = getFirestore('user-a');
    await assertFails(
      setDoc(doc(db, 'canonicalItemAliases/hacked'), {
        canonicalItemId: 'banana',
      })
    );
  });

  // === Summary ===
  console.log(`\n${'─'.repeat(40)}`);
  console.log(`  Total: ${passed + failed}  ✅ ${passed}  ❌ ${failed}`);
  console.log(`${'─'.repeat(40)}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

// ── Main ──
async function main() {
  try {
    await setup();
    await runTests();
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  } finally {
    await teardown();
  }
}

main();
