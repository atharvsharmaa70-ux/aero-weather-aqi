import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { getWeatherInterpretation } from '../utils/aqiUtils';

export function WeatherHero({
  weatherData,
  currentLocation,
  themeConfig,
  unit,
  onToggleUnit,
}) {
  const current = weatherData?.current || {};
  const daily = weatherData?.daily || {};

  const isDay = current.is_day ?? 1;
  const weatherCode = current.weather_code ?? 0;
  const weatherInfo = getWeatherInterpretation(weatherCode, isDay);

  const rawTemp = current.temperature_2m ?? 24;
  const rawFeels = current.apparent_temperature ?? 25;
  const rawMax = daily.temperature_2m_max?.[0] ?? rawTemp + 4;
  const rawMin = daily.temperature_2m_min?.[0] ?? rawTemp - 4;

  const toF = (c) => Math.round((c * 9) / 5 + 32);
  const formatTemp = (c) => (unit === 'F' ? `${toF(c)}°F` : `${Math.round(c)}°C`);

  const renderWeatherIcon = (iconName) => {
    const props = { className: 'w-16 h-16 sm:w-20 sm:h-20 drop-shadow-xl' };
    switch (iconName) {
      case 'Sun':
        return <Sun {...props} className={`${props.className} text-amber-400 animate-[spin_24s_linear_infinite]`} />;
      case 'Moon':
        return <Moon {...props} className={`${props.className} text-sky-200 animate-pulse`} />;
      case 'CloudSun':
        return <CloudSun {...props} className={`${props.className} text-amber-300`} />;
      case 'CloudMoon':
        return <CloudMoon {...props} className={`${props.className} text-sky-300`} />;
      case 'CloudFog':
        return <CloudFog {...props} className={`${props.className} text-slate-300`} />;
      case 'CloudDrizzle':
        return <CloudDrizzle {...props} className={`${props.className} text-sky-300`} />;
      case 'CloudRain':
        return <CloudRain {...props} className={`${props.className} text-blue-400 animate-bounce`} />;
      case 'CloudRainWind':
        return <CloudRainWind {...props} className={`${props.className} text-blue-500`} />;
      case 'CloudSnow':
        return <CloudSnow {...props} className={`${props.className} text-sky-100 animate-pulse`} />;
      case 'CloudLightning':
        return <CloudLightning {...props} className={`${props.className} text-amber-300`} />;
      default:
        return <Cloud {...props} className={`${props.className} text-sky-200`} />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all relative overflow-hidden ${themeConfig.cardBg}`}>
        
        {/* Ambient background accent orb */}
        <div className={`absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          themeConfig.isDay ? 'bg-sky-400/25' : 'bg-blue-600/20'
        }`} />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Main Temp & Location */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7">
            <div className="p-3.5 rounded-2xl bg-white/20 dark:bg-slate-800/40 backdrop-blur-md shadow-inner border border-white/30 dark:border-white/5">
              {renderWeatherIcon(weatherInfo.iconName)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-wide uppercase opacity-75">
                  {currentLocation?.country || 'Current Forecast'}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${themeConfig.badgeColor}`}>
                  {themeConfig.isDay ? '☀️ Daytime' : '🌙 Nighttime'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-0.5">
                {currentLocation?.name}
              </h2>

              <p className="text-sm sm:text-base font-medium opacity-85 mt-1">
                {weatherInfo.description}
              </p>

              <div className="flex items-center gap-3 mt-2 text-xs font-semibold opacity-75">
                <span className="flex items-center gap-0.5">
                  <ArrowUp className="w-3.5 h-3.5 text-rose-500" /> High: {formatTemp(rawMax)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <ArrowDown className="w-3.5 h-3.5 text-sky-500" /> Low: {formatTemp(rawMin)}
                </span>
              </div>
            </div>
          </div>

          {/* Large Temperature Display & Unit Switcher */}
          <div className="flex flex-row lg:flex-col items-baseline lg:items-end justify-between w-full lg:w-auto gap-3">
            <div className="flex items-start">
              <span className="text-6xl sm:text-7xl font-black tracking-tighter leading-none">
                {unit === 'F' ? toF(rawTemp) : Math.round(rawTemp)}
              </span>
              <div className="flex items-center ml-2 border rounded-xl overflow-hidden text-xs font-bold shadow-sm backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => onToggleUnit('C')}
                  className={`px-2.5 py-1 transition-all ${
                    unit === 'C'
                      ? themeConfig.activeTabClass
                      : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  °C
                </button>
                <button
                  type="button"
                  onClick={() => onToggleUnit('F')}
                  className={`px-2.5 py-1 transition-all ${
                    unit === 'F'
                      ? themeConfig.activeTabClass
                      : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  °F
                </button>
              </div>
            </div>

            <div className="text-xs sm:text-sm font-medium opacity-75">
              Feels like <span className="font-bold">{formatTemp(rawFeels)}</span>
            </div>
          </div>

        </div>

        {/* Quick Weather Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-inherit">
          <div className={`p-3 rounded-2xl flex items-center gap-3 ${themeConfig.innerCardBg}`}>
            <Droplets className="w-5 h-5 text-sky-500 shrink-0" />
            <div>
              <p className="text-[11px] font-semibold uppercase opacity-70">Humidity</p>
              <p className="text-sm font-bold">{current.relative_humidity_2m ?? 50}%</p>
            </div>
          </div>

          <div className={`p-3 rounded-2xl flex items-center gap-3 ${themeConfig.innerCardBg}`}>
            <Wind className="w-5 h-5 text-teal-500 shrink-0" />
            <div>
              <p className="text-[11px] font-semibold uppercase opacity-70">Wind Speed</p>
              <p className="text-sm font-bold">{current.wind_speed_10m ?? 0} km/h</p>
            </div>
          </div>

          <div className={`p-3 rounded-2xl flex items-center gap-3 ${themeConfig.innerCardBg}`}>
            <Compass className="w-5 h-5 text-indigo-500 shrink-0" />
            <div>
              <p className="text-[11px] font-semibold uppercase opacity-70">Wind Angle</p>
              <p className="text-sm font-bold">{current.wind_direction_10m ?? 0}°</p>
            </div>
          </div>

          <div className={`p-3 rounded-2xl flex items-center gap-3 ${themeConfig.innerCardBg}`}>
            <Thermometer className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-[11px] font-semibold uppercase opacity-70">Precipitation</p>
              <p className="text-sm font-bold">{current.precipitation ?? 0} mm</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
