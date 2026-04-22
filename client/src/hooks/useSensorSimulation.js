import { useEffect, useRef } from 'react';
import useMetricsStore from '../store/metricsStore';

export default function useSensorSimulation() {
  const updateLiveSensors = useMetricsStore(s => s.updateLiveSensors);
  const liveSensors = useMetricsStore(s => s.liveSensors);
  
  const simulationRef = useRef(null);

  useEffect(() => {
    // Start sensor simulation loop
    simulationRef.current = setInterval(() => {
      // Create slight variations in heart rate (e.g. resting ~70, working out ~120)
      const isWorkingOut = liveSensors.isWorkoutActive;
      const baseHR = isWorkingOut ? 120 : 70;
      const hrFluctuation = Math.floor(Math.random() * 6) - 3; // -3 to +3
      const newHR = Math.max(50, Math.min(200, baseHR + hrFluctuation));

      // Increment steps if walking/moving (simulated randomly)
      // 30% chance to take a few steps every 2 seconds
      let newSteps = liveSensors.steps;
      let newCalories = liveSensors.activeCalories;
      
      if (isWorkingOut || Math.random() > 0.7) {
        const addedSteps = isWorkingOut ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 3) + 1;
        newSteps += addedSteps;
        // 1 step ~= 0.04 calories
        newCalories += (addedSteps * 0.04);
      }

      // Simulate stress level changes sporadically
      let newStress = liveSensors.stressLevel;
      if (Math.random() > 0.95) { // 5% chance every 2 sec to shift stress
        newStress = Math.max(1, Math.min(10, newStress + (Math.random() > 0.5 ? 1 : -1)));
      }

      updateLiveSensors({
        heartRate: newHR,
        steps: newSteps,
        activeCalories: newCalories,
        stressLevel: newStress
      });

    }, 2000); // Update every 2 seconds

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
    };
  }, [liveSensors.isWorkoutActive, updateLiveSensors]); // Depend on workout state

  return null; // This is a headless hook
}
