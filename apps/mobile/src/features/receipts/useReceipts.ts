/**
 * useReceipts — TanStack Query hook to fetch the user's receipts.
 *
 * Fetches from /users/{uid}/receipts, ordered by createdAt descending.
 */

import { useQuery } from '@tanstack/react-query';
import {
  collection,
  query,
  orderBy,
  getDocs,
  limit,
  Timestamp,
} from 'firebase/firestore';

import { db } from '@/src/lib/firebase';
import { useAuthStore } from '@/src/stores/authStore';

export interface ReceiptSummary {
  id: string;
  retailerName: string | null;
  purchasedAt: Date | null;
  totalPence: number | null;
  itemCount: number;
  imageUrl: string | null;
  status: string;
  createdAt: Date;
}

async function fetchReceipts(uid: string): Promise<ReceiptSummary[]> {
  const q = query(
    collection(db, `users/${uid}/receipts`),
    orderBy('createdAt', 'desc'),
    limit(50),
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      retailerName: d.retailerName ?? null,
      purchasedAt: d.purchasedAt instanceof Timestamp
        ? d.purchasedAt.toDate()
        : null,
      totalPence: d.totalPence ?? null,
      itemCount: d.itemCount ?? 0,
      imageUrl: d.imageUrl ?? null,
      status: d.status ?? 'unknown',
      createdAt: d.createdAt instanceof Timestamp
        ? d.createdAt.toDate()
        : new Date(),
    };
  });
}

export function useReceipts() {
  const uid = useAuthStore((s) => s.user?.uid);

  return useQuery({
    queryKey: ['receipts', uid],
    queryFn: () => fetchReceipts(uid!),
    enabled: !!uid,
  });
}
