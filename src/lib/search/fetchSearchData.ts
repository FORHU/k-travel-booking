/**
 * Server-side data fetching utilities for search page.
 * These are pure functions that can be used in server components.
 */

import { type HotelProperty } from '@/types/properties';
import { searchOndaApi } from '@/utils/supabase/functions';

// Types
export interface SearchParams {
    checkIn?: string;
    checkOut?: string;
    checkin?: string;
    checkout?: string;
    destination?: string;
    adults?: string | number;
    children?: string | number;
    childrenAges?: string; // Comma-separated ages (e.g., "5,10,12")
    rooms?: string | number;
    nationality?: string;
    countryCode?: string;
    currency?: string;
    placeId?: string;
    hotelName?: string;
    starRating?: string;
    minRating?: string;
    minReviewsCount?: string;
    facilities?: string;
    strictFacilityFiltering?: string;
}

export interface SearchQueryParams {
    checkin: string;
    checkout: string;
    adults: number;
    children: number;
    childrenAges?: number[];
    rooms: number;
    guest_nationality: string;
    currency: string;
    cityName: string;
    countryCode: string;
    placeId?: string;
    query: string;
    hotelName?: string;
    starRating?: number[];
    minRating?: number;
    minReviewsCount?: number;
    facilities?: number[];
    strictFacilityFiltering?: boolean;
}

// Format date as YYYY-MM-DD
export function formatSearchDate(dateInput: string | undefined): string {
    if (!dateInput) return "";
    try {
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return "";
        return d.toISOString().split('T')[0];
    } catch {
        return "";
    }
}

// Parse raw check-in date from search params
export function parseCheckInDate(params: SearchParams): string {
    return (typeof params.checkIn === 'string' && params.checkIn ? params.checkIn :
        typeof params.checkin === 'string' && params.checkin ? params.checkin : "2026-06-01");
}

// Parse raw check-out date from search params
export function parseCheckOutDate(params: SearchParams): string {
    return (typeof params.checkOut === 'string' && params.checkOut ? params.checkOut :
        typeof params.checkout === 'string' && params.checkout ? params.checkout : "2026-06-05");
}

// Parse filter parameters
export function parseFilterParams(params: SearchParams) {
    const hotelName = typeof params.hotelName === 'string' ? params.hotelName : undefined;
    const starRating = typeof params.starRating === 'string'
        ? params.starRating.split(',').map(Number).filter(n => !isNaN(n) && n >= 1 && n <= 5)
        : undefined;
    const minRating = typeof params.minRating === 'string' ? Number(params.minRating) : undefined;
    const minReviewsCount = typeof params.minReviewsCount === 'string' ? Number(params.minReviewsCount) : undefined;
    const facilities = typeof params.facilities === 'string'
        ? params.facilities.split(',').map(Number).filter(n => !isNaN(n))
        : undefined;
    const strictFacilityFiltering = params.strictFacilityFiltering === 'true';

    return { hotelName, starRating, minRating, minReviewsCount, facilities, strictFacilityFiltering };
}

// Build query params object
export function buildSearchQueryParams(params: SearchParams): SearchQueryParams {
    const rawCheckin = parseCheckInDate(params);
    const rawCheckout = parseCheckOutDate(params);
    const destination = typeof params.destination === 'string' ? params.destination : "";
    const filters = parseFilterParams(params);

    const childrenAges = typeof params.childrenAges === 'string' && params.childrenAges
        ? params.childrenAges.split(',').map(Number).filter(n => !isNaN(n) && n >= 0 && n <= 17)
        : undefined;

    const countryCode = typeof params.countryCode === 'string' && params.countryCode
        ? params.countryCode : '';

    const currency = typeof params.currency === 'string' && params.currency
        ? params.currency : 'KRW';

    const queryParams: SearchQueryParams = {
        checkin: formatSearchDate(rawCheckin) || "2026-06-01",
        checkout: formatSearchDate(rawCheckout) || "2026-06-05",
        adults: Number(params.adults) || 2,
        children: Number(params.children) || 0,
        childrenAges,
        rooms: Number(params.rooms) || 1,
        guest_nationality: typeof params.nationality === 'string' && params.nationality ? params.nationality : "KR",
        currency,
        cityName: destination,
        countryCode: countryCode || '',
        placeId: typeof params.placeId === 'string' ? params.placeId : undefined,
        query: destination,
    };

    if (filters.hotelName) queryParams.hotelName = filters.hotelName;
    if (filters.starRating && filters.starRating.length > 0) queryParams.starRating = filters.starRating;
    if (filters.minRating && filters.minRating > 0) queryParams.minRating = filters.minRating;
    if (filters.minReviewsCount && filters.minReviewsCount > 0) queryParams.minReviewsCount = filters.minReviewsCount;
    if (filters.facilities && filters.facilities.length > 0) {
        queryParams.facilities = filters.facilities;
        if (filters.strictFacilityFiltering) queryParams.strictFacilityFiltering = true;
    }

    return queryParams;
}

// Transform Onda hotel to Property
function transformOndaToProperty(hotel: any, cityName: string, currency: string): HotelProperty {
    return {
        id: hotel.hotelId,
        name: hotel.name,
        location: cityName,
        description: hotel.description || "Onda property",
        rating: hotel.rating || 0,
        reviews: hotel.reviews || 0,
        price: hotel.price || 0,
        currency,
        image: hotel.thumbnailUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
        images: hotel.images || [],
        amenities: hotel.amenities || [],
        badges: hotel.provider === 'onda' ? ['Onda'] : [],
        type: 'hotel',
        coordinates: {
            lat: hotel.latitude || 0,
            lng: hotel.longitude || 0,
        },
    } as HotelProperty;
}

/**
 * Main search function - fetches properties exclusively from Onda.
 */
export async function fetchSearchProperties(params: SearchParams): Promise<HotelProperty[]> {
    const queryParams = buildSearchQueryParams(params);

    try {
        console.log("Fetching Onda API with params:", queryParams);
        const result = await searchOndaApi(queryParams);
        console.log("Onda API Result:", JSON.stringify(result, null, 2));

        if (result?.data && Array.isArray(result.data)) {
            return result.data.map((hotel: any) =>
                transformOndaToProperty(hotel, queryParams.cityName, queryParams.currency)
            );
        }
    } catch (e) {
        console.error("Failed to fetch Onda properties:", e);
    }

    return [];
}
