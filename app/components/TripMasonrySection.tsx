"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface TripMasonrySectionProps {
    title: string;
    photos: string[];
}

export default function TripMasonrySection({ title, photos }: TripMasonrySectionProps) {
    const [hasEntered, setHasEntered] = useState(false);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = sectionRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasEntered(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -10% 0px",
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleImageLoad = (index: number) => {
        setLoadedImages(prev => new Set(prev).add(index));
    };

    return (
        <div
            ref={sectionRef}
            className={`py-12 transition-all duration-1000 ${hasEntered
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
        >
            {/* Trip Title */}
            <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-periwinkle-300 mb-4">
                    {title}
                </h3>
                <div className="w-24 h-0.5 mx-auto bg-periwinkle-400 rounded-full"></div>
            </div>

            {/* Masonry Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 max-w-7xl mx-auto">
                {photos.map((photo, index) => (
                    <div
                        key={`${title}-${index}`}
                        className={`mb-4 break-inside-avoid transition-all duration-700 ${hasEntered
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                            }`}
                        style={{
                            transitionDelay: `${index * 100}ms`,
                        }}
                    >
                        <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-900">
                            <div className="relative w-full">
                                <Image
                                    src={photo}
                                    alt={`${title} photo ${index + 1}`}
                                    width={800}
                                    height={600}
                                    className={`w-full h-auto object-cover transition-opacity duration-300 ${loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    onLoad={() => handleImageLoad(index)}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                                {!loadedImages.has(index) && (
                                    <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                                        <div className="text-gray-500 text-sm">Loading...</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

