import mongoose from 'mongoose';

const mealEntrySchema = new mongoose.Schema({
  foodItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem',
    // If it's a custom/API food not saved locally, we can embed it
  },
  customFood: {
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    // Micronutrients (optional)
    fiber: Number,
    sugar: Number,
    sodium: Number,
    vitaminA: Number,
    vitaminC: Number,
    iron: Number,
    calcium: Number,
  },
  servingsConsumed: {
    type: Number,
    required: true,
    default: 1
  }
});

const mealLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
    index: true
  },
  totals: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 }
  },
  breakfast: [mealEntrySchema],
  lunch: [mealEntrySchema],
  dinner: [mealEntrySchema],
  snacks: [mealEntrySchema]
}, { timestamps: true });

// Compound index to ensure 1 log per user per day
mealLogSchema.index({ userId: 1, date: 1 }, { unique: true });

// Pre-save hook to automatically calculate totals
mealLogSchema.pre('save', function() {
  let cots = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  
  const calculateMacros = (mealArray) => {
    mealArray.forEach(entry => {
      if (entry.customFood) {
        cots.calories += (entry.customFood.calories || 0) * entry.servingsConsumed;
        cots.protein += (entry.customFood.protein || 0) * entry.servingsConsumed;
        cots.carbs += (entry.customFood.carbs || 0) * entry.servingsConsumed;
        cots.fat += (entry.customFood.fat || 0) * entry.servingsConsumed;
      }
    });
  };

  calculateMacros(this.breakfast);
  calculateMacros(this.lunch);
  calculateMacros(this.dinner);
  calculateMacros(this.snacks);

  this.totals = cots;
  // No next() — Mongoose synchronous pre hook resolves automatically
});

export default mongoose.model('MealLog', mealLogSchema);
