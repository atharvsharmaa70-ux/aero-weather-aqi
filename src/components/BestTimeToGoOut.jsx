import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Sun,
  Moon,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { calculateBestTimeToGoOut, getAqiCategory } from '../utils/aqiUtils';

export function BestTimeToGoOut({ aqiData, weatherData, themeConfig }) {
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Merge hourly AQI data
  const hourlyData = aqiData?.hourly;
  const analysis = calculateBestTimeToGoOut(hourlyData);

  if (!analysis) {
    return null;
  }

  const {
    bestPoint,
    worstPoint,
    windowRange,
    bestAqi,
    bestCategory,
    worstAqi,
    worstCategory,
    worstHour,
    advice,
    points,
  } = analysis;

  const activePoint = selectedPoint || bestPoint;
  const activeCategory = getAqiCategory(activePoint.aqi);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${themeConfig.cardBg}`}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Clock className="w-4 h-4" />
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                24-Hour AQI Forecast & Best Time To Go Out
              </h3>
            </div>
            <p className={`text-xs mt-1 ${themeConfig.subText}`}>
              Predictive window analysis based on Open-Meteo hourly atmospheric dispersion
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Optimal: {windowRange}
            </span>
          </div>
        </div>

        {/* Highlight Insights Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Best Window Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  Recommended Time
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {bestCategory.label}
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold mt-1">
                {windowRange} (Best: {bestPoint.formattedHour})
              </h4>
              <p className="text-xs opacity-75 mt-0.5">
                Lowest pollution index: <strong className="text-emerald-600 dark:text-emerald-300 font-bold">AQI {bestAqi}</strong> (PM2.5 {bestPoint.pm25.toFixed(1)} μg/m³).
                Ideal for walking, sports training, and opening room windows.
              </p>
            </div>
          </div>

          {/* Worst Window to Avoid */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-amber-500/5 border border-rose-500/20 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-rose-500 text-white shadow-md shadow-rose-500/30 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-700 dark:text-rose-300">
                  Peak Risk Window
                </span>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  {worstCategory.label}
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold mt-1">
                Around {worstHour} (Peak AQI {worstAqi})
              </h4>
              <p className="text-xs opacity-75 mt-0.5">
                Elevated stagnant pollution. Avoid vigorous running or aerobic outdoor activities during this interval.
              </p>
            </div>
          </div>

        </div>

        {/* Hourly Interactive Timeline Bar Chart */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold opacity-70">
              Hourly Progression (Next 24 Hours) — Hover/Click a bar to inspect:
            </span>
            <div className="text-xs font-bold flex items-center gap-2">
              <span>{activePoint.formattedHour}:</span>
              <span style={{ color: activeCategory.color }}>
                AQI {activePoint.aqi} ({activeCategory.label})
              </span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-end gap-1.5 sm:gap-2 h-44 pt-6 px-1 min-w-[700px]">
              {points.map((pt, idx) => {
                const cat = getAqiCategory(pt.aqi);
                const isBest = pt.time.getTime() === bestPoint.time.getTime();
                const isWorst = pt.time.getTime() === worstPoint.time.getTime();
                const isSelected = selectedPoint && selectedPoint.time.getTime() === pt.time.getTime();

                // Height scaled between 25% and 100%
                const barHeight = Math.min(100, Math.max(22, (pt.aqi / 250) * 100));

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedPoint(pt)}
                    onMouseEnter={() => setSelectedPoint(pt)}
                    className="flex-1 flex flex-col items-center group cursor-pointer transition-all"
                  >
                    {/* Floating label for best/worst */}
                    <div className="h-5 flex items-center justify-center">
                      {isBest && (
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/15 px-1 rounded uppercase tracking-tighter">
                          Best
                        </span>
                      )}
                      {isWorst && (
                        <span className="text-[10px] font-black text-rose-500 bg-rose-500/15 px-1 rounded uppercase tracking-tighter">
                          Peak
                        </span>
                      )}
                    </div>

                    {/* Bar */}
                    <div className="w-full flex items-end justify-center h-28 relative">
                      <div
                        className={`w-full max-w-[24px] rounded-t-lg transition-all duration-300 relative ${
                          isSelected ? 'ring-2 ring-white shadow-lg' : 'opacity-85 group-hover:opacity-100 group-hover:scale-y-105'
                        }`}
                        style={{
                          height: `${barHeight}%`,
                          backgroundColor: cat.color,
                        }}
                      >
                        {/* Number on top */}
                        <span className="hidden group-hover:block absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-1 rounded bg-black/80 text-white whitespace-nowrap z-20">
                          {pt.aqi}
                        </span>
                      </div>
                    </div>

                    {/* Hour label */}
                    <span className={`text-[10px] font-semibold mt-1 transition-colors ${
                      isBest ? 'text-emerald-500 font-bold' : 'opacity-60'
                    }`}>
                      {pt.hour % 3 === 0 ? pt.formattedHour : '·'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-inherit text-xs opacity-80 flex items-center gap-2">
            <span className="text-base">💡</span>
            <span>{advice}</span>
          </div>

        </div>

      </div>
    </div>
  );
}
