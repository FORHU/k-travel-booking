
export interface GeoPoint {
    lat: number;
    lng: number;
}

export interface ItineraryActivity {
    id: string;
    title: string;
    description: string;
    location: GeoPoint;
    time: string; // e.g. "Morning", "Afternoon", "Evening"
}

export interface DailyItinerary {
    day: number;
    title: string; // e.g. "Historical Seoul"
    activities: ItineraryActivity[];
}

export interface ItineraryRequest {
    city: string;
    days: number;
    vibe: string;
    hotelLocation?: GeoPoint;
}

const SEOUL_LOCATIONS = {
    gyeongbokgung: { lat: 37.5796, lng: 126.9770 },
    bukchon: { lat: 37.5826, lng: 126.9830 },
    insadong: { lat: 37.5743, lng: 126.9893 },
    nseoultower: { lat: 37.5512, lng: 126.9882 },
    myeongdong: { lat: 37.5636, lng: 126.9845 },
    hanriver: { lat: 37.5284, lng: 126.9328 },
    gangnam: { lat: 37.4979, lng: 127.0276 },
    coex: { lat: 37.5106, lng: 127.0596 },
    lotteworld: { lat: 37.5111, lng: 127.0982 },
};

export async function generateMockItinerary(request: ItineraryRequest): Promise<DailyItinerary[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { city, days } = request;

    // Simple hardcoded logic for Seoul demo
    if (city.toLowerCase().includes('seoul')) {
        return generateSeoulItinerary(days);
    }

    // Fallback for other cities (generic)
    return Array.from({ length: days }).map((_, i) => ({
        day: i + 1,
        title: `Day ${i + 1} exploring ${city}`,
        activities: [
            {
                id: `day${i + 1}-1`,
                title: `${city} City Center`,
                description: "Explore the downtown area and local monuments.",
                location: { lat: 0, lng: 0 }, // Placeholder
                time: "Morning"
            },
            {
                id: `day${i + 1}-2`,
                title: "Local Cuisine Lunch",
                description: "Try famous local dishes.",
                location: { lat: 0, lng: 0 },
                time: "Afternoon"
            }
        ]
    }));
}

function generateSeoulItinerary(days: number): DailyItinerary[] {
    const plan: DailyItinerary[] = [];

    // Day 1: History & Culture
    plan.push({
        day: 1,
        title: "Historical Vibes",
        activities: [
            {
                id: 'd1-1',
                title: 'Gyeongbokgung Palace',
                description: 'The main royal palace of the Joseon dynasty.',
                location: SEOUL_LOCATIONS.gyeongbokgung,
                time: 'Morning'
            },
            {
                id: 'd1-2',
                title: 'Bukchon Hanok Village',
                description: 'Traditional Korean village with long history.',
                location: SEOUL_LOCATIONS.bukchon,
                time: 'Afternoon'
            },
            {
                id: 'd1-3',
                title: 'Insadong Culture Street',
                description: 'Traditional tea houses and antique shops.',
                location: SEOUL_LOCATIONS.insadong,
                time: 'Evening'
            }
        ]
    });

    if (days >= 2) {
        // Day 2: City Views & Shopping
        plan.push({
            day: 2,
            title: "City Landmarks",
            activities: [
                {
                    id: 'd2-1',
                    title: 'N Seoul Tower',
                    description: 'Panoramic views of the city.',
                    location: SEOUL_LOCATIONS.nseoultower,
                    time: 'Morning'
                },
                {
                    id: 'd2-2',
                    title: 'Myeongdong Shopping Street',
                    description: 'Famous for cosmetics and street food.',
                    location: SEOUL_LOCATIONS.myeongdong,
                    time: 'Afternoon'
                },
                {
                    id: 'd2-3',
                    title: 'Han River Park',
                    description: 'Relaxing riverside walk and picnic.',
                    location: SEOUL_LOCATIONS.hanriver,
                    time: 'Evening'
                }
            ]
        });
    }

    if (days >= 3) {
        // Day 3: Modern Seoul
        plan.push({
            day: 3,
            title: "Gangnam Style",
            activities: [
                {
                    id: 'd3-1',
                    title: 'COEX Mall & Library',
                    description: 'Massive underground shopping center.',
                    location: SEOUL_LOCATIONS.coex,
                    time: 'Morning'
                },
                {
                    id: 'd3-2',
                    title: 'Gangnam Station',
                    description: 'Trendy fashion and energetic atmosphere.',
                    location: SEOUL_LOCATIONS.gangnam,
                    time: 'Afternoon'
                },
                {
                    id: 'd3-3',
                    title: 'Lotte World Tower',
                    description: 'Sky-high observations.',
                    location: SEOUL_LOCATIONS.lotteworld,
                    time: 'Evening'
                }
            ]
        });
    }

    return plan;
}
