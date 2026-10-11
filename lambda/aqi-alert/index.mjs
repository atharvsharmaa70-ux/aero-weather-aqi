import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({});

const LAT = 28.6139; // New Delhi
const LON = 77.2090;

export const handler = async () => {
  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${LAT}&longitude=${LON}` +
    `&current=us_aqi,pm2_5,pm10&timezone=Asia%2FKolkata`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  const data = await res.json();

  const { us_aqi, pm2_5, pm10 } = data.current;
  const threshold = Number(process.env.AQI_THRESHOLD || 150);

  console.log(`Delhi AQI: ${us_aqi}, PM2.5: ${pm2_5}, threshold: ${threshold}`);

  if (us_aqi >= threshold) {
    await sns.send(
      new PublishCommand({
        TopicArn: process.env.TOPIC_ARN,
        Subject: `AeroWeather alert: Delhi AQI is ${us_aqi}`,
        Message:
          `Air quality in Delhi is unhealthy.\n\n` +
          `US AQI: ${us_aqi}\nPM2.5: ${pm2_5} ug/m3\nPM10: ${pm10} ug/m3\n\n` +
          `Recommendation: keep windows closed, wear an N95 mask outdoors, ` +
          `and avoid outdoor exercise.\n\n` +
          `Live dashboard: https://main.d1nkjnb4jf6v1s.amplifyapp.com/`,
      })
    );
    return { alertSent: true, us_aqi };
  }

  return { alertSent: false, us_aqi };
};
