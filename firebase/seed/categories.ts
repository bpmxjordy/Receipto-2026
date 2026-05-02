/**
 * Seed data: Categories
 *
 * ~30 categories with a hierarchical ID system (e.g. 'groceries.dairy').
 * Top-level categories have parentId = null.
 * Colours chosen to match the Receipto design system and be visually
 * distinct in pie charts.
 *
 * Run via: npx tsx firebase/seed/seed-categories.ts
 */

import type { Category } from '../../packages/shared/src/types/category';

export const CATEGORIES: Category[] = [
  // ── Top-level ──
  { categoryId: 'groceries',     parentId: null, displayName: 'Groceries',      colorHex: '#7FB582', sortOrder: 0 },
  { categoryId: 'household',     parentId: null, displayName: 'Household',      colorHex: '#6BA3D6', sortOrder: 1 },
  { categoryId: 'electronics',   parentId: null, displayName: 'Electronics',    colorHex: '#9B7ED8', sortOrder: 2 },
  { categoryId: 'subscriptions', parentId: null, displayName: 'Subscriptions',  colorHex: '#E88B8B', sortOrder: 3 },
  { categoryId: 'eating-out',    parentId: null, displayName: 'Eating Out',     colorHex: '#E8C76B', sortOrder: 4 },
  { categoryId: 'transport',     parentId: null, displayName: 'Transport',      colorHex: '#6BCFCF', sortOrder: 5 },
  { categoryId: 'health',        parentId: null, displayName: 'Health & Beauty', colorHex: '#D87ED8', sortOrder: 6 },
  { categoryId: 'clothing',      parentId: null, displayName: 'Clothing',       colorHex: '#CF8B6B', sortOrder: 7 },
  { categoryId: 'other',         parentId: null, displayName: 'Other',          colorHex: '#9CA3AF', sortOrder: 8 },

  // ── Groceries sub-categories ──
  { categoryId: 'groceries.dairy',         parentId: 'groceries', displayName: 'Dairy',          colorHex: '#A8D8EA', sortOrder: 0 },
  { categoryId: 'groceries.meat',          parentId: 'groceries', displayName: 'Meat',           colorHex: '#E88B8B', sortOrder: 1 },
  { categoryId: 'groceries.fish',          parentId: 'groceries', displayName: 'Fish & Seafood', colorHex: '#6BA3D6', sortOrder: 2 },
  { categoryId: 'groceries.produce',       parentId: 'groceries', displayName: 'Fruit & Veg',    colorHex: '#7FB582', sortOrder: 3 },
  { categoryId: 'groceries.bakery',        parentId: 'groceries', displayName: 'Bakery',         colorHex: '#E8C76B', sortOrder: 4 },
  { categoryId: 'groceries.beverages',     parentId: 'groceries', displayName: 'Beverages',      colorHex: '#6BCFCF', sortOrder: 5 },
  { categoryId: 'groceries.dry-goods',     parentId: 'groceries', displayName: 'Dry Goods',      colorHex: '#CF8B6B', sortOrder: 6 },
  { categoryId: 'groceries.frozen',        parentId: 'groceries', displayName: 'Frozen',         colorHex: '#A8C8EA', sortOrder: 7 },
  { categoryId: 'groceries.confectionery', parentId: 'groceries', displayName: 'Confectionery',  colorHex: '#D87ED8', sortOrder: 8 },
  { categoryId: 'groceries.condiments',    parentId: 'groceries', displayName: 'Condiments & Sauces', colorHex: '#E8A86B', sortOrder: 9 },
  { categoryId: 'groceries.alcohol',       parentId: 'groceries', displayName: 'Alcohol',        colorHex: '#9B7ED8', sortOrder: 10 },
  { categoryId: 'groceries.snacks',        parentId: 'groceries', displayName: 'Snacks',         colorHex: '#D8B87E', sortOrder: 11 },
  { categoryId: 'groceries.ready-meals',   parentId: 'groceries', displayName: 'Ready Meals',    colorHex: '#CF6B6B', sortOrder: 12 },
  { categoryId: 'groceries.baby',          parentId: 'groceries', displayName: 'Baby & Infant',  colorHex: '#B8E8B8', sortOrder: 13 },
  { categoryId: 'groceries.pet',           parentId: 'groceries', displayName: 'Pet Food',       colorHex: '#8B8BE8', sortOrder: 14 },

  // ── Household sub-categories ──
  { categoryId: 'household.cleaning',   parentId: 'household', displayName: 'Cleaning',         colorHex: '#A8D8EA', sortOrder: 0 },
  { categoryId: 'household.laundry',    parentId: 'household', displayName: 'Laundry',          colorHex: '#6BA3D6', sortOrder: 1 },
  { categoryId: 'household.paper',      parentId: 'household', displayName: 'Paper & Kitchen',  colorHex: '#E8C76B', sortOrder: 2 },
  { categoryId: 'household.garden',     parentId: 'household', displayName: 'Garden',           colorHex: '#7FB582', sortOrder: 3 },

  // ── Health sub-categories ──
  { categoryId: 'health.pharmacy',      parentId: 'health', displayName: 'Pharmacy',          colorHex: '#E88B8B', sortOrder: 0 },
  { categoryId: 'health.toiletries',    parentId: 'health', displayName: 'Toiletries',        colorHex: '#D87ED8', sortOrder: 1 },
];
