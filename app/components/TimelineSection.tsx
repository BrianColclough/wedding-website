"use client";

import { useEffect, useRef, useState } from "react";
import Polaroid from "./Polaroid";

interface PhotoData {
    imgName: string;
    description: string;
    imageDate: string;
    imgSrc: string;
}

interface TimelineSectionProps {
    year: string;
    photos: PhotoData[];
}

export default function TimelineSection({ year, photos }: TimelineSectionProps) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            {
                threshold: 0.2,
                rootMargin: "50px 0px",
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={sectionRef}
            className={`py-16 transition-all duration-1000 ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
        >
            {/* Year Header */}
            <div className="text-center mb-12">
                <h2 className="text-5xl md:text-6xl font-bold text-periwinkle-300 mb-4">
                    {year}
                </h2>
                <div className="w-24 h-0.5 mx-auto bg-periwinkle-400 rounded-full"></div>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
                {photos.map((photo, index) => (
                    <div
                        key={`${year}-${index}`}
                        className={`transition-all duration-700 ${isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                            }`}
                        style={{
                            transitionDelay: `${index * 100}ms`,
                        }}
                    >
                        <Polaroid
                            imgName={photo.imgName}
                            description={photo.description}
                            imageDate={photo.imageDate}
                            imgSrc={photo.imgSrc}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
} 