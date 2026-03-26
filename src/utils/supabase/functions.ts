import { env } from "@/utils/env";

// Booking operations need more time than search/autocomplete
const SLOW_FUNCTIONS = new Set([
    'onda-book', 'onda-cancel',
    'create-booking', 'create-booking-session',
]);

export async function invokeEdgeFunction<T = any>(
    functionName: string,
    body?: any,
    options?: { headers?: Record<string, string>; method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH'; timeoutMs?: number }
) {
    // Use direct HTTP fetch to bypass Supabase client auth issues on server side
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_ANON_KEY;

    const functionUrl = `${supabaseUrl}/functions/v1/${functionName}`;
    const method = options?.method || 'POST';
    const timeout = options?.timeoutMs ?? (SLOW_FUNCTIONS.has(functionName) ? 60_000 : 15_000);

    const response = await fetch(functionUrl, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
            ...options?.headers
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
        let errorText = '';
        try {
            errorText = await response.text();
        } catch (e) {
            errorText = 'Could not read error response';
        }
        throw new Error(`Error invoking ${functionName}: ${response.statusText || 'Unknown error'} (Status: ${response.status}). details: ${errorText}`);
    }

    const data = await response.json();
    return data as T;
}

// Specific helper for onda-search
export async function searchOndaApi(params: any) {
    return invokeEdgeFunction('onda-search', params);
}

// Specific helper for onda-details
export async function getOndaPropertyDetails(params: any) {
    return invokeEdgeFunction('onda-details', params);
}

// Specific helper for onda-book
export async function ondaBook(params: any) {
    return invokeEdgeFunction('onda-book', params);
}

// Specific helper for onda-cancel
export async function ondaCancel(params: any) {
    return invokeEdgeFunction('onda-cancel', params);
}
