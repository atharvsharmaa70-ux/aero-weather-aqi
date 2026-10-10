import { Heart, CloudSun, Shield, Layers } from 'lucide-react';

export function Footer({ themeConfig, onOpenAwsModal }) {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-6">
      <div className={`p-6 rounded-3xl border transition-all text-xs flex flex-col md:flex-row items-center justify-between gap-4 ${themeConfig.cardBg}`}>
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span>AeroWeather Sentinel</span>
            <span className="opacity-50">•</span>
            <span className={themeConfig.accentColor}>Day (Light Blue) / Night (Dark Blue)</span>
          </div>
          <p className="opacity-70 mt-1 max-w-md">
            Built with zero keys using Open-Meteo Air Quality & Weather API. Deployed on AWS Amplify Hosting.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onOpenAwsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-inherit hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>AWS Amplify Specs</span>
          </button>

          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-inherit hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <CloudSun className="w-3.5 h-3.5 text-sky-500" />
            <span>Open-Meteo API</span>
          </a>
        </div>

      </div>
    </footer>
  );
}
