/**
 * saveReceipt — persist a parsed receipt + its items to Firestore.
 *
 * Writes:
 *   1. /users/{uid}/receipts/{receiptId}   — receipt header
 *   2. /users/{uid}/receipts/{rid}/items/{itemId} — one doc per line item
 *   3. Uploads receipt image to Storage   → receipts/{uid}/{receiptId}.jpg
 *
 * All writes happen inside a batch so they succeed or fail atomically.
 */

import {
  collection,
  doc,
  writeBatch,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

import { db, storage } from '@/src/lib/firebase';
import type { ParsedReceipt, ParsedItem } from './parseReceipt';

// ── Public types ──

export interface SaveReceiptInput {
  /** The currently signed-in user's UID */
  uid: string;
  /** Parsed receipt data (may have been edited on the review screen) */
  receipt: ParsedReceipt;
  /** Items the user confirmed (can be a subset of parsed items) */
  items: ParsedItem[];
  /** Local file URI to the receipt image (file://) */
  imageUri: string;
}

export interface SaveReceiptResult {
  receiptId: string;
  imageUrl: string;
}

// ── Implementation ──

export async function saveReceipt(
  input: SaveReceiptInput,
): Promise<SaveReceiptResult> {
  const { uid, receipt, items, imageUri } = input;

  // 1. Upload image to Firebase Storage
  const receiptRef = doc(collection(db, `users/${uid}/receipts`));
  const receiptId = receiptRef.id;

  const imageUrl = await uploadReceiptImage(uid, receiptId, imageUri);

  // 2. Batch-write receipt header + items
  const batch = writeBatch(db);

  batch.set(receiptRef, {
    retailerName: receipt.retailerName,
    purchasedAt: receipt.purchasedAt
      ? Timestamp.fromDate(receipt.purchasedAt)
      : null,
    totalPence: receipt.totalPence,
    itemCount: items.length,
    imageUrl,
    rawText: receipt.rawText,
    status: 'pending_categorisation', // items not yet categorised
    createdAt: serverTimestamp(),
  });

  const itemsColl = collection(
    db,
    `users/${uid}/receipts/${receiptId}/items`,
  );

  for (const item of items) {
    const itemRef = doc(itemsColl);
    batch.set(itemRef, {
      rawName: item.rawName,
      qty: item.qty,
      unit: item.unit,
      pricePence: item.pricePence,
      position: item.position,
      // Categorisation fields — filled in later by Gemma / cloud function
      canonicalItemId: null,
      categoryId: null,
      co2Grams: null,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
  }

  await batch.commit();

  return { receiptId, imageUrl };
}

// ── Helpers ──

async function uploadReceiptImage(
  uid: string,
  receiptId: string,
  imageUri: string,
): Promise<string> {
  const response = await fetch(imageUri);
  const blob = await response.blob();

  const storageRef = ref(storage, `users/${uid}/receipts/${receiptId}.jpg`);
  await uploadBytes(storageRef, blob);

  return getDownloadURL(storageRef);
}
