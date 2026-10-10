import React, { useState } from 'react';
import {
  Flame,
  AlertOctagon,
  Wind,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { checkCropBurningAlert } from '../utils/aqiUtils';

export function CropBurningAlert({
  pm25,
  currentDate = new Date(),
  themeConfig,
  onTriggerSimulateSpike,
}) {
  const [expanded, setExpanded] = useState(false);
  const [forceTrigger, setForceTrigger] = useState(false);

  // Check alert conditions
  const normalAlert = checkCropBurningAlert(pm25, currentDate);
  const isTriggered = forceTrigger || normalAlert.active;

  if (!isTriggered) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <div className={`px-4 py-2 rounded-2xl border text-xs flex items-center justify-between backdrop-blur-md opacity-75 hover:opacity-100 transition-opacity ${
          themeConfig.isDay ? 'bg-sky-50/70 border-sky-200 text-slate-700' : 'bg-slate-900/60 border-blue-900/40 text-slate-300'
        }`}>
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>
              <strong>Crop Burning Monitor:</strong> Inactive for this location (requires Oct–Nov season & PM2.5 &gt; 60 µg/m³).
            </span>
          </div>
          <button
            type="button"
            onClick={() => setForceTrigger(true)}
            className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            Preview Crop Burning Alert 🔥
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="rounded-3xl border border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-red-900/30 to-amber-950/40 backdrop-blur-xl p-5 sm:p-6 text-white shadow-xl shadow-rose-950/20">
        
        {/* Banner Top Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-600/30 border border-rose-500/50 text-rose-300 animate-pulse">
              <Flame className="w-6 h-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-sm">
                  Active Seasonal Alert
                </span>
                <span className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold">
                  <Calendar className="w-3 h-3" />
                  October – November Crop Residue Fire Window
                </span>
                {forceTrigger && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Demo Simulation
                  </span>
                )}
              </div>

              <h4 className="text-base sm:text-lg font-bold text-rose-100 mt-1 flex items-center gap-2">
                Seasonal Stubble & Crop Residue Burning Alert Active
              </h4>

              <p className="text-xs text-rose-200/80 mt-0.5 max-w-3xl">
                Heavy farm stubble burning combined with atmospheric autumn inversion is trapping dense carbonaceous soot, PAHs, and PM2.5 smoke plumes at ground level.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 transition-all cursor-pointer"
            >
              <span>{expanded ? 'Less Details' : 'Scientific Context & Safety'}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {forceTrigger && (
              <button
                type="button"
                onClick={() => setForceTrigger(false)}
                className="text-[11px] text-rose-300/70 hover:text-rose-200 px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Expandable Explanation & Safety Matrix */}
        {expanded && (
          <div className="mt-5 pt-5 border-t border-rose-500/20 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-black/20 border border-rose-500/20">
              <p className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5" />
                Why October–November?
              </p>
              <p className="text-rose-100/75 leading-relaxed">
                Farmers rapidly burn paddy straw to clear fields for wheat planting before winter. Concurrently, wind speeds drop and cold air descends, creating a thermal inversion lid that prevents smoke dispersal.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/20 border border-rose-500/20">
              <p className="font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5" />
                Health Hazard
              </p>
              <p className="text-rose-100/75 leading-relaxed">
                Biomass smoke contains toxic ultrafine PM2.5, carbon monoxide, polycyclic aromatic hydrocarbons (PAHs), and aldehydes that cause acute throat stinging, asthma flares, and blood stream irritation.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/20 border border-rose-500/20">
              <p className="font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Immediate Action Plan
              </p>
              <ul className="list-disc list-inside space-y-1 text-rose-100/75">
                <li>Run indoor HEPA air purifier on Turbo/High.</li>
                <li>Keep all balcony doors and windows sealed.</li>
                <li>Wear tight N95 mask outside; avoid morning jogging.</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
