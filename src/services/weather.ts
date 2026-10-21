import type Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";

import type { EventItem } from "@/types";

export type Weather = {
  icon: ComponentProps<typeof Ionicons>["name"];
  temp: number;
};

type Forecast = {
  daily: {
    time: string[]; // ["2026-10-21", "2026-10-22", …] (16 jours)
    weather_code: (number | null)[];
    temperature_2m_max: (number | null)[];
  };
};

// Garde la réponse de l'API par lieu pour ne pas la redemander
const cache = new Map<string, Forecast>();

async function getForecast(latitude: number, longitude: number) {
  const key = `${latitude},${longitude}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      "&daily=weather_code,temperature_2m_max&timezone=auto&forecast_days=16",
  );
  const forecast: Forecast = await res.json();
  cache.set(key, forecast);
  return forecast;
}

// Code météo renvoyé par l'API → icône
function weatherIcon(code: number): Weather["icon"] {
  if (code === 0) return "sunny-outline";
  if (code <= 3) return "partly-sunny-outline";
  if (code <= 48) return "cloudy-outline";
  if (code >= 71 && code <= 77) return "snow-outline";
  if (code >= 95) return "thunderstorm-outline";
  return "rainy-outline";
}

// Météo du jour de l'événement, ou null si l'API n'a pas de prévision pour ce jour
export async function getEventWeather(event: EventItem): Promise<Weather | null> {
  try {
    const { daily } = await getForecast(event.latitude, event.longitude);
    const i = daily.time.indexOf(event.startsAt.slice(0, 10)); // -1 si date absente
    const code = daily.weather_code[i];
    const temp = daily.temperature_2m_max[i];
    if (code == null || temp == null) return null;

    return { icon: weatherIcon(code), temp: Math.round(temp) };
  } catch {
    return null; // pas de réseau : pas de météo sur la carte
  }
}
