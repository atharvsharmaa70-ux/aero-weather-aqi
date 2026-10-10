import React from 'react';
import {
  ShieldAlert,
  Sliders,
  Sparkles,
  Eye,
  Activity,
  HeartPulse,
  DoorClosed,
  DoorOpen,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { generateAlertRules, HEALTH_PROFILES } from '../utils/aqiUtils';

export function ActionableAlerts({
  aqi,
  pm25,
  pm10,
  healthProfile,
  themeConfig,
}) {
  const { windowAlert, maskAlert, outdoorAlert, eyeAlert } = generateAlertRules({
    aqi,
    pm25,
    pm10,
    healthProfile,
  });

  const profileInfo = HEALTH_PROFILES[healthProfile] || HEALTH_PROFILES.normal;

  const getStatusBadge = (severity) => {
    switch (severity) {
      case 'good':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" /> Safe
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" /> Caution
          </span>
        );
      case 'danger':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" /> Alert
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${themeConfig.cardBg}`}>
        
        {/* Header with Health Sensitivity context */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-blue-500/10 text-blue-500">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                Health & Exposure Action Rules
              </h3>
            </div>
            <p className={`text-xs mt-1 ${themeConfig.subText}`}>
              Automated safety guidance tailored to your active health sensitivity profile
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              healthProfile === 'asthma'
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30'
                : healthProfile === 'sensitive'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30'
                : 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30'
            }`}>
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Sensitivity Mode: <strong>{profileInfo.shortLabel}</strong></span>
            </span>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Window Status Alert */}
          <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${themeConfig.innerCardBg}`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-sky-500/15 text-sky-500">
                  {windowAlert.status === 'open' ? (
                    <DoorOpen className="w-5 h-5" />
                  ) : (
                    <DoorClosed className="w-5 h-5 text-rose-500" />
                  )}
                </span>
                {getStatusBadge(windowAlert.severity)}
              </div>

              <h4 className="text-sm font-bold tracking-tight mb-1">
                {windowAlert.title}
              </h4>
              <p className="text-xs opacity-75 leading-relaxed">
                {windowAlert.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-inherit">
              <p className="text-[11px] font-semibold opacity-90">
                💡 <span className="opacity-80">{windowAlert.action}</span>
              </p>
            </div>
          </div>

          {/* 2. Mask Alert */}
          <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${themeConfig.innerCardBg}`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-purple-500/15 text-purple-500">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                {getStatusBadge(maskAlert.severity)}
              </div>

              <h4 className="text-sm font-bold tracking-tight mb-1">
                {maskAlert.title}
              </h4>
              <p className="text-xs opacity-75 leading-relaxed">
                {maskAlert.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-inherit">
              <p className="text-[11px] font-semibold opacity-90">
                😷 <span className="opacity-80">{maskAlert.action}</span>
              </p>
            </div>
          </div>

          {/* 3. Outdoor Activity Alert */}
          <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${themeConfig.innerCardBg}`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
                  <Activity className="w-5 h-5" />
                </span>
                {getStatusBadge(outdoorAlert.severity)}
              </div>

              <h4 className="text-sm font-bold tracking-tight mb-1">
                {outdoorAlert.title}
              </h4>
              <p className="text-xs opacity-75 leading-relaxed">
                {outdoorAlert.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-inherit">
              <p className="text-[11px] font-semibold opacity-90">
                🏃 <span className="opacity-80">{outdoorAlert.action}</span>
              </p>
            </div>
          </div>

          {/* 4. Eye & Throat Protection Alert */}
          <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${themeConfig.innerCardBg}`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
                  <Eye className="w-5 h-5" />
                </span>
                {getStatusBadge(eyeAlert.severity)}
              </div>

              <h4 className="text-sm font-bold tracking-tight mb-1">
                {eyeAlert.title}
              </h4>
              <p className="text-xs opacity-75 leading-relaxed">
                {eyeAlert.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-inherit">
              <p className="text-[11px] font-semibold opacity-90">
                🕶️ <span className="opacity-80">{eyeAlert.action}</span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
