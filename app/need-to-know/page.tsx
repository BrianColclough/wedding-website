import MapWithMarkers from "@/app/components/MapWithMarkers";
import WeatherWidget from "@/app/components/WeatherWidget";

export default function Info() {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 relative selection:bg-periwinkle-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] bg-periwinkle-900/20 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[100px] opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-12 text-center relative z-10">
          <div className="inline-block animate-fade-in-down">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-periwinkle-300 via-white to-periwinkle-300 pb-2 tracking-tight">
              Need to Knows
            </h1>
            <div className="h-1 w-1/3 mx-auto bg-gradient-to-r from-transparent via-periwinkle-500 to-transparent rounded-full mt-2"></div>
            <p className="mt-4 text-periwinkle-200 text-lg md:text-xl font-light max-w-2xl mx-auto">
              Everything you need to know to celebrate with us on our special day
            </p>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">

          {/* 1. KEY DETAILS (Large Card) */}
          <div className="lg:col-span-2 row-span-1 group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-md transition-all hover:bg-white/10 hover:border-periwinkle-500/30 hover:shadow-2xl hover:shadow-periwinkle-900/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-periwinkle-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-periwinkle-500/20 transition-all duration-700"></div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-periwinkle-300 uppercase bg-periwinkle-900/50 rounded-full border border-periwinkle-700/30">
                  Date, Time & Location
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Our wedding will take place on <span className="text-periwinkle-200">Friday, May 15th, 2026</span> at Cedar Hill Weddings & Events.
                </h2>
                <p className="text-lg text-gray-200 leading-relaxed max-w-2xl">
                  The ceremony begins at <strong className="text-white">4:30 pm</strong>, so please plan to arrive by <strong className="text-white">4:00 pm</strong> to allow yourself time to get situated before the ceremony.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">Venue Address</p>
                  <p className="text-lg font-medium text-white">450 Clark Road</p>
                  <p className="text-periwinkle-200">Salisbury, NC 28146</p>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">Hotel Address</p>
                  <p className="text-lg font-medium text-white">1001 Klumac Rd</p>
                  <p className="text-periwinkle-200">Salisbury, NC 28144, US</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. MAP (Square Card) */}
          <div className="lg:col-span-1 row-span-1 min-h-[300px] relative rounded-3xl overflow-hidden border border-white/10 group">
            <div className="absolute inset-0 z-0">
              <MapWithMarkers />
            </div>
            <div className="absolute inset-0 pointer-events-none border-4 border-black/10 rounded-3xl z-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
          </div>

          {/* 3. SCHEDULE (Tall Card) */}
          <div className="lg:col-span-1 lg:row-span-2 rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md transition-all hover:border-periwinkle-500/30">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-2xl">⏳</span> Schedule
            </h3>
            <p className="text-gray-300 mb-6 text-sm">Here&apos;s an outline of the day so you know what to expect:</p>
            <div className="space-y-0 relative pl-4 border-l-2 border-white/10">
              {[
                { time: "4:00 pm", event: "Guest Arrival" },
                { time: "4:30 pm", event: "Ceremony Begins" },
                { time: "5:00 pm", event: "Cocktail Hour" },
                { time: "6:00 pm", event: "Dinner & Reception" },
                { time: "8:00 pm", event: "Dancing & Celebration" },
                { time: "10:00 pm", event: "Sendoff and Return to Hotel" },
              ].map((item, i) => (
                <div key={i} className="mb-6 relative group last:mb-0">
                  <div className="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full bg-periwinkle-500 ring-4 ring-black group-hover:scale-125 transition-transform"></div>
                  <time className="block text-sm font-mono text-periwinkle-300 mb-1">{item.time}</time>
                  <h4 className="text-lg font-semibold text-white">{item.event}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* 4. SHUTTLE (Standard Card) */}
          <div className="md:col-span-1 lg:col-span-2 rounded-3xl bg-gradient-to-br from-periwinkle-900/40 to-black border border-periwinkle-500/20 p-6 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Shuttle Service 🚌</h3>
            <div className="space-y-4 text-gray-200 mb-6 max-w-2xl">
              <p>
                To make your evening as easy and enjoyable as possible, we&apos;re offering a <strong className="text-white">complimentary shuttle</strong> to and from the hotel. If you plan to enjoy several drinks, we highly encourage you to ride with us for a safe, stress-free celebration!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <p className="text-xs uppercase tracking-wider text-periwinkle-300 mb-1">Pickup</p>
                <p className="font-semibold text-white">From: Hampton Inn Salisbury</p>
                <p className="text-white">Time: 3:45 pm</p>
                <p className="text-sm text-gray-400 mt-1">Arrival at venue: approximately 4:00 pm</p>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <p className="text-xs uppercase tracking-wider text-periwinkle-300 mb-1">Return</p>
                <p className="font-semibold text-white">To: Hampton Inn Salisbury</p>
                <p className="text-white">Departure: approximately 10:30 pm</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-amber-200/90 italic bg-amber-900/10 p-2 rounded border border-amber-900/20 inline-block">
              <strong>Remember:</strong> Please check the shuttle box on your RSVP form so we know how many people to expect!
            </div>
          </div>

          {/* 5. ACCOMMODATIONS (Standard Card) */}
          <div className="lg:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md transition-all  hover:border-periwinkle-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Accommodations 🏨</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white">Hotel Block - Hampton Inn Salisbury</h4>
                <p className="text-sm text-gray-300">
                  We&apos;ve reserved a room block at the Hampton Inn in Salisbury for both Thursday and Friday night.
                </p>
                <div className="flex flex-col gap-2 text-sm text-gray-400 mt-2">
                  <p><strong className="text-periwinkle-200">Address:</strong> 1001 Klumac Rd, Salisbury, NC</p>
                  <p><strong className="text-periwinkle-200">Room Block Rate:</strong> $159 per night</p>
                  <p><strong className="text-periwinkle-200">Booking Deadline:</strong> April 15th, 2026</p>
                </div>
                <a href="https://group.hamptoninn.com/lv6nxh" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-4 py-2 bg-periwinkle-600 hover:bg-periwinkle-500 text-white text-sm font-medium rounded-lg transition-colors">
                  Book with our discounted rate
                </a>
              </div>

              <div className="space-y-3 md:pl-8 md:border-l border-white/10">
                <h4 className="text-lg font-semibold text-white">Alternative Options</h4>
                <p className="text-sm text-gray-300">
                  Prefer something more private? There are a few nearby Airbnb homes available for rent—perfect for groups or families. These tend to book quickly, so we recommend securing your spot early!
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  <a href="https://www.airbnb.com/rooms/53949423?check_in=2026-05-14&check_out=2026-05-16&search_mode=regular_search&source_impression_id=p3_1746385633_P3r3UL6AEtn1DTxL&previous_page_section_name=1000&federated_search_id=3001d3d0-c447-4901-9b89-41fc23cd5c78&guests=1&adults=1" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded  transition-colors group border border-white/5">
                    <span className="text-periwinkle-200 group-hover:text-white font-medium">Oar House <span className="text-xs text-gray-400 font-normal ml-1">(Sleeps 15)</span></span>
                    <span className="text-gray-500 group-hover:text-white">↗</span>
                  </a>
                  <a href="https://www.airbnb.com/rooms/1155862286490450718?check_in=2026-05-14&check_out=2026-05-16&search_mode=regular_search&source_impression_id=p3_1746385633_P3JvcqIzubqAYKOV&previous_page_section_name=1000&federated_search_id=3001d3d0-c447-4901-9b89-41fc23cd5c78&guests=1&adults=1" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded  transition-colors group border border-white/5">
                    <span className="text-periwinkle-200 group-hover:text-white font-medium">Lakefront Retreat <span className="text-xs text-gray-400 font-normal ml-1">(Sleeps 9)</span></span>
                    <span className="text-gray-500 group-hover:text-white">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 6. PARKING (Standard Card) */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md transition-all  hover:border-periwinkle-500/30">
            <h3 className="text-xl font-bold text-white mb-3">Parking 🚗</h3>
            <div className="text-gray-300 text-sm space-y-3">
              <p>The parking lot at the venue can accommodate <strong className="text-white">100 vehicles</strong>.</p>
              <p>
                Please note that the parking lot is a <strong className="text-white">one-way circle</strong> to park as many cars as possible. Signage, cones, and chains are used to direct cars. Spaces are marked with railroad ties and painted lines.
              </p>
            </div>
          </div>

          {/* 7. ATTIRE (Standard Card) */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md transition-all  hover:border-periwinkle-500/30">
            <h3 className="text-xl font-bold text-white mb-3">Attire & Dress Code 👗</h3>
            <p className="text-gray-200 text-sm mb-4">
              We&apos;re excited to see you all dressed up! Our wedding dress code is <strong className="text-white">semi-formal</strong>.
            </p>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-periwinkle-200 uppercase tracking-wide">For Women</h4>
                <p className="text-sm text-gray-400">Cocktail dresses, midi or maxi dresses, and jumpsuits are perfect.</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-periwinkle-200 uppercase tracking-wide">For Men</h4>
                <p className="text-sm text-gray-400">Dress shirts paired with khakis or slacks work well.</p>
              </div>
              <div className="bg-red-900/10 p-3 rounded border border-red-900/20 mt-2">
                <p className="text-xs text-red-200 font-semibold mb-1">Please Avoid:</p>
                <ul className="text-xs text-red-300 space-y-0.5">
                  <li>• White or ivory (reserved for the bride)</li>
                  <li>• Lavender (our bridal party color)</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 italic">
              If you have any questions about what to wear, feel free to reach out to the bride or groom - we&apos;d be happy to help!
            </p>
          </div>

          {/* 8. WEATHER & EXTRAS (Grouped Column) */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl hover:scale-[1.02] transition-transform duration-300 h-full">
              <WeatherWidget />
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md transition-all  hover:border-periwinkle-500/30 flex flex-col justify-center">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Little Ones Welcome 👶</h3>
                <p className="text-sm text-gray-300">
                  We&apos;re excited to have little ones join us to celebrate! <strong className="text-white">Children are welcome</strong> at our wedding.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <h4 className="font-bold text-white mb-1">🌤️ Note</h4>
                <p className="text-sm text-gray-400">Ceremony is outdoors. Plan accordingly!</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
