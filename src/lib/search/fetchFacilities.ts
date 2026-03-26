import { HOTEL_FACILITIES } from '@/lib/constants/facilities';

export type Facility = { id: number; label: string };

/**
 * Fetches hotel facilities.
 * Fallback to local constants.
 */
export async function fetchFacilities() {
    return {
        success: true,
        data: HOTEL_FACILITIES
    };
}
