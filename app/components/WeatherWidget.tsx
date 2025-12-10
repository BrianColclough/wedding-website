"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  temp: number;
  code: number;
  isDay: number;
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      try {
        // Salisbury, NC coordinates
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=35.6295&longitude=-80.3240&current=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit"
        );
        if (!res.ok) throw new Error("Weather fetch failed");

        const data = await res.json();
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          code: data.current.weather_code,
          isDay: data.current.is_day,
        });
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="mt-3 p-3 rounded-xl bg-black/20 border border-white/5 animate-pulse flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-white/10"></div>
        <div className="space-y-1 flex-1">
          <div className="h-3 w-20 bg-white/10 rounded"></div>
          <div className="h-2 w-16 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) return null;

  // Weather Icon Component
  const WeatherIcon = ({ code, isDay }: { code: number; isDay: number }) => {
    // Clear Sky
    if (code === 0) {
      return isDay ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-200 drop-shadow-[0_0_8px_rgba(191,219,254,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
      );
    }
    // Cloudy / Partly Cloudy
    if (code >= 1 && code <= 3) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-100 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19c0-1.7-1.3-3-3-3h-1.1c-.2-1.7-1.7-3-3.4-3-1.9 0-3.5 1.6-3.5 3.5 0 .3 0 .5.1.8h-.1c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5h11c1.7 0 3-1.3 3-3Z" /><path d="M12 2v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /></svg>
      );
    }
    // Rain / Drizzle
    if (code >= 51 && code <= 67 || (code >= 80 && code <= 82)) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-200 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M16 14v6" /><path d="M8 14v6" /><path d="M12 16v6" /></svg>
      );
    }
    // Snow
    if (code >= 71 && code <= 77) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10 14-2.5 2.5" /><path d="m14 10 2.5-2.5" /><path d="M12 22v-6.5" /><path d="M12 8.5V2" /><path d="m4.34 7.43 4.24 4.25" /><path d="m15.42 12.32 4.24 4.25" /><path d="m16.24 7.43-4.24 4.25" /><path d="m7.58 12.32-4.24 4.25" /><circle cx="12" cy="12" r="2" /></svg>
      );
    }
    // Thunder
    if (code >= 95) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" /><polyline points="13 11 9 17 15 17 11 23" /></svg>
      );
    }

    // Default (Fog or other)
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 6h14" /><path d="M4 10h16" /><path d="M6 14h12" /><path d="M4 18h16" /></svg>
    );
  };

  const getWeatherLabel = (code: number) => {
    if (code === 0) return "Clear Sky";
    if (code >= 1 && code <= 3) return "Cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 71 && code <= 77) return "Snowy";
    if (code >= 80 && code <= 82) return "Showers";
    if (code >= 95) return "Stormy";
    return "Overcast";
  };

  const getGradient = (code: number, isDay: number) => {
    // Night
    if (!isDay) return "bg-gradient-to-br from-indigo-900 via-indigo-950 to-black";

    // Clear Day
    if (code === 0) return "bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600";

    // Cloudy
    if (code >= 1 && code <= 3) return "bg-gradient-to-br from-gray-400 via-gray-500 to-slate-600";

    // Rain
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900";

    // Storm
    if (code >= 95) return "bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900";

    // Default
    return "bg-gradient-to-br from-periwinkle-500 via-periwinkle-600 to-indigo-700";
  }

  return (
    <div className={`h-full w-full rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden ${getGradient(weather.code, weather.isDay)}`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

      <div className="flex justify-between items-start z-10">
        <div>
          <p className="font-semibold text-lg tracking-wide">Salisbury, NC</p>
          <p className="text-xs text-white/80 uppercase font-medium mt-1">{getWeatherLabel(weather.code)}</p>
        </div>
        <WeatherIcon code={weather.code} isDay={weather.isDay} />
      </div>

      <div className="z-10 mt-4">
        <p className="text-6xl font-bold tracking-tighter">{weather.temp}°</p>
        <div className="flex items-center gap-2 mt-2 text-sm text-white/80">
          <span className="bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">Outdoor Ceremony</span>
        </div>
      </div>
    </div>
  );
}
