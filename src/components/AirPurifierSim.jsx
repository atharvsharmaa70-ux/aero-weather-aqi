import React, { useState, useEffect } from 'react';
import {
  Power,
  Fan,
  Wind,
  ShieldCheck,
  Wifi,
  Sparkles,
  Sliders,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export function AirPurifierSim({ outdoorPm25 = 65, themeConfig }) {
  const [isOn, setIsOn] = useState(true);
  const [speed, setSpeed] = useState('auto'); // auto, quiet, medium, turbo
  const [autoSync, setAutoSync] = useState(true);
  const [filterLife, setFilterLife] = useState(84);
  const [indoorPm25, setIndoorPm25] = useState(12.4);

  // Dynamic simulation of indoor air quality based on purifier state and speed
  useEffect(() => {
    const interval = setInterval(() => {
      setIndoorPm25((prev) => {
        if (!isOn) {
          // Drifts upward toward outdoor PM2.5
          const target = Math.min(outdoorPm25 * 0.8, 90);
          const next = prev + (target - prev) * 0.08 + (Math.random() * 0.5 - 0.2);
          return Math.max(8, Number(next.toFixed(1)));
        } else {
          // Drops down toward clean air target (speed affects how clean)
          let target = 11.0;
          if (speed === 'turbo') target = 6.5;
          if (speed === 'quiet') target = 15.0;
          if (speed === 'medium') target = 10.0;
          if (speed === 'auto') target = 8.5;

          const next = prev + (target - prev) * 0.12 + (Math.random() * 0.3 - 0.15);
          return Math.max(5, Number(next.toFixed(1)));
        }
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isOn, speed, outdoorPm25]);

  // Auto clean mode responds to outdoor PM2.5
  useEffect(() => {
    if (autoSync && outdoorPm25 > 50 && !isOn) {
      setIsOn(true);
      setSpeed('turbo');
    }
  }, [autoSync, outdoorPm25, isOn]);

  const getIndoorQualityBadge = (pm) => {
    if (pm <= 12) {
      return {
        label: 'Pure (HEPA Filtered)',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/15 border-emerald-500/30',
      };
    }
    if (pm <= 35) {
      return {
        label: 'Acceptable',
        color: 'text-amber-500',
        bg: 'bg-amber-500/15 border-amber-500/30',
      };
    }
    return {
      label: 'Stale / Needs Purifying',
      color: 'text-rose-500',
      bg: 'bg-rose-500/15 border-rose-500/30',
    };
  };

  const indoorBadge = getIndoorQualityBadge(indoorPm25);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${themeConfig.cardBg}`}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-500">
                <Wind className="w-4 h-4" />
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                Smart Air Purifier Control
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                Connected Look (Simulated)
              </span>
            </div>
            <p className={`text-xs mt-1 ${themeConfig.subText}`}>
              Simulated IoT control interface with real-time indoor air filtration feedback
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Wifi className="w-3.5 h-3.5 animate-pulse" />
              <span>AWS IoT Core: Connected</span>
            </span>
          </div>
        </div>

        {/* Purifier Controller Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left: Device Status & Big Power Toggle */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-black/5 to-white/5 border border-inherit flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                  Smart Appliance
                </span>
                <h4 className="text-base font-bold">AeroShield Pro 450</h4>
                <p className="text-xs opacity-75">Living Room • True HEPA H13</p>
              </div>

              {/* Power Toggle Button */}
              <button
                type="button"
                onClick={() => setIsOn(!isOn)}
                className={`p-4 rounded-2xl transition-all shadow-lg cursor-pointer ${
                  isOn
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 scale-105 ring-4 ring-emerald-500/20'
                    : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 text-slate-600 dark:text-slate-300 shadow-slate-500/10'
                }`}
                title={isOn ? 'Turn Purifier Off' : 'Turn Purifier On'}
              >
                <Power className="w-6 h-6" />
              </button>
            </div>

            {/* Simulated Indoor Telemetry */}
            <div className="mt-6 pt-4 border-t border-inherit">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs font-semibold opacity-75">Indoor PM2.5 Sensor:</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${indoorBadge.bg}`}>
                  {indoorBadge.label}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black">{indoorPm25}</span>
                <span className="text-xs opacity-60">μg/m³</span>
                <span className="text-xs opacity-75 ml-auto">
                  {isOn ? '🍃 Actively purifying air' : '⏸️ Purifier standby'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Fan Speeds, Auto Triggers, and Filter Life */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Speed Selector */}
            <div className={`p-4 rounded-2xl border border-inherit ${themeConfig.innerCardBg}`}>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                  <Fan className={`w-3.5 h-3.5 ${isOn ? 'animate-spin' : ''}`} style={{ animationDuration: speed === 'turbo' ? '0.5s' : '2s' }} />
                  Airflow Speed Mode
                </span>
                <span className="text-xs font-semibold opacity-75 capitalize">
                  {isOn ? `${speed} mode` : 'Powered off'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'quiet', label: 'Quiet', desc: 'Sleep' },
                  { id: 'auto', label: 'Auto', desc: 'Smart' },
                  { id: 'medium', label: 'Med', desc: 'Normal' },
                  { id: 'turbo', label: 'Turbo', desc: 'Max CADR' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    disabled={!isOn}
                    onClick={() => setSpeed(m.id)}
                    className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                      isOn && speed === m.id
                        ? themeConfig.isDay
                          ? 'bg-sky-500 text-white border-sky-400 font-bold shadow-md shadow-sky-500/20'
                          : 'bg-blue-600 text-white border-blue-500 font-bold shadow-md shadow-blue-500/30'
                        : !isOn
                        ? 'opacity-40 cursor-not-allowed border-transparent'
                        : 'hover:bg-white/10 dark:hover:bg-black/20 border-inherit font-medium opacity-80'
                    }`}
                  >
                    <p className="text-xs">{m.label}</p>
                    <p className="text-[10px] opacity-75">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Auto-Trigger & Filter Life */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Auto Sync Toggle */}
              <div className={`p-3.5 rounded-2xl border border-inherit flex items-center justify-between ${themeConfig.innerCardBg}`}>
                <div>
                  <p className="text-xs font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Auto-Clean Trigger
                  </p>
                  <p className="text-[11px] opacity-70 mt-0.5">
                    Starts Turbo when outdoor AQI &gt; 100
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoSync(!autoSync)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    autoSync ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    autoSync ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Filter Health */}
              <div className={`p-3.5 rounded-2xl border border-inherit ${themeConfig.innerCardBg}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                    HEPA H13 Filter
                  </span>
                  <span className="text-xs font-bold text-emerald-500">{filterLife}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-1.5">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: `${filterLife}%` }}
                  />
                </div>
                <p className="text-[10px] opacity-65 mt-1">Est. 128 days remaining</p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
