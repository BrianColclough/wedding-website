"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

interface PolaroidProps {
    imgName: string;
    description: string;
    imageDate: string;
    imgSrc: string;
}

export default function Polaroid({ imgName, description, imageDate, imgSrc }: PolaroidProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

    // Generate a consistent slight rotation based on the image name for natural Polaroid look
    const rotation = useMemo(() => {
        const hash = imgName.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return (hash % 6) - 3; // Random rotation between -3 and 3 degrees
    }, [imgName]);

    // Generate consistent random positioning for tape
    const showTape = useMemo(() => {
        const hash = imgName.split('').reduce((a, b) => {
            a = ((a << 3) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return Math.abs(hash % 10) > 7; // About 20% chance for tape
    }, [imgName]);

    const tapePosition = useMemo(() => {
        const hash = imgName.split('').reduce((a, b) => {
            a = ((a << 2) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return 30 + (Math.abs(hash % 40)); // Position between 30% and 70%
    }, [imgName]);

    return (
        <div
            className="group cursor-pointer"
            style={{ transform: `rotate(${rotation}deg)` }}
            onMouseEnter={() => setShowDescription(true)}
            onMouseLeave={() => setShowDescription(false)}
        >
            <div className="relative bg-white p-4 pb-16 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2">
                {/* Image area */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <Image
                        src={imgSrc}
                        alt={imgName}
                        fill
                        className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        onLoad={() => setImageLoaded(true)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                            <div className="text-gray-400 text-sm">Loading...</div>
                        </div>
                    )}

                    {/* Description overlay on hover */}
                    {showDescription && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 transition-opacity duration-200">
                            <p className="text-white text-center text-sm font-medium leading-relaxed">
                                {description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Bottom text area (Polaroid style) */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-gray-700 text-sm font-mono tracking-wider">
                        {imageDate}
                    </p>
                </div>

                {/* Tape effect for some Polaroids */}
                <div>{showTape ? "true" : "false"}</div>
                {showTape && (
                    <div
                        className="absolute -top-2 w-16 h-6 bg-yellow-200/80 border border-yellow-300/50 rotate-1 shadow-sm"
                        style={{
                            left: `${tapePosition}%`,
                            transform: `translateX(-50%) rotate(${rotation > 0 ? '-2deg' : '2deg'})`
                        }}
                    />
                )}
            </div>
        </div>
    );
} 