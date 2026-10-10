/**
 * AQI & Weather Interpretation and Recommendation Engine
 */

export const HEALTH_PROFILES = {
  normal: {
    id: 'normal',
    label: 'Standard',
    shortLabel: 'Normal',
    description: 'General population with no specific chronic respiratory risks',
    aqiWarningThreshold: 101,
    maskThreshold: 151,
  },
  sensitive: {
    id: 'sensitive',
    label: 'Sensitive Groups',
    shortLabel: 'Sensitive',
    description: 'Children, elderly, pregnant individuals, or mild allergies',
    aqiWarningThreshold: 75,
    maskThreshold: 101,
  },
  asthma: {
    id: 'asthma',
    label: 'Asthma / Respiratory',
    shortLabel: 'Asthma/COPD',
    description: 'Individuals with asthma, bronchitis, or COPD (protective mode)',
    aqiWarningThreshold: 51,
    maskThreshold: 80,
  },
};

/**
 * US AQI standard breakpoints
 */
export function getAqiCategory(aqiValue) {
  const aqi = Math.round(aqiValue || 0);

  if (aqi <= 50) {
    return {
      level: 'good',
      label: 'Good',
      color: '#10b981', // emerald-500
      bgClass: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
      badgeBg: 'bg-emerald-500',
      glowClass: 'shadow-emerald-500/20',
      description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
      emoji: '🌿',
    };
  }
  if (aqi <= 100) {
    return {
      level: 'moderate',
      label: 'Moderate',
      color: '#eab308', // yellow-500
      bgClass: 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300',
      badgeBg: 'bg-amber-500',
      glowClass: 'shadow-amber-500/20',
      description: 'Air quality is acceptable; however, sensitive groups may experience minor issues.',
      emoji: '🌤️',
    };
  }
  if (aqi <= 150) {
    return {
      level: 'sensitive',
      label: 'Unhealthy for Sensitive Groups',
      color: '#f97316', // orange-500
      bgClass: 'bg-orange-500/15 border-orange-500/30 text-orange-700 dark:text-orange-300',
      badgeBg: 'bg-orange-500',
      glowClass: 'shadow-orange-500/20',
      description: 'Sensitive individuals may experience irritation; general public is less likely to be affected.',
      emoji: '⚠️',
    };
  }
  if (aqi <= 200) {
    return {
      level: 'unhealthy',
      label: 'Unhealthy',
      color: '#ef4444', // red-500
      bgClass: 'bg-red-500/15 border-red-500/30 text-red-700 dark:text-red-300',
      badgeBg: 'bg-red-500',
      glowClass: 'shadow-red-500/20',
      description: 'Everyone may begin to experience health effects; sensitive groups may feel serious symptoms.',
      emoji: '🚨',
    };
  }
  if (aqi <= 300) {
    return {
      level: 'very-unhealthy',
      label: 'Very Unhealthy',
      color: '#8b5cf6', // purple-500
      bgClass: 'bg-purple-500/15 border-purple-500/30 text-purple-700 dark:text-purple-300',
      badgeBg: 'bg-purple-500',
      glowClass: 'shadow-purple-500/20',
      description: 'Health alert: increased risk of respiratory and cardiovascular aggravation for everyone.',
      emoji: '🛑',
    };
  }
  return {
    level: 'hazardous',
    label: 'Hazardous',
    color: '#991b1b', // red-800
    bgClass: 'bg-rose-950/20 border-rose-600/40 text-rose-800 dark:text-rose-300',
    badgeBg: 'bg-rose-700',
    glowClass: 'shadow-rose-700/30',
    description: 'Health warning of emergency conditions. The entire population is likely to be affected.',
    emoji: '☣️',
  };
}

/**
 * WMO Weather Codes mapping
 */
export function getWeatherInterpretation(code, isDay = 1) {
  const numericCode = Number(code) || 0;
  switch (numericCode) {
    case 0:
      return {
        description: isDay ? 'Clear Sky' : 'Clear Night',
        iconName: isDay ? 'Sun' : 'Moon',
        conditionGroup: 'clear',
      };
    case 1:
      return {
        description: isDay ? 'Mainly Sunny' : 'Mainly Clear Night',
        iconName: isDay ? 'SunMedium' : 'Moon',
        conditionGroup: 'clear',
      };
    case 2:
      return {
        description: 'Partly Cloudy',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        conditionGroup: 'cloudy',
      };
    case 3:
      return {
        description: 'Overcast',
        iconName: 'Cloud',
        conditionGroup: 'cloudy',
      };
    case 45:
    case 48:
      return {
        description: 'Fog & Depositing Rime',
        iconName: 'CloudFog',
        conditionGroup: 'fog',
      };
    case 51:
    case 53:
    case 55:
      return {
        description: 'Light Drizzle',
        iconName: 'CloudDrizzle',
        conditionGroup: 'rain',
      };
    case 61:
    case 63:
    case 65:
      return {
        description: 'Rain Showers',
        iconName: 'CloudRain',
        conditionGroup: 'rain',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        description: 'Snow Fall',
        iconName: 'CloudSnow',
        conditionGroup: 'snow',
      };
    case 80:
    case 81:
    case 82:
      return {
        description: 'Heavy Showers',
        iconName: 'CloudRainWind',
        conditionGroup: 'rain',
      };
    case 95:
    case 96:
    case 99:
      return {
        description: 'Thunderstorm',
        iconName: 'CloudLightning',
        conditionGroup: 'storm',
      };
    default:
      return {
        description: 'Pleasant Weather',
        iconName: isDay ? 'Sun' : 'Moon',
        conditionGroup: 'clear',
      };
  }
}

/**
 * Rule-based alert generation based on AQI, PM2.5, PM10, and Health Profile
 */
export function generateAlertRules({ aqi, pm25, pm10, healthProfile = 'normal' }) {
  const currentAqi = Number(aqi) || 0;
  const currentPm25 = Number(pm25) || 0;
  const currentPm10 = Number(pm10) || 0;
  const isAsthma = healthProfile === 'asthma';
  const isSensitive = healthProfile === 'sensitive' || isAsthma;

  // 1. Window Alert
  let windowAlert = {
    status: 'open',
    severity: 'good',
    title: 'Windows Can Be Opened',
    summary: 'Fresh outdoor air is safe. Great time for natural room ventilation.',
    action: 'Open for 30–60 mins to refresh indoor circulation.',
  };
  if (currentPm25 > 65 || currentAqi > 140) {
    windowAlert = {
      status: 'closed',
      severity: 'danger',
      title: 'Keep Windows Closed',
      summary: 'High fine particulate load outdoors. Micro-particles will seep inside and degrade indoor air.',
      action: 'Keep windows and doors tightly sealed. Run HEPA air purifier on Auto or Turbo.',
    };
  } else if (currentPm25 > 35 || currentAqi > (isSensitive ? 75 : 100)) {
    windowAlert = {
      status: 'caution',
      severity: 'warning',
      title: 'Ventilate With Caution',
      summary: 'Moderate outdoor pollution. Limit open window duration.',
      action: isSensitive
        ? 'Keep windows shut; rely on indoor air circulation.'
        : 'Open only during optimal clean hours (early morning/afternoon).',
    };
  }

  // 2. Mask Alert
  let maskAlert = {
    status: 'none',
    severity: 'good',
    title: 'No Mask Needed',
    summary: 'Particulate density is well within safe thresholds.',
    action: 'Breathe freely outdoors.',
  };
  if (currentPm25 > 60 || currentAqi > (isSensitive ? 100 : 150)) {
    maskAlert = {
      status: 'n95',
      severity: 'danger',
      title: 'N95 / FFP2 Mask Advised',
      summary: 'Dangerous PM2.5 levels that bypass nasal filters and enter lung alveoli.',
      action: isAsthma
        ? 'Strictly wear a fitted N95 respirator. Keep fast-acting rescue inhaler on hand.'
        : 'Wear a well-fitted N95 or KN95 respirator when outdoors.',
    };
  } else if (currentPm25 > 25 || currentAqi > (isSensitive ? 60 : 100)) {
    maskAlert = {
      status: 'recommended',
      severity: 'warning',
      title: isSensitive ? 'Light Respirator / Mask Recommended' : 'Optional Mask for Sensitive Groups',
      summary: 'Elevated particle concentrations may cause throat tickle or cough.',
      action: isSensitive
        ? 'Wear a light mask or avoid lingering on busy roads.'
        : 'Sensitive individuals should consider wearing a mask.',
    };
  }

  // 3. Outdoor Activity Alert
  let outdoorAlert = {
    status: 'favorable',
    severity: 'good',
    title: 'Outdoor Exercise Encouraged',
    summary: 'Conditions are favorable for running, cycling, walking, and sports.',
    action: 'Great window for high-intensity workouts and outdoor training.',
  };
  if (currentAqi > 160 || currentPm25 > 75) {
    outdoorAlert = {
      status: 'avoid',
      severity: 'danger',
      title: 'Avoid Outdoor Cardio',
      summary: 'Heavy breathing during exercise increases deep toxic particle inhalation by 5x–10x.',
      action: isAsthma
        ? 'Stay indoors. Avoid any exertion outside.'
        : 'Switch to an indoor treadmill, yoga, or gym workout.',
    };
  } else if (currentAqi > (isSensitive ? 80 : 110) || currentPm25 > 40) {
    outdoorAlert = {
      status: 'moderate',
      severity: 'warning',
      title: 'Reduce Strenuous Outdoor Exercise',
      summary: 'Elevated pollution may induce coughing or shortness of breath.',
      action: isSensitive
        ? 'Substitute outdoor running with low-intensity indoor movement.'
        : 'Limit outdoor cardio to less than 30 minutes, or exercise during optimal hours.',
    };
  }

  // 4. Eye & Mucous Membrane Protection Alert
  let eyeAlert = {
    status: 'clear',
    severity: 'good',
    title: 'Clear Eye & Throat Conditions',
    summary: 'Low airborne particulate irritation risk.',
    action: 'No special protective eyewear needed.',
  };
  if (currentPm10 > 120 || currentPm25 > 70) {
    eyeAlert = {
      status: 'irritation_high',
      severity: 'danger',
      title: 'High Eye Stinging & Irritation Risk',
      summary: 'Coarse dust (PM10) and fine soot irritate the ocular surface and cause conjunctival redness.',
      action: 'Wear wraparound sunglasses/glasses outside. Keep lubricating eye drops (artificial tears) handy.',
    };
  } else if (currentPm10 > 75 || currentPm25 > 45) {
    eyeAlert = {
      status: 'irritation_mild',
      severity: 'warning',
      title: 'Mild Eye Dryness & Dust Alert',
      summary: 'Windborne particulates may cause mild scratching or watering in eyes.',
      action: 'Avoid rubbing eyes; rinse with clean water if exposed to roadside traffic.',
    };
  }

  return {
    windowAlert,
    maskAlert,
    outdoorAlert,
    eyeAlert,
  };
}

/**
 * Seasonal Crop / Stubble Burning Alert Detector
 * October (9) and November (10) + elevated PM2.5 (stubble burning season in agricultural belts)
 */
export function checkCropBurningAlert(pm25Value, date = new Date()) {
  const month = date.getMonth(); // 0-indexed: Jan=0, Oct=9, Nov=10
  const isCropBurningSeason = month === 9 || month === 10;
  const pm25 = Number(pm25Value) || 0;

  // Stubble burning generates massive spikes of PM2.5 soot & smoke
  const isElevated = pm25 >= 60;
  const isSevere = pm25 >= 120;

  if (isCropBurningSeason && isElevated) {
    return {
      active: true,
      severity: isSevere ? 'critical' : 'warning',
      title: isSevere
        ? '🔥 Severe Agricultural Crop Burning & Stubble Smoke Alert'
        : '🔥 Seasonal Crop Burning Smoke Detected',
      headline: 'Active post-harvest paddy stubble burning in regional agricultural belts.',
      description:
        'Seasonal October–November crop residue fires combined with calm autumn winds and nocturnal inversion are trapping dense carbonaceous soot, PAHs, and PM2.5 micro-particles at ground level.',
      impact:
        'Fine smoke particles cause sudden respiratory burning, chest tightness, and stinging eyes. Indoor air purifiers are strongly advised.',
      seasonNote: 'October–November Post-Harvest Burning Window',
    };
  }

  return {
    active: false,
    severity: 'none',
    title: '',
    description: '',
  };
}

/**
 * Calculates the best and worst times to go outside over the next 24-hour forecast
 */
export function calculateBestTimeToGoOut(hourlyData) {
  if (!hourlyData || !hourlyData.time || !hourlyData.us_aqi) {
    return null;
  }

  const times = hourlyData.time;
  const aqis = hourlyData.us_aqi;
  const pm25s = hourlyData.pm2_5 || [];
  const temps = hourlyData.temperature_2m || [];

  const now = new Date();
  const points = [];

  // Look ahead up to 24 hours
  for (let i = 0; i < times.length && points.length < 24; i++) {
    const pointTime = new Date(times[i]);
    // Consider from current hour or within the last hour
    if (pointTime >= new Date(now.getTime() - 60 * 60 * 1000)) {
      points.push({
        time: pointTime,
        hour: pointTime.getHours(),
        formattedTime: pointTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        formattedHour: pointTime.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
        aqi: aqis[i] ?? 50,
        pm25: pm25s[i] ?? 15,
        temp: temps[i] ?? 24,
      });
    }
  }

  if (points.length === 0) return null;

  // Find minimum AQI (best hour) and maximum AQI (worst hour)
  let bestPoint = points[0];
  let worstPoint = points[0];

  for (const pt of points) {
    if (pt.aqi < bestPoint.aqi) {
      bestPoint = pt;
    }
    if (pt.aqi > worstPoint.aqi) {
      worstPoint = pt;
    }
  }

  // Find a 3-hour window around the best point
  const bestIdx = points.indexOf(bestPoint);
  const startIdx = Math.max(0, bestIdx - 1);
  const endIdx = Math.min(points.length - 1, bestIdx + 1);

  const startHourStr = points[startIdx].formattedTime;
  const endHourStr = points[endIdx].formattedTime;
  const bestCategory = getAqiCategory(bestPoint.aqi);
  const worstCategory = getAqiCategory(worstPoint.aqi);

  const isSignificantImprovement = worstPoint.aqi - bestPoint.aqi >= 25;

  let advice = `Air quality peaks favorably around ${bestPoint.formattedHour} (AQI ${bestPoint.aqi} - ${bestCategory.label}).`;
  if (isSignificantImprovement) {
    advice += ` This is ${worstPoint.aqi - bestPoint.aqi} points cleaner than the peak risk at ${worstPoint.formattedHour} (AQI ${worstPoint.aqi}). Schedule outdoor walks and ventilate during this window.`;
  } else {
    advice += ` Pollution levels remain fairly steady across the next 24 hours.`;
  }

  return {
    bestPoint,
    worstPoint,
    windowRange: `${startHourStr} – ${endHourStr}`,
    bestAqi: bestPoint.aqi,
    bestPm25: bestPoint.pm25,
    bestCategory,
    worstAqi: worstPoint.aqi,
    worstCategory,
    worstHour: worstPoint.formattedHour,
    advice,
    points,
  };
}
