import { useEffect } from 'react';
import api from '../services/api';
import useMetricsStore from '../store/metricsStore';

/**
 * useMetrics — Hook to fetch and manage user daily metrics via global store
 */
export function useMetrics() {
  const { 
    todayMetrics: today, 
    weeklyTrend: weekly, 
    isLoading: loading, 
    error, 
    fetchData 
  } = useMetricsStore();

  useEffect(() => {
    // Initial fetch
    fetchData(api);
    
    // Listen for manual log updates from any tab
    const handleUpdate = () => fetchData(api);
    window.addEventListener('metrics-updated', handleUpdate);
    return () => window.removeEventListener('metrics-updated', handleUpdate);
  }, [fetchData]);

  return {
    today,
    weekly,
    loading,
    error,
    refresh: () => fetchData(api)
  };
}

export default useMetrics;
