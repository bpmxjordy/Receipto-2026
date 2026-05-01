import { z } from 'zod';

/**
 * Receipt source — how the receipt entered the system.
 */
export const ReceiptSourceSchema = z.enum([
  'manual_photo',
  'simulated',
  'nfc',
]);
export type ReceiptSource = z.infer<typeof ReceiptSourceSchema>;

/**
 * Receipt schema
 *
 * Top-level receipt document stored at users/{uid}/receipts/{receiptId}.
 * Line items are stored in a subcollection (see receipt-item.ts).
 */
export const ReceiptSchema = z.object({
  receiptId: z.string().min(1),
  retailerName: z.string().min(1),
  retailerLocation: z.string().nullable().default(null),
  purchasedAt: z.coerce.date(),
  totalPence: z.number().int().nonnegative(),
  currency: z.string().default('GBP'),
  source: ReceiptSourceSchema,
  rawImagePath: z.string().nullable().default(null),
  ocrRawText: z.string().nullable().default(null),
  totalCo2Kg: z.number().nonnegative().nullable().default(null),
  createdAt: z.coerce.date(),
});

export type Receipt = z.infer<typeof ReceiptSchema>;

/**
 * Monthly aggregate schema
 *
 * Pre-computed aggregates stored at users/{uid}/monthly/{YYYY-MM}.
 * Updated by the onReceiptCreate cloud function trigger.
 */
export const MonthlyAggregateSchema = z.object({
  spendByCategory: z.record(z.string(), z.number().int().nonnegative()),
  co2ByCategory: z.record(z.string(), z.number().nonnegative()),
  totalSpendPence: z.number().int().nonnegative(),
  totalCo2Kg: z.number().nonnegative(),
  receiptCount: z.number().int().nonnegative(),
});

export type MonthlyAggregate = z.infer<typeof MonthlyAggregateSchema>;
