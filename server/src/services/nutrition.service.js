import axios from 'axios';

// Curated mock dataset — always available as last-resort fallback
const MOCK_FOODS = [
  { name: 'Banana', brandName: 'Generic', calories: 89, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 1, carbs: 23, fat: 0, fiber: 3 } },
  { name: 'Chicken Breast (Grilled)', brandName: 'Generic', calories: 165, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 31, carbs: 0, fat: 4, fiber: 0 } },
  { name: 'Brown Rice (Cooked)', brandName: 'Generic', calories: 112, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 3, carbs: 24, fat: 1, fiber: 2 } },
  { name: 'White Rice (Cooked)', brandName: 'Generic', calories: 130, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 3, carbs: 28, fat: 0, fiber: 0 } },
  { name: 'Whole Egg', brandName: 'Generic', calories: 155, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 13, carbs: 1, fat: 11, fiber: 0 } },
  { name: 'Oatmeal (Cooked)', brandName: 'Generic', calories: 71, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 2, carbs: 12, fat: 1, fiber: 2 } },
  { name: 'Greek Yogurt (Plain)', brandName: 'Generic', calories: 100, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 9, carbs: 4, fat: 5, fiber: 0 } },
  { name: 'Salmon (Baked)', brandName: 'Generic', calories: 182, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 25, carbs: 0, fat: 9, fiber: 0 } },
  { name: 'Broccoli (Steamed)', brandName: 'Generic', calories: 35, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 2, carbs: 7, fat: 0, fiber: 3 } },
  { name: 'Sweet Potato (Baked)', brandName: 'Generic', calories: 86, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 2, carbs: 20, fat: 0, fiber: 3 } },
  { name: 'Avocado', brandName: 'Generic', calories: 160, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 2, carbs: 9, fat: 15, fiber: 7 } },
  { name: 'Almonds', brandName: 'Generic', calories: 579, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 21, carbs: 22, fat: 50, fiber: 13 } },
  { name: 'Apple', brandName: 'Generic', calories: 52, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 0, carbs: 14, fat: 0, fiber: 2 } },
  { name: 'Orange', brandName: 'Generic', calories: 47, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 1, carbs: 12, fat: 0, fiber: 2 } },
  { name: 'Milk (Whole)', brandName: 'Generic', calories: 61, servingSize: { amount: 100, unit: 'ml' }, macros: { protein: 3, carbs: 5, fat: 3, fiber: 0 } },
  { name: 'Cheddar Cheese', brandName: 'Generic', calories: 402, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 25, carbs: 1, fat: 33, fiber: 0 } },
  { name: 'Lentils (Boiled)', brandName: 'Generic', calories: 116, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 9, carbs: 20, fat: 0, fiber: 8 } },
  { name: 'Tuna (Canned in Water)', brandName: 'Generic', calories: 132, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 29, carbs: 0, fat: 1, fiber: 0 } },
  { name: 'Peanut Butter', brandName: 'Generic', calories: 588, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 25, carbs: 20, fat: 50, fiber: 6 } },
  { name: 'Strawberries', brandName: 'Generic', calories: 32, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 1, carbs: 8, fat: 0, fiber: 2 } },
  { name: 'Pasta (Cooked)', brandName: 'Generic', calories: 158, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 6, carbs: 31, fat: 1, fiber: 2 } },
  { name: 'Bread (Whole Wheat)', brandName: 'Generic', calories: 247, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 13, carbs: 41, fat: 4, fiber: 7 } },
  { name: 'Spinach (Raw)', brandName: 'Generic', calories: 23, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 3, carbs: 4, fat: 0, fiber: 2 } },
  { name: 'Beef (Ground, Lean)', brandName: 'Generic', calories: 215, servingSize: { amount: 100, unit: 'g' }, macros: { protein: 26, carbs: 0, fat: 12, fiber: 0 } },
];

const searchMockFoods = (query) => {
  const q = query.toLowerCase();
  return MOCK_FOODS.filter(f => f.name.toLowerCase().includes(q)).slice(0, 10);
};

/**
 * Search food database
 * Primary: OpenFoodFacts (free, no key)
 * Fallback: Built-in curated mock dataset
 */
export const searchFoods = async (query) => {
  // Try OpenFoodFacts first
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20&fields=product_name,brands,nutriments,serving_quantity,code,image_front_url`;
    const { data } = await axios.get(url, { timeout: 8000 });

    if (data?.products?.length > 0) {
      const mapped = data.products
        .filter(p => p.product_name && p.nutriments?.['energy-kcal_100g'])
        .map(p => ({
          externalId: p.code,
          name: p.product_name,
          brandName: p.brands || 'Generic',
          calories: Math.round(p.nutriments['energy-kcal_100g'] || 0),
          servingSize: {
            amount: p.serving_quantity || 100,
            unit: p.serving_quantity ? 'g/ml' : 'g (per 100g)',
          },
          macros: {
            protein: Math.round(p.nutriments.proteins_100g || 0),
            carbs: Math.round(p.nutriments.carbohydrates_100g || 0),
            fat: Math.round(p.nutriments.fat_100g || 0),
            fiber: Math.round(p.nutriments.fiber_100g || 0),
          },
          barcode: p.code,
          image: p.image_front_url,
        }));

      if (mapped.length > 0) return mapped;
    }
  } catch (err) {
    console.warn('[Nutrition] OpenFoodFacts unavailable, using local fallback:', err.message);
  }

  // Fallback to curated mock dataset
  const mockResults = searchMockFoods(query);
  if (mockResults.length > 0) return mockResults;

  // If nothing matched mock either, return some general suggestions
  return MOCK_FOODS.slice(0, 5);
};

