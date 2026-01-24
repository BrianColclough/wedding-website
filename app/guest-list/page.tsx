"use client";

import LoadingSpinner from "@/app/components/LoadingSpinner";
import BackgroundAmbience from "@/app/components/BackgroundAmbience";
import { createClient } from "@/utils/supabase/client";
import { useDeferredValue, useEffect, useState } from "react";

export interface GuestListEntry {
    id: number;
    created_at: string;
    first_name: string;
    last_name: string;
    attending: boolean;
    interested_in_shuttle: boolean;
    interested_in_hotel_block: boolean;
    has_plus_one: boolean;
    is_plus_one: boolean;
    plus_one_host: string | null;
    message: string | null;
}

export default function SearchableGuestList() {
    const [guests, setGuests] = useState<GuestListEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const deferredSearch = useDeferredValue(searchTerm);

    useEffect(() => {
        async function fetchGuests() {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from("Guest List")
                .select(
                    "id, first_name, last_name, is_plus_one, plus_one_host, interested_in_hotel_block, interested_in_shuttle"
                )
                .eq("attending", true);
            if (error) {
                setError(error);
            } else {
                setGuests(data as GuestListEntry[]);
            }
            setLoading(false);
        }
        fetchGuests();
    }, []);

    const filtered = guests.filter((content: { first_name: string, last_name: string }) =>
        `${content.first_name} ${content.last_name}`
            .toLowerCase()
            .includes(deferredSearch.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 relative selection:bg-periwinkle-500/30 font-sans">
            {/* Background Ambience */}
            <BackgroundAmbience />

            <div className="max-w-4xl mx-auto relative z-10 pt-12 pb-20">
                {/* Header Section */}
                <div className="text-center mb-12 animate-fade-in-down">
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-periwinkle-300 via-white to-periwinkle-300 pb-2 tracking-tight mb-6">
                        Guest List
                    </h1>
                    <div className="space-y-4 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-medium text-white">
                            We&apos;re so excited to celebrate with all of you! ✨
                        </h2>
                        <p className="text-periwinkle-200/80 font-light text-lg leading-relaxed">
                            Below is a list of all the friends and family who will be joining us on our special day.
                            Search for your name if you&apos;d like to confirm your RSVP status.
                        </p>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="rounded-3xl bg-white/5 border border-white/10 p-6 md:p-10 backdrop-blur-md shadow-2xl animate-fade-in-up">

                    {/* Stats */}
                    {!loading && !error && (
                        <div className="flex justify-center mb-8">
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-periwinkle-500/10 text-periwinkle-200 border border-periwinkle-500/20">
                                🎉 {guests.length} attending so far
                            </span>
                        </div>
                    )}

                    {/* Search Input */}
                    <div className="mb-8 relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-periwinkle-300/50 group-focus-within:text-periwinkle-300 transition-colors"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            aria-label="Search guests"
                            placeholder="Search guests by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-periwinkle-500/30 focus:border-periwinkle-500/50 focus:bg-black/30 transition-all duration-300 text-lg"
                        />
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="py-12">
                            <LoadingSpinner message="Loading Guests..." size="xl" />
                        </div>
                    )}

                    {/* Guest List Grid */}
                    {!loading && filtered.length > 0 && (
                        <div className="space-y-4">
                            <div className="text-sm text-periwinkle-300/60 pl-2 mb-2 uppercase tracking-wider font-semibold">
                                {filtered.length} guest{filtered.length !== 1 ? "s" : ""} found
                            </div>
                            <ul className="grid grid-cols-1 gap-4">
                                {filtered.map((guest) => (
                                    <li
                                        key={guest.id}
                                        className="group p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-periwinkle-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-periwinkle-900/20"
                                    >
                                        <div className="flex justify-between items-center flex-wrap gap-4">
                                            <div>
                                                <p className="font-semibold text-lg text-white group-hover:text-periwinkle-100 transition-colors">
                                                    {guest.first_name} {guest.last_name}
                                                </p>
                                                {guest.is_plus_one && guest.plus_one_host && (
                                                    <p className="text-sm text-periwinkle-300/60 mt-1 flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-periwinkle-500/50"></span>
                                                        Plus one for {guest.plus_one_host}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                {guest.interested_in_hotel_block && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-200 border border-indigo-500/20">
                                                        🏨 Hotel
                                                    </span>
                                                )}
                                                {guest.interested_in_shuttle && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-200 border border-amber-500/20">
                                                        🚌 Shuttle
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && filtered.length === 0 && (
                        <div className="py-16 text-center">
                            <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 text-periwinkle-300/40"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">No guests found</h3>
                            <p className="text-periwinkle-200/60 mb-6">
                                We couldn&apos;t find anyone matching &quot;{searchTerm}&quot;
                            </p>
                            <button
                                onClick={() => setSearchTerm("")}
                                className="px-6 py-2.5 bg-periwinkle-600 hover:bg-periwinkle-500 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-periwinkle-500/25"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}

                    {/* Error state */}
                    {error && (
                        <div className="text-center py-12">
                            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl inline-block max-w-md">
                                <p className="text-red-300 flex items-center gap-2 justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-bold">Error:</span> {error.message}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
