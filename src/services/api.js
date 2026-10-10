/**
 * Open-Meteo Weather & Air Quality API Service
 * No API key or signup required!
 */

const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const AQI_BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(
      `${GEOCODING_BASE_URL}?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`
    );
    if (!res.ok) throw new Error('Geocoding search failed');
    const data = await res.json();
    if (!data.results) return [];
    return data.results.map((item) => ({
      name: item.name,
      admin1: item.admin1 || '',
      country: item.country || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone,
    }));
  } catch (err) {
    console.error('Location search error:', err);
    return [];
  }
}

export async function fetchWeatherAndAqi(latitude, longitude) {
  try {
    const weatherParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
      hourly: 'temperature_2m,weather_code,is_day,relative_humidity_2m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset',
      timezone: 'auto',
      forecast_days: '2',
    });

    const aqiParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: 'us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
      hourly: 'us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide',
      timezone: 'auto',
      forecast_days: '2',
    });

    const [weatherRes, aqiRes] = await Promise.all([
      fetch(`${WEATHER_BASE_URL}?${weatherParams.toString()}`),
      fetch(`${AQI_BASE_URL}?${aqiParams.toString()}`),
    ]);

    if (!weatherRes.ok || !aqiRes.ok) {
      throw new Error(`API responded with status: weather=${weatherRes.status}, aqi=${aqiRes.status}`);
    }

    const weatherData = await weatherRes.json();
    const aqiData = await aqiRes.json();

    return {
      weather: weatherData,
      aqi: aqiData,
      timestamp: new Date().toISOString(),
      isLive: true,
    };
  } catch (error) {
    console.warn('Network error or Open-Meteo downtime. Falling back to cached/demo payload:', error);
    return getFallbackData(latitude, longitude);
  }
}

function getFallbackData(latitude, longitude) {
  const isNight = false;
  return {
    isLive: false,
    timestamp: new Date().toISOString(),
    weather: {
      current: {
        temperature_2m: 27.5,
        relative_humidity_2m: 54,
        apparent_temperature: 29.1,
        is_day: isNight ? 0 : 1,
        precipitation: 0.0,
        weather_code: 1,
        wind_speed_10m: 8.5,
        wind_direction_10m: 140,
      },
      hourly: {
        time: Array.from({ length: 24 }, (_, i) => {
          const d = new Date();
          d.setHours(d.getHours() + i, 0, 0, 0);
          return d.toISOString();
        }),
        temperature_2m: Array.from({ length: 24 }, (_, i) => 24 + Math.sin(i / 3) * 6),
        weather_code: Array.from({ length: 24 }, () => 1),
        is_day: Array.from({ length: 24 }, (_, i) => ((i >= 6 && i <= 18) ? 1 : 0)),
      },
      daily: {
        temperature_2m_max: [31.0, 30.5],
        temperature_2m_min: [21.0, 20.2],
        weather_code: [1, 2],
      },
    },
    aqi: {
      current: {
        us_aqi: 142,
        european_aqi: 75,
        pm2_5: 68.4,
        pm10: 112.0,
        carbon_monoxide: 450,
        nitrogen_dioxide: 42,
        sulphur_dioxide: 8.2,
        ozone: 55,
      },
      hourly: {
        time: Array.from({ length: 24 }, (_, i) => {
          const d = new Date();
          d.setHours(d.getHours() + i, 0, 0, 0);
          return d.toISOString();
        }),
        us_aqi: [
          142, 148, 155, 162, 170, 150, 120, 95, 75, 55, 48, 42,
          50, 65, 80, 105, 130, 158, 185, 192, 180, 165, 150, 140
        ],
        pm2_5: [
          68, 72, 78, 85, 90, 75, 58, 42, 30, 22, 18, 15,
          19, 26, 35, 49, 62, 79, 95, 98, 92, 81, 72, 65
        ],
        pm10: [
          112, 120, 130, 140, 150, 125, 98, 70, 52, 38, 30, 26,
          32, 45, 60, 85, 110, 138, 160, 165, 155, 135, 120, 110
        ],
      },
    },
  };
}
