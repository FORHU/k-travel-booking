'use client';

import React, { useMemo } from 'react';
import { Map, Marker, NavigationControl } from 'react-map-gl/mapbox';
import { DailyItinerary } from '@/lib/ai/itinerary/mockItineraryGenerator';
import { MapPin } from 'lucide-react';

interface ItineraryMapPinsProps {
    itinerary: DailyItinerary[];
    onMarkerClick?: (activityId: string) => void;
}

const DAY_COLORS = [
    'text-blue-500',
    'text-emerald-500',
    'text-purple-500',
    'text-amber-500',
    'text-rose-500',
];

const ItineraryMapPins: React.FC<ItineraryMapPinsProps> = ({ itinerary, onMarkerClick }) => {

    // Flatten activities for rendering
    const allActivities = useMemo(() => {
        return itinerary.flatMap(day =>
            day.activities.map(activity => ({
                ...activity,
                dayIndex: day.day - 1
            }))
        );
    }, [itinerary]);

    // Calculate bounds (simple average for center)
    const viewState = useMemo(() => {
        if (allActivities.length === 0) return { latitude: 37.5665, longitude: 126.9780, zoom: 11 };

        const lats = allActivities.map(a => a.location.lat);
        const lngs = allActivities.map(a => a.location.lng);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        return {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            zoom: 11
        };
    }, [allActivities]);

    return (
        <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            initialViewState={viewState}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
        >
            <NavigationControl position="top-right" />

            {allActivities.map((activity) => (
                <Marker
                    key={activity.id}
                    latitude={activity.location.lat}
                    longitude={activity.location.lng}
                    anchor="bottom"
                    onClick={(e) => {
                        e.originalEvent.stopPropagation();
                        onMarkerClick?.(activity.id);
                    }}
                >
                    <div className="relative group cursor-pointer">
                        <div className={`p-2 bg-white rounded-full shadow-lg border-2 border-white ${DAY_COLORS[activity.dayIndex % DAY_COLORS.length]}`}>
                            <MapPin size={24} fill="currentColor" strokeWidth={1} />
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {activity.title}
                        </div>
                    </div>
                </Marker>
            ))}
        </Map>
    );
};

export default ItineraryMapPins;
