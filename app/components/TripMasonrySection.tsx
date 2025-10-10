"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface TripMasonrySectionProps {
    title: string;
    photos: string[];
}

export default function TripMasonrySection({ title, photos }: TripMasonrySectionProps) {
    const [hasEntered, setHasEntered] = useState(false);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Track mount state for portal
    useEffect(() => {
        setIsMounted(true);
    }, []);

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

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };

    const goToPrevious = () => {
        setCurrentImageIndex(prev => Math.max(0, prev - 1));
    };

    const goToNext = () => {
        setCurrentImageIndex(prev => Math.min(photos.length - 1, prev + 1));
    };

    // Keyboard navigation and body scroll prevention
    useEffect(() => {
        if (!isLightboxOpen) return;

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isLightboxOpen, currentImageIndex, photos.length]);

    // Lightbox JSX to be rendered via portal
    const lightboxContent = isLightboxOpen && (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
            onClick={closeLightbox}
        >
            {/* Close Button */}
            <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors p-2"
                aria-label="Close lightbox"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            {/* Previous Button */}
            {currentImageIndex > 0 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        goToPrevious();
                    }}
                    className="absolute left-4 z-50 text-white hover:text-gray-300 transition-colors p-2 bg-black bg-opacity-50 rounded-full"
                    aria-label="Previous image"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
            )}

            {/* Next Button */}
            {currentImageIndex < photos.length - 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        goToNext();
                    }}
                    className="absolute right-4 z-50 text-white hover:text-gray-300 transition-colors p-2 bg-black bg-opacity-50 rounded-full"
                    aria-label="Next image"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            )}

            {/* Image Container */}
            <div
                className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={photos[currentImageIndex]}
                    alt={`${title} photo ${currentImageIndex + 1}`}
                    width={1920}
                    height={1080}
                    className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                    priority
                />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-full">
                {currentImageIndex + 1} / {photos.length}
            </div>
        </div>
    );

    return (
        <>
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
                            <div
                                className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-900 cursor-pointer"
                                onClick={() => openLightbox(index)}
                            >
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

            {/* Render lightbox via portal to document body */}
            {isMounted && lightboxContent && createPortal(lightboxContent, document.body)}
        </>
    );
}


