export default function Info() {
  return (
    <div className="container mx-auto bg-black text-white px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Need to Know</h1>
        <div className="w-16 h-0.5 mx-auto bg-periwinkle-400 rounded-full mb-3"></div>
        <p className="text-lg font-light text-periwinkle-200 max-w-2xl mx-auto">
          Everything you need to know to celebrate with us on our special day
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Date, Time & Location */}
        <div className="backdrop-blur-sm bg-black/30 rounded-xl shadow-lg border border-periwinkle-700/30 p-6">
          <h2 className="text-2xl font-semibold text-periwinkle-300 mb-4">Date, Time &amp; Location</h2>
          <div className="space-y-3 text-gray-200">
            <p>Our wedding will take place on <strong className="text-white">Friday, May 15th, 2026</strong> at Cedar Hill Weddings &amp; Events.</p>
            <p>The ceremony begins at <strong className="text-white">4:30 pm</strong>, so please plan to arrive by <strong className="text-white">4:00 pm</strong> to allow yourself time to get situated before the ceremony.</p>
            <div className="mt-4 p-3 bg-periwinkle-900/20 rounded-lg border border-periwinkle-700/40">
              <p className="font-medium text-periwinkle-200">Venue Address:</p>
              <p className="text-white">450 Clark Road, Salisbury, NC 28146</p>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="backdrop-blur-sm bg-black/30 rounded-xl shadow-lg border border-periwinkle-700/30 p-6">
          <h2 className="text-2xl font-semibold text-periwinkle-300 mb-4">Schedule</h2>
          <p className="text-gray-200 mb-4">Here&apos;s an outline of the day so you know what to expect:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
              <span className="text-periwinkle-200">Guest Arrival</span>
              <span className="font-medium text-white">4:00 pm</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
              <span className="text-periwinkle-200">Ceremony Begins</span>
              <span className="font-medium text-white">4:30 pm</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
              <span className="text-periwinkle-200">Cocktail Hour</span>
              <span className="font-medium text-white">5:00 pm</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
              <span className="text-periwinkle-200">Dinner &amp; Reception</span>
              <span className="font-medium text-white">6:00 pm</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
              <span className="text-periwinkle-200">Dancing &amp; Celebration</span>
              <span className="font-medium text-white">8:00 pm</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
              <span className="text-periwinkle-200">Sendoff</span>
              <span className="font-medium text-white">10:00 pm</span>
            </div>
          </div>
        </div>

        {/* Shuttle Service */}
        <div className="backdrop-blur-sm bg-black/30 rounded-xl shadow-lg border border-periwinkle-700/30 p-6">
          <h2 className="text-2xl font-semibold text-periwinkle-300 mb-4">Shuttle Service</h2>
          <div className="space-y-4 text-gray-200">
            <p>Please check back later</p>
            {/* <p>To make your evening as easy and enjoyable as possible, we&apos;re offering a complimentary shuttle to and from the Courtyard by Marriott Salisbury. If you plan to enjoy a drink or two, we highly encourage you to ride with us for a safe, stress-free celebration!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-periwinkle-900/20 rounded-lg border border-periwinkle-700/40">
                <h3 className="font-semibold text-periwinkle-200 mb-2">Pickup</h3>
                <p><strong className="text-white">From:</strong> Courtyard by Marriott Salisbury</p>
                <p><strong className="text-white">Time:</strong> 3:45 pm</p>
                <p><strong className="text-white">Arrival at venue:</strong> approximately 4:00 pm</p>
              </div>
              <div className="p-4 bg-periwinkle-900/20 rounded-lg border border-periwinkle-700/40">
                <h3 className="font-semibold text-periwinkle-200 mb-2">Return</h3>
                <p><strong className="text-white">To:</strong> Courtyard by Marriott Salisbury</p>
                <p><strong className="text-white">Departure:</strong> approximately 10:30 pm</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-900/20 rounded-lg border border-amber-700/40">
              <p className="text-amber-200"><strong>Remember:</strong> Please check the shuttle box on your RSVP form if you&apos;d like to reserve a spot!</p>
            </div> */}
          </div>
        </div>

        {/* Accommodations */}
        <div className="backdrop-blur-sm bg-black/30 rounded-xl shadow-lg border border-periwinkle-700/30 p-6">
          <h2 className="text-2xl font-semibold text-periwinkle-300 mb-4">Accommodations</h2>
          <div className="space-y-4">
            <p>Please check back later</p>
            {/* <div className="p-4 bg-black/40 rounded-lg">
              <h3 className="font-semibold text-white mb-2">Hotel Block - Courtyard by Marriott Salisbury</h3>
              <p className="text-gray-200 mb-3">We&apos;ve reserved a room block for both Thursday and Friday nights.</p>
              <div className="space-y-2 text-sm">
                <p><strong className="text-periwinkle-200">Address:</strong> 120 Marriott Circle, Salisbury, NC 28144</p>
                <p><strong className="text-periwinkle-200">Rate:</strong> $$$ per night</p>
                <p><strong className="text-periwinkle-200">Booking Deadline:</strong> TBD</p>
                <p><strong className="text-periwinkle-200">Booking:</strong> Mention &quot;Colclough Wedding&quot; for discounted rate</p>
              </div>
          </div>

          <div className="p-4 bg-black/40 rounded-lg">
            <h3 className="font-semibold text-white mb-2">Alternative Options</h3>
            <p className="text-gray-200 mb-3">Prefer something more private? There are a few nearby Airbnb homes available for rent—perfect for groups or families. These tend to book quickly, so we recommend securing your spot early!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-periwinkle-900/20 rounded border border-periwinkle-700/40">
                <p className="font-medium text-periwinkle-200">Oar House</p>
                <p className="text-sm text-gray-300">Sleeps up to 15</p>
              </div>
              <div className="p-3 bg-periwinkle-900/20 rounded border border-periwinkle-700/40">
                <p className="font-medium text-periwinkle-200">Lakefront Retreat</p>
                <p className="text-sm text-gray-300">Sleeps up to 9</p>
              </div>
            </div>
          </div> */}
          </div>
        </div>

        {/* Parking */}
        <div className="backdrop-blur-sm bg-black/30 rounded-xl shadow-lg border border-periwinkle-700/30 p-6">
          <h2 className="text-2xl font-semibold text-periwinkle-300 mb-4">Parking</h2>
          <div className="space-y-3 text-gray-200">
            <p>The parking lot at the venue can accommodate <strong className="text-white">100 vehicles</strong>.</p>
            <p>Please note that the parking lot is a <strong className="text-white">one-way circle</strong> to park as many cars as possible. Signage, cones, and chains are used to direct cars. Spaces are marked with railroad ties and painted lines.</p>
          </div>
        </div>

        {/* Attire & Dress Code */}
        <div className="backdrop-blur-sm bg-black/30 rounded-xl shadow-lg border border-periwinkle-700/30 p-6">
          <h2 className="text-2xl font-semibold text-periwinkle-300 mb-4">Attire &amp; Dress Code</h2>
          <div className="space-y-4">
            <p className="text-gray-200">We&apos;re excited to see you all dressed up! Our wedding dress code is <strong className="text-white">semi-formal</strong>.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 rounded-lg">
                <h3 className="font-semibold text-periwinkle-200 mb-2">For Women</h3>
                <p className="text-gray-200 text-sm">Cocktail dresses, midi or maxi dresses, and jumpsuits are perfect.</p>
              </div>
              <div className="p-4 bg-black/40 rounded-lg">
                <h3 className="font-semibold text-periwinkle-200 mb-2">For Men</h3>
                <p className="text-gray-200 text-sm">Dress shirts paired with khakis or slacks work well.</p>
              </div>
            </div>

            <div className="p-4 bg-red-900/20 rounded-lg border border-red-700/40">
              <h3 className="font-semibold text-red-200 mb-2">Please Avoid</h3>
              <ul className="text-red-200 text-sm space-y-1">
                <li>&bull; White or ivory (reserved for the bride)</li>
                <li>&bull; Lavender (our bridal party color)</li>
              </ul>
            </div>

            <p className="text-gray-200 text-sm">If you have any questions about what to wear, feel free to reach out to the bride or groom - we&apos;d be happy to help!</p>
          </div>
        </div>

        {/* Weather & Children */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-black/30 rounded-xl shadow-lg border border-periwinkle-700/30 p-6">
            <h2 className="text-xl font-semibold text-periwinkle-300 mb-3">Weather Considerations</h2>
            <p className="text-gray-200">Our ceremony will be held <strong className="text-white">outdoors</strong> (weather permitting), so please plan your attire accordingly.</p>
          </div>

          <div className="backdrop-blur-sm bg-black/30 rounded-xl shadow-lg border border-periwinkle-700/30 p-6">
            <h2 className="text-xl font-semibold text-periwinkle-300 mb-3">Little Ones Welcome</h2>
            <p className="text-gray-200">We&apos;re excited to have little ones join us to celebrate! <strong className="text-white">Children are welcome</strong> at our wedding, and we look forward to sharing this special day with your family.</p>
          </div>
        </div>
      </div>
    </div >
  );
}
