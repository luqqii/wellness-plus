import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * useMetrics — Hook to fetch and manage user daily metrics
 */
export function useMetrics() {
  const [today, setToday] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch today's summary
      const resToday = await api.get('/metrics');
      
      // 2. Fetch weekly trend (7 days)
      const resWeekly = await api.get('/metrics/trend?days=7');

      setToday(resToday?.data || resToday || null);
      setWeekly(Array.isArray(resWeekly?.data) ? resWeekly.data : (Array.isArray(resWeekly) ? resWeekly : []));
    } catch (err) {
      console.error('Failed to fetch metrics', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Listen for manual log updates
    const handleUpdate = () => fetchData();
    window.addEventListener('metrics-updated', handleUpdate);
    return () => window.removeEventListener('metrics-updated', handleUpdate);
  }, [fetchData]);

  return {
    today,
    weekly,
    loading,
    error,
    refresh: fetchData
  };
}

export default useMetrics;
