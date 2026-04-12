import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brandName: {
    type: String,
    trim: true,
    default: 'Generic'
  },
  calories: {
    type: Number,
    required: true
  },
  servingSize: {
    type: {
      amount: Number,
      unit: String // e.g., 'g', 'oz', 'cup', 'ml'
    },
    required: true
  },
  macros: {
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 }
  },
  barcode: {
    type: String,
    index: true,
    sparse: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Text index for fast search
foodItemSchema.index({ name: 'text', brandName: 'text' });

export default mongoose.model('FoodItem', foodItemSchema);
