import { z } from 'zod';

/**
 * Receipt Item schema
 *
 * A single line item within a receipt, stored at
 * users/{uid}/receipts/{receiptId}/items/{itemId}.
 *
 * canonicalItemId and categoryId start as null after OCR and are filled
 * in by the categorisation pipeline (Phase 5).
 */
export const ReceiptItemSchema = z.object({
  itemId: z.string().min(1),
  canonicalItemId: z.string().nullable().default(null),
  rawName: z.string().min(1),
  qty: z.number().positive().default(1),
  unit: z.string().nullable().default(null),
  pricePence: z.number().int().nonnegative(),
  categoryId: z.string().nullable().default(null),
  co2Kg: z.number().nonnegative().nullable().default(null),
  position: z.number().int().nonnegative(),
});

export type ReceiptItem = z.infer<typeof ReceiptItemSchema>;
