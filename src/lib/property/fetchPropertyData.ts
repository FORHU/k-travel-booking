/**
 * Server-side data fetching utilities for property page.
 * These are pure functions that can be used in server components.
 */

import { getOndaPropertyDetails } from '@/utils/supabase/functions';
import { type HotelProperty } from '@/types/properties';
export type PropertyData = HotelProperty;

// Types
export interface SearchParamsInput {
    offerId?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: string | number;
    children?: string | number;
    rooms?: string | number;
    currency?: string;
}

export interface FetchPropertyResult {
    property: PropertyData | null;
    fetchedDetails: any;
}

// Format date as YYYY-MM-DD
export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

// Sanitize date from URL (may be ISO strings or YYYY-MM-DD)
export function sanitizeDate(dateStr: string | undefined): string | undefined {
    if (!dateStr) return undefined;
    try {
        const decoded = decodeURIComponent(dateStr);
        // If it's already YYYY-MM-DD, just return it
        if (/^\d{4}-\d{2}-\d{2}$/.test(decoded)) return decoded;
        
        // Otherwise try to parse as Date and format
        const date = new Date(decoded);
        if (isNaN(date.getTime())) return undefined;
        return date.toISOString().split('T')[0];
    } catch {
        return undefined;
    }
}

// Get default check-in/out dates (tomorrow + 2 days)
export function getDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(tomorrow.getDate() + 2);
    return { checkIn: formatDate(tomorrow), checkOut: formatDate(dayAfter) };
}

// Collect room images from room types
export function collectRoomImages(roomTypes: any[] | undefined): string[] {
    const images: string[] = [];
    if (roomTypes) {
        roomTypes.forEach((room: any) => {
            if (room.roomPhotos && Array.isArray(room.roomPhotos)) {
                images.push(...room.roomPhotos);
            }
        });
    }
    return images;
}

// Combine and deduplicate images
export function combineImages(
    thumbnailUrl: string | undefined,
    hotelImages: string[],
    roomImages: string[]
): string[] {
    return [
        ...(thumbnailUrl ? [thumbnailUrl] : []),
        ...hotelImages,
        ...roomImages
    ].filter((img, index, arr) => img && arr.indexOf(img) === index);
}

// Transform fetched Onda details to PropertyData
export function transformOndaDetailsToProperty(
    id: string,
    fetchedDetails: any,
    allImages: string[],
    currency: string
): PropertyData {
    return {
        id: fetchedDetails.hotelId || id,
        name: fetchedDetails.name || "Unknown Property",
        location: fetchedDetails.location || fetchedDetails.address || "Unknown Location",
        description: fetchedDetails.description || "No description available",
        rating: fetchedDetails.reviewRating || 0,
        reviews: fetchedDetails.reviewCount || 0,
        price: fetchedDetails.price || 0,
        currency,
        image: allImages[0] || '',
        images: allImages.length > 0 ? allImages : [],
        amenities: fetchedDetails.amenities || [],
        badges: ['Onda'],
        type: 'hotel',
        coordinates: {
            lat: fetchedDetails.latitude || 0,
            lng: fetchedDetails.longitude || 0
        }
    };
}

/**
 * Main data fetching function for property page (Onda-only).
 */
export async function fetchPropertyData(
    id: string,
    searchParams: SearchParamsInput
): Promise<FetchPropertyResult> {
    const propertyId = id.startsWith('onda_') ? id.replace('onda_', '') : id;
    let fetchedDetails = null;

    // 1. Fetch hotel details from Onda
    try {
        const defaults = getDefaultDates();
        const checkIn = sanitizeDate(searchParams.checkIn as string) || defaults.checkIn;
        const checkOut = sanitizeDate(searchParams.checkOut as string) || defaults.checkOut;

        const result = await getOndaPropertyDetails({
            propertyId,
            checkin: checkIn,
            checkout: checkOut,
            adults: Number(searchParams.adults || 2),
            children: Number(searchParams.children || 0),
            currency: searchParams.currency
        });
        fetchedDetails = result?.data;
    } catch (error) {
        console.error('Failed to fetch Onda property details:', error);
    }

    // 2. Build property data
    let property: PropertyData | null = null;

    if (fetchedDetails) {
        const roomImages = collectRoomImages(fetchedDetails.roomTypes);
        const allImages = combineImages(
            fetchedDetails.thumbnailUrl,
            fetchedDetails.images || [],
            roomImages
        );
        property = transformOndaDetailsToProperty(id, fetchedDetails, allImages, searchParams.currency || 'KRW');
    }

    return { property, fetchedDetails };
}
