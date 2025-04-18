"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  weddingDate: Date;
}

export default function CountdownTimer({ weddingDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = weddingDate.getTime() - new Date().getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

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
