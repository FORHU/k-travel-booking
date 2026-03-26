import type {
    PrebookInput,
    BookingConfirmInput,
    AmendBookingInput,
    SaveBookingInput,
} from '@/lib/schemas';

/**
 * Standardized result type for all API responses.
 * Discriminated union ensures type-safe handling of success/error cases.
 */
export type ApiResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

// Re-export input types
export type PrebookParams = PrebookInput;
export type BookingParams = BookingConfirmInput;
export type AmendBookingParams = AmendBookingInput;
export type SaveBookingParams = SaveBookingInput;

// Input type for the unified confirm + save flow
export interface ConfirmAndSaveInput {
  prebookId: string;
  holder: { firstName: string; lastName: string; email: string };
  guests: Array<{
    occupancyNumber: number;
    firstName: string;
    lastName: string;
    email: string;
    remarks?: string;
  }>;
  payment: { method: string; transactionId?: string };
  paymentIntentId?: string;
  propertyName: string;
  propertyImage?: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  currency: string;
  specialRequests?: string;
  voucherCode?: string;
  discountAmount?: number;
}

export interface ConfirmAndSaveResult {
  success: boolean;
  data?: {
    bookingId: string;
    status: string;
    policyType: string;
    policySummary: string;
  };
  error?: string;
}

// Result Types
export interface PrebookResult {
    success: boolean;
    data?: {
        prebookId: string;
        price?: {
            subtotal?: number;
            taxes?: number;
            total: number;
        };
        status?: string;
        cancellationPolicies?: CancellationPolicy;
        /** Payment SDK secret key */
        secretKey?: string;
        /** Payment SDK transaction ID */
        transactionId?: string;
    };
    error?: string;
}

export interface BookingResult {
    success: boolean;
    data?: {
        bookingId: string;
        status: string;
        confirmationNumber?: string;
    };
    error?: string;
}

export interface CancelBookingResult {
    success: boolean;
    data?: {
        bookingId: string;
        status: string;
        cancellationId?: string;
        message?: string;
        refund?: {
            id?: string;
            amount: number;
            currency: string;
            status: string;
        };
    };
    error?: string;
}

export interface AmendBookingResult {
    success: boolean;
    data?: {
        bookingId: string;
        status: string;
    };
    error?: string;
}

export interface CancellationPolicy {
    cancelPolicyInfos?: Array<{
        cancelTime: string;
        amount: number;
        currency: string;
        type: string;
    }>;
    hotelRemarks?: string[];
    refundableTag?: string;
}

export interface GetUserBookingsResult {
    success: boolean;
    data?: Array<{
        id: string;
        booking_id: string;
        user_id: string;
        property_name: string;
        property_image?: string;
        room_name: string;
        check_in: string;
        check_out: string;
        guests_adults: number;
        guests_children: number;
        total_price: number;
        currency: string;
        holder_first_name: string;
        holder_last_name: string;
        holder_email: string;
        status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
        special_requests?: string;
        created_at: string;
        updated_at: string;
        cancellation_policy?: CancellationPolicy;
    }>;
    error?: string;
}

export interface BookingDetailsResult {
    success: boolean;
    data?: {
        bookingId: string;
        status: string;
        hotel: {
            name: string;
            hotelId: string;
        };
        bookedRooms: Array<{
            roomType: string;
            adults: number;
            children: number;
            rate: {
                retailRate: {
                    total: { amount: number; currency: string };
                };
            };
        }>;
        guestInfo: {
            guestFirstName: string;
            guestLastName: string;
            guestEmail: string;
        };
        checkin: string;
        checkout: string;
        cancellationPolicies?: CancellationPolicy;
        cancellation?: {
            cancelAllowed: boolean;
            fee?: { amount: number; currency: string };
            refund?: { amount: number; currency: string };
        };
    };
    error?: string;
}
