import { useMemo } from 'react';
import useMetricsStore from '../store/metricsStore';
import { getScoreColor, getScoreLabel } from '../utils/formatters';

/**
 * useWellnessScore — derived wellness score data from metrics store
 */
export function useWellnessScore() {
  const { todayMetrics, weeklyTrend } = useMetricsStore();
  const score = todayMetrics?.wellnessScore ?? 0;

  const scoreData = useMemo(() => {
    const color = getScoreColor(score);
    const label = getScoreLabel(score);

    // Calculate trend (compare today with yesterday)
    const weekly = weeklyTrend || [];
    const prev = weekly.length > 1 ? weekly[weekly.length - 2]?.score : score;
    const delta = score - prev;

    // Factor breakdown (mock weights for now, will be dynamic from backend)
    const factors = [
      { label: 'Activity',  value: Math.min(100, (todayMetrics.steps / (todayMetrics.stepGoal || 10000)) * 100), color: 'var(--c-blue)' },
      { label: 'Sleep',     value: Math.min(100, (todayMetrics.sleep?.hours / 8) * 100), color: 'var(--c-purple)' },
      { label: 'Stress',    value: Math.max(0, 100 - (todayMetrics.stressLevel - 1) * 12.5), color: 'var(--c-teal)' },
      { label: 'Nutrition', value: Math.min(100, (todayMetrics.nutrition?.calories / (todayMetrics.nutrition?.calorieGoal || 2100)) * 100), color: 'var(--c-orange)' },
    ];

    return { score, color, label, delta, factors };
  }, [score, todayMetrics, weeklyTrend]);

  return scoreData;
}

export default useWellnessScore;
