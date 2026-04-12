import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';

/**
 * Generates logic for JWT tokens
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Create a new user
 */
export const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already in use');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return user;
};

/**
 * Login user and verify credentials
 */
export const loginUser = async (email, password) => {
  // Add +password to select it because it is select: false in schema
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  return user;
};

/**
 * Update user details
 */
export const updateUser = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
  return user;
};

