"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface TripMasonrySectionProps {
    title: string;
    photos: string[];
}

interface LightboxProps {
    isOpen: boolean;
    onClose: () => void;
    currentIndex: number;
    onIndexChange: (index: number) => void;
    photos: string[];
    title: string;
}

function Lightbox({ isOpen, onClose, currentIndex, onIndexChange, photos, title }: LightboxProps) {
    // Lock body scroll when open
    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowLeft') {
                onIndexChange(Math.max(0, currentIndex - 1));
            } else if (e.key === 'ArrowRight') {
                onIndexChange(Math.min(photos.length - 1, currentIndex + 1));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex, photos.length, onClose, onIndexChange]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} photo gallery`}
        >
            {/* Modal Card */}
            <div
                className="relative w-full max-w-7xl h-[85vh] bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header / Controls */}
                <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
                    <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <span className="text-white font-medium">{currentIndex + 1} / {photos.length}</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="group bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300"
                        aria-label="Close lightbox"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white group-hover:text-periwinkle-300 transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Main Image Area */}
                <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black/20 p-2 md:p-4">
                    <Image
                        src={photos[currentIndex]}
                        alt={`${title} photo ${currentIndex + 1}`}
                        fill
                        className="object-contain"
                        priority
                        sizes="95vw"
                    />
                </div>

                {/* Navigation Buttons (Overlay) */}
                <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                    {currentIndex > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onIndexChange(currentIndex - 1);
                            }}
                            className="pointer-events-auto group bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/10 hover:bg-white/10 hover:border-periwinkle-500/30 transition-all duration-300 transform hover:scale-110"
                            aria-label="Previous image"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-white group-hover:text-periwinkle-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    {currentIndex < photos.length - 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onIndexChange(currentIndex + 1);
                            }}
                            className="pointer-events-auto group bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/10 hover:bg-white/10 hover:border-periwinkle-500/30 transition-all duration-300 transform hover:scale-110"
                            aria-label="Next image"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-white group-hover:text-periwinkle-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function TripMasonrySection({ title, photos }: TripMasonrySectionProps) {
    const [hasEntered, setHasEntered] = useState(false);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Animation observer
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

    const handleImageLoad = useCallback((index: number) => {
        setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(index);
            return newSet;
        });
    }, []);

    const openLightbox = useCallback((index: number) => {
        setCurrentImageIndex(index);
        setIsLightboxOpen(true);
    }, []);

    const closeLightbox = useCallback(() => {
        setIsLightboxOpen(false);
    }, []);

    const handleIndexChange = useCallback((index: number) => {
        setCurrentImageIndex(index);
    }, []);

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
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
                        {title}
                    </h3>
                    <div className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-periwinkle-400 to-transparent rounded-full opacity-80"></div>
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

            <Lightbox
                isOpen={isLightboxOpen}
                onClose={closeLightbox}
                currentIndex={currentImageIndex}
                onIndexChange={handleIndexChange}
                photos={photos}
                title={title}
            />
        </>
    );
}
