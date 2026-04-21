import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import env from '../config/env.js';

// gemini-2.5-flash-lite bypassed the 429 quota on this key!
const MODEL_NAME = 'gemini-2.5-flash-lite';

let genAI = null;
let model = null;
// Circuit breaker: if quota is blown, stop hammering the API
let quotaExceeded = false;
let quotaResetTimer = null;

if (env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: MODEL_NAME });
  console.log('[AI Service] Gemini initialized with model:', MODEL_NAME);
} else {
  console.warn('[AI Service] GEMINI_API_KEY not found — using fallback responses.');
}

function setQuotaExceeded() {
  quotaExceeded = true;
  console.warn('[AI] Quota exceeded — activating circuit breaker for 60 seconds.');
  clearTimeout(quotaResetTimer);
  quotaResetTimer = setTimeout(() => {
    quotaExceeded = false;
    console.log('[AI] Circuit breaker reset — retrying Gemini API.');
  }, 60 * 1000);
}

/**
 * Helper: call Gemini generateContent with retry on 429
 */
async function callGemini(prompt, retries = 2) {
  if (quotaExceeded) throw new Error('QUOTA_CIRCUIT_OPEN');

  for (let i = 0; i <= retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      const is429 = e.message?.includes('429') || e.message?.includes('quota') || e.message?.includes('RESOURCE_EXHAUSTED');
      if (is429) {
        if (i < retries) {
          const delay = (i + 1) * 3000;
          console.warn(`[AI] Rate limited (attempt ${i + 1}/${retries}), retrying in ${delay / 1000}s...`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        } else {
          setQuotaExceeded();
        }
      }
      throw e;
    }
  }
}

/**
 * Basic AI Service Interface connected to Gemini
 */
export const generateCoachingInsight = async (user, metrics, context) => {
  if (ai) {
    try {
      const prompt = `You are Wellness+, a friendly AI Health Coach. Give a warm one-sentence greeting to ${user?.name || 'Alex'} and one short wellness tip.`;
      const text = await callGemini(prompt);
      return text;
    } catch (e) {
      console.error('[AI] generateCoachingInsight error:', e.message?.substring(0, 150));
    }
  }
  return `Hi ${user?.name || 'Alex'}, how may I help you today?`;
};

/**
 * Handle direct conversation messages with history
 */
export const replyToConversation = async (user, messageHistory, newMessage) => {
  if (ai) {
    try {
      const goalList = Array.isArray(user?.goals)
        ? user.goals.map(g => g.type || g).join(', ')
        : 'General Wellness';

      // Build a plain-text conversation log (free-tier safe approach)
      const conversationLog = messageHistory
        .slice(-10)
        .map(m => `${m.role === 'ai' ? 'Coach' : 'User'}: ${m.content}`)
        .join('\n');

      const fullPrompt = `You are Wellness+, a warm and helpful AI Health Coach for ${user?.name || 'Alex'}.
User goals: ${goalList}.
Keep your reply conversational and concise (2-3 sentences max).

${conversationLog ? `Conversation so far:\n${conversationLog}\n` : ''}
User: ${newMessage}
Coach:`;

      const text = await callGemini(fullPrompt);
      return { content: text.trim(), sentiment: 'neutral' };
    } catch (e) {
      const errorMsg = e.message || String(e);
      const isQuota = errorMsg.includes('429') || errorMsg.includes('quota') ||
        errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('QUOTA_CIRCUIT_OPEN');
      console.error('[AI] replyToConversation error:', errorMsg.substring(0, 200));
      return {
        content: isQuota
          ? `I'm taking a short breather — you've been chatting a lot today! 😊 I'll be back in about a minute. In the meantime, keep up the great wellness work!`
          : `Sorry, I'm having a little trouble connecting right now. Please try again in a few seconds!`,
        sentiment: 'neutral'
      };
    }
  }

  return { content: "I hear you. Let's focus on small, consistent steps forward.", sentiment: 'neutral' };
};

export const analyzeFoodImage = async (imageBuffer, mimeType) => {
  if (ai) {
    try {
      const prompt = `Analyze this food image. Return ONLY in JSON format: { "name": String, "calories": Number, "protein": Number, "carbs": Number, "fat": Number, "confidence": Number }`;
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [
          { inlineData: { data: imageBuffer.toString('base64'), mimeType } },
          { text: prompt }
        ],
      });
      const cleanedJson = response.text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanedJson);
    } catch (e) {
      console.error('[AI] analyzeFoodImage error:', e.message?.substring(0, 150));
    }
  }
  return null;
};

export const generateNutritionAdvice = async (user, consumed, remaining) => {
  if (ai) {
    try {
      const prompt = `User Goals: ${user.goals?.join(', ') || 'General Wellness'}. Remaining: ${remaining.calories} cal, ${remaining.protein}g protein, ${remaining.carbs}g carbs, ${remaining.fat}g fat. 
Give 3 short meal suggestions that perfectly fit these remaining macros. 
Return ONLY a JSON array of objects with the exact structure: [{ "name": "Meal Name", "calories": Number, "protein": Number, "tag": "e.g. High Protein", "why": "Why it fits" }]`;
      const text = await callGemini(prompt);
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch (e) {
      console.error('[AI] generateNutritionAdvice error:', e.message?.substring(0, 150));
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
  if (ai) {
    try {
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

      const text = await callGemini(prompt);
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch (e) {
      console.error('[AI] generateMealPlan error:', e.message?.substring(0, 150));
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
  if (ai) {
    try {
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

      const text = await callGemini(prompt);
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch (e) {
      console.error('[AI] generateGroceryList error:', e.message?.substring(0, 150));
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
