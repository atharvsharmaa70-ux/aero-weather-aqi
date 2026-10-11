import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, Sparkles, Captions } from 'lucide-react';

const TOUR_STEPS = [
  {
    id: 1,
    startSec: 0.5,
    endSec: 5.8,
    text: "Welcome to AeroWeather, a smart air quality and weather sentinel deployed on AWS Amplify.",
    action: ({ setThemeOverride }) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
  {
    id: 2,
    startSec: 6.0,
    endSec: 12.8,
    text: "First, our dynamic theme adapts to weather and daylight. In day mode, the interface displays a luminous light blue sky gradient.",
    action: ({ setThemeOverride }) => {
      setThemeOverride('day');
    },
  },
  {
    id: 3,
    startSec: 13.0,
    endSec: 18.2,
    text: "Switching to night mode transitions into a deep midnight dark blue palette.",
    action: ({ setThemeOverride }) => {
      setThemeOverride('night');
    },
  },
  {
    id: 4,
    startSec: 18.4,
    endSec: 24.8,
    text: "Next, our live telemetry pulls real-time atmospheric data via the free Open-Meteo API with zero API keys.",
    action: ({ setThemeOverride }) => {
      setThemeOverride('auto');
    },
  },
  {
    id: 5,
    startSec: 25.0,
    endSec: 32.8,
    text: "Selecting Home loads New Delhi, which immediately activates our seasonal crop burning and stubble smoke alert for October and November.",
    action: ({ selectLocationById }) => {
      selectLocationById('home');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    },
  },
  {
    id: 6,
    startSec: 33.0,
    endSec: 38.5,
    text: "Selecting School switches to San Francisco with clean coastal air.",
    action: ({ selectLocationById }) => {
      selectLocationById('school');
    },
  },
  {
    id: 7,
    startSec: 38.7,
    endSec: 47.5,
    text: "Our health sensitivity setting lets users personalize thresholds. In asthma mode, mask and indoor exercise alerts trigger earlier for respiratory safety.",
    action: ({ setHealthProfile, selectLocationById }) => {
      selectLocationById('home');
      setHealthProfile('asthma');
      window.scrollTo({ top: 380, behavior: 'smooth' });
    },
  },
  {
    id: 8,
    startSec: 47.7,
    endSec: 56.5,
    text: "Below, our predictive forecast analyzes the next 24 hours to find the optimal clean air window to go outside versus peak pollution hours.",
    action: () => {
      window.scrollTo({ top: 680, behavior: 'smooth' });
    },
  },
  {
    id: 9,
    startSec: 56.7,
    endSec: 65.5,
    text: "Our simulated connected air purifier features real-time indoor telemetry. When turned on, the simulated indoor PM2.5 drops down to clean HEPA levels.",
    action: () => {
      window.scrollTo({ top: 1100, behavior: 'smooth' });
    },
  },
  {
    id: 10,
    startSec: 65.7,
    endSec: 71.5,
    text: "Finally, in-app notification cards alert users to sudden spikes.",
    action: ({ triggerNotification }) => {
      triggerNotification({
        type: 'spike',
        title: '🚨 In-App Demo Alert',
        message: 'Sudden PM2.5 spike detected! Close windows and turn on air filtration.',
        severity: 'danger',
      });
    },
  },
  {
    id: 11,
    startSec: 71.7,
    endSec: 78.0,
    text: "The entire application is production ready and hosted live on AWS Amplify Hosting.",
    action: ({ setIsAwsModalOpen }) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsAwsModalOpen(true);
    },
  },
];

export function GuidedTour({
  themeConfig,
  setThemeOverride,
  setHealthProfile,
  selectLocationById,
  triggerNotification,
  setIsAwsModalOpen,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [activeStepId, setActiveStepId] = useState(null);
  const audioRef = useRef(null);

  // Time tracking and step trigger
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (audioRef.current) {
        const time = audioRef.current.currentTime;
        setCurrentTime(time);

        // Find active step
        const step = TOUR_STEPS.find((s) => time >= s.startSec && time <= s.endSec);
        if (step) {
          setCurrentSubtitle(step.text);
          if (step.id !== activeStepId) {
            setActiveStepId(step.id);
            // Execute automated UI action
            step.action({
              setThemeOverride,
              setHealthProfile,
              selectLocationById,
              triggerNotification,
              setIsAwsModalOpen,
            });
          }
        } else if (time > 78) {
          handleStop();
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isPlaying, activeStepId]);

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setActiveStepId(null);
      }).catch((e) => {
        console.warn('Audio play failed:', e);
        // Fallback: Web Speech API if audio file fails
        runSpeechFallback();
      });
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
    setCurrentSubtitle('');
    setActiveStepId(null);
  };

  // Fallback using browser speech synthesis
  const runSpeechFallback = () => {
    setIsPlaying(true);
    let stepIndex = 0;

    const playNextStep = () => {
      if (stepIndex >= TOUR_STEPS.length) {
        setIsPlaying(false);
        setCurrentSubtitle('');
        return;
      }
      const step = TOUR_STEPS[stepIndex];
      setCurrentSubtitle(step.text);
      step.action({
        setThemeOverride,
        setHealthProfile,
        selectLocationById,
        triggerNotification,
        setIsAwsModalOpen,
      });

      const utterance = new SpeechSynthesisUtterance(step.text);
      utterance.rate = 1.0;
      utterance.onend = () => {
        stepIndex++;
        setTimeout(playNextStep, 400);
      };
      window.speechSynthesis.speak(utterance);
    };

    playNextStep();
  };

  return (
    <>
      <audio ref={audioRef} src="/demo_voiceover.wav" preload="auto" />

      {/* Floating Guided Tour Launcher (Bottom Left) */}
      <div className="fixed bottom-5 left-5 z-40">
        {!isPlaying ? (
          <button
            type="button"
            onClick={handleStart}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs shadow-xl shadow-blue-500/25 border border-white/20 hover:scale-105 transition-all cursor-pointer"
            title="Start automated voiceover demo with subtitles"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>🎙️ Start Guided Demo (Voice + Subtitles)</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/90 text-white border border-white/20 backdrop-blur-xl shadow-2xl">
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>Stop Demo</span>
            </button>
            <div className="flex items-center gap-1 text-[11px] text-sky-400 font-mono px-2">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Playing Voiceover</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Subtitles Overlay Banner (Bottom Center) */}
      {isPlaying && currentSubtitle && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl animate-in slide-in-from-bottom-3 duration-300 pointer-events-none">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/20 text-white text-center shadow-2xl">
            <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-black tracking-wider text-sky-400 mb-1">
              <Captions className="w-3.5 h-3.5" />
              <span>Closed Captions / Subtitles</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold leading-relaxed tracking-wide text-slate-100">
              "{currentSubtitle}"
            </p>
          </div>
        </div>
      )}
    </>
  );
}
