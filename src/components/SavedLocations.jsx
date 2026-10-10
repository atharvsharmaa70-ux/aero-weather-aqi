import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Briefcase,
  GraduationCap,
  MapPin,
  Search,
  Plus,
  Trash2,
  Navigation,
  Loader2,
  Check,
} from 'lucide-react';
import { searchLocations } from '../services/api';

export function SavedLocations({
  locations,
  currentLocation,
  onSelectLocation,
  onAddLocation,
  onRemoveLocation,
  onUseCurrentGps,
  themeConfig,
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const searchRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchLocations(query);
      setResults(res);
      setIsSearching(false);
      setShowDropdown(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (res) => {
    const newLoc = {
      id: `loc-${Date.now()}`,
      label: res.name,
      iconType: 'pin',
      name: res.name,
      country: res.country || res.admin1 || '',
      latitude: res.latitude,
      longitude: res.longitude,
    };
    onAddLocation(newLoc);
    onSelectLocation(newLoc);
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  const handleGpsClick = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onUseCurrentGps(pos.coords.latitude, pos.coords.longitude);
        setIsLocating(false);
      },
      (err) => {
        console.warn('GPS location error:', err.message);
        alert('Could not access current location. Please check browser permissions.');
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case 'home':
        return <Home className="w-3.5 h-3.5" />;
      case 'office':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'school':
        return <GraduationCap className="w-3.5 h-3.5" />;
      default:
        return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className={`p-3.5 rounded-2xl border backdrop-blur-xl transition-all ${themeConfig.cardBg}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Saved Location Quick Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <span className={`text-xs font-bold uppercase tracking-wider pl-1 hidden sm:inline ${themeConfig.subText}`}>
              Locations:
            </span>

            {locations.map((loc) => {
              const isSelected =
                currentLocation?.latitude === loc.latitude &&
                currentLocation?.longitude === loc.longitude;

              return (
                <div
                  key={loc.id}
                  className={`group relative flex items-center rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                    isSelected
                      ? themeConfig.isDay
                        ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/25'
                        : 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30'
                      : themeConfig.isDay
                      ? 'bg-white/80 hover:bg-sky-50 border-sky-200/80 text-slate-700'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 border-blue-900 text-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectLocation(loc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer"
                  >
                    {getIcon(loc.iconType)}
                    <span>{loc.label}</span>
                    <span className="opacity-75 text-[10px] font-normal">
                      ({loc.name})
                    </span>
                  </button>

                  {/* Allow deleting custom locations (non-core defaults) */}
                  {!['home', 'office', 'school'].includes(loc.id) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveLocation(loc.id);
                      }}
                      className="px-1.5 py-1 text-rose-400 hover:text-rose-500 transition-colors"
                      title="Remove this saved location"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* GPS Locator Button */}
            <button
              type="button"
              onClick={handleGpsClick}
              disabled={isLocating}
              title="Use Current Device GPS Location"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
                themeConfig.isDay
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
              }`}
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5" />
              )}
              <span>GPS Current</span>
            </button>
          </div>

          {/* Search Box with Autocomplete */}
          <div ref={searchRef} className="relative w-full md:w-72 shrink-0">
            <div className={`relative flex items-center rounded-xl border transition-all ${
              themeConfig.isDay
                ? 'bg-white/90 border-sky-200 text-slate-800 focus-within:border-sky-400'
                : 'bg-slate-950/70 border-blue-900 text-slate-100 focus-within:border-blue-500'
            }`}>
              <Search className="w-4 h-4 ml-3 opacity-50 shrink-0" />
              <input
                type="text"
                placeholder="Search city (e.g. Paris, Tokyo)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
                className="w-full bg-transparent px-2.5 py-1.5 text-xs outline-none placeholder:text-slate-400"
              />
              {isSearching && (
                <Loader2 className="w-3.5 h-3.5 mr-2.5 animate-spin text-slate-400" />
              )}
            </div>

            {/* Dropdown Results */}
            {showDropdown && results.length > 0 && (
              <div className={`absolute top-full right-0 left-0 mt-1.5 rounded-xl border shadow-xl z-50 overflow-hidden backdrop-blur-2xl ${
                themeConfig.isDay
                  ? 'bg-white/95 border-sky-200 text-slate-800'
                  : 'bg-slate-900/95 border-blue-900 text-slate-100'
              }`}>
                {results.map((res, idx) => (
                  <button
                    key={`${res.latitude}-${res.longitude}-${idx}`}
                    type="button"
                    onClick={() => handleSelectResult(res)}
                    className="w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-sky-500/10 transition-colors border-b last:border-0 border-inherit"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-sky-500" />
                      <div>
                        <span className="font-bold">{res.name}</span>
                        <span className="text-[11px] opacity-70 ml-1.5">
                          {[res.admin1, res.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] opacity-50">Add +</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
