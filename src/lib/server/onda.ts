/**
 * Centralized Onda gateway.
 * ALL Supabase Edge Function calls for Onda go through this file.
 */

import { invokeEdgeFunction } from '@/utils/supabase/functions';

// ============================================================================
// Search & Property Details
// ============================================================================

export async function searchOndaApi(params: Record<string, unknown>) {
    return invokeEdgeFunction('onda-search', params);
}

export async function getOndaPropertyDetails(params: Record<string, unknown>) {
    return invokeEdgeFunction('onda-details', params);
}

// ============================================================================
// Booking
// ============================================================================

export async function bookOndaApi(params: Record<string, unknown>) {
    return invokeEdgeFunction('onda-book', params);
}

export async function cancelBookingOndaApi(params: { propertyId: string; bookingNumber: string }) {
    return invokeEdgeFunction('onda-cancel', params);
}
