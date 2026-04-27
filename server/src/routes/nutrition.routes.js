import express from 'express';
import { searchFoods, getMealLog, addFoodEntry, deleteFoodEntry, getNutritionSuggestions, getMealPlan, scanFoodPhoto, getGroceryList } from '../controllers/nutrition.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { addFoodSchema } from '../middleware/validators.js';

const router = express.Router();

router.use(protect);

router.get('/search', searchFoods);
router.get('/suggestions', getNutritionSuggestions);
router.get('/meal-plan', getMealPlan);
router.post('/grocery-list', getGroceryList);
router.post('/scan-photo', scanFoodPhoto);
router.route('/log/:date')
  .get(getMealLog)
  .post(validate(addFoodSchema), addFoodEntry);

router.delete('/log/:date/:mealType/:itemId', deleteFoodEntry);

export default router;
