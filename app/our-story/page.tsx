"use client";

import TimelineSection from "@/app/components/TimelineSection";
import TripMasonrySection from "@/app/components/TripMasonrySection";

interface PhotoData {
  imgName: string;
  description: string;
  imageDate: string;
  imgSrc: string;
}

interface StoryData {
  [year: string]: PhotoData[];
}

interface TripData {
  title: string;
  folder: string;
  photoCount: number;
}

export default function OurStory() {
  // Helper function to generate trip photo paths dynamically
  const getTripPhotos = (folder: string, count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const num = (i + 1).toString().padStart(2, '0'); // Pad with leading zero
      return `/Our story/trips/${folder}/${num}.jpg`;
    });
  };

  // Trips data - add new trips here
  const tripsData: TripData[] = [
    {
      title: "Alaska Adventure",
      folder: "Alaska",
      photoCount: 13
    }
  ];

  // Generated from images in public/Our story/<year>/[n]_result.(jpg|png)
  const storyData: StoryData = {
    "2021": [
      {
        imgName: "2021-1",
        description: "Our first picture together at the airport overlook",
        imageDate: "February 2021",
        imgSrc: "/Our story/2021/1_result.jpg"
      },
      {
        imgName: "2021-2",
        description: "First beach trip together",
        imageDate: "March 2021",
        imgSrc: "/Our story/2021/2_result.png"
      },
      {
        imgName: "2021-3",
        description: "Our first trip to the zoo",
        imageDate: "May 2021",
        imgSrc: "/Our story/2021/3_result.jpg"
      },
      {
        imgName: "2021-4",
        description: "First Halloween together",
        imageDate: "October 2021",
        imgSrc: "/Our story/2021/4_result.png"
      },
      {
        imgName: "2021-5",
        description: "Trip to Gatlinburg, Tennessee",
        imageDate: "October 2021",
        imgSrc: "/Our story/2021/5_result.png"
      },
      {
        imgName: "2021-6",
        description: "First Christmas",
        imageDate: "December 2021",
        imgSrc: "/Our story/2021/6_result.png"
      }
    ],
    "2022": [
      {
        imgName: "2022-1",
        description: "Celebrating Alexis' acceptance into grad school",
        imageDate: "February 2022",
        imgSrc: "/Our story/2022/1_result.png"
      },
      {
        imgName: "2022-2",
        description: "One year anniversary!",
        imageDate: "February 2022",
        imgSrc: "/Our story/2022/2_result.png"
      },
      {
        imgName: "2022-3",
        description: "Game night at the beach",
        imageDate: "March 2022",
        imgSrc: "/Our story/2022/3_result.png"
      },
      {
        imgName: "2022-4",
        description: "Joel and Rebecca's wedding",
        imageDate: "April 2022",
        imgSrc: "/Our story/2022/4_result.png"
      },
      {
        imgName: "2022-5",
        description: "Brian's college graduation",
        imageDate: "May 2022",
        imgSrc: "/Our story/2022/5_result.jpg"
      },
      {
        imgName: "2022-6",
        description: "Mom and Matt's wedding",
        imageDate: "June 2022",
        imgSrc: "/Our story/2022/6_result.png"
      },
      {
        imgName: "2022-7",
        description: "Chunk's adoption day",
        imageDate: "June 2022",
        imgSrc: "/Our story/2022/7_result.png"
      },
      {
        imgName: "2022-8",
        description: "First camping trip together",
        imageDate: "October 2022",
        imgSrc: "/Our story/2022/8_result.png"
      }
    ],
    "2023": [
      {
        imgName: "2023-1",
        description: "Kiwi's adoption day",
        imageDate: "January 2023",
        imgSrc: "/Our story/2023/1_result.jpg"
      },
      {
        imgName: "2023-2",
        description: "Two year anniversary trip!",
        imageDate: "February 2023",
        imgSrc: "/Our story/2023/2_result.jpg"
      },
      {
        imgName: "2023-3",
        description: "Alexis' graduation from undergrad",
        imageDate: "April 2023",
        imgSrc: "/Our story/2023/3_result.jpg"
      },
      {
        imgName: "2023-4",
        description: "Zak and Mackenzie's wedding",
        imageDate: "May 2023",
        imgSrc: "/Our story/2023/4_result.png"
      },
      {
        imgName: "2023-5",
        description: "Brian's 23rd birthday trip",
        imageDate: "June 2023",
        imgSrc: "/Our story/2023/5_result.png"
      },
      {
        imgName: "2023-6",
        description: "Brielle and Luke's wedding",
        imageDate: "June 2023",
        imgSrc: "/Our story/2023/6_result.jpg"
      },
      {
        imgName: "2023-7",
        description: "Alexis' 22nd birthday trip",
        imageDate: "August 2023",
        imgSrc: "/Our story/2023/7_result.jpg"
      },
      {
        imgName: "2023-8",
        description: "The day after we found Willow outside",
        imageDate: "October 2023",
        imgSrc: "/Our story/2023/8_result.png"
      }
    ],
    "2024": [
      {
        imgName: "2024-1",
        description: "Three year anniversary!",
        imageDate: "February 2024",
        imgSrc: "/Our story/2024/1_result.jpg"
      },
      {
        imgName: "2024-2",
        description: "Tulip picking in Kernersville",
        imageDate: "March 2024",
        imgSrc: "/Our story/2024/2_result.png"
      },
      {
        imgName: "2024-3",
        description: "Our trip to Switzerland, Austria, and Italy",
        imageDate: "May 2024",
        imgSrc: "/Our story/2024/3_result.png"
      },
      {
        imgName: "2024-4",
        description: "Brian's 24th birthday trip",
        imageDate: "June 2024",
        imgSrc: "/Our story/2024/4_result.png"
      },
      {
        imgName: "2024-5",
        description: "One of our first mountain bike rides",
        imageDate: "June 2024",
        imgSrc: "/Our story/2024/5_result.png"
      },
      {
        imgName: "2024-6",
        description: "Celebrating Alexis' birthday",
        imageDate: "August 2024",
        imgSrc: "/Our story/2024/6_result.png"
      },
      {
        imgName: "2024-7",
        description: "Dakotah's one year birthday party",
        imageDate: "September 2024",
        imgSrc: "/Our story/2024/7_result.png"
      },
      {
        imgName: "2024-8",
        description: "Halloween!!",
        imageDate: "October 2024",
        imgSrc: "/Our story/2024/8_result.jpg"
      },
      {
        imgName: "2024-9",
        description: "Thanksgiving trip to Pennsylvania, at the Corning Glass Museum",
        imageDate: "November 2024",
        imgSrc: "/Our story/2024/2024-11.jpg"
      }
    ]
  };

  // Sort years in ascending order
  const sortedYears = Object.keys(storyData).sort();

  return (
    <div className="min-h-screen bg-black text-white scroll-smooth relative selection:bg-periwinkle-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] bg-periwinkle-900/20 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[100px] opacity-40"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16 animate-fade-in-down">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-periwinkle-300 via-white to-periwinkle-300 mb-6 tracking-tight pb-2">
              Our Story
            </h1>
            <div className="h-1 w-1/3 mx-auto bg-gradient-to-r from-transparent via-periwinkle-500 to-transparent rounded-full mb-6"></div>
            <p className="text-lg md:text-xl font-light text-periwinkle-200 max-w-3xl mx-auto leading-relaxed">
              Every love story is beautiful, but ours is our favorite. From our first meeting to our upcoming wedding day,
              these moments capture the journey that brought us together and the memories we&apos;ve created along the way.
            </p>
            <p className="text-sm text-periwinkle-300/70 mt-4 italic inline-block px-4 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
              Tap or hover any photo to read the story behind the moment
            </p>
          </div>
        </div>

        {/* Timeline Sections */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-periwinkle-500/50 to-transparent"
            style={{ height: "100%" }}></div>

          {sortedYears.map((year) => (
            <TimelineSection
              key={year}
              year={year}
              photos={storyData[year]}
            />
          ))}
        </div>

        {/* Trips Section */}
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Adventures Together
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-periwinkle-500 to-transparent rounded-full"></div>
          </div>

          {tripsData.map((trip) => (
            <TripMasonrySection
              key={trip.folder}
              title={trip.title}
              photos={getTripPhotos(trip.folder, trip.photoCount)}
            />
          ))}
        </div>

        {/* Footer message */}
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-xl text-periwinkle-200 mb-4 font-light">
              And this is just the beginning...
            </p>
            <p className="text-white font-medium">
              We can&apos;t wait to add our wedding photos to this timeline and continue writing our story together!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
