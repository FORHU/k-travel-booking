import { useState } from 'react';
import { useSearchActions } from '@/stores/searchStore';
import { parseSemanticQuery } from './mockSemanticParser';
import { AISearchResponse } from './types';
import { toast } from 'sonner';

export function useAISearch() {
    const [query, setQuery] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [aiResponse, setAiResponse] = useState<AISearchResponse | null>(null);

    const {
        setDestination,
        setDates,
        setTravelers,
        setFilters,
        setDestinationQuery,
    } = useSearchActions();

    const submitAISearch = async () => {
        if (!query.trim()) return;

        setIsProcessing(true);
        setAiResponse(null);

        try {
            const result = await parseSemanticQuery(query);
            setAiResponse(result);

            // --- Map AI Response to App State ---

            // 1. Destination
            if (result.destination) {
                setDestination({
                    title: result.destination.title,
                    subtitle: 'AI Suggested Location',
                    type: result.destination.type || 'city',
                });
                setDestinationQuery(result.destination.title);
            }

            // 2. Dates
            if (result.dates) {
                // Mock date logic: if AI says "weekend", pick next Friday
                const today = new Date();
                const nextFriday = new Date(today.setDate(today.getDate() + (5 - today.getDay() + 7) % 7));
                const nextSunday = new Date(today.setDate(nextFriday.getDate() + 2));

                if (result.dates.flexibility) {
                    setDates({
                        checkIn: nextFriday, // Default to next weekend for demo
                        checkOut: nextSunday,
                        flexibility: result.dates.flexibility,
                    });
                }
            }

            // 3. Travelers
            if (result.travelers) {
                setTravelers({
                    adults: result.travelers.adults || 2,
                    children: result.travelers.children || 0,
                    rooms: result.travelers.rooms || 1,
                });
            }

            // 4. Filters (Amenities, etc.) - mapped to LiteAPI IDs in real app
            // For now, we just toast the "vibe" as we can't map text to ID without a DB lookup
            if (result.filters?.vibe) {
                toast.info(`Applying ${result.filters.vibe} vibe filters...`);
            }

        } catch (error) {
            console.error('AI Search Failed:', error);
            toast.error('AI Search failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        query,
        setQuery,
        isProcessing,
        aiResponse,
        submitAISearch,
    };
}
