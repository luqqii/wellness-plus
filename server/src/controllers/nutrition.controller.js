import MealLog from '../models/MealLog.js';
import DailyMetric from '../models/DailyMetric.js';
import { searchFoods as searchExternalFoods } from '../services/nutrition.service.js';
import { analyzeFoodImage, generateNutritionAdvice, generateMealPlan as aiGenerateMealPlan, generateGroceryList as aiGenerateGroceryList } from '../services/ai.service.js';
import env from '../config/env.js';

// @desc    Search food database (USDA)
// @route   GET /api/v1/nutrition/search?query=banana
export const searchFoods = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: 'Search query required' });
    const results = await searchExternalFoods(query);
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};

// @desc    Get meal log for a specific date
// @route   GET /api/v1/nutrition/log/:date
export const getMealLog = async (req, res, next) => {
  try {
    let log = await MealLog.findOne({ userId: req.user._id, date: req.params.date });
    if (!log) {
      log = await MealLog.create({ userId: req.user._id, date: req.params.date });
    }
    res.json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

// @desc    Add food to diary
// @route   POST /api/v1/nutrition/log/:date
export const addFoodEntry = async (req, res, next) => {
  try {
    const { date } = req.params;
    const { mealType, customFood, servingsConsumed } = req.body;

    if (!['breakfast', 'lunch', 'dinner', 'snacks'].includes(mealType)) {
      return res.status(400).json({ success: false, message: 'Invalid meal type' });
    }

    let log = await MealLog.findOne({ userId: req.user._id, date });
    if (!log) {
      log = new MealLog({ userId: req.user._id, date });
    }

    log[mealType].push({ customFood, servingsConsumed: servingsConsumed || 1 });
    await log.save();
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food from diary
// @route   DELETE /api/v1/nutrition/log/:date/:mealType/:itemId
export const deleteFoodEntry = async (req, res, next) => {
  try {
    const { date, mealType, itemId } = req.params;

    if (!['breakfast', 'lunch', 'dinner', 'snacks'].includes(mealType)) {
      return res.status(400).json({ success: false, message: 'Invalid meal type' });
    }

    const log = await MealLog.findOne({ userId: req.user._id, date });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Meal log not found' });
    }

    // Pull the item from the array
    log[mealType] = log[mealType].filter(item => item._id.toString() !== itemId);
    await log.save(); // triggers pre-save macro recalculation

    res.json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI-powered nutrition suggestions
// @route   GET /api/v1/nutrition/suggestions
export const getNutritionSuggestions = async (req, res, next) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const mealLog = await MealLog.findOne({ userId: req.user._id, date: todayStr });

    const consumed = mealLog?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };
    const userGoals = req.user.goals || [];
    const lifestyle = req.user.onboarding?.lifestyle || 'moderate';

    const baseCalories = { sedentary: 1800, light: 2000, moderate: 2200, very_active: 2600 };
    let adjustedCalories = req.user.preferences?.nutrition?.calorieGoal;
    
    if (!adjustedCalories) {
      const targetCalories = baseCalories[lifestyle] || 2200;
      adjustedCalories = targetCalories;
      if (userGoals.includes('weight_loss')) adjustedCalories -= 300;
      if (userGoals.includes('muscle_gain')) adjustedCalories += 300;
    }

    const remaining = {
      calories: Math.max(0, adjustedCalories - consumed.calories),
      protein: Math.max(0, Math.round(adjustedCalories * 0.3 / 4) - consumed.protein),
      carbs: Math.max(0, Math.round(adjustedCalories * 0.4 / 4) - consumed.carbs),
      fat: Math.max(0, Math.round(adjustedCalories * 0.3 / 9) - consumed.fat),
    };

    const aiSuggestion = await generateNutritionAdvice(req.user, consumed, remaining);

    res.json({
      success: true,
      data: {
        dailyTarget: {
          calories: adjustedCalories,
          protein: Math.round(adjustedCalories * 0.3 / 4),
          carbs: Math.round(adjustedCalories * 0.4 / 4),
          fat: Math.round(adjustedCalories * 0.3 / 9),
        },
        consumed,
        remaining,
        suggestion: aiSuggestion,
        basedOnGoals: userGoals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI weekly meal plan (Gemini powered)
// @route   GET /api/v1/nutrition/meal-plan
export const getMealPlan = async (req, res, next) => {
  try {
    const userGoals = req.user.goals || [];
    const lifestyle = req.user.onboarding?.lifestyle || 'moderate';
    const baseCalories = { sedentary: 1800, light: 2000, moderate: 2200, very_active: 2600 };
    let targetCalories = req.user.preferences?.nutrition?.calorieGoal;
    if (!targetCalories) {
      targetCalories = baseCalories[lifestyle] || 2200;
      if (userGoals.includes('weight_loss')) targetCalories -= 300;
      if (userGoals.includes('muscle_gain')) targetCalories += 300;
    }

    const mealPlan = await aiGenerateMealPlan(req.user, targetCalories);
    res.json({ success: true, data: { ...mealPlan, targetCalories } });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate grocery list from meal plan
// @route   POST /api/v1/nutrition/grocery-list
export const getGroceryList = async (req, res, next) => {
  try {
    const userGoals = req.user.goals || [];
    const lifestyle = req.user.onboarding?.lifestyle || 'moderate';
    const baseCalories = { sedentary: 1800, light: 2000, moderate: 2200, very_active: 2600 };
    let targetCalories = req.user.preferences?.nutrition?.calorieGoal;
    if (!targetCalories) {
      targetCalories = baseCalories[lifestyle] || 2200;
      if (userGoals.includes('weight_loss')) targetCalories -= 300;
      if (userGoals.includes('muscle_gain')) targetCalories += 300;
    }

    const mealPlan = req.body.mealPlan || await aiGenerateMealPlan(req.user, targetCalories);
    const groceryList = await aiGenerateGroceryList(mealPlan);

    res.json({ success: true, data: groceryList });
  } catch (error) {
    next(error);
  }
};

// @desc    Scan food photo with Gemini Vision
// @route   POST /api/v1/nutrition/scan-photo
export const scanFoodPhoto = async (req, res, next) => {
  try {
    if (!req.files || (!req.files.image && !req.files.file)) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }
    const image = req.files.image || req.files.file;
    const analysis = await analyzeFoodImage(image.data, image.mimetype);
    if (!analysis) {
      return res.status(500).json({ success: false, message: 'AI failed to analyze image' });
    }
    res.json({
      success: true,
      data: {
        matches: [{
          name: analysis.name,
          confidence: analysis.confidence || 0.95,
          cal: analysis.calories,
          p: analysis.protein,
          c: analysis.carbs,
          f: analysis.fat
        }]
      }
    });
  } catch (error) {
    next(error);
  }
};
