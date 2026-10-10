/**
 * Weather & Day/Night Theme Resolver
 * Requirement:
 * - If Day: Light Blue theme
 * - If Night: Dark Blue theme
 * - Also tunes nuances based on weather conditions (sunny, rainy, foggy, high AQI)
 */

export function resolveTheme({ isDay = 1, weatherCode = 0, aqi = 50, themeOverride = 'auto' }) {
  // Determine if day or night is active
  let isEffectiveDay = isDay === 1;
  if (themeOverride === 'day') isEffectiveDay = true;
  if (themeOverride === 'night') isEffectiveDay = false;

  const isRain = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode);
  const isFog = [45, 48].includes(weatherCode);
  const isPoorAqi = aqi > 150;

  if (isEffectiveDay) {
    // DAY THEME: Light Blue Palette
    let bgGradient = 'from-sky-200 via-sky-100 to-blue-200';
    let ambientBlob1 = 'bg-sky-400/30';
    let ambientBlob2 = 'bg-blue-300/35';
    let badgeColor = 'text-sky-800 bg-sky-100/90 border-sky-300';
    let headerText = 'text-slate-900';
    let subText = 'text-slate-600';
    let cardBg = 'bg-white/75 backdrop-blur-xl border border-white/80 shadow-lg shadow-sky-500/10 text-slate-800';
    let cardHover = 'hover:border-sky-300/80 hover:shadow-sky-400/15';
    let innerCardBg = 'bg-sky-50/80 border border-sky-100 text-slate-700';

    if (isRain) {
      bgGradient = 'from-slate-200 via-sky-200 to-blue-300';
      ambientBlob1 = 'bg-blue-400/20';
      ambientBlob2 = 'bg-slate-400/20';
    } else if (isPoorAqi) {
      bgGradient = 'from-amber-100/70 via-sky-200 to-blue-200';
      ambientBlob1 = 'bg-amber-300/20';
      ambientBlob2 = 'bg-sky-300/30';
    } else if (isFog) {
      bgGradient = 'from-slate-100 via-sky-100 to-slate-200';
    }

    return {
      isDay: true,
      themeName: 'day',
      label: 'Daylight Sky (Light Blue)',
      bgGradient,
      ambientBlob1,
      ambientBlob2,
      badgeColor,
      headerText,
      subText,
      cardBg,
      cardHover,
      innerCardBg,
      accentColor: 'text-sky-600',
      activeTabClass: 'bg-white text-sky-800 shadow-sm border border-sky-200',
      inactiveTabClass: 'text-slate-600 hover:text-slate-900 hover:bg-white/40',
    };
  }

  // NIGHT THEME: Dark Blue Palette
  let bgGradient = 'from-slate-950 via-slate-900 to-blue-950';
  let ambientBlob1 = 'bg-blue-600/20';
  let ambientBlob2 = 'bg-indigo-600/20';
  let badgeColor = 'text-sky-300 bg-blue-950/80 border-blue-800';
  let headerText = 'text-slate-50';
  let subText = 'text-slate-400';
  let cardBg = 'bg-slate-900/75 backdrop-blur-xl border border-blue-900/40 shadow-xl shadow-black/50 text-slate-100';
  let cardHover = 'hover:border-blue-600/60 hover:shadow-blue-500/10';
  let innerCardBg = 'bg-slate-950/60 border border-blue-950 text-slate-300';

  if (isRain) {
    bgGradient = 'from-gray-950 via-slate-950 to-blue-950';
    ambientBlob1 = 'bg-cyan-800/20';
    ambientBlob2 = 'bg-blue-900/20';
  } else if (isPoorAqi) {
    bgGradient = 'from-stone-950 via-slate-950 to-blue-950';
    ambientBlob1 = 'bg-amber-800/15';
    ambientBlob2 = 'bg-blue-900/20';
  }

  return {
    isDay: false,
    themeName: 'night',
    label: 'Midnight Deep (Dark Blue)',
    bgGradient,
    ambientBlob1,
    ambientBlob2,
    badgeColor,
    headerText,
    subText,
    cardBg,
    cardHover,
    innerCardBg,
    accentColor: 'text-sky-400',
    activeTabClass: 'bg-blue-950/90 text-sky-200 border border-blue-700/60 shadow-inner',
    inactiveTabClass: 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40',
  };
}
