import React, { useState } from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  Bell,
  HeartPulse,
  CloudLightning,
  Sparkles,
  Layers,
  ChevronDown,
  Info,
} from 'lucide-react';
import { HEALTH_PROFILES } from '../utils/aqiUtils';

export function Header({
  themeConfig,
  themeOverride,
  setThemeOverride,
  healthProfile,
  setHealthProfile,
  notifications,
  onOpenNotifications,
  onOpenAwsModal,
  isLive,
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="w-full transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl shadow-md ${
              themeConfig.isDay
                ? 'bg-gradient-to-tr from-sky-400 to-blue-500 text-white shadow-sky-400/30'
                : 'bg-gradient-to-tr from-blue-700 to-indigo-900 text-sky-200 shadow-blue-900/40'
            }`}>
              {themeConfig.isDay ? (
                <Sun className="w-6 h-6 animate-[spin_20s_linear_infinite]" />
              ) : (
                <Moon className="w-6 h-6 animate-pulse" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${themeConfig.headerText}`}>
                  Aero<span className={themeConfig.accentColor}>Weather</span>
                </h1>
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  themeConfig.isDay
                    ? 'bg-sky-100/90 text-sky-800 border-sky-300'
                    : 'bg-blue-950/80 text-sky-300 border-blue-700'
                }`}>
                  Live AQI
                </span>
                {isLive ? (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    API Active
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-500 font-medium">Demo Mode</span>
                )}
              </div>
              <p className={`text-xs ${themeConfig.subText}`}>
                Theme reflects conditions: Day (Light Blue) · Night (Dark Blue)
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Theme Selector Pill (Auto, Day, Night) */}
            <div className={`flex items-center p-1 rounded-xl border text-xs font-medium backdrop-blur-md transition-all ${
              themeConfig.isDay ? 'bg-white/70 border-sky-200 text-slate-700' : 'bg-slate-900/80 border-blue-900 text-slate-300'
            }`}>
              <button
                type="button"
                onClick={() => setThemeOverride('auto')}
                title="Automatically follow Day/Night from live weather"
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                  themeOverride === 'auto'
                    ? themeConfig.activeTabClass
                    : themeConfig.inactiveTabClass
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Auto</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeOverride('day')}
                title="Force Day Theme (Light Blue)"
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                  themeOverride === 'day'
                    ? themeConfig.activeTabClass
                    : themeConfig.inactiveTabClass
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Day</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeOverride('night')}
                title="Force Night Theme (Dark Blue)"
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                  themeOverride === 'night'
                    ? themeConfig.activeTabClass
                    : themeConfig.inactiveTabClass
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span>Night</span>
              </button>
            </div>

            {/* Health Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md transition-all ${
                  themeConfig.isDay
                    ? 'bg-white/80 border-sky-200 text-slate-700 hover:border-sky-300'
                    : 'bg-slate-900/80 border-blue-900 text-slate-200 hover:border-blue-700'
                }`}
              >
                <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                <span>
                  Profile: <span className={themeConfig.accentColor}>{HEALTH_PROFILES[healthProfile]?.shortLabel}</span>
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className={`absolute right-0 mt-2 w-72 rounded-2xl p-2 z-40 border shadow-2xl backdrop-blur-2xl ${
                    themeConfig.isDay
                      ? 'bg-white/95 border-sky-200 text-slate-800'
                      : 'bg-slate-900/95 border-blue-900 text-slate-100'
                  }`}>
                    <div className="px-3 py-2 border-b border-inherit">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Health Sensitivity Profile
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Modifies air safety thresholds and alert triggers
                      </p>
                    </div>

                    <div className="space-y-1 mt-1.5">
                      {Object.values(HEALTH_PROFILES).map((prof) => (
                        <button
                          key={prof.id}
                          type="button"
                          onClick={() => {
                            setHealthProfile(prof.id);
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition-all flex flex-col ${
                            healthProfile === prof.id
                              ? themeConfig.isDay
                                ? 'bg-sky-100/90 text-sky-900 font-semibold'
                                : 'bg-blue-950 text-sky-200 font-semibold border border-blue-800'
                              : 'hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{prof.label}</span>
                            {healthProfile === prof.id && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                                Active
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] opacity-75 font-normal mt-0.5">
                            {prof.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className={`relative p-2 rounded-xl border backdrop-blur-md transition-all ${
                themeConfig.isDay
                  ? 'bg-white/80 border-sky-200 text-slate-700 hover:border-sky-300'
                  : 'bg-slate-900/80 border-blue-900 text-slate-200 hover:border-blue-700'
              }`}
              title="View Simulated Push Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* AWS Amplify Hosting Deploy Badge */}
            <button
              type="button"
              onClick={onOpenAwsModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20 hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>AWS Amplify Ready</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
