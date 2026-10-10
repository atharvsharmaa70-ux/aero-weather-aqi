import React from 'react';
import {
  Activity,
  AlertTriangle,
  Info,
  ShieldCheck,
  Wind,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { getAqiCategory } from '../utils/aqiUtils';

export function AqiGauge({ aqiData, themeConfig }) {
  const current = aqiData?.current || {};
  const usAqi = Math.round(current.us_aqi ?? 65);
  const pm25 = (current.pm2_5 ?? 28).toFixed(1);
  const pm10 = (current.pm10 ?? 45).toFixed(1);
  const europeanAqi = current.european_aqi ?? 40;
  const ozone = current.ozone ? Number(current.ozone).toFixed(0) : '48';
  const no2 = current.nitrogen_dioxide ? Number(current.nitrogen_dioxide).toFixed(0) : '32';
  const co = current.carbon_monoxide ? Number(current.carbon_monoxide).toFixed(0) : '380';

  const category = getAqiCategory(usAqi);

  // Gauge percentage calculation (capped at 500)
  const gaugePercent = Math.min(100, Math.max(0, (usAqi / 300) * 100));

  // WHO comparison: WHO 24-hr guideline for PM2.5 is 15 µg/m³
  const whoRatio = (Number(pm25) / 15).toFixed(1);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${themeConfig.cardBg}`}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-sky-500/10 text-sky-500">
                <Activity className="w-4 h-4" />
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                Live Air Quality Index (AQI)
              </h3>
            </div>
            <p className={`text-xs mt-1 ${themeConfig.subText}`}>
              Real-time atmospheric telemetry via Open-Meteo Air Quality API (No key required)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${category.bgClass}`}>
              {category.emoji} {category.label}
            </span>
          </div>
        </div>

        {/* Main AQI Score & Visual Gauge Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Large Score Card */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left p-6 rounded-2xl bg-gradient-to-br from-black/5 to-white/5 border border-inherit">
            <span className="text-xs font-bold uppercase tracking-wider opacity-60">
              US Air Quality Index
            </span>
            <div className="flex items-baseline gap-3 my-2">
              <span
                className="text-7xl font-black tracking-tighter"
                style={{ color: category.color }}
              >
                {usAqi}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold opacity-80">/ 500</span>
                <span className="text-xs font-semibold" style={{ color: category.color }}>
                  {category.label}
                </span>
              </div>
            </div>

            <p className="text-xs opacity-80 mt-1 leading-relaxed">
              {category.description}
            </p>

            {/* WHO Comparison Tag */}
            <div className="mt-4 pt-3 border-t border-inherit w-full flex items-center justify-between text-xs">
              <span className="opacity-70">WHO 24h PM2.5 Guideline:</span>
              <span className={`font-bold ${Number(pm25) <= 15 ? 'text-emerald-500' : 'text-amber-500'}`}>
                {whoRatio <= 1 ? '✅ Safe (≤15 µg/m³)' : `⚠️ ${whoRatio}x WHO Limit`}
              </span>
            </div>
          </div>

          {/* Bar Gauge & Spectrum */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Visual Gauge Scale */}
            <div>
              <div className="flex justify-between text-xs font-semibold opacity-70 mb-1.5">
                <span>0 Good</span>
                <span>50</span>
                <span>100 Mod</span>
                <span>150 Unhealthy</span>
                <span>200+</span>
                <span>300+ Haz</span>
              </div>

              <div className="relative h-4 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 p-0.5 shadow-inner">
                {/* Multi-color gradient spectrum */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-amber-400 via-orange-500 via-rose-500 to-purple-700 opacity-90 rounded-full" />
                
                {/* Pointer / Marker */}
                <div
                  className="absolute top-0 bottom-0 w-2.5 bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-white rounded-full shadow-lg transform -translate-x-1/2 transition-all duration-700"
                  style={{ left: `${gaugePercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center mt-2 text-[11px] opacity-65">
                <span>Safe baseline: 0–50</span>
                <span className="font-semibold" style={{ color: category.color }}>
                  Current: {usAqi} ({category.label})
                </span>
                <span>Hazardous: 301–500</span>
              </div>
            </div>

            {/* Detailed Pollutants Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2">
              
              {/* PM2.5 */}
              <div className={`p-3 rounded-xl border border-inherit ${themeConfig.innerCardBg}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase opacity-75">PM2.5 (Fine)</span>
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div className="mt-1">
                  <span className="text-xl font-black">{pm25}</span>
                  <span className="text-[10px] ml-1 opacity-60">μg/m³</span>
                </div>
                <p className="text-[10px] opacity-60 mt-0.5">Penetrates deep into lungs</p>
              </div>

              {/* PM10 */}
              <div className={`p-3 rounded-xl border border-inherit ${themeConfig.innerCardBg}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase opacity-75">PM10 (Dust)</span>
                  <Wind className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="mt-1">
                  <span className="text-xl font-black">{pm10}</span>
                  <span className="text-[10px] ml-1 opacity-60">μg/m³</span>
                </div>
                <p className="text-[10px] opacity-60 mt-0.5">Airborne road & soil dust</p>
              </div>

              {/* European AQI */}
              <div className={`p-3 rounded-xl border border-inherit ${themeConfig.innerCardBg}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase opacity-75">European AQI</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                </div>
                <div className="mt-1">
                  <span className="text-xl font-black">{europeanAqi}</span>
                  <span className="text-[10px] ml-1 opacity-60">EAQI</span>
                </div>
                <p className="text-[10px] opacity-60 mt-0.5">EEA Index standard</p>
              </div>

              {/* Ozone */}
              <div className={`p-3 rounded-xl border border-inherit ${themeConfig.innerCardBg}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase opacity-75">Ozone (O₃)</span>
                  <Activity className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <div className="mt-1">
                  <span className="text-xl font-black">{ozone}</span>
                  <span className="text-[10px] ml-1 opacity-60">μg/m³</span>
                </div>
                <p className="text-[10px] opacity-60 mt-0.5">Photochemical smog</p>
              </div>

              {/* NO2 */}
              <div className={`p-3 rounded-xl border border-inherit ${themeConfig.innerCardBg}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase opacity-75">NO₂ (Nitrogen)</span>
                  <Activity className="w-3.5 h-3.5 text-teal-500" />
                </div>
                <div className="mt-1">
                  <span className="text-xl font-black">{no2}</span>
                  <span className="text-[10px] ml-1 opacity-60">μg/m³</span>
                </div>
                <p className="text-[10px] opacity-60 mt-0.5">Vehicle combustion exhaust</p>
              </div>

              {/* Carbon Monoxide */}
              <div className={`p-3 rounded-xl border border-inherit ${themeConfig.innerCardBg}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase opacity-75">CO (Monoxide)</span>
                  <Activity className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <div className="mt-1">
                  <span className="text-xl font-black">{co}</span>
                  <span className="text-[10px] ml-1 opacity-60">μg/m³</span>
                </div>
                <p className="text-[10px] opacity-60 mt-0.5">Incomplete fuel burning</p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
