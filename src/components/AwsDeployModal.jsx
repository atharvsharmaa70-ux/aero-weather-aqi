import React, { useState } from 'react';
import {
  Layers,
  X,
  CheckCircle,
  Copy,
  ExternalLink,
  Terminal,
  Cloud,
  Rocket,
  ShieldCheck,
} from 'lucide-react';

export function AwsDeployModal({ isOpen, onClose, themeConfig }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const amplifyYaml = `version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*`;

  const copyConfig = () => {
    navigator.clipboard.writeText(amplifyYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/50 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden transition-all max-h-[90vh] flex flex-col ${
          themeConfig.isDay
            ? 'bg-white/95 border-sky-200 text-slate-800'
            : 'bg-slate-900/95 border-blue-900 text-slate-100'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-inherit flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg">AWS Amplify Deployment Guide</h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Hackathon Ready
                </span>
              </div>
              <p className="text-xs opacity-75">
                Rule Check: “Use an AWS open source tool or be deployed on AWS.”
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Rule qualification banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-700 dark:text-amber-300">
                How This App Qualifies for AWS Rules
              </h4>
              <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                This project includes an AWS Amplify Hosting build specification (<code>amplify.yml</code>) ready for instant CI/CD deployment to AWS Amplify, and features simulated integration with AWS IoT Core (for air purifier MQTT telemetry) and AWS SNS (for air quality push notifications).
              </p>
            </div>
          </div>

          {/* 3 Step Deployment Guide */}
          <div>
            <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-orange-500" />
              Deploy to AWS Amplify Hosting in 3 Minutes:
            </h4>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5">
                <p className="font-bold mb-1">Step 1: Push code to your GitHub / GitLab repository</p>
                <div className="font-mono text-[11px] p-2 rounded-lg bg-black/80 text-emerald-300 space-y-0.5">
                  <p>git init</p>
                  <p>git add .</p>
                  <p>git commit -m "feat: AeroWeather AQI app with dynamic day/night theme"</p>
                  <p>git branch -M main</p>
                  <p>git remote add origin https://github.com/YOUR_USERNAME/aero-weather-aqi.git</p>
                  <p>git push -u origin main</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5">
                <p className="font-bold mb-1">Step 2: Connect AWS Amplify Hosting</p>
                <ol className="list-decimal list-inside space-y-1 opacity-85">
                  <li>Log in to <a href="https://console.aws.amazon.com/amplify" target="_blank" rel="noreferrer" className="text-sky-500 underline font-semibold">AWS Amplify Console</a>.</li>
                  <li>Click <strong>Host web app</strong> &gt; Select <strong>GitHub</strong>.</li>
                  <li>Authorize AWS Amplify and select your <code>aero-weather-aqi</code> repository.</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5">
                <p className="font-bold mb-1">Step 3: Save and Deploy</p>
                <p className="opacity-80 leading-relaxed">
                  Amplify automatically detects Vite and reads the included <code>amplify.yml</code>. Click <strong>Save and deploy</strong>. In about 90 seconds, AWS Amplify assigns you a live public HTTPS URL (e.g. <code>https://main.d1234abc.amplifyapp.com</code>).
                </p>
              </div>
            </div>
          </div>

          {/* amplify.yml viewer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-sky-500" />
                Included <code>amplify.yml</code> Build Configuration:
              </span>
              <button
                type="button"
                onClick={copyConfig}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-300 font-semibold transition-colors cursor-pointer"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-white/10">
              {amplifyYaml}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-inherit flex items-center justify-between bg-black/5 dark:bg-white/5">
          <span className="text-[11px] opacity-65">
            Zero API keys required • Open-Meteo & AWS Amplify
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-bold bg-sky-500 hover:bg-sky-600 text-white transition-all cursor-pointer"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
}
