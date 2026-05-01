import { z } from 'zod';

/**
 * Canonical Item schema
 *
 * Represents a globally-known item in the system. Once an item is
 * categorised, it lives here forever — every future occurrence of the
 * same normalised name resolves to this document.
 *
 * Document ID in Firestore == normalisedName (for instant lookup).
 */
export const CanonicalItemSourceSchema = z.enum(['seeded', 'llm', 'human']);
export type CanonicalItemSource = z.infer<typeof CanonicalItemSourceSchema>;

export const CanonicalItemSchema = z.object({
  normalisedName: z.string().min(1),
  displayName: z.string().min(1),
  categoryId: z.string().min(1),
  co2KgPerKg: z.number().nonnegative().nullable().default(null),
  co2KgPerUnit: z.number().nonnegative().nullable().default(null),
  source: CanonicalItemSourceSchema,
  approved: z.boolean().default(false),
  firstSeenAt: z.coerce.date(),
});

export type CanonicalItem = z.infer<typeof CanonicalItemSchema>;

/**
 * Canonical Item Alias schema
 *
 * Maps an alternative normalised name to a canonical item.
 * Document ID in Firestore == aliasNormalised.
 */
export const CanonicalItemAliasSchema = z.object({
  aliasNormalised: z.string().min(1),
  canonicalItemId: z.string().min(1),
});

export type CanonicalItemAlias = z.infer<typeof CanonicalItemAliasSchema>;
