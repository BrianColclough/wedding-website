import Image from "next/image";
import CountdownTimer from "./components/CountdownTimer";
import FloatingHearts from "./components/FloatingHearts";

export default function Home() {
  const weddingDate = new Date("2026-05-15T16:00:00");

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-periwinkle-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] bg-periwinkle-900/20 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[100px] opacity-40"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative h-svh w-full overflow-hidden">
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
            {/* Darker overlay to make text pop against image */}
            <div className="absolute inset-0 bg-black/40"></div>
            <FloatingHearts />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-white">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-center mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-periwinkle-300 via-white to-periwinkle-300 animate-fade-in-down">
              Brian & Alexis
            </h1>

            <div className="inline-block rounded-full bg-white/5 border border-white/10 px-8 py-3 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors">
              <span className="text-xl md:text-2xl font-medium text-white">
                We&apos;re getting married!
              </span>
            </div>

            <div className="w-full max-w-md rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md transition-all hover:border-periwinkle-500/30 mb-6 group">
              <h2 className="text-center text-xl font-semibold mb-4 text-periwinkle-200 group-hover:text-periwinkle-100 transition-colors">
                Countdown to Our Big Day ⏳
              </h2>
              <CountdownTimer weddingDate={weddingDate} />
            </div>

            <div className="mt-8 animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-periwinkle-300"
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

        {/* Welcome Content */}
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="rounded-3xl bg-white/5 border border-white/10 p-8 md:p-12 backdrop-blur-md transition-all hover:border-periwinkle-500/30">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-periwinkle-300 via-white to-periwinkle-300 mb-4">
                Friday, May 15, 2026
              </h2>
              <div className="w-32 h-1 mx-auto bg-gradient-to-r from-transparent via-periwinkle-500 to-transparent rounded-full"></div>
            </div>

            <div className="space-y-6 text-lg text-gray-200 leading-relaxed text-center">
              <p>
                Welcome to our wedding website! We&apos;re so excited to celebrate this special day with all of our loved ones! 🥂
              </p>

              <p>
                We&apos;ve put together this site to share everything you need to know about our big day. Use the tabs to navigate through our site - you&apos;ll find our story, RSVP details, venue information, and more!
              </p>

              <div className="pt-6 border-t border-white/10 mt-8">
                <p className="text-gray-300">
                  If you have any questions or concerns, please feel free to contact Alexis at{" "}
                  <a
                    href="tel:+18562201476"
                    className="text-periwinkle-300 hover:text-white transition-colors font-medium decoration-periwinkle-500/30 underline underline-offset-4 hover:decoration-periwinkle-300"
                  >
                    (856) 220-1476
                  </a>{" "}
                  or Brian at{" "}
                  <a
                    href="tel:+13369052142"
                    className="text-periwinkle-300 hover:text-white transition-colors font-medium decoration-periwinkle-500/30 underline underline-offset-4 hover:decoration-periwinkle-300"
                  >
                    (336) 905-2142
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
