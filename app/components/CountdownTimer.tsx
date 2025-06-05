"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  weddingDate: Date;
}

// Pure function - can be calculated during render
function calculateTimeLeft(weddingDate: Date): TimeLeft {
  const now = Date.now();
  const difference = weddingDate.getTime() - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export default function CountdownTimer({ weddingDate }: CountdownTimerProps) {
  const [currentTime, setCurrentTime] = useState(Date.now);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const timeLeft = useMemo(() => calculateTimeLeft(weddingDate), [weddingDate, currentTime]);

  const isFinished = timeLeft.days === 0 && timeLeft.hours === 0 &&
    timeLeft.minutes === 0 && timeLeft.seconds === 0;

  useEffect(() => {
    if (isFinished) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isFinished]);

  return (
    <div className="flex justify-center flex-wrap">
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="flex flex-col items-center p-3">
          <div className="text-4xl md:text-5xl font-bold mb-1">
            {timeLeft.days}
          </div>
          <div className="text-sm uppercase tracking-wider">Days</div>
        </div>
        <div className="flex flex-col items-center p-3">
          <div className="text-4xl md:text-5xl font-bold mb-1">
            {timeLeft.hours}
          </div>
          <div className="text-sm uppercase tracking-wider">Hours</div>
        </div>
        <div className="flex flex-col items-center p-3">
          <div className="text-4xl md:text-5xl font-bold mb-1">
            {timeLeft.minutes}
          </div>
          <div className="text-sm uppercase tracking-wider">Minutes</div>
        </div>
        <div className="flex flex-col items-center p-3">
          <div className="text-4xl md:text-5xl font-bold mb-1">
            {timeLeft.seconds}
          </div>
          <div className="text-sm uppercase tracking-wider">Seconds</div>
        </div>
      </div>
    </div>
  );
}
