import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    profilePic: {
      type: String,
      default: '',
    },
    goals: [
      {
        type: String,
        enum: ['weight_loss', 'muscle_gain', 'stress', 'energy', 'nutrition', 'fitness'],
      },
    ],
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
      notifications: { push: { type: Boolean, default: true }, email: { type: Boolean, default: true } },
      units: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
    },
    onboarding: {
      completed: { type: Boolean, default: false },
      lifestyle: { type: String, enum: ['sedentary', 'light', 'moderate', 'very_active'] },
      schedule: {
        wakeTime: String,
        sleepTime: String,
      },
      baseline: {
        weight: Number,
        height: Number,
        stepGoal: Number,
        sleepGoal: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
