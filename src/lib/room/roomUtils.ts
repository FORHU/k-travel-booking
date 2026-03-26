import { type CancellationPolicy } from '@/services/booking.service';

/**
 * Room rate option within a grouped room
 */
export interface RoomRate {
    offerId: string;
    price: number;
    currency: string;
    refundable: boolean;
    boardType?: string;
    description?: string;
    cancellationPolicy?: CancellationPolicy;
}

/**
 * Room type definition (input from API)
 */
export interface RoomType {
    id: string;
    roomName: string;
    description?: string;
    images?: string[];
    amenities?: string[];
    price: {
        amount: number;
        currency: string;
    };
    cancellationPolicies?: CancellationPolicy;
    maxOccupancy?: number;
    bedType?: string;
    roomSize?: string;
}

/**
 * Grouped room for display
 */
export interface GroupedRoom {
    roomName: string;
    lowestPrice: number;
    currency: string;
    maxOccupancy: number;
    bedType: string;
    roomSize: string;
    amenities: string[];
    roomPhotos: string[];
    rateOptions: RoomRate[];
    roomTypes: RoomType[];
}

export interface PriceInfo {
    amount: number;
    currency: string;
}

// ============================================================================
// Display Utilities
// ============================================================================

export function normalizeRoomName(name: string): string {
    if (!name) return 'Standard Room';
    // Remove "Onda -" prefix if present
    return name.replace(/^Onda\s*-\s*/, '').trim();
}

export function getRoomDisplayName(room: RoomType): string {
    return normalizeRoomName(room.roomName);
}

export function getRoomImage(groupedRoom: GroupedRoom, index: number, hotelImages: string[] = []): string {
    if (groupedRoom.roomPhotos?.[0]) return groupedRoom.roomPhotos[0];
    if (hotelImages[index % hotelImages.length]) return hotelImages[index % hotelImages.length];
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';
}

// ============================================================================
// Grouping & Search
// ============================================================================

export function createRateOption(room: RoomType): RoomRate {
    return {
        offerId: room.id,
        price: room.price.amount,
        currency: room.price.currency,
        refundable: room.cancellationPolicies?.refundableTag === 'RFN',
        boardType: room.description,
        description: room.description,
        cancellationPolicy: room.cancellationPolicies,
    };
}

export function groupRoomsByName(rooms: RoomType[]): GroupedRoom[] {
    const groups: Record<string, GroupedRoom> = {};

    rooms.forEach((room) => {
        const name = normalizeRoomName(room.roomName);
        if (!groups[name]) {
            groups[name] = {
                roomName: name,
                lowestPrice: room.price.amount,
                currency: room.price.currency,
                maxOccupancy: room.maxOccupancy || 2,
                bedType: room.bedType || 'King Bed',
                roomSize: room.roomSize || '30 sqm',
                amenities: room.amenities || [],
                roomPhotos: room.images || [],
                rateOptions: [],
                roomTypes: [],
            };
        }

        groups[name].roomTypes.push(room);
        groups[name].rateOptions.push(createRateOption(room));

        if (room.price.amount < groups[name].lowestPrice) {
            groups[name].lowestPrice = room.price.amount;
            groups[name].currency = room.price.currency;
        }
    });

    // Sort rates by price
    return Object.values(groups).map(g => ({
        ...g,
        rateOptions: g.rateOptions.sort((a, b) => a.price - b.price)
    }));
}

export function findRateByOfferId(groupedRoom: GroupedRoom, offerId?: string): RoomRate | undefined {
    if (!offerId) return groupedRoom.rateOptions[0];
    return groupedRoom.rateOptions.find(r => r.offerId === offerId);
}

// ============================================================================
// Other Utilities
// ============================================================================

export function extractRoomPrice(room: RoomType): number {
    return room.price.amount;
}

export function hasFreeCancellation(room: RoomType): boolean {
    return room.cancellationPolicies?.refundableTag === 'RFN';
}

export function getRoomRefundableTag(room: RoomType): string | undefined {
    return room.cancellationPolicies?.refundableTag;
}

export function formatCancellationPolicy(policy?: CancellationPolicy): string {
    if (!policy) return 'Policy details unavailable';
    if (policy.refundableTag === 'NRFN') return 'Non-refundable';
    if (policy.refundableTag === 'RFN') return 'Free cancellation';
    return policy.refundableTag || 'Flexible policy';
}
