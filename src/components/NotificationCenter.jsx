import React from 'react';
import {
  Bell,
  X,
  CheckCheck,
  AlertTriangle,
  Flame,
  Sparkles,
  Wind,
  ShieldAlert,
  Send,
  Trash2,
} from 'lucide-react';

export function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onDismissNotification,
  onClearAll,
  onTriggerSimulatedAlert,
  themeConfig,
}) {
  if (!isOpen) return null;

  const getAlertIcon = (type) => {
    switch (type) {
      case 'crop_burn':
        return <Flame className="w-4 h-4 text-rose-500" />;
      case 'spike':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'clean':
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case 'mask':
        return <ShieldAlert className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          themeConfig.isDay
            ? 'bg-white/95 border-sky-200 text-slate-800'
            : 'bg-slate-900/95 border-blue-900 text-slate-100'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">In-App Alert Center</h3>
              <p className="text-xs opacity-70">
                Push Notifications Simulation (AWS SNS / Web Push Ready)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-rose-500 hover:text-rose-600 font-medium px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Demo Trigger Buttons */}
        <div className="p-3.5 border-b border-inherit bg-black/5 dark:bg-white/5">
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-2">
            Test Alert Simulator (Click to Trigger In-App Card):
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onTriggerSimulatedAlert('spike')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangle className="w-3 h-3" />
              + AQI Spike Warning
            </button>
            <button
              type="button"
              onClick={() => onTriggerSimulatedAlert('crop_burn')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Flame className="w-3 h-3" />
              + Crop Smoke Alert
            </button>
            <button
              type="button"
              onClick={() => onTriggerSimulatedAlert('clean')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              + Clean Window Alert
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-8 opacity-60">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">No active alert cards</p>
              <p className="text-xs mt-0.5">Use the test buttons above to simulate alerts.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  n.severity === 'danger'
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : n.severity === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-emerald-500/10 border-emerald-500/30'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-800 shadow-sm shrink-0 mt-0.5">
                    {getAlertIcon(n.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold">{n.title}</h4>
                      <span className="text-[10px] opacity-60">{n.time}</span>
                    </div>
                    <p className="text-xs opacity-80 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDismissNotification(n.id)}
                  className="opacity-50 hover:opacity-100 p-1 cursor-pointer"
                  title="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-inherit text-center text-[11px] opacity-60">
          Simulated Web Push Notification Card Pipeline
        </div>
      </div>
    </div>
  );
}

/**
 * Floating in-app toast for instant feedback
 */
export function FloatingToast({ toast, onDismiss }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl p-4 shadow-2xl border backdrop-blur-xl bg-slate-900/90 text-white border-white/20 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold">{toast.title}</h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
