import { Destination, DateRange, TravelersConfig, SearchFilters } from '@/stores/searchStore';

export interface AISearchQuery {
    query: string;
}

export interface AISearchResponse {
    destination?: {
        title: string;
        type?: 'city' | 'airport' | 'history';
    };
    dates?: {
        checkIn?: string; // ISO date string
        checkOut?: string; // ISO date string
        flexibility?: 'exact' | '1day' | '2days' | '3days' | '7days';
    };
    travelers?: {
        adults?: number;
        children?: number;
        rooms?: number;
    };
    filters?: {
        budget?: {
            min?: number;
            max?: number;
            currency?: string;
        };
        amenities?: string[]; // Natural language amenities (e.g., "pool", "spa")
        vibe?: string;       // e.g., "romantic", "party"
        sort?: 'recommended' | 'price_low' | 'price_high' | 'rating';
    };
    explanation?: string; // Friendly message: "I found 3 romantic hotels near Seoul with a spa."
}

export interface MappedSearchParams {
    destination: Destination | null;
    dates: Partial<DateRange>;
    travelers: Partial<TravelersConfig>;
    filters: Partial<SearchFilters>;
}
