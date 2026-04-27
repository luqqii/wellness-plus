/**
 * useWeather.js
 *
 * Fetches REAL weather data for the user's current GPS location
 * using the Open-Meteo API (free, no API key required).
 * - Requests geolocation directly (doesn't wait for metricsStore)
 * - Resolves city name via reverse geocoding (Nominatim, free)
 * - Updates liveSensors.weather in metricsStore
 * - Refreshes every 15 minutes
 */

import { useEffect, useRef } from 'react';
import useMetricsStore from '../store/metricsStore';

const WMO_CODES = {
  0:  { label: 'Clear Sky',             icon: '☀️',  type: 'clear' },
  1:  { label: 'Mainly Clear',           icon: '🌤️', type: 'clear' },
  2:  { label: 'Partly Cloudy',          icon: '⛅',  type: 'cloudy' },
  3:  { label: 'Overcast',               icon: '☁️',  type: 'cloudy' },
  45: { label: 'Foggy',                  icon: '🌫️', type: 'fog' },
  48: { label: 'Icy Fog',                icon: '🌫️', type: 'fog' },
  51: { label: 'Light Drizzle',          icon: '🌦️', type: 'rain' },
  53: { label: 'Drizzle',                icon: '🌦️', type: 'rain' },
  55: { label: 'Heavy Drizzle',          icon: '🌧️', type: 'rain' },
  61: { label: 'Light Rain',             icon: '🌧️', type: 'rain' },
  63: { label: 'Rain',                   icon: '🌧️', type: 'rain' },
  65: { label: 'Heavy Rain',             icon: '🌧️', type: 'rain' },
  71: { label: 'Light Snow',             icon: '🌨️', type: 'snow' },
  73: { label: 'Snow',                   icon: '❄️',  type: 'snow' },
  75: { label: 'Heavy Snow',             icon: '❄️',  type: 'snow' },
  80: { label: 'Rain Showers',           icon: '🌦️', type: 'rain' },
  81: { label: 'Showers',                icon: '🌧️', type: 'rain' },
  82: { label: 'Violent Showers',        icon: '⛈️', type: 'storm' },
  95: { label: 'Thunderstorm',           icon: '⛈️', type: 'storm' },
  96: { label: 'Thunderstorm w/ Hail',   icon: '⛈️', type: 'storm' },
  99: { label: 'Thunderstorm + Hail',    icon: '⛈️', type: 'storm' },
};

/** Outdoor exercise suitability based on weather type */
export const getOutdoorSuitability = (weather) => {
  if (!weather) return null;
  const map = {
    clear:  { label: 'Great for Outdoors', color: '#22C55E', score: 5 },
    cloudy: { label: 'Good for Outdoors',  color: '#14B8A6', score: 4 },
    fog:    { label: 'Exercise with Care', color: '#F59E0B', score: 3 },
    rain:   { label: 'Better Indoors',     color: '#EC5A42', score: 2 },
    snow:   { label: 'Stay Warm Indoors',  color: '#8B5CF6', score: 1 },
    storm:  { label: 'Stay Indoors!',      color: '#EF4444', score: 0 },
  };
  return map[weather.type] || map.cloudy;
};

async function fetchCityName(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      null
    );
  } catch {
    return null;
  }
}

async function fetchWeatherData(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,` +
    `weather_code,wind_speed_10m,precipitation,uv_index` +
    `&timezone=auto&forecast_days=1`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather API error');
  return res.json();
}

export default function useWeather() {
  const updateLiveSensors = useMetricsStore(s => s.updateLiveSensors);
  const intervalRef = useRef(null);
  const coordsRef   = useRef(null);

  const loadWeather = async (lat, lon) => {
    try {
      const [data, city] = await Promise.all([
        fetchWeatherData(lat, lon),
        fetchCityName(lat, lon),
      ]);

      const c   = data.current;
      const wmo = WMO_CODES[c.weather_code] ?? { label: 'Unknown', icon: '🌡️', type: 'clear' };

      updateLiveSensors({
        weather: {
          temp:        Math.round(c.temperature_2m),
          feelsLike:   Math.round(c.apparent_temperature),
          humidity:    c.relative_humidity_2m,
          windSpeed:   Math.round(c.wind_speed_10m),
          precipitation: c.precipitation,
          uvIndex:     c.uv_index ?? null,
          condition:   wmo.label,
          icon:        wmo.icon,
          type:        wmo.type,
          city:        city,
          fetchedAt:   new Date().toISOString(),
        },
      });
    } catch (err) {
      console.warn('[Weather] Fetch failed:', err.message);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) return;

    // Request location directly — do not wait for metricsStore.location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        coordsRef.current = { latitude, longitude };

        // Also update location in the store so other consumers get it
        updateLiveSensors({ location: { latitude, longitude, altitude: pos.coords.altitude ?? null } });

        // Immediate fetch
        loadWeather(latitude, longitude);

        // Refresh every 15 minutes
        intervalRef.current = setInterval(() => {
          const { latitude: lat, longitude: lon } = coordsRef.current;
          loadWeather(lat, lon);
        }, 15 * 60 * 1000);
      },
      (err) => {
        console.warn('[Weather] Geolocation denied or unavailable:', err.message);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
