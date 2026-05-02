/**
 * Seed data: Canonical Items
 *
 * ~100 common UK supermarket items with categories and CO₂ estimates.
 * CO₂ values are approximate, derived from DEFRA / Poore & Nemecek 2018
 * / Mike Berners-Lee "How Bad Are Bananas?" data.
 *
 * Document ID in Firestore == normalisedName (for instant lookup).
 * All items marked source='seeded', approved=true.
 *
 * Run via: npx tsx firebase/seed/seed-canonical-items.ts
 */

import type { CanonicalItem } from '../../packages/shared/src/types/canonical-item';

const now = new Date();

/** Helper to create a seeded canonical item */
function item(
  normalisedName: string,
  displayName: string,
  categoryId: string,
  co2KgPerKg: number | null,
  co2KgPerUnit: number | null = null,
): CanonicalItem {
  return {
    normalisedName,
    displayName,
    categoryId,
    co2KgPerKg,
    co2KgPerUnit,
    source: 'seeded',
    approved: true,
    firstSeenAt: now,
  };
}

export const CANONICAL_ITEMS: CanonicalItem[] = [
  // ═══════════════════════════════════════════════════════════════
  // DAIRY
  // ═══════════════════════════════════════════════════════════════
  item('whole milk',            'Whole Milk',              'groceries.dairy',  1.39,   null),
  item('semi skimmed milk',     'Semi-Skimmed Milk',       'groceries.dairy',  1.39,   null),
  item('skimmed milk',          'Skimmed Milk',            'groceries.dairy',  1.39,   null),
  item('cheddar cheese',        'Cheddar Cheese',          'groceries.dairy',  13.5,   null),
  item('butter',                'Butter',                  'groceries.dairy',  11.9,   null),
  item('double cream',          'Double Cream',            'groceries.dairy',  5.4,    null),
  item('greek yoghurt',         'Greek Yoghurt',           'groceries.dairy',  3.5,    null),
  item('natural yoghurt',       'Natural Yoghurt',         'groceries.dairy',  3.2,    null),
  item('eggs',                  'Eggs',                    'groceries.dairy',  4.67,   0.27),
  item('mozzarella',            'Mozzarella',              'groceries.dairy',  10.0,   null),

  // ═══════════════════════════════════════════════════════════════
  // MEAT
  // ═══════════════════════════════════════════════════════════════
  item('beef mince',            'Beef Mince',              'groceries.meat',   27.0,   null),
  item('chicken breast',        'Chicken Breast',          'groceries.meat',   6.9,    null),
  item('chicken thighs',        'Chicken Thighs',          'groceries.meat',   6.9,    null),
  item('whole chicken',         'Whole Chicken',           'groceries.meat',   6.9,    null),
  item('pork sausages',         'Pork Sausages',           'groceries.meat',   7.6,    null),
  item('bacon',                 'Bacon',                   'groceries.meat',   7.6,    null),
  item('lamb mince',            'Lamb Mince',              'groceries.meat',   24.0,   null),
  item('pork chops',            'Pork Chops',              'groceries.meat',   7.6,    null),
  item('steak',                 'Steak',                   'groceries.meat',   27.0,   null),
  item('ham',                   'Ham',                     'groceries.meat',   7.6,    null),

  // ═══════════════════════════════════════════════════════════════
  // FISH & SEAFOOD
  // ═══════════════════════════════════════════════════════════════
  item('salmon fillet',         'Salmon Fillet',           'groceries.fish',   11.9,   null),
  item('cod fillet',            'Cod Fillet',              'groceries.fish',   5.4,    null),
  item('tuna',                  'Tuna',                    'groceries.fish',   6.1,    null),
  item('prawns',                'Prawns',                  'groceries.fish',   12.0,   null),
  item('fish fingers',          'Fish Fingers',            'groceries.fish',   5.4,    null),

  // ═══════════════════════════════════════════════════════════════
  // FRUIT & VEG
  // ═══════════════════════════════════════════════════════════════
  item('bananas',               'Bananas',                 'groceries.produce', 0.86,  null),
  item('apples',                'Apples',                  'groceries.produce', 0.43,  null),
  item('oranges',               'Oranges',                 'groceries.produce', 0.47,  null),
  item('strawberries',          'Strawberries',            'groceries.produce', 1.1,   null),
  item('blueberries',           'Blueberries',             'groceries.produce', 1.1,   null),
  item('grapes',                'Grapes',                  'groceries.produce', 0.69,  null),
  item('tomatoes',              'Tomatoes',                'groceries.produce', 1.4,   null),
  item('potatoes',              'Potatoes',                'groceries.produce', 0.46,  null),
  item('onions',                'Onions',                  'groceries.produce', 0.39,  null),
  item('carrots',               'Carrots',                 'groceries.produce', 0.43,  null),
  item('broccoli',              'Broccoli',                'groceries.produce', 0.89,  null),
  item('peppers',               'Peppers',                 'groceries.produce', 1.0,   null),
  item('cucumber',              'Cucumber',                'groceries.produce', 0.7,   null),
  item('lettuce',               'Lettuce',                 'groceries.produce', 0.7,   null),
  item('mushrooms',             'Mushrooms',               'groceries.produce', 0.8,   null),
  item('avocado',               'Avocado',                 'groceries.produce', 2.5,   null),
  item('courgette',             'Courgette',               'groceries.produce', 0.7,   null),
  item('sweetcorn',             'Sweetcorn',               'groceries.produce', 0.7,   null),
  item('lemons',                'Lemons',                  'groceries.produce', 0.47,  null),
  item('garlic',                'Garlic',                  'groceries.produce', 0.51,  null),

  // ═══════════════════════════════════════════════════════════════
  // BAKERY
  // ═══════════════════════════════════════════════════════════════
  item('white bread',           'White Bread',             'groceries.bakery', 1.0,    null),
  item('wholemeal bread',       'Wholemeal Bread',         'groceries.bakery', 1.0,    null),
  item('bread rolls',           'Bread Rolls',             'groceries.bakery', 1.0,    null),
  item('croissants',            'Croissants',              'groceries.bakery', 1.8,    null),
  item('wraps',                 'Wraps',                   'groceries.bakery', 1.0,    null),

  // ═══════════════════════════════════════════════════════════════
  // BEVERAGES
  // ═══════════════════════════════════════════════════════════════
  item('orange juice',          'Orange Juice',            'groceries.beverages', 0.73, null),
  item('apple juice',           'Apple Juice',             'groceries.beverages', 0.73, null),
  item('coca cola',             'Coca-Cola',               'groceries.beverages', 0.41, null),
  item('tea bags',              'Tea Bags',                'groceries.beverages', 1.9,  null),
  item('instant coffee',        'Instant Coffee',          'groceries.beverages', 16.5, null),
  item('ground coffee',         'Ground Coffee',           'groceries.beverages', 16.5, null),
  item('oat milk',              'Oat Milk',                'groceries.beverages', 0.9,  null),
  item('sparkling water',       'Sparkling Water',         'groceries.beverages', 0.2,  null),

  // ═══════════════════════════════════════════════════════════════
  // DRY GOODS
  // ═══════════════════════════════════════════════════════════════
  item('pasta',                 'Pasta',                   'groceries.dry-goods', 1.3,  null),
  item('rice',                  'Rice',                    'groceries.dry-goods', 4.45, null),
  item('baked beans',           'Baked Beans',             'groceries.dry-goods', 1.1,  null),
  item('chopped tomatoes',      'Chopped Tomatoes',        'groceries.dry-goods', 1.0,  null),
  item('cereal',                'Cereal',                  'groceries.dry-goods', 1.2,  null),
  item('flour',                 'Flour',                   'groceries.dry-goods', 0.7,  null),
  item('sugar',                 'Sugar',                   'groceries.dry-goods', 1.2,  null),
  item('olive oil',             'Olive Oil',               'groceries.dry-goods', 5.4,  null),
  item('vegetable oil',         'Vegetable Oil',           'groceries.dry-goods', 3.2,  null),
  item('peanut butter',         'Peanut Butter',           'groceries.dry-goods', 2.5,  null),

  // ═══════════════════════════════════════════════════════════════
  // FROZEN
  // ═══════════════════════════════════════════════════════════════
  item('frozen peas',           'Frozen Peas',             'groceries.frozen', 0.8,  null),
  item('frozen chips',          'Frozen Chips',            'groceries.frozen', 0.9,  null),
  item('ice cream',             'Ice Cream',               'groceries.frozen', 2.5,  null),
  item('frozen pizza',          'Frozen Pizza',            'groceries.frozen', 2.8,  null),

  // ═══════════════════════════════════════════════════════════════
  // CONFECTIONERY
  // ═══════════════════════════════════════════════════════════════
  item('chocolate bar',         'Chocolate Bar',           'groceries.confectionery', 4.5, null),
  item('biscuits',              'Biscuits',                'groceries.confectionery', 2.0, null),
  item('crisps',                'Crisps',                  'groceries.snacks',        2.5, null),

  // ═══════════════════════════════════════════════════════════════
  // CONDIMENTS & SAUCES
  // ═══════════════════════════════════════════════════════════════
  item('ketchup',               'Ketchup',                 'groceries.condiments', 1.5, null),
  item('mayonnaise',            'Mayonnaise',              'groceries.condiments', 3.0, null),
  item('soy sauce',             'Soy Sauce',               'groceries.condiments', 1.0, null),
  item('salt',                  'Salt',                    'groceries.condiments', 0.2, null),
  item('pepper',                'Pepper',                  'groceries.condiments', 0.8, null),

  // ═══════════════════════════════════════════════════════════════
  // ALCOHOL
  // ═══════════════════════════════════════════════════════════════
  item('lager',                 'Lager',                   'groceries.alcohol', 0.9,  null),
  item('red wine',              'Red Wine',                'groceries.alcohol', 1.5,  null),
  item('white wine',            'White Wine',              'groceries.alcohol', 1.5,  null),

  // ═══════════════════════════════════════════════════════════════
  // READY MEALS
  // ═══════════════════════════════════════════════════════════════
  item('ready meal',            'Ready Meal',              'groceries.ready-meals', 4.5, null),
  item('sandwich',              'Sandwich',                'groceries.ready-meals', 1.5, null),
  item('soup',                  'Soup',                    'groceries.ready-meals', 1.0, null),

  // ═══════════════════════════════════════════════════════════════
  // HOUSEHOLD
  // ═══════════════════════════════════════════════════════════════
  item('washing up liquid',     'Washing Up Liquid',       'household.cleaning', 1.5,  null),
  item('bleach',                'Bleach',                  'household.cleaning', 1.0,  null),
  item('kitchen roll',          'Kitchen Roll',            'household.paper',    3.0,  null),
  item('toilet roll',           'Toilet Roll',             'household.paper',    1.8,  null),
  item('bin bags',              'Bin Bags',                'household.cleaning', 2.5,  null),
  item('washing powder',        'Washing Powder',          'household.laundry',  1.5,  null),
  item('fabric conditioner',    'Fabric Conditioner',      'household.laundry',  1.2,  null),
  item('dishwasher tablets',    'Dishwasher Tablets',      'household.cleaning', 1.8,  null),

  // ═══════════════════════════════════════════════════════════════
  // HEALTH & BEAUTY
  // ═══════════════════════════════════════════════════════════════
  item('toothpaste',            'Toothpaste',              'health.toiletries', 1.0,  null),
  item('shampoo',               'Shampoo',                 'health.toiletries', 1.2,  null),
  item('deodorant',             'Deodorant',               'health.toiletries', 1.0,  null),
  item('paracetamol',           'Paracetamol',             'health.pharmacy',   0.5,  null),
  item('ibuprofen',             'Ibuprofen',               'health.pharmacy',   0.5,  null),

  // ═══════════════════════════════════════════════════════════════
  // PET FOOD
  // ═══════════════════════════════════════════════════════════════
  item('cat food',              'Cat Food',                'groceries.pet', 3.5, null),
  item('dog food',              'Dog Food',                'groceries.pet', 3.5, null),
];
