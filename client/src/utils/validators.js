/**
 * Validation utilities for Wellness+
 */

/**
 * Validate email format
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate password strength
 * Returns { valid, errors, strength (0-3) }
 */
export function validatePassword(password) {
  const errors = [];
  if (!password || password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Uppercase letter required');
  if (!/[0-9]/.test(password)) errors.push('Number required');
  return {
    valid: errors.length === 0,
    errors,
    strength: 3 - errors.length,
  };
}

/**
 * Validate login form
 */
export function validateLogin({ email, password }) {
  const errors = {};
  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  return errors;
}

/**
 * Validate signup form
 */
export function validateSignup({ name, email, password, confirm }) {
  const errors = {};
  if (!name?.trim()) errors.name = 'Full name is required';
  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';
  const { valid, errors: pwErrors } = validatePassword(password);
  if (!password) errors.password = 'Password is required';
  else if (!valid) errors.password = pwErrors[0];
  if (!confirm) errors.confirm = 'Please confirm your password';
  else if (confirm !== password) errors.confirm = 'Passwords do not match';
  return errors;
}

/**
 * Validate a habit form
 */
export function validateHabit({ title, frequency }) {
  const errors = {};
  if (!title?.trim()) errors.title = 'Habit name is required';
  if (title?.length > 60) errors.title = 'Keep it under 60 characters';
  if (!frequency?.type) errors.frequency = 'Select a frequency';
  return errors;
}

/**
 * Validate that a numeric metric is in range
 */
export function validateMetric(value, { min, max, name }) {
  if (value === '' || value == null) return null;
  const num = Number(value);
  if (isNaN(num)) return `${name} must be a number`;
  if (num < min) return `${name} must be at least ${min}`;
  if (num > max) return `${name} must be at most ${max}`;
  return null;
}

/**
 * Common metric validators
 */
export const metricValidators = {
  steps:      v => validateMetric(v, { min: 0, max: 100000, name: 'Steps' }),
  sleep:      v => validateMetric(v, { min: 0, max: 24,     name: 'Sleep hours' }),
  stress:     v => validateMetric(v, { min: 1, max: 10,     name: 'Stress level' }),
  weight:     v => validateMetric(v, { min: 20, max: 500,   name: 'Weight' }),
  height:     v => validateMetric(v, { min: 50, max: 300,   name: 'Height' }),
  calories:   v => validateMetric(v, { min: 0, max: 10000,  name: 'Calories' }),
  water:      v => validateMetric(v, { min: 0, max: 30,     name: 'Water (glasses)' }),
};

/**
 * Check if a string is empty or whitespace
 */
export function isEmpty(value) {
  return !value || !String(value).trim();
}
