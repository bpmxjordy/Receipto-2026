/**
 * @receipto/shared
 *
 * Shared types, schemas, and utilities used across the Receipto
 * mobile app, web app, and cloud functions.
 */

// ── Types ──
export { CategorySchema, type Category } from './types/category';
export {
  CanonicalItemSchema,
  CanonicalItemSourceSchema,
  CanonicalItemAliasSchema,
  type CanonicalItem,
  type CanonicalItemSource,
  type CanonicalItemAlias,
} from './types/canonical-item';
export {
  ReceiptSchema,
  ReceiptSourceSchema,
  MonthlyAggregateSchema,
  type Receipt,
  type ReceiptSource,
  type MonthlyAggregate,
} from './types/receipt';
export { ReceiptItemSchema, type ReceiptItem } from './types/receipt-item';

// ── Utilities ──
export { normalise } from './normalise';
