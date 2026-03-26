import { extractCountryCode } from '@/lib/constants/countries';

export interface AutocompleteResult {
    type: 'city';
    title: string;
    subtitle: string;
    countryCode: string;
    id?: string;
}

// Local fallback for popular cities
const POPULAR_CITIES = [
    { name: 'Seoul', country: 'South Korea', countryCode: 'KR' },
    { name: 'Busan', country: 'South Korea', countryCode: 'KR' },
    { name: 'Jeju', country: 'South Korea', countryCode: 'KR' },
    { name: 'Tokyo', country: 'Japan', countryCode: 'JP' },
    { name: 'Osaka', country: 'Japan', countryCode: 'JP' },
    { name: 'Bangkok', country: 'Thailand', countryCode: 'TH' },
    { name: 'Manila', country: 'Philippines', countryCode: 'PH' },
    { name: 'Cebu', country: 'Philippines', countryCode: 'PH' },
    { name: 'Da Nang', country: 'Vietnam', countryCode: 'VN' },
    { name: 'Singapore', country: 'Singapore', countryCode: 'SG' },
    { name: 'London', country: 'United Kingdom', countryCode: 'GB' },
    { name: 'Paris', country: 'France', countryCode: 'FR' },
    { name: 'New York', country: 'USA', countryCode: 'US' },
];

/**
 * Autocomplete destinations (Local fallback version).
 */
export async function autocompleteDestinations(
    query: string
): Promise<{ success: true; data: AutocompleteResult[] } | { success: false; error: string }> {
    if (!query || query.length < 2) {
        return { success: true, data: [] };
    }

    try {
        const normalizedQuery = query.toLowerCase().trim();
        const matches = POPULAR_CITIES.filter(city => 
            city.name.toLowerCase().includes(normalizedQuery) || 
            city.country.toLowerCase().includes(normalizedQuery)
        ).map(city => ({
            type: 'city' as const,
            title: city.name,
            subtitle: city.country,
            countryCode: city.countryCode,
        }));

        return { success: true, data: matches };
    } catch (error) {
        console.error('[autocompleteDestinations] Error:', error);
        return {
            success: false,
            error: 'Autocomplete failed',
        };
    }
}
