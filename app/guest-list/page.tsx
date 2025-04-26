"use client";

import LoadingSpinner from "@/app/components/LoadingSpinner";
import { createClient } from "@/utils/supabase/client";
import { useDeferredValue, useEffect, useState } from "react";

export interface GuestListEntry {
  id: number;
  created_at: string;
  first_name: string;
  last_name: string;
  interested_in_shuttle: boolean;
  interested_in_hotel_block: boolean;
  has_plus_one: boolean;
  plus_one_first_name: string | null;
  plus_one_last_name: string | null;
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
      const { data, error } = await supabase.from("Guest List").select("*");
      if (error) {
        setError(error);
      } else {
        setGuests(data as GuestListEntry[]);
      }
      setLoading(false);
    }
    fetchGuests();
  }, []);

  const filtered = guests.filter(({ first_name, last_name }) =>
    `${first_name} ${last_name}`
      .toLowerCase()
      .includes(deferredSearch.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-black text-white pt-8 pb-16">
      <div className="max-w-3xl mx-auto p-6">
        <div className="backdrop-blur-sm bg-black/30 rounded-xl shadow-lg border border-periwinkle-700/30 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Guest List</h1>
            <div className="w-16 h-0.5 mx-auto bg-periwinkle-400 rounded-full"></div>
          </div>

          {/* Search Input */}
          <div className="mb-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-periwinkle-500/50"
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
              aria-describedby="search-description"
              placeholder="Search guests by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-periwinkle-700/50 focus:ring-1 focus:ring-periwinkle-400 focus:border-periwinkle-400 focus:outline-none bg-black/40 text-white placeholder-periwinkle-300/40 transition-all duration-200"
            />
            <p id="search-description" className="sr-only">
              Type a name to filter the guest list
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <LoadingSpinner message="Loading Guests..." />
          )}

          {/* Guest List */}
          {!loading && filtered.length > 0 && (
            <div>
              <p className="text-xs text-periwinkle-400/70 mb-3 pl-1">
                {filtered.length} guest{filtered.length !== 1 ? "s" : ""} found
              </p>
              <ul className="space-y-2">
                {filtered.map((guest) => (
                  <li
                    key={guest.id}
                    className="p-3 border border-periwinkle-700/20 rounded-lg bg-black/20 "
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-white">
                          {guest.first_name} {guest.last_name}
                        </p>
                        {guest.has_plus_one &&
                          (guest.plus_one_first_name ||
                            guest.plus_one_last_name) && (
                            <p className="text-xs text-periwinkle-300/60 mt-1">
                              Plus One: {guest.plus_one_first_name || ""}{" "}
                              {guest.plus_one_last_name || ""}
                            </p>
                          )}
                      </div>
                      <div className="flex space-x-2">
                        {guest.interested_in_hotel_block && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-periwinkle-900/80 text-periwinkle-300">
                            Hotel
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
            <div className="py-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-periwinkle-700/40 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-periwinkle-300/80">
                No guests found matching &quot;{searchTerm}&quot;
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-3 px-3 py-1.5 bg-periwinkle-700 text-white text-sm rounded-md hover:bg-periwinkle-600 transition-colors duration-200"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-8">
              <div className="bg-red-900/20 p-3 rounded-lg">
                <p className="text-red-400">
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
