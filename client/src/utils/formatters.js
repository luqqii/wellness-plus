/**
 * Utility formatters for Wellness+
 */

/**
 * Format a number with thousands separators
 * @param {number} value
 * @returns {string}
 */
export function formatNumber(value) {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format steps with K suffix
 */
export function formatSteps(steps) {
  if (steps >= 1000) return `${(steps / 1000).toFixed(1)}k`;
  return formatNumber(steps);
}

/**
 * Format calories
 */
export function formatCalories(cal) {
  return `${formatNumber(cal)} kcal`;
}

/**
 * Format a percentage
 */
export function formatPercent(value, decimals = 0) {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format duration in minutes to human-readable
 */
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Format a date object or string to "Mon, Apr 11"
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr  = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60)  return 'just now';
  if (diffMin < 60)  return `${diffMin}m ago`;
  if (diffHr  < 24)  return `${diffHr}h ago`;
  if (diffDay < 7)   return `${diffDay}d ago`;
  return formatDate(date);
}

/**
 * Format time (HH:MM)
 */
export function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

/**
 * Format sleep hours, e.g. 7.5 -> "7h 30m"
 */
export function formatSleep(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Get wellness score color based on value
 */
export function getScoreColor(score) {
  if (score >= 80) return 'var(--c-teal)';
  if (score >= 65) return 'var(--c-blue)';
  if (score >= 50) return 'var(--c-yellow)';
  return 'var(--c-red)';
}

/**
 * Get wellness score label
 */
export function getScoreLabel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Attention';
}

/**
 * Clamp a number between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
