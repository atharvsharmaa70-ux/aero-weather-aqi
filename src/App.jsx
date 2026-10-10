import React, { useState, useEffect, useCallback } from 'react';
import { DEFAULT_LOCATIONS } from './constants/locations';
import { fetchWeatherAndAqi } from './services/api';
import { resolveTheme } from './utils/themeUtils';
import { Header } from './components/Header';
import { SavedLocations } from './components/SavedLocations';
import { WeatherHero } from './components/WeatherHero';
import { AqiGauge } from './components/AqiGauge';
import { CropBurningAlert } from './components/CropBurningAlert';
import { ActionableAlerts } from './components/ActionableAlerts';
import { BestTimeToGoOut } from './components/BestTimeToGoOut';
import { AirPurifierSim } from './components/AirPurifierSim';
import { NotificationCenter, FloatingToast } from './components/NotificationCenter';
import { AwsDeployModal } from './components/AwsDeployModal';
import { Footer } from './components/Footer';
import { Loader2, RefreshCw } from 'lucide-react';

export default function App() {
  // Saved locations state
  const [locations, setLocations] = useState(() => {
    try {
      const saved = localStorage.getItem('aero_saved_locations');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATIONS;
    } catch {
      return DEFAULT_LOCATIONS;
    }
  });

  const [currentLocation, setCurrentLocation] = useState(locations[0]);
  const [weatherData, setWeatherData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [unit, setUnit] = useState('C');

  // Health Profile: 'normal', 'sensitive', 'asthma'
  const [healthProfile, setHealthProfile] = useState(() => {
    return localStorage.getItem('aero_health_profile') || 'normal';
  });

  // Theme Override: 'auto' | 'day' | 'night'
  const [themeOverride, setThemeOverride] = useState('auto');

  // Modal and drawer controls
  const [isAwsModalOpen, setIsAwsModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // In-app Push Notification simulation list
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-welcome',
      type: 'clean',
      title: 'Welcome to AeroWeather',
      message: 'Real-time telemetry loaded from Open-Meteo Air Quality & Weather API.',
      time: 'Just now',
      severity: 'good',
      read: false,
    },
  ]);

  const [activeToast, setActiveToast] = useState(null);

  // Save locations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aero_saved_locations', JSON.stringify(locations));
    } catch (e) {
      console.warn('Could not save locations to localStorage', e);
    }
  }, [locations]);

  // Save health profile
  useEffect(() => {
    try {
      localStorage.setItem('aero_health_profile', healthProfile);
    } catch (e) {
      console.warn('Could not save health profile', e);
    }
  }, [healthProfile]);

  // Load weather & AQI for selected location
  const loadData = useCallback(async (loc) => {
    setLoading(true);
    try {
      const data = await fetchWeatherAndAqi(loc.latitude, loc.longitude);
      setWeatherData(data.weather);
      setAqiData(data.aqi);
      setIsLive(data.isLive);

      // Check for automatic notification trigger on load
      const currentUsAqi = data.aqi?.current?.us_aqi || 0;
      const currentPm25 = data.aqi?.current?.pm2_5 || 0;

      if (currentUsAqi > 140) {
        triggerNotification({
          type: 'spike',
          title: `AQI Alert: ${loc.name} reached ${Math.round(currentUsAqi)}`,
          message: 'Particulate density is elevated. Keep windows closed and check mask recommendations.',
          severity: 'danger',
        });
      } else if (currentUsAqi <= 50) {
        triggerNotification({
          type: 'clean',
          title: `Clean Air in ${loc.name} (AQI ${Math.round(currentUsAqi)})`,
          message: 'Optimal air quality. Great time for outdoor sports and opening windows.',
          severity: 'good',
        });
      }
    } catch (err) {
      console.error('Failed to load telemetry', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentLocation) {
      loadData(currentLocation);
    }
  }, [currentLocation, loadData]);

  // Trigger in-app notification & toast
  const triggerNotification = ({ type, title, message, severity = 'warning' }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      severity,
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setActiveToast(newNotif);

    // Auto-dismiss toast after 6 seconds
    setTimeout(() => {
      setActiveToast((current) => (current?.id === newNotif.id ? null : current));
    }, 6000);
  };

  const handleSimulateAlert = (type) => {
    if (type === 'spike') {
      triggerNotification({
        type: 'spike',
        title: '🚨 Sudden PM2.5 Spike Detected',
        message: 'Industrial or traffic plume detected. AQI climbed past 180. Close windows immediately.',
        severity: 'danger',
      });
    } else if (type === 'crop_burn') {
      triggerNotification({
        type: 'crop_burn',
        title: '🔥 Agricultural Stubble Smoke Inflow',
        message: 'Wind shift carrying paddy stubble burning smoke into the metropolitan basin. Wear N95 outdoors.',
        severity: 'danger',
      });
    } else if (type === 'clean') {
      triggerNotification({
        type: 'clean',
        title: '🌤️ Clean Morning Ventilation Window',
        message: 'AQI dropped to 36. Open room windows now for fresh air exchange before afternoon inversion.',
        severity: 'good',
      });
    }
  };

  // Location management
  const handleAddLocation = (newLoc) => {
    setLocations((prev) => {
      const exists = prev.some((l) => l.latitude === newLoc.latitude && l.longitude === newLoc.longitude);
      if (exists) return prev;
      return [...prev, newLoc];
    });
  };

  const handleRemoveLocation = (id) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  };

  const handleUseCurrentGps = (lat, lon) => {
    const gpsLoc = {
      id: `loc-gps-${Date.now()}`,
      label: 'My Location',
      iconType: 'pin',
      name: 'Current GPS',
      country: '',
      latitude: lat,
      longitude: lon,
    };
    handleAddLocation(gpsLoc);
    setCurrentLocation(gpsLoc);
  };

  // Determine current weather parameters for theme resolution
  const currentIsDay = weatherData?.current?.is_day ?? 1;
  const currentWeatherCode = weatherData?.current?.weather_code ?? 0;
  const currentAqiValue = aqiData?.current?.us_aqi ?? 50;

  // Theme resolution: If day -> Light Blue, If night -> Dark Blue
  const themeConfig = resolveTheme({
    isDay: currentIsDay,
    weatherCode: currentWeatherCode,
    aqi: currentAqiValue,
    themeOverride,
  });

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeConfig.bgGradient} theme-transition relative selection:bg-sky-500 selection:text-white`}>
      
      {/* Dynamic ambient gradient glow spheres */}
      <div className={`fixed -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${themeConfig.ambientBlob1}`} />
      <div className={`fixed top-1/2 -right-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none ${themeConfig.ambientBlob2}`} />

      {/* Main Header */}
      <Header
        themeConfig={themeConfig}
        themeOverride={themeOverride}
        setThemeOverride={setThemeOverride}
        healthProfile={healthProfile}
        setHealthProfile={setHealthProfile}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        onOpenAwsModal={() => setIsAwsModalOpen(true)}
        isLive={isLive}
      />

      {/* Saved Locations Bar */}
      <SavedLocations
        locations={locations}
        currentLocation={currentLocation}
        onSelectLocation={setCurrentLocation}
        onAddLocation={handleAddLocation}
        onRemoveLocation={handleRemoveLocation}
        onUseCurrentGps={handleUseCurrentGps}
        themeConfig={themeConfig}
      />

      {/* Loading overlay / spinner */}
      {loading && !weatherData ? (
        <div className="flex flex-col items-center justify-center py-28 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
          <p className="text-sm font-semibold opacity-75">
            Streaming live atmospheric telemetry for {currentLocation?.name}...
          </p>
        </div>
      ) : (
        <main className="relative z-10 space-y-1">
          
          {/* 1. Main Weather Hero Card */}
          <WeatherHero
            weatherData={weatherData}
            currentLocation={currentLocation}
            themeConfig={themeConfig}
            unit={unit}
            onToggleUnit={setUnit}
          />

          {/* 2. Seasonal Crop Burning Alert (October-November + High PM2.5) */}
          <CropBurningAlert
            pm25={aqiData?.current?.pm2_5}
            currentDate={new Date()}
            themeConfig={themeConfig}
            onTriggerSimulateSpike={() => handleSimulateAlert('crop_burn')}
          />

          {/* 3. Live AQI Gauge & Detailed Pollutants Matrix */}
          <AqiGauge
            aqiData={aqiData}
            themeConfig={themeConfig}
          />

          {/* 4. Actionable Alerts (Window, Mask, Outdoor, Eye Protection) */}
          <ActionableAlerts
            aqi={aqiData?.current?.us_aqi}
            pm25={aqiData?.current?.pm2_5}
            pm10={aqiData?.current?.pm10}
            healthProfile={healthProfile}
            themeConfig={themeConfig}
          />

          {/* 5. 24-Hour Forecast & Best Time To Go Out */}
          <BestTimeToGoOut
            aqiData={aqiData}
            weatherData={weatherData}
            themeConfig={themeConfig}
          />

          {/* 6. Smart Air Purifier Control (Simulated IoT) */}
          <AirPurifierSim
            outdoorPm25={aqiData?.current?.pm2_5 || 65}
            themeConfig={themeConfig}
          />

        </main>
      )}

      {/* Footer */}
      <Footer
        themeConfig={themeConfig}
        onOpenAwsModal={() => setIsAwsModalOpen(true)}
      />

      {/* Floating Instant Push Toast */}
      <FloatingToast
        toast={activeToast}
        onDismiss={() => setActiveToast(null)}
      />

      {/* Notifications Drawer / Modal */}
      <NotificationCenter
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        onDismissNotification={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
        onClearAll={() => setNotifications([])}
        onTriggerSimulatedAlert={handleSimulateAlert}
        themeConfig={themeConfig}
      />

      {/* AWS Amplify Hosting Deploy Modal */}
      <AwsDeployModal
        isOpen={isAwsModalOpen}
        onClose={() => setIsAwsModalOpen(false)}
        themeConfig={themeConfig}
      />

    </div>
  );
}
