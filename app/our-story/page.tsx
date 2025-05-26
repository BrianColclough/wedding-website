"use client";

import TimelineSection from "@/app/components/TimelineSection";

interface PhotoData {
  imgName: string;
  description: string;
  imageDate: string;
  imgSrc: string;
}

interface StoryData {
  [year: string]: PhotoData[];
}

export default function OurStory() {
  // Placeholder data structure - replace with actual photos when available
  const storyData: StoryData = {
    "2021": [
      {
        imgName: "first-meeting",
        description: "The beginning of our beautiful journey together. This was taken shortly after we first met.",
        imageDate: "March 2021",
        imgSrc: "/Lexi&B.jpg"
      },
      {
        imgName: "spring-walk",
        description: "Our first spring together, taking long walks and getting to know each other.",
        imageDate: "April 2021",
        imgSrc: "/Lexi&B.jpg"
      },
      {
        imgName: "summer-adventure",
        description: "Summer adventures and making memories that would last a lifetime.",
        imageDate: "July 2021",
        imgSrc: "/Lexi&B.jpg"
      }
    ],
    "2022": [
      {
        imgName: "new-year",
        description: "Starting 2022 together, excited for what the year would bring.",
        imageDate: "January 2022",
        imgSrc: "/Lexi&B.jpg"
      },
      {
        imgName: "valentine",
        description: "Our first Valentine's Day together, filled with love and laughter.",
        imageDate: "February 2022",
        imgSrc: "/Lexi&B.jpg"
      },
      {
        imgName: "spring-bloom",
        description: "Watching the flowers bloom just like our relationship was blossoming.",
        imageDate: "May 2022",
        imgSrc: "/Lexi&B.jpg"
      },
      {
        imgName: "summer-getaway",
        description: "Our first vacation together, creating memories we'll cherish forever.",
        imageDate: "August 2022",
        imgSrc: "/Lexi&B.jpg"
      }
    ],
    "2023": [
      {
        imgName: "new-home",
        description: "Moving in together and making our house a home.",
        imageDate: "February 2023",
        imgSrc: "/Lexi&B.jpg"
      },
      {
        imgName: "anniversary",
        description: "Celebrating our second anniversary with a romantic dinner.",
        imageDate: "March 2023",
        imgSrc: "/Lexi&B.jpg"
      },
      {
        imgName: "family-time",
        description: "Spending time with family and realizing we were meant to be together.",
        imageDate: "June 2023",
        imgSrc: "/Lexi&B.jpg"
      },
      {
        imgName: "autumn-love",
        description: "Fall colors matching the warmth we felt in our hearts.",
        imageDate: "October 2023",
        imgSrc: "/Lexi&B.jpg"
      },
      {
        imgName: "holidays",
        description: "Our first holiday season living together, starting our own traditions.",
        imageDate: "December 2023",
        imgSrc: "/Lexi&B.jpg"
      }
    ],
    "2024": [
      {
        imgName: "winter-cozy",
        description: "Cozy winter nights that brought us even closer together.",
        imageDate: "January 2024",
        imgSrc: "/Lexi&B.jpg"
      },
      {
        imgName: "spring-proposal",
        description: "The moment that changed everything - when Brian got down on one knee!",
        imageDate: "April 2024",
        imgSrc: "/Lexi&B.jpg"
      },
      {
        imgName: "engagement-party",
        description: "Celebrating our engagement with friends and family who mean the world to us.",
        imageDate: "May 2024",
        imgSrc: "/Lexi&B.jpg"
      },
      {
        imgName: "wedding-planning",
        description: "Starting to plan our dream wedding and getting excited for our future.",
        imageDate: "July 2024",
        imgSrc: "/Lexi&B.jpg"
      },
      {
        imgName: "venue-visit",
        description: "Finding the perfect venue for our special day at Cedar Hill.",
        imageDate: "September 2024",
        imgSrc: "/Lexi&B.jpg"
      },
      {
        imgName: "thanksgiving",
        description: "Grateful for another year together and excited for what's to come.",
        imageDate: "November 2024",
        imgSrc: "/Lexi&B.jpg"
      }
    ],
    "2025": [
      {
        imgName: "new-year-engaged",
        description: "Starting 2025 as an engaged couple, counting down to our wedding day!",
        imageDate: "January 2025",
        imgSrc: "/Lexi&B.jpg"
      }
    ]
  };

  // Sort years in ascending order
  const sortedYears = Object.keys(storyData).sort();

  return (
    <div className="min-h-screen bg-black text-white scroll-smooth">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Our Story
          </h1>
          <div className="w-24 h-0.5 mx-auto bg-periwinkle-400 rounded-full mb-6"></div>
          <p className="text-lg md:text-xl font-light text-periwinkle-200 max-w-3xl mx-auto leading-relaxed">
            Every love story is beautiful, but ours is our favorite. From our first meeting to our upcoming wedding day,
            these moments capture the journey that brought us together and the memories we&apos;ve created along the way.
          </p>
          <p className="text-sm text-periwinkle-300/70 mt-4 italic">
            Hover over any photo to read the story behind the moment
          </p>
        </div>
      </div>

      {/* Timeline Sections */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-px bg-gradient-to-b from-periwinkle-400 to-periwinkle-600 opacity-30"
          style={{ height: "calc(100% - 100px)" }}></div>

        {sortedYears.map((year) => (
          <TimelineSection
            key={year}
            year={year}
            photos={storyData[year]}
          />
        ))}
      </div>

      {/* Footer message */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-periwinkle-200 mb-4">
            And this is just the beginning...
          </p>
          <p className="text-periwinkle-300">
            We can&apos;t wait to add our wedding photos to this timeline and continue writing our story together!
          </p>
        </div>
      </div>
    </div>
  );
}
