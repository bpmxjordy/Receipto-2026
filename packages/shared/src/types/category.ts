import { z } from 'zod';

/**
 * Category schema
 *
 * Represents a spending/item category.
 * Uses a hierarchical ID system, e.g. 'groceries.dairy'.
 * categoryId is also the Firestore document ID.
 */
export const CategorySchema = z.object({
  categoryId: z.string().min(1),
  parentId: z.string().nullable().default(null),
  displayName: z.string().min(1),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  sortOrder: z.number().int().nonnegative(),
});

export type Category = z.infer<typeof CategorySchema>;
