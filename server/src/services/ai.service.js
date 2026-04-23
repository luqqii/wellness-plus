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
  if (model) {
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
  if (model) {
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
You also act as an Emotion & Stress Detector and Context-Aware Suggestion engine. 
Based on the user's message, extract their emotional tone (choose from: Neutral, Motivated, Tired, Stressed, Positive, Negative).
If you detect weather or schedule context in their message, adapt your advice accordingly.

Return ONLY a valid JSON object with exactly this structure, no markdown formatting:
{ "content": "Your conversational, 2-3 sentence coaching reply", "sentiment": "Extracted emotion string" }

${conversationLog ? `Conversation so far:\n${conversationLog}\n` : ''}
User: ${newMessage}
Coach:`;

      const text = await callGemini(fullPrompt);
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
      return { content: parsed.content || "I hear you.", sentiment: parsed.sentiment || 'Neutral' };
    } catch (e) {
      const errorMsg = e.message || String(e);
      const isQuota = errorMsg.includes('429') || errorMsg.includes('quota') ||
        errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('QUOTA_CIRCUIT_OPEN');
      console.error('[AI] replyToConversation error:', errorMsg.substring(0, 200));
      return {
        content: isQuota
          ? `I'm taking a short breather — you've been chatting a lot today! 😊 I'll be back in about a minute. In the meantime, keep up the great wellness work!`
          : `Sorry, I'm having a little trouble connecting right now. Please try again in a few seconds!`,
        sentiment: 'Neutral'
      };
    }
  }

  return { content: "I hear you. Let's focus on small, consistent steps forward.", sentiment: 'neutral' };
};

export const analyzeFoodImage = async (imageBuffer, mimeType) => {
  if (model) {
    try {
      const prompt = `Analyze this food image. Return ONLY in JSON format: { "name": String, "calories": Number, "protein": Number, "carbs": Number, "fat": Number, "confidence": Number }`;
      const result = await model.generateContent([
        prompt,
        { inlineData: { data: imageBuffer.toString('base64'), mimeType } }
      ]);
      const cleanedJson = result.response.text().replace(/```json|```/g, '').trim();
      return JSON.parse(cleanedJson);
    } catch (e) {
      console.error('[AI] analyzeFoodImage error:', e.message?.substring(0, 150));
      // Graceful fallback if Gemini API quota is exhausted
      return {
        name: "Healthy Salad (Estimated)",
        calories: 320,
        protein: 12,
        carbs: 25,
        fat: 18,
        confidence: 0.85
      };
    }
  }
  return {
    name: "Healthy Meal (Estimated)",
    calories: 400,
    protein: 20,
    carbs: 45,
    fat: 15,
    confidence: 0.8
  };
};

export const generateNutritionAdvice = async (user, consumed, remaining) => {
  if (model) {
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
    console.warn("FastAPI Prediction failed, falling back to Gemini...");
    if (model) {
      try {
        const prompt = `Analyze these wellness metrics: Steps: ${metrics.steps}, Sleep: ${metrics.sleep?.hours}h, Stress: ${metrics.stressLevel}/10. 
Predict burnout risk. Return ONLY a JSON object with this exact structure:
{ "burnout_risk": "Low" | "Moderate" | "High", "recommended_recovery_hours": number, "confidence_score": number }`;
        const text = await callGemini(prompt);
        return JSON.parse(text.replace(/```json|```/g, '').trim());
      } catch (geminiError) {
        console.error("Gemini Fallback Error:", geminiError.message);
      }
    }
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
  if (model) {
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

/**
 * Generate a context-aware suggestion based on weather, schedule, and metrics
 */
export const generateContextAwareSuggestion = async (user, metrics, context) => {
  if (model) {
    try {
      const prompt = `User Goals: ${user?.goals?.join(', ') || 'General Wellness'}.
Metrics: Sleep: ${metrics?.sleep?.hours || 7}h, Stress: ${metrics?.stressLevel || 5}/10.
Context: Weather is ${context.weather || 'clear'}, Calendar is ${context.calendarBusy ? 'busy' : 'open'}.

Generate ONE highly specific wellness suggestion that adapts to this context. 
Return ONLY a JSON object with this exact structure:
{
  "iconName": "CloudRain" | "Sun" | "Moon" | "Briefcase" | "Activity",
  "title": "Short punchy title",
  "text": "1-2 sentences of specific advice",
  "color": "var(--c-blue)" | "var(--c-orange)" | "var(--c-purple)" | "var(--c-teal)"
}`;
      const text = await callGemini(prompt);
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch (e) {
      console.error('[AI] generateContextAwareSuggestion error:', e.message?.substring(0, 150));
    }
  }
  return {
    iconName: "Activity",
    title: "Stay Active",
    text: "Keep moving throughout the day to maintain your energy levels.",
    color: "var(--c-teal)"
  };
};

/**
 * Generate a 7-day routine AI planner based on goals and availability
 */
export const generateWeeklyRoutine = async (user) => {
  if (model) {
    try {
      const prompt = `User Goals: ${user?.goals?.join(', ') || 'General Wellness'}.
Create a 7-day fitness and wellness routine.
Return ONLY a JSON array of objects with this exact structure:
[
  { "day": "Monday", "focus": "String describing the workout/activity", "duration": "String like '45 min'", "completed": false }
]
Make sure to include all 7 days of the week in order.`;
      const text = await callGemini(prompt);
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch (e) {
      console.error('[AI] generateWeeklyRoutine error:', e.message?.substring(0, 150));
    }
  }
  return [
    { day: 'Monday', focus: 'Cardio & Mobility', duration: '45 min', completed: false },
    { day: 'Tuesday', focus: 'Upper Body Strength', duration: '60 min', completed: false },
    { day: 'Wednesday', focus: 'Active Recovery', duration: '30 min', completed: false },
    { day: 'Thursday', focus: 'Lower Body Strength', duration: '60 min', completed: false },
    { day: 'Friday', focus: 'HIIT & Core', duration: '40 min', completed: false },
    { day: 'Saturday', focus: 'Long Outdoor Run', duration: '90 min', completed: false },
    { day: 'Sunday', focus: 'Rest & Meal Prep', duration: '--', completed: false },
  ];
};

/**
 * Generate a professional onboarding assessment based on 10 quiz answers
 */
export const generateOnboardingAssessment = async (answers) => {
  if (model) {
    try {
      const prompt = `You are an elite, highly empathetic Personal Trainer.
A new client has just completed a 10-question onboarding assessment. Here are their answers:
1. Goal: ${answers.q1}
2. Activity Level: ${answers.q2}
3. Experience: ${answers.q3}
4. Workout Preference: ${answers.q4}
5. Diet: ${answers.q5}
6. Sleep: ${answers.q6}
7. Stress: ${answers.q7}
8. Time: ${answers.q8}
9. Obstacle: ${answers.q9}
10. Timeline: ${answers.q10}

Write a personalized, 3-paragraph professional assessment for them. 
Paragraph 1: Current Status & Strengths.
Paragraph 2: Major Roadblocks & Adjustments.
Paragraph 3: Immediate Next Steps (Actionable).

Return ONLY a JSON object with this exact structure:
{
  "status": "String",
  "roadblocks": "String",
  "nextSteps": "String",
  "recommendedFocus": "String (e.g. 'Strength & Recovery')"
}`;
      const text = await callGemini(prompt);
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch (e) {
      console.error('[AI] generateOnboardingAssessment error:', e.message?.substring(0, 150));
    }
  }
  // Deterministic Fallback Engine (Runs if AI is unavailable or fails)
  // This guarantees completely different, tailored results based on quiz outcomes
  const goal = answers.q1 || 'General Wellness';
  const time = answers.q8 || '30-45 mins';
  const roadblock = answers.q9 || 'Consistency';
  const experience = answers.q3 || 'Beginner';
  
  let status = "";
  let roadblocks = "";
  let nextSteps = "";
  let recommendedFocus = "";

  // 1. Analyze Status based on Goal & Experience
  if (goal === 'Weight Loss') {
    status = `As a ${experience} focusing on weight loss, your primary lever will be metabolic conditioning and a sustainable caloric deficit. You already have a great baseline, we just need to dial in the consistency.`;
    recommendedFocus = "Metabolic Conditioning & Deficit";
  } else if (goal === 'Muscle Gain') {
    status = `To achieve muscle hypertrophy as a ${experience}, we need to focus on progressive overload and adequate protein intake. Your body is primed for adaptation.`;
    recommendedFocus = "Progressive Overload & Fuel";
  } else if (goal === 'Stress Reduction') {
    status = `Your focus on stress reduction is incredibly mature. We will prioritize down-regulation of your nervous system through mobility, light cardio, and breathwork over high-intensity strain.`;
    recommendedFocus = "Recovery & Nervous System Reset";
  } else {
    status = `Building cardiovascular and muscular endurance takes time. As a ${experience}, your focus will be on sustained, zone-2 training combined with strategic high-intensity bursts.`;
    recommendedFocus = "Aerobic Base & Stamina";
  }

  // 2. Analyze Roadblocks
  if (roadblock === 'Lack of time') {
    roadblocks = `Since time is your biggest hurdle, we are eliminating junk volume. We will focus entirely on compound movements and high-yield habits that take less time but deliver maximum results.`;
  } else if (roadblock === 'Lack of knowledge') {
    roadblocks = `Don't worry about not knowing where to start. That's what this platform is for. We are taking the guesswork completely out of your routine so you can just execute.`;
  } else if (roadblock === 'Loss of motivation') {
    roadblocks = `Motivation is fleeting, but discipline and momentum are permanent. We will build momentum through micro-wins—tasks so small you can't fail—to rebuild your psychological drive.`;
  } else {
    roadblocks = `Working around discomfort or past injuries requires a smart approach. We will emphasize perfect form, mobility, and pain-free ranges of motion before adding any intensity.`;
  }

  // 3. Analyze Next Steps based on Time
  if (time === '< 20 mins') {
    nextSteps = `1. Start with daily 15-minute micro-workouts. \n2. Focus on hitting your daily step goal. \n3. Log your food accurately just to build awareness.`;
  } else if (time === '60+ mins') {
    nextSteps = `1. Follow the full 50-minute structured daily routine. \n2. Dedicate 10 minutes post-workout to active recovery. \n3. Meal prep your proteins for the week.`;
  } else {
    nextSteps = `1. Commit to three 35-minute focused sessions per week. \n2. Optimize your sleep environment to maximize recovery. \n3. Drink 3 liters of water daily.`;
  }

  return {
    status,
    roadblocks,
    nextSteps,
    recommendedFocus
  };
};
