"use client";

import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { useEffect, useMemo, useState } from "react";
// Avoid top-level value imports from leaflet/react-leaflet to prevent SSR build errors
type ReactLeafletModule = typeof import("react-leaflet");
type LeafletModule = typeof import("leaflet");

type LocationSpec = {
    name: string;
    address: string;
    position: LatLngExpression;
};

const LOCATIONS: LocationSpec[] = [
    {
        name: "Cedar Hill Weddings & Events",
        address: "450 Clark Road, Salisbury, NC 28146",
        position: [35.62946701115182, -80.3240476624808],
    },
    {
        name: "Hampton Inn Salisbury",
        address: "1001 Klumac Rd, Salisbury, NC 28144, US",
        position: [35.6423344, -80.4849527],
    },
];

function isAppleDevice(): boolean {
    if (typeof navigator === "undefined" || typeof window === "undefined") {
        return false;
    }
    const ua = navigator.userAgent || "";
    const platform = (navigator as Navigator).platform ?? "";
    const isiOS = /iPhone|iPad|iPod/.test(ua) || /iPhone|iPad|iPod/.test(platform);
    const isTouchMac = ua.includes("Mac") && "ontouchend" in window;
    return isiOS || isTouchMac;
}

function buildMapLinkForCoords(lat: number, lon: number): string {
    const apple = `https://maps.apple.com/?q=${lat},${lon}`;
    const google = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    return isAppleDevice() ? apple : google;
}

export default function MapWithMarkers() {
    const [error, setError] = useState<string | null>(null);
    const [clientReady, setClientReady] = useState(false);
    const [RL, setRL] = useState<ReactLeafletModule | null>(null);
    const [L, setL] = useState<LeafletModule | null>(null);

    useEffect(() => {
        // Load libraries only on the client to avoid SSR evaluation
        Promise.all([import("react-leaflet"), import("leaflet")])
            .then(([rl, leaflet]) => {
                setRL(rl as ReactLeafletModule);
                setL(leaflet as LeafletModule);
                setClientReady(true);
            })
            .catch(() => {
                setError("Map failed to load.");
            });
    }, []);

    const center = useMemo<LatLngExpression>(() => {
        if (LOCATIONS.length === 0) {
            // Salisbury, NC fallback center
            return [35.67097, -80.47423];
        }

        if (LOCATIONS.length === 1) {
            return LOCATIONS[0].position;
        }

        const avgLat =
            LOCATIONS.reduce((sum, loc) => sum + (loc.position as [number, number])[0], 0) /
            LOCATIONS.length;
        const avgLon =
            LOCATIONS.reduce((sum, loc) => sum + (loc.position as [number, number])[1], 0) /
            LOCATIONS.length;
        return [avgLat, avgLon];
    }, []);

    const bounds = useMemo<LatLngBoundsExpression | null>(() => {
        if (LOCATIONS.length <= 1) return null;

        const lats = LOCATIONS.map((loc) => (loc.position as [number, number])[0]);
        const lons = LOCATIONS.map((loc) => (loc.position as [number, number])[1]);

        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);

        return [
            [minLat, minLon],
            [maxLat, maxLon],
        ];
    }, []);

    const markerIcon = useMemo(() => {
        if (!L) return undefined as unknown as ReturnType<LeafletModule["divIcon"]>;
        return L.divIcon({
            className: "custom-marker",
            html:
                '<div style="height:24px;width:24px;border-radius:9999px;background:#9aa5ff;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25)"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12],
        });
    }, [L]);

    return (
        <div className="w-full overflow-hidden rounded-xl border border-periwinkle-700/30 bg-black/30">
            <div className="w-full" style={{ height: 400 }}>
                {clientReady && RL && (
                    <RL.MapContainer
                        style={{ height: "100%", width: "100%" }}
                        scrollWheelZoom={false}
                        {...(bounds
                            ? { bounds, boundsOptions: { padding: [48, 48] } }
                            : { center, zoom: 12 })}
                    >
                        <RL.TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {LOCATIONS.map((loc) => {
                            const [lat, lon] = loc.position as [number, number];
                            return (
                                <RL.Marker key={loc.name} position={loc.position} icon={markerIcon}>
                                    <RL.Popup>
                                        <div className="space-y-1">
                                            <p className="font-semibold">{loc.name}</p>
                                            <p className="text-sm">{loc.address}</p>
                                            <a
                                                className="text-periwinkle-300 underline"
                                                href={buildMapLinkForCoords(lat, lon)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Open in Maps ↗
                                            </a>
                                        </div>
                                    </RL.Popup>
                                </RL.Marker>
                            );
                        })}
                    </RL.MapContainer>
                )}
            </div>

            {error && (
                <div className="px-4 py-3 text-sm text-amber-200">
                    {error} You can still open directions:
                    <ul className="list-disc ml-5 mt-1">
                        {LOCATIONS.map((loc) => (
                            <li key={loc.name}>
                                <a
                                    className="text-periwinkle-300 underline"
                                    href={buildMapLinkForCoords(
                                        (loc.position as [number, number])[0],
                                        (loc.position as [number, number])[1]
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {loc.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}


