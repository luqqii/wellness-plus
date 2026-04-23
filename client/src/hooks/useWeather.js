/**
 * useWeather.js
 * 
 * Fetches REAL weather data for the user's current GPS location
 * using the Open-Meteo API (free, no API key required).
 * Updates every 15 minutes.
 */

import { useEffect, useRef } from 'react';
import useMetricsStore from '../store/metricsStore';

const WMO_CODES = {
  0: { label: 'Clear Sky', icon: '☀️', type: 'clear' },
  1: { label: 'Mainly Clear', icon: '🌤️', type: 'clear' },
  2: { label: 'Partly Cloudy', icon: '⛅', type: 'cloudy' },
  3: { label: 'Overcast', icon: '☁️', type: 'cloudy' },
  45: { label: 'Foggy', icon: '🌫️', type: 'fog' },
  48: { label: 'Icy Fog', icon: '🌫️', type: 'fog' },
  51: { label: 'Light Drizzle', icon: '🌦️', type: 'rain' },
  53: { label: 'Drizzle', icon: '🌦️', type: 'rain' },
  55: { label: 'Heavy Drizzle', icon: '🌧️', type: 'rain' },
  61: { label: 'Light Rain', icon: '🌧️', type: 'rain' },
  63: { label: 'Rain', icon: '🌧️', type: 'rain' },
  65: { label: 'Heavy Rain', icon: '🌧️', type: 'rain' },
  71: { label: 'Light Snow', icon: '🌨️', type: 'snow' },
  73: { label: 'Snow', icon: '❄️', type: 'snow' },
  75: { label: 'Heavy Snow', icon: '❄️', type: 'snow' },
  80: { label: 'Rain Showers', icon: '🌦️', type: 'rain' },
  81: { label: 'Showers', icon: '🌧️', type: 'rain' },
  82: { label: 'Violent Showers', icon: '⛈️', type: 'storm' },
  95: { label: 'Thunderstorm', icon: '⛈️', type: 'storm' },
  96: { label: 'Thunderstorm w/ Hail', icon: '⛈️', type: 'storm' },
  99: { label: 'Thunderstorm w/ Heavy Hail', icon: '⛈️', type: 'storm' },
};

export default function useWeather() {
  const updateLiveSensors = useMetricsStore(s => s.updateLiveSensors);
  const liveSensors = useMetricsStore(s => s.liveSensors);
  const timerRef = useRef(null);

  const fetchWeather = async (lat, lon) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation&timezone=auto&forecast_days=1`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      const c = data.current;
      const wmo = WMO_CODES[c.weather_code] || { label: 'Unknown', icon: '🌡️', type: 'clear' };

      updateLiveSensors({
        weather: {
          temp: Math.round(c.temperature_2m),
          feelsLike: Math.round(c.apparent_temperature),
          humidity: c.relative_humidity_2m,
          windSpeed: Math.round(c.wind_speed_10m),
          precipitation: c.precipitation,
          condition: wmo.label,
          icon: wmo.icon,
          type: wmo.type,
          fetchedAt: new Date().toISOString(),
        }
      });
    } catch (err) {
      console.warn('[Weather] Fetch failed:', err.message);
    }
  };

  useEffect(() => {
    // Wait for GPS location, then fetch weather
    const tryFetch = () => {
      const loc = useMetricsStore.getState().liveSensors.location;
      if (loc?.latitude && loc?.longitude) {
        fetchWeather(loc.latitude, loc.longitude);
        clearInterval(timerRef.current);
        // Refresh every 15 minutes
        timerRef.current = setInterval(() => {
          const updated = useMetricsStore.getState().liveSensors.location;
          if (updated?.latitude) fetchWeather(updated.latitude, updated.longitude);
        }, 15 * 60 * 1000);
      }
    };

    // Poll until location is available (GPS may take a few seconds)
    const locationPoller = setInterval(tryFetch, 3000);
    tryFetch(); // immediate attempt

    return () => {
      clearInterval(locationPoller);
      clearInterval(timerRef.current);
    };
  }, []); // eslint-disable-line

  return null;
}
