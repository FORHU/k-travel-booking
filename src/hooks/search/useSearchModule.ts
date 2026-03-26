"use client";

import { useEffect, useCallback } from 'react';
import { useSearchStore, Destination } from '@/stores/searchStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Custom hook for search module logic
 * Provides all state and actions needed for search functionality
 */
export interface UseSearchModuleReturn {
    // State
    destinationQuery: string;
    destination: Destination | null;
    checkIn: Date | null;
    checkOut: Date | null;
    flexibility: string;
    adults: number;
    children: number;
    rooms: number;
    totalTravelers: number;
    recentSearches: Destination[];
    isSearching: boolean;

    // Derived
    activeDropdown: string | null;

    // Actions
    setDestinationQuery: (query: string) => void;
    selectDestination: (destination: Destination) => void;
    setCheckIn: (date: Date | null) => void;
    setCheckOut: (date: Date | null) => void;
    setFlexibility: (flex: string) => void;
    setAdults: (count: number) => void;
    setChildren: (count: number) => void;
    setRooms: (count: number) => void;
    setActiveDropdown: (dropdown: string | null) => void;

    // Search Action
    handleSearch: () => void;
    clearRecentSearch: (title: string) => void;
}

/**
 * useSearchModule - Centralized search logic hook
 * 
 * Features:
 * - Syncs URL params to Zustand store on mount
 * - Preserves placeId and countryCode for searches
 * - Manages loading state across components
 * - Provides memoized actions for performance
 */
export const useSearchModule = (): UseSearchModuleReturn => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        destination,
        destinationQuery,
        dates,
        travelers,
        recentSearches,
        activeDropdown,
        isSearching,
        setDestination,
        setDestinationQuery,
        setDates,
        setTravelers,
        setActiveDropdown,
        setIsSearching,
        addRecentSearch,
        removeRecentSearch,
    } = useSearchStore();

    const totalTravelers = travelers.adults + travelers.children;

    useEffect(() => {
        setIsSearching(false);

        const destParam = searchParams?.get('destination');
        const checkInParam = searchParams?.get('checkIn');
        const checkOutParam = searchParams?.get('checkOut');
        const adultsParam = searchParams?.get('adults');
        const childrenParam = searchParams?.get('children');
        const roomsParam = searchParams?.get('rooms');
        const countryCodeParam = searchParams?.get('countryCode');
        const placeIdParam = searchParams?.get('placeId');

        if (destParam) {
            setDestinationQuery(destParam);
            setDestination({
                type: 'city',
                title: destParam,
                subtitle: 'Selected destination',
                id: placeIdParam || undefined,
                countryCode: countryCodeParam || undefined
            });
        }

        if (checkInParam || checkOutParam) {
            setDates({
                checkIn: checkInParam ? new Date(checkInParam) : null,
                checkOut: checkOutParam ? new Date(checkOutParam) : null
            });
        }

        if (adultsParam || childrenParam || roomsParam) {
            setTravelers({
                adults: adultsParam ? parseInt(adultsParam) : 2,
                children: childrenParam ? parseInt(childrenParam) : 0,
                rooms: roomsParam ? parseInt(roomsParam) : 1
            });
        }
    }, [searchParams, setDestination as any, setDestinationQuery, setDates, setTravelers, setIsSearching]);

    const selectDestination = useCallback((dest: Destination) => {
        setDestination(dest);
        setDestinationQuery(dest.title);
        addRecentSearch(dest);
        setActiveDropdown(null);
    }, [setDestination, setDestinationQuery, addRecentSearch, setActiveDropdown]);

    const setCheckIn = useCallback((date: Date | null) => {
        setDates({ checkIn: date });
    }, [setDates]);

    const setCheckOut = useCallback((date: Date | null) => {
        setDates({ checkOut: date });
    }, [setDates]);

    const setFlexibility = useCallback((flexibility: string) => {
        setDates({ flexibility: flexibility as 'exact' | '1day' | '2days' | '3days' | '7days' });
    }, [setDates]);

    const setAdults = useCallback((count: number) => {
        setTravelers({ adults: Math.max(1, count) });
    }, [setTravelers]);

    const setChildren = useCallback((count: number) => {
        setTravelers({ children: Math.max(0, count) });
    }, [setTravelers]);

    const setRooms = useCallback((count: number) => {
        setTravelers({ rooms: Math.max(1, count) });
    }, [setTravelers]);

    const handleSearch = useCallback(() => {
        const state = useSearchStore.getState();

        const destValue = state.destination?.title || state.destinationQuery;
        const hasDestination = destValue && destValue.trim().length > 0;
        const hasCheckIn = state.dates.checkIn !== null;
        const hasCheckOut = state.dates.checkOut !== null;

        const missingFields: string[] = [];
        if (!hasDestination) missingFields.push('destination');
        if (!hasCheckIn) missingFields.push('check-in date');
        if (!hasCheckOut) missingFields.push('check-out date');

        if (missingFields.length > 0) {
            const fieldText = missingFields.length === 1
                ? missingFields[0]
                : missingFields.slice(0, -1).join(', ') + ' and ' + missingFields[missingFields.length - 1];

            toast.error(`Please select ${fieldText}`, {
                description: 'All fields are required to search for hotels',
            });

            if (!hasDestination) {
                setActiveDropdown('destination');
            } else if (!hasCheckIn || !hasCheckOut) {
                setActiveDropdown('dates');
            }
            return;
        }

        setIsSearching(true);
        setActiveDropdown(null);

        const params = new URLSearchParams();

        params.set('destination', destValue!);
        if (state.destination?.countryCode) {
            params.set('countryCode', state.destination.countryCode);
        }
        if (state.destination?.id) {
            params.set('placeId', state.destination.id);
        }

        params.set('currency', state.userCurrency || 'KRW');
        params.set('checkIn', state.dates.checkIn!.toISOString());
        params.set('checkOut', state.dates.checkOut!.toISOString());
        params.set('adults', state.travelers.adults.toString());
        params.set('children', state.travelers.children.toString());
        params.set('rooms', state.travelers.rooms.toString());

        if (state.travelers.occupancies && state.travelers.occupancies.length > 0) {
            const allChildrenAges = state.travelers.occupancies.flatMap(occ => occ.childrenAges);
            if (allChildrenAges.length > 0) {
                params.set('childrenAges', allChildrenAges.join(','));
            }
        }

        router.push(`/search?${params.toString()}`);
    }, [router, setIsSearching, setActiveDropdown]);

    const clearRecentSearch = useCallback((title: string) => {
        removeRecentSearch(title);
    }, [removeRecentSearch]);

    return {
        destinationQuery,
        destination,
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        flexibility: dates.flexibility,
        adults: travelers.adults,
        children: travelers.children,
        rooms: travelers.rooms,
        totalTravelers,
        recentSearches,
        isSearching,
        activeDropdown,
        setDestinationQuery,
        selectDestination,
        setCheckIn,
        setCheckOut,
        setFlexibility,
        setAdults,
        setChildren,
        setRooms,
        setActiveDropdown,
        handleSearch,
        clearRecentSearch,
    };
};

export default useSearchModule;
