import { AISearchQuery, AISearchResponse } from './types';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock responses for demo purposes
const MOCK_RESPONSES: Record<string, AISearchResponse> = {
    // Scenario 1: Romantic Weekend
    'romantic weekend near seoul with spa': {
        destination: {
            title: 'Seoul',
            type: 'city',
        },
        dates: {
            flexibility: '2days', // "weekend" implies ~2 days flexible
        },
        filters: {
            amenities: ['Spa', 'Hot Tub'],
            vibe: 'romantic',
            sort: 'recommended',
        },
        explanation: 'Found romantic getaways in Seoul with Spa facilities.',
    },

    // Scenario 2: Family Trip to Jeju
    'family trip to jeju next week': {
        destination: {
            title: 'Jeju',
            type: 'city',
        },
        travelers: {
            adults: 2,
            children: 2,
            rooms: 1,
        },
        filters: {
            amenities: ['Pool', 'Kids Club'],
            vibe: 'family',
        },
        dates: {
            flexibility: '7days', // "next week" is broad
        },
        explanation: 'Searching for family-friendly resorts in Jeju for next week.',
    },

    // Scenario 3: Cheap Stay
    'cheap hotel in busan under $50': {
        destination: {
            title: 'Busan',
            type: 'city',
        },
        filters: {
            budget: {
                max: 50,
                currency: 'USD',
            },
            sort: 'price_low',
        },
        explanation: 'Looking for budget-friendly stays in Busan under $50.',
    },
};

/**
 * Mock implementation of semantic query parsing.
 * In production, this would call an LLM (OpenAI/Anthropic).
 */
export async function parseSemanticQuery(query: string): Promise<AISearchResponse> {
    await delay(1500); // Simulate API latency

    const normalizedQuery = query.toLowerCase().trim();

    // 1. Exact match for demo
    if (MOCK_RESPONSES[normalizedQuery]) {
        return MOCK_RESPONSES[normalizedQuery];
    }

    // 2. Fuzzy / Keyword matching fallback (basic logic for non-exact demo inputs)
    if (normalizedQuery.includes('seoul')) {
        return {
            destination: { title: 'Seoul', type: 'city' },
            explanation: 'Searching for hotels in Seoul.',
        };
    }
    if (normalizedQuery.includes('jeju')) {
        return {
            destination: { title: 'Jeju', type: 'city' },
            explanation: 'Searching for hotels in Jeju.',
        };
    }

    // 3. Default fallback
    return {
        explanation: "I couldn't quite understand that. Try 'romantic weekend near Seoul' or 'family trip to Jeju'.",
    };
}
