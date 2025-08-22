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
  // Generated from images in public/Our story/<year>/[n]_result.(jpg|png)
  const storyData: StoryData = {
    "2021": [
      {
        imgName: "2021-1",
        description: "A favorite memory from 2021. Description to be updated.",
        imageDate: "2021",
        imgSrc: "/Our story/2021/1_result.jpg"
      },
      {
        imgName: "2021-2",
        description: "A favorite memory from 2021. Description to be updated.",
        imageDate: "2021",
        imgSrc: "/Our story/2021/2_result.png"
      },
      {
        imgName: "2021-3",
        description: "A favorite memory from 2021. Description to be updated.",
        imageDate: "2021",
        imgSrc: "/Our story/2021/3_result.jpg"
      },
      {
        imgName: "2021-4",
        description: "A favorite memory from 2021. Description to be updated.",
        imageDate: "2021",
        imgSrc: "/Our story/2021/4_result.png"
      },
      {
        imgName: "2021-5",
        description: "A favorite memory from 2021. Description to be updated.",
        imageDate: "2021",
        imgSrc: "/Our story/2021/5_result.png"
      },
      {
        imgName: "2021-6",
        description: "A favorite memory from 2021. Description to be updated.",
        imageDate: "2021",
        imgSrc: "/Our story/2021/6_result.png"
      }
    ],
    "2022": [
      {
        imgName: "2022-1",
        description: "A favorite memory from 2022. Description to be updated.",
        imageDate: "2022",
        imgSrc: "/Our story/2022/1_result.png"
      },
      {
        imgName: "2022-2",
        description: "A favorite memory from 2022. Description to be updated.",
        imageDate: "2022",
        imgSrc: "/Our story/2022/2_result.png"
      },
      {
        imgName: "2022-3",
        description: "A favorite memory from 2022. Description to be updated.",
        imageDate: "2022",
        imgSrc: "/Our story/2022/3_result.png"
      },
      {
        imgName: "2022-4",
        description: "A favorite memory from 2022. Description to be updated.",
        imageDate: "2022",
        imgSrc: "/Our story/2022/4_result.png"
      },
      {
        imgName: "2022-5",
        description: "A favorite memory from 2022. Description to be updated.",
        imageDate: "2022",
        imgSrc: "/Our story/2022/5_result.jpg"
      },
      {
        imgName: "2022-6",
        description: "A favorite memory from 2022. Description to be updated.",
        imageDate: "2022",
        imgSrc: "/Our story/2022/6_result.png"
      },
      {
        imgName: "2022-7",
        description: "A favorite memory from 2022. Description to be updated.",
        imageDate: "2022",
        imgSrc: "/Our story/2022/7_result.png"
      },
      {
        imgName: "2022-8",
        description: "A favorite memory from 2022. Description to be updated.",
        imageDate: "2022",
        imgSrc: "/Our story/2022/8_result.png"
      }
    ],
    "2023": [
      {
        imgName: "2023-1",
        description: "A favorite memory from 2023. Description to be updated.",
        imageDate: "2023",
        imgSrc: "/Our story/2023/1_result.jpg"
      },
      {
        imgName: "2023-2",
        description: "A favorite memory from 2023. Description to be updated.",
        imageDate: "2023",
        imgSrc: "/Our story/2023/2_result.jpg"
      },
      {
        imgName: "2023-3",
        description: "A favorite memory from 2023. Description to be updated.",
        imageDate: "2023",
        imgSrc: "/Our story/2023/3_result.jpg"
      },
      {
        imgName: "2023-4",
        description: "A favorite memory from 2023. Description to be updated.",
        imageDate: "2023",
        imgSrc: "/Our story/2023/4_result.png"
      },
      {
        imgName: "2023-5",
        description: "A favorite memory from 2023. Description to be updated.",
        imageDate: "2023",
        imgSrc: "/Our story/2023/5_result.png"
      },
      {
        imgName: "2023-6",
        description: "A favorite memory from 2023. Description to be updated.",
        imageDate: "2023",
        imgSrc: "/Our story/2023/6_result.jpg"
      },
      {
        imgName: "2023-7",
        description: "A favorite memory from 2023. Description to be updated.",
        imageDate: "2023",
        imgSrc: "/Our story/2023/7_result.jpg"
      },
      {
        imgName: "2023-8",
        description: "A favorite memory from 2023. Description to be updated.",
        imageDate: "2023",
        imgSrc: "/Our story/2023/8_result.png"
      }
    ],
    "2024": [
      {
        imgName: "2024-1",
        description: "A favorite memory from 2024. Description to be updated.",
        imageDate: "2024",
        imgSrc: "/Our story/2024/1_result.jpg"
      },
      {
        imgName: "2024-2",
        description: "A favorite memory from 2024. Description to be updated.",
        imageDate: "2024",
        imgSrc: "/Our story/2024/2_result.png"
      },
      {
        imgName: "2024-3",
        description: "A favorite memory from 2024. Description to be updated.",
        imageDate: "2024",
        imgSrc: "/Our story/2024/3_result.png"
      },
      {
        imgName: "2024-4",
        description: "A favorite memory from 2024. Description to be updated.",
        imageDate: "2024",
        imgSrc: "/Our story/2024/4_result.png"
      },
      {
        imgName: "2024-5",
        description: "A favorite memory from 2024. Description to be updated.",
        imageDate: "2024",
        imgSrc: "/Our story/2024/5_result.png"
      },
      {
        imgName: "2024-6",
        description: "A favorite memory from 2024. Description to be updated.",
        imageDate: "2024",
        imgSrc: "/Our story/2024/6_result.png"
      },
      {
        imgName: "2024-7",
        description: "A favorite memory from 2024. Description to be updated.",
        imageDate: "2024",
        imgSrc: "/Our story/2024/7_result.png"
      },
      {
        imgName: "2024-8",
        description: "A favorite memory from 2024. Description to be updated.",
        imageDate: "2024",
        imgSrc: "/Our story/2024/8_result.jpg"
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
            Tap or hover any photo to read the story behind the moment
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
