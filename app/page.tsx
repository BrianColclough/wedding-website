import Image from "next/image";
import CountdownTimer from "./components/CountdownTimer";
import FloatingHearts from "./components/FloatingHearts";

export default function Home() {
  const weddingDate = new Date("2026-05-15T16:00:00");

  return (
    <>
      <div className="grid grid-cols-12 min-h-svh">
        <div className="col-span-12 relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/wedding-hero.webp"
              alt="Brian and Alexis"
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={90}
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <FloatingHearts />
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
              <CountdownTimer weddingDate={weddingDate} />
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
      <div className="flex flex-col items-center justify-center">
        <div className="col-span-12">
          <h2 className="text-center text-4xl font-bold text-periwinkle-300 mt-12 mb-2">Friday, May 15, 2026</h2>
          <div className="w-32 h-0.5 mx-auto bg-periwinkle-400 rounded-full mb-8"></div>
          <div className="text-center text-gray-200 max-w-3xl flex flex-col gap-6 mb-12 mx-4 sm:mx-0">
            <p>
              Welcome to our wedding website! We&apos;re so excited to celebrate this special day with all of our loved ones!
            </p>

            <p>
              We&apos;ve put together this site to share everything you need to know about our big day. Use the tabs to navigate through our site - you&apos;ll find our story, RSVP details, venue information, and more!
            </p>

            <p>
              If you have any questions or concerns, please feel free to contact Alexis at <a href="tel:+18562201476" className="text-periwinkle-300 hover:text-periwinkle-400 transition-colors">(856) 220-1476</a> or Brian at <a href="tel:+13369052142" className="text-periwinkle-300 hover:text-periwinkle-400 transition-colors">(336) 905-2142</a>  .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
