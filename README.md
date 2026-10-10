# 🌤️ AeroWeather — Dynamic Weather & AQI Sentinel

> **A real-time atmospheric and air quality intelligence app** featuring dynamic day/night theme adaptation (Light Blue by Day, Dark Blue by Night), predictive outdoor activity planning, crop burning detection, and simulated smart home integrations.
>
> Built with zero API keys using **Open-Meteo Air Quality & Weather API** and engineered for 1-click deployment on **AWS Amplify Hosting**.

---

## 🚀 Live Demo & AWS Qualification

- **AWS Qualification Rule:** *“Use an AWS open source tool or be deployed on AWS.”*
- **Deployment Target:** [AWS Amplify Hosting](https://aws.amazon.com/amplify/hosting/)
- **Build Specification:** Pre-configured [`amplify.yml`](./amplify.yml) in root directory for zero-config CI/CD.
- **Simulated AWS Integrations:**
  - **AWS IoT Core (Simulated MQTT):** Connected air purifier telemetry with dynamic indoor PM2.5 monitoring.
  - **AWS SNS / Web Push (Simulated):** In-app alert notification pipeline for sudden pollution spikes.

---

## 🌟 Feature Breakdown

### 🎨 1. Dynamic Weather & Day/Night Theme
- **Daytime:** Luminous **Light Blue** palette (`from-sky-200 via-sky-100 to-blue-200`), frosted glass cards, and sunshine accents.
- **Nighttime:** Deep Midnight **Dark Blue** palette (`from-slate-950 via-slate-900 to-blue-950`), dark glassy cards, and moonlit cyan accents.
- **Condition Tuning:** Adapts to rain (cool slate blue), fog, and heavy smog.
- **Demo Switcher:** Toggle between **Auto (matches live sun/moon)**, **Force Day (Light Blue)**, and **Force Night (Dark Blue)** anytime!

### 📡 2. Real Live Telemetry (Open-Meteo API — No Keys Needed)
- **Live AQI:** Real-time US AQI (0–500 scale) with EPA standard categories:
  - 🌿 *Good (0–50)* · 🌤️ *Moderate (51–100)* · ⚠️ *Unhealthy for Sensitive Groups (101–150)* · 🚨 *Unhealthy (151–200)* · 🛑 *Very Unhealthy (201–300)* · ☣️ *Hazardous (301+)*
- **Detailed Pollutants:** PM2.5 (fine combustion soot), PM10 (coarse dust), European AQI (EAQI), Ozone ($O_3$), Nitrogen Dioxide ($NO_2$), and Carbon Monoxide ($CO$).
- **Live Weather Metrics:** Temperature (°C / °F toggle), Feels Like, Humidity %, Wind Speed & Angle, and Precipitation.

### 📍 3. Saved Locations & Global Search
- **Quick Preset Pills:**
  - 🏠 **Home:** New Delhi (displays active autumn crop burning smoke telemetry)
  - 🏢 **Office:** London (maritime climate & European AQI)
  - 🎓 **School:** San Francisco (Pacific coastal air quality)
- **Global Search:** Type any city in the world with instant geocoding autocomplete.
- **GPS Locator:** 1-tap `navigator.geolocation` button for device location.
- **Persistent:** Saved directly to `localStorage`.

### ⏱️ 4. 24-Hour Forecast & "Best Time To Go Out"
- **Hourly AQI Progression Bar Chart:** Color-coded EPA bars for the upcoming 24 hours.
- **Optimal Outdoor Air Window:** Detects the cleanest window (e.g. `06:00 AM – 09:00 AM (AQI 42)`).
- **Peak Risk Window:** Warns against high pollution intervals to prevent deep-lung particulate exposure during cardio or sports.

### 🛡️ 5. Four Actionable Rule-Based Alerts
- 🪟 **Window Status:** Safe to ventilate vs keep sealed.
- 😷 **Mask Recommendation:** None vs Light Mask vs N95/FFP2 Respirator required.
- 🏃 **Outdoor Activity Alert:** Safe for outdoor cardio vs indoor workout replacement.
- 👁️ **Eye & Mucous Membrane Protection:** Clear vs Wraparound glasses & lubricating drops for particulate sting.

### 🩺 6. Health Sensitivity Profile
- Select between:
  - **Standard / Normal:** Standard EPA thresholds.
  - **Sensitive Groups:** Early warning triggers for children, elderly, and pregnancy.
  - **Asthma / Respiratory:** Hyper-protective mode with rescue inhaler alerts at lower AQI cutoffs.

### 🔥 7. Seasonal Crop Residue / Stubble Burning Alert
- Triggers automatically during **October – November** when **PM2.5 $\ge 60$ $\mu g/m^3$**.
- Explains regional farm stubble burning, atmospheric autumn thermal inversion lids, and particulate health hazards.
- Includes a test preview toggle to demonstrate the banner anytime.

### 🔌 8. Smart Air Purifier Control (Simulated IoT)
- Sleek connected appliance card: **AeroShield Pro 450 (Living Room)**.
- **On / Off Power Switch** with glowing aura.
- Fan Speeds: *Quiet*, *Auto*, *Medium*, *Turbo CADR (450 $m^3/h$)*.
- **Dynamic Indoor PM2.5 Counter:** Drops down to pristine levels ($8–12$ $\mu g/m^3$) when purifier runs, or slowly rises if turned off!
- **True HEPA H13 Filter Health Bar:** Remaining lifespan tracker.
- **Auto-Clean Trigger:** Automatically kicks purifier into Turbo when outdoor air spikes.

### 🔔 9. Push Notifications Simulation (In-App Alert Cards)
- Notification Bell with unread counter badge.
- Floating in-app toast cards when alerts trigger.
- Notification Center drawer with test buttons to trigger on-demand:
  - `+ AQI Spike Warning`
  - `+ Crop Smoke Alert`
  - `+ Clean Window Alert`

---

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 with custom glassmorphism and theme transitions
- **Icons:** Lucide React
- **Data Source:** [Open-Meteo Air Quality & Weather API](https://open-meteo.com) (100% Free, No signup, No API keys)
- **Hosting Target:** AWS Amplify Hosting

---

## 📦 Local Setup & Development

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/aero-weather-aqi.git
cd aero-weather-aqi

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## ☁️ 3-Minute Deployment to AWS Amplify Hosting

1. **Commit and push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: complete AeroWeather app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/aero-weather-aqi.git
   git push -u origin main
   ```

2. **Open AWS Amplify Console:**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify).
   - Click **Host web app** > Select **GitHub**.
   - Authorize AWS and select the `aero-weather-aqi` repository and `main` branch.

3. **Deploy:**
   - AWS Amplify automatically detects the included [`amplify.yml`](./amplify.yml).
   - Click **Save and deploy**.
   - Your live HTTPS URL will be online in ~90 seconds!

---

## 📄 License

MIT Open Source License.
