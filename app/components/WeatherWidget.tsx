"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

type Weather = {
  temp: number;
  wind: number;
  code: number;
};

export default function WeatherWidget() {
  const [data, setData] = useState<Weather | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=35.629467&longitude=-80.324048&current=temperature_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph";
    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        setData({
          temp: j.current?.temperature_2m,
          wind: j.current?.wind_speed_10m,
          code: j.current?.weather_code,
        });
      })
      .catch(() => setErr("Weather unavailable"))
      .finally(() => setIsLoading(false));
  }, []);

  if (err) return <div className="text-amber-200">{err}</div>;
  if (isLoading || !data)
    return (
      <div className="p-1 bg-periwinkle-900/20 rounded-lg border border-periwinkle-700/40">
        <LoadingSpinner message="Loading weather…" />
      </div>
    );

  const codeToText = (c: number) => {
    const map: Record<number, string> = {
      0: "Clear",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Light freezing drizzle",
      57: "Dense freezing drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Light freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    return map[c] || "Unknown";
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-periwinkle-900/20 rounded-lg border border-periwinkle-700/40">
      <div className="text-2xl font-semibold text-white">
        {Math.round(data.temp)}°F
      </div>
      <div className="text-sm text-periwinkle-200">
        <div>{codeToText(data.code)}</div>
        <div>Wind {Math.round(data.wind)} mph</div>
        <div className="text-xs opacity-70">Salisbury, NC</div>
      </div>
    </div>
  );
}

