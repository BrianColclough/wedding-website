import Image from "next/image";
import { Suspense } from "react";
import CountdownTimer from "./components/CountdownTimer";

export default function Home() {
  const weddingDate = new Date("2026-05-15T16:00:00");

  return (
    <div className="grid grid-cols-12 min-h-svh">
      <div className="col-span-12 relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/Lexi&B.jpg"
            alt="Brian and Alexis"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-white">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-center mb-6 tracking-tight">
            Brian & Alexis
          </h1>

          <div className="text-xl md:text-2xl font-medium bg-white/10 px-6 py-3 rounded-lg backdrop-blur-md mb-8">
            We&apos;re getting married!
          </div>

          <div className="w-full max-w-md bg-white/10 rounded-lg backdrop-blur-md p-4 mb-6">
            <h2 className="text-center text-xl font-semibold mb-4">
              Countdown to Our Big Day
            </h2>
            <Suspense
              fallback={<div className="text-center">Loading countdown...</div>}
            >
              <CountdownTimer weddingDate={weddingDate} />
            </Suspense>
          </div>

          <div className="mt-4 animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
