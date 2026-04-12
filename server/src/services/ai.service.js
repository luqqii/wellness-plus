import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import env from '../config/env.js';

const MODEL_NAME = 'gemini-1.5-flash';

let genAI = null;
if (env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  console.log('[AI Service] Gemini initialized with model:', MODEL_NAME);
} else {
  console.warn('[AI Service] GEMINI_API_KEY not found — using fallback responses.');
}

const insightCache = new Map();


/**
 * Basic AI Service Interface connected to Gemini
 */
export const generateCoachingInsight = async (user, metrics, context) => {
  if (genAI) {
    const todayStr = new Date().toISOString().split('T')[0];
    const cacheKey = `${user?._id || user?.id || 'anon'}_${todayStr}`;
    if (insightCache.has(cacheKey)) return insightCache.get(cacheKey);

    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const prompt = `You are Wellness+, a friendly AI Health Coach for ${user?.name || 'Alex'}. 
Provide a warm, personalized greeting and one actionable wellness tip. Keep it under 3 sentences.`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      insightCache.set(cacheKey, text);
      return text;
    } catch (e) {
      console.error('[AI] generateCoachingInsight error:', e.message);
    }
  }
  return `Hi ${user?.name || 'Alex'}, how may I help you today?`;
};

/**
 * Handle direct conversation messages with history
 */
export const replyToConversation = async (user, messageHistory, newMessage) => {
  if (genAI) {
    try {
      const goalList = Array.isArray(user?.goals) ? user.goals.map(g => g.type || g).join(', ') : 'General Wellness';

      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      // Build clean alternating history
      let history = messageHistory
        .map(m => ({
          role: m.role === 'ai' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }))
        .filter((m, i, arr) => i === 0 || m.role !== arr[i - 1].role);

      // History must start with 'user'
      while (history.length > 0 && history[0].role !== 'user') history.shift();

      const systemContext = `You are Wellness+, a helpful and empathetic AI Health Coach for ${user?.name || 'Alex'}.
User goals: ${goalList}.
Instructions: Be warm, conversational, and concise (2-4 sentences). 
IMPORTANT: Respond ONLY with a valid JSON object in this exact format: { "response": "your message here", "sentiment": "positive|neutral|negative" }`;

      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: systemContext }] },
          { role: 'model', parts: [{ text: '{ "response": "Understood! I am ready to help.", "sentiment": "positive" }' }] },
          ...history
        ]
      });

      const result = await chat.sendMessage(newMessage);
      const text = result.response.text().trim();

      const cleanedJson = text.replace(/```json|```/g, '').trim();
      try {
        const output = JSON.parse(cleanedJson);
        return { content: output.response || text, sentiment: output.sentiment || 'neutral' };
      } catch {
        // If not JSON, return raw text
        return { content: text, sentiment: 'neutral' };
      }

    } catch (e) {
      console.error('[AI] replyToConversation error:', e.message);
      return {
        content: "I'm here for you. How else can I support your wellness journey today?",
        sentiment: 'neutral'
      };
    }
  }

  return { content: "I hear you. Let's focus on small, consistent steps forward.", sentiment: 'neutral' };
};

export const analyzeFoodImage = async (imageBuffer, mimeType) => {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const prompt = `Analyze this food image. Return ONLY in JSON format: { "name": String, "calories": Number, "protein": Number, "carbs": Number, "fat": Number, "confidence": Number }`;
      const result = await model.generateContent([
        { inlineData: { data: imageBuffer.toString('base64'), mimeType } },
        { text: prompt }
      ]);
      const cleanedJson = result.response.text().replace(/```json|```/g, '').trim();
      return JSON.parse(cleanedJson);
    } catch (e) {
      console.error('[AI] analyzeFoodImage error:', e.message);
    }
  }
  return null;
};


export const generateNutritionAdvice = async (user, consumed, remaining) => {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json", temperature: 0.7 }
      });
      const prompt = `User Goals: ${user.goals?.join(', ') || 'General Wellness'}. Remaining: ${remaining.calories} cal, ${remaining.protein}g protein, ${remaining.carbs}g carbs, ${remaining.fat}g fat. 
Give 3 short meal suggestions that perfectly fit these remaining macros. 
Return ONLY a JSON array of objects with the exact structure: [{ "name": "Meal Name", "calories": Number, "protein": Number, "tag": "e.g. High Protein", "why": "Why it fits" }]`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, '').trim();
      return JSON.parse(text);
    } catch (e) {
      console.error("Gemini Nutrition Error:", e.message);
    }
  }
  return null;
};

/**
 * Interface to Python FastAPI ML Microservice
 * Predicts risk based on daily metrics.
 */
export const predictBurnoutRisk = async (metrics) => {
  try {
    const payload = {
      steps: metrics.steps || 0,
      sleep_hours: metrics.sleep?.hours || 0,
      stress_level: metrics.stressLevel || 5,
      activity_intensity: metrics.nutrition?.calories > 2500 ? 8 : 4
    };

    const res = await axios.post('http://localhost:8000/predict/recovery', payload);
    return res.data;
  } catch (error) {
    console.error("FastAPI Prediction Error:", error.message);
    return {
      burnout_risk: "Unknown",
      recommended_recovery_hours: 8.0,
      confidence_score: 0.0
    };
  }
};

/**
 * Generate a weekly AI meal plan using Gemini
 */
export const generateMealPlan = async (user, targetCalories) => {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json", temperature: 0.8 }
      });
      const goals = Array.isArray(user?.goals) ? user.goals.join(', ') : 'General Wellness';
      const prompt = `Create a 7-day healthy meal plan for someone with goals: ${goals}. Target: ~${targetCalories} calories/day.
Return ONLY a JSON object with this exact structure:
{
  "days": [
    {
      "day": "Monday",
      "breakfast": { "name": "string", "calories": number, "protein": number, "carbs": number, "fat": number, "ingredients": ["string"] },
      "lunch": { "name": "string", "calories": number, "protein": number, "carbs": number, "fat": number, "ingredients": ["string"] },
      "snack": { "name": "string", "calories": number, "protein": number, "carbs": number, "fat": number, "ingredients": ["string"] },
      "dinner": { "name": "string", "calories": number, "protein": number, "carbs": number, "fat": number, "ingredients": ["string"] }
    }
  ]
}
Include all 7 days (Monday through Sunday). Make meals varied, realistic and delicious.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, '').trim();
      return JSON.parse(text);
    } catch (e) {
      console.error("Gemini Meal Plan Error:", e.message);
    }
  }

  // Static fallback meal plan
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const bCal = Math.round(targetCalories * 0.25);
  const lCal = Math.round(targetCalories * 0.35);
  const sCal = Math.round(targetCalories * 0.1);
  const dCal = Math.round(targetCalories * 0.3);
  return {
    days: days.map((day, i) => ({
      day,
      breakfast: { name: ['Oatmeal with Berries','Avocado Toast + Eggs','Greek Yogurt Parfait','Protein Smoothie Bowl','Whole Wheat Pancakes','Egg White Omelette','Overnight Oats'][i], calories: bCal, protein: 15, carbs: 45, fat: 10, ingredients: ['Oats','Berries','Milk'] },
      lunch: { name: ['Grilled Chicken Salad','Quinoa Power Bowl','Turkey Wrap','Mediterranean Bowl','Salmon Poke Bowl','Veggie Stir Fry','Chicken Soup'][i], calories: lCal, protein: 40, carbs: 35, fat: 14, ingredients: ['Chicken','Salad','Quinoa'] },
      snack: { name: ['Apple + Almond Butter','Rice Cakes','Greek Yogurt','Mixed Nuts','Protein Bar','Hummus + Veggies','Cottage Cheese'][i], calories: sCal, protein: 10, carbs: 15, fat: 6, ingredients: ['Apple','Almond Butter'] },
      dinner: { name: ['Baked Salmon + Veggies','Lean Beef Stir Fry','Grilled Chicken + Quinoa','Shrimp Tacos','Turkey Meatballs','Tofu Curry','Steak + Sweet Potato'][i], calories: dCal, protein: 38, carbs: 28, fat: 16, ingredients: ['Salmon','Broccoli','Quinoa'] },
    }))
  };
};

/**
 * Generate a grocery list from a meal plan using Gemini
 */
export const generateGroceryList = async (mealPlan) => {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json", temperature: 0.5 }
      });

      // Extract all meal names from the plan
      const meals = mealPlan.days.flatMap(d => [d.breakfast?.name, d.lunch?.name, d.snack?.name, d.dinner?.name]).filter(Boolean);
      const prompt = `Based on these meals for a week: ${meals.join(', ')}.
Create a consolidated grocery shopping list organized by category.
Return ONLY a JSON array like:
[
  { "category": "Proteins", "items": [{ "name": "Chicken Breast", "quantity": "500g" }] },
  { "category": "Vegetables", "items": [{ "name": "Broccoli", "quantity": "2 heads" }] },
  { "category": "Fruits", "items": [{ "name": "Berries", "quantity": "2 cups" }] },
  { "category": "Grains & Carbs", "items": [{ "name": "Quinoa", "quantity": "1 bag" }] },
  { "category": "Dairy & Eggs", "items": [{ "name": "Greek Yogurt", "quantity": "4 cups" }] },
  { "category": "Pantry & Spices", "items": [{ "name": "Olive Oil", "quantity": "1 bottle" }] }
]`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, '').trim();
      return JSON.parse(text);
    } catch (e) {
      console.error("Gemini Grocery List Error:", e.message);
    }
  }

  // Fallback static grocery list
  return [
    { category: 'Proteins', items: [{ name: 'Chicken Breast', quantity: '1kg' }, { name: 'Salmon Fillets', quantity: '500g' }, { name: 'Eggs', quantity: '12' }] },
    { category: 'Vegetables', items: [{ name: 'Broccoli', quantity: '2 heads' }, { name: 'Spinach', quantity: '200g' }, { name: 'Bell Peppers', quantity: '4' }] },
    { category: 'Fruits', items: [{ name: 'Berries (mixed)', quantity: '400g' }, { name: 'Bananas', quantity: '6' }, { name: 'Apples', quantity: '4' }] },
    { category: 'Grains & Carbs', items: [{ name: 'Oats', quantity: '500g' }, { name: 'Quinoa', quantity: '400g' }, { name: 'Whole Wheat Bread', quantity: '1 loaf' }] },
    { category: 'Dairy & Eggs', items: [{ name: 'Greek Yogurt', quantity: '500g' }, { name: 'Almond Milk', quantity: '1L' }] },
    { category: 'Pantry & Spices', items: [{ name: 'Olive Oil', quantity: '1 bottle' }, { name: 'Almond Butter', quantity: '1 jar' }, { name: 'Honey', quantity: '1 jar' }] },
  ];
};


