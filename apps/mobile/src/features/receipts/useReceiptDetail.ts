/**
 * useReceiptDetail — fetch a single receipt + its items subcollection.
 */

import { useQuery } from '@tanstack/react-query';
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore';

import { db } from '@/src/lib/firebase';
import { useAuthStore } from '@/src/stores/authStore';

export interface ReceiptItem {
  id: string;
  rawName: string;
  qty: number;
  unit: string;
  pricePence: number;
  position: number;
  canonicalItemId: string | null;
  categoryId: string | null;
  co2Grams: number | null;
  status: string;
}

export interface ReceiptDetail {
  id: string;
  retailerName: string | null;
  purchasedAt: Date | null;
  totalPence: number | null;
  itemCount: number;
  imageUrl: string | null;
  rawText: string;
  status: string;
  createdAt: Date;
  items: ReceiptItem[];
}

async function fetchReceiptDetail(
  uid: string,
  receiptId: string,
): Promise<ReceiptDetail> {
  // Fetch receipt header
  const receiptDoc = await getDoc(
    doc(db, `users/${uid}/receipts/${receiptId}`),
  );

  if (!receiptDoc.exists()) {
    throw new Error('Receipt not found');
  }

  const d = receiptDoc.data();

  // Fetch items subcollection
  const itemsQuery = query(
    collection(db, `users/${uid}/receipts/${receiptId}/items`),
    orderBy('position', 'asc'),
  );
  const itemsSnap = await getDocs(itemsQuery);

  const items: ReceiptItem[] = itemsSnap.docs.map((itemDoc) => {
    const i = itemDoc.data();
    return {
      id: itemDoc.id,
      rawName: i.rawName ?? '',
      qty: i.qty ?? 1,
      unit: i.unit ?? 'each',
      pricePence: i.pricePence ?? 0,
      position: i.position ?? 0,
      canonicalItemId: i.canonicalItemId ?? null,
      categoryId: i.categoryId ?? null,
      co2Grams: i.co2Grams ?? null,
      status: i.status ?? 'pending',
    };
  });

  return {
    id: receiptDoc.id,
    retailerName: d.retailerName ?? null,
    purchasedAt:
      d.purchasedAt instanceof Timestamp ? d.purchasedAt.toDate() : null,
    totalPence: d.totalPence ?? null,
    itemCount: d.itemCount ?? 0,
    imageUrl: d.imageUrl ?? null,
    rawText: d.rawText ?? '',
    status: d.status ?? 'unknown',
    createdAt:
      d.createdAt instanceof Timestamp ? d.createdAt.toDate() : new Date(),
    items,
  };
}

export function useReceiptDetail(receiptId: string | undefined) {
  const uid = useAuthStore((s) => s.user?.uid);

  return useQuery({
    queryKey: ['receipt', uid, receiptId],
    queryFn: () => fetchReceiptDetail(uid!, receiptId!),
    enabled: !!uid && !!receiptId,
  });
}
