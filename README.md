# 🌤️ AeroWeather: Live Air Quality & Smoke Alerts

**Team AeroWeathers** | Environmental Hacks 2026 (WeMakeDevs x AWS)

**Live app:** https://main.d1nkjnb4jf6v1s.amplifyapp.com/

---

## The problem

Every October and November, smoke from stubble burning and winter inversion layers push Delhi-NCR's air quality into the "Unhealthy" and "Hazardous" range. Most people only check an AQI number, if they check at all, and don't know what to *do* about it: whether to open windows, wear a mask, exercise outside, or when the cleanest part of the day is.

## Our solution

AeroWeather turns raw air-quality data into plain-language actions, and sends an email alert when air quality turns bad, so people don't have to keep checking.

## Features

- **Live AQI and pollutants:** US AQI, PM2.5, PM10, O₃, NO₂, CO, plus temperature, humidity and wind (Open-Meteo API, no key needed).
- **Best time to go out:** scans the next 24 hours and shows the cleanest and the riskiest windows.
- **Four actionable alerts:** windows (open or sealed), mask type, outdoor exercise, and eye protection.
- **Health profiles:** Standard, Sensitive Groups, and Asthma/Respiratory, each with lower warning thresholds.
- **Seasonal smoke-risk alert:** during October-November, when PM2.5 is 60 µg/m³ or higher, a banner explains likely stubble-smoke impact. *This is a rule-based estimate and does not use satellite fire data.*
- **Saved locations, city search and GPS:** stored in the browser's `localStorage`.
- **Day/night themes:** automatic or manual.
- **Real email alerts through AWS** (see below).

## How we use AWS

| AWS service | What it does in this project |
|---|---|
| **AWS Amplify Hosting** | Hosts the React app and rebuilds it automatically on every push to `main`. |
| **AWS Lambda** | `lambda/aqi-alert/index.mjs` fetches Delhi's current AQI from Open-Meteo and checks it against a threshold. |
| **Amazon EventBridge** | Triggers the Lambda function on a schedule (every hour). |
| **Amazon SNS** | Sends an email alert to subscribers when AQI crosses the threshold. |

**Flow:** EventBridge (schedule) → Lambda (fetch and check AQI) → SNS (email alert)

## Honest notes

- The **smart air purifier card** and the **in-app notification center test buttons** are **demo-only simulations** to show how the app could connect to smart-home devices later. They are not connected to real hardware or AWS IoT.
- Smoke-risk detection is based on season and PM2.5, not live fire data.
- Not medical advice.

## AI tools used

This project was built with the help of **Google Antigravity** and **Claude** (AI coding assistants) for writing, debugging and setting up AWS services.

## Tech stack

- React 19 + Vite
- Tailwind CSS v4
- Lucide React icons
- Open-Meteo Air Quality & Weather API (free, no key)
- AWS Amplify, Lambda, EventBridge, SNS

## Run locally

```bash
git clone https://github.com/atharvsharmaa70-ux/aero-weather-aqi.git
cd aero-weather-aqi
npm install
npm run dev
```

Build for production: `npm run build`

## Deploy to AWS Amplify

1. Push the repo to GitHub.
2. In the AWS Amplify Console, choose **Host web app** → **GitHub** and select this repo and the `main` branch.
3. Amplify detects the build settings automatically. Click **Save and deploy**.

## Set up the alert backend

1. Create an SNS topic and subscribe your email.
2. Create a Lambda function (Node.js 22.x) with the code from `lambda/aqi-alert/index.mjs`.
3. Set the environment variables `TOPIC_ARN` and `AQI_THRESHOLD` (default 150).
4. Give the Lambda role permission for `sns:Publish` on the topic.
5. Add an EventBridge schedule trigger, for example `rate(1 hour)`.

## What's next

- Use NASA FIRMS satellite fire data for real stubble-burn detection.
- Store AQI history in DynamoDB to show trends.
- Add SMS and WhatsApp alerts and Hindi language support.

## Credits

- Air quality and weather data: [Open-Meteo](https://open-meteo.com)
- Icons: [Lucide](https://lucide.dev)
