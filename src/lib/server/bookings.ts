import type { SupabaseClient, User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { env } from "@/utils/env";
import {
  bookingConfirmSchema,
  saveBookingSchema,
} from '@/lib/schemas';
import {
  bookOndaApi,
  cancelBookingOndaApi,
} from './onda';
import type {
  ConfirmAndSaveInput,
  ConfirmAndSaveResult,
  CancelBookingResult,
  GetUserBookingsResult,
  PrebookParams,
  PrebookResult,
  BookingParams,
  BookingResult,
  AmendBookingParams,
  AmendBookingResult,
  BookingDetailsResult,
} from './types';

// ============================================================================
// Ownership verification
// ============================================================================

export async function verifyBookingOwnership(
  supabase: SupabaseClient,
  bookingId: string,
  userId: string,
): Promise<{ isOwner: boolean; error?: string }> {
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('user_id')
    .eq('booking_id', bookingId)
    .single();

  if (fetchError || !booking) {
    return { isOwner: false, error: 'Booking not found' };
  }

  if (booking.user_id !== userId) {
    return { isOwner: false, error: 'Not authorized' };
  }

  return { isOwner: true };
}

// ============================================================================
// Confirm booking + save atomically (Onda-only)
// ============================================================================

export async function confirmAndSaveBooking(
  params: ConfirmAndSaveInput,
  user: User,
): Promise<ConfirmAndSaveResult> {
  // 1. Validate required fields
  if (!params.prebookId) {
    return { success: false, error: 'Booking identifier is required' };
  }
  if (!params.holder?.firstName || !params.holder?.lastName || !params.holder?.email) {
    return { success: false, error: 'Holder information is incomplete' };
  }
  if (!params.guests?.length) {
    return { success: false, error: 'At least one guest is required' };
  }

  let bookingId: string;
  let bookingStatus: string;
  let totalPrice: number;
  let currency: string;
  let snapshot: any;
  let tiers: any[] = [];

  // Onda Booking Flow
  const propertyId = params.prebookId.replace('onda_', '');
  let ondaResult: any;
  try {
    ondaResult = await bookOndaApi({
      propertyId,
      checkin: params.checkIn,
      checkout: params.checkOut,
      rateplans: [{
        rateplan_id: params.prebookId.split('|')[1] || 'default',
        amount: params.adults * 100, // Placeholder
        guests: params.guests
      }],
      booker: params.holder,
      currency: params.currency
    });
  } catch (error) {
    console.error('[confirmAndSaveBooking] Onda call failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Onda booking failed' };
  }

  const bookingData = ondaResult?.data;
  if (!bookingData?.booking_number) {
    return { success: false, error: 'Onda booking failed - no booking number' };
  }

  bookingId = bookingData.booking_number;
  bookingStatus = bookingData.status || 'confirmed';
  totalPrice = params.adults * 100; // Placeholder
  currency = params.currency || 'KRW';
  
  snapshot = {
    policyType: 'Onda Policy',
    summary: 'Onda cancellation policy depends on property.',
    refundableTag: 'UNK',
    hotelRemarks: [],
    rawProviderResponse: ondaResult
  };

  // 2. Atomic DB insert via service role + RPC
  try {
    const serviceClient = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const bookingPayload = {
      booking_id: bookingId,
      user_id: user.id,
      property_name: params.propertyName,
      property_image: params.propertyImage ?? null,
      room_name: params.roomName,
      check_in: params.checkIn,
      check_out: params.checkOut,
      guests_adults: params.adults,
      guests_children: params.children ?? 0,
      total_price: totalPrice,
      currency,
      holder_first_name: params.holder.firstName,
      holder_last_name: params.holder.lastName,
      holder_email: params.holder.email,
      status: bookingStatus,
      special_requests: params.specialRequests ?? null,
      voucher_code: params.voucherCode ?? null,
      discount_amount: params.discountAmount ?? 0,
      policy_type: snapshot.policyType,
    };

    const snapshotPayload = {
      policy_type: snapshot.policyType,
      summary: snapshot.summary,
      refundable_tag: snapshot.refundableTag,
      hotel_remarks: snapshot.hotelRemarks,
      no_show_penalty: 0,
      early_departure_fee: 0,
      free_cancel_deadline: null,
      raw_provider_response: snapshot.rawProviderResponse,
    };

    const { data: rpcResult, error: rpcError } = await serviceClient
      .rpc('create_booking_with_policy', {
        p_booking: bookingPayload,
        p_snapshot: snapshotPayload,
        p_tiers: tiers,
      });

    if (rpcError) {
      console.error('[confirmAndSaveBooking] DB transaction failed:', rpcError);
      return {
        success: true,
        data: {
          bookingId,
          status: bookingStatus,
          policyType: snapshot.policyType,
          policySummary: snapshot.summary ?? 'Policy details unavailable',
        },
        error: 'Booking confirmed but failed to save details. Contact support.',
      };
    }

    return {
      success: true,
      data: {
        bookingId,
        status: bookingStatus,
        policyType: snapshot.policyType,
        policySummary: snapshot.summary ?? '',
      },
    };
  } catch (error) {
    console.error('[confirmAndSaveBooking] DB error:', error);
    return {
      success: true,
      data: {
        bookingId,
        status: bookingStatus,
        policyType: snapshot.policyType,
        policySummary: snapshot.summary ?? '',
      },
      error: 'Booking confirmed but failed to save. Contact support.',
    };
  }
}

// ============================================================================
// Cancel booking (Onda-only)
// ============================================================================

export async function cancelBooking(
  bookingId: string,
  user: User,
  supabase: SupabaseClient
): Promise<CancelBookingResult> {
  if (!bookingId || typeof bookingId !== 'string' || bookingId.trim().length === 0) {
    return { success: false, error: 'Booking ID is required' };
  }

  try {
    // 1. Verify ownership
    const { isOwner, error: ownerError } = await verifyBookingOwnership(supabase, bookingId, user.id);
    if (!isOwner) {
      return { success: false, error: ownerError || 'Not authorized to cancel this booking' };
    }

    // Onda cancellation flow
    const { data: booking } = await supabase.from('bookings').select('property_name, metadata').eq('booking_id', bookingId).single();
    const propertyId = booking?.metadata?.propertyId || booking?.property_name?.split('Property ')[1]; 
    
    // Fallback if propertyId cannot be determined
    const targetPropertyId = propertyId || bookingId.split('_')[0]; // last ditch attempt

    const result = await cancelBookingOndaApi({ 
      propertyId: targetPropertyId, 
      bookingNumber: bookingId.replace('onda_', '') 
    });

    if (result.success) {
      await supabase.from('bookings').update({ status: 'cancelled' }).eq('booking_id', bookingId);
      return { success: true, data: { bookingId, status: 'cancelled', message: 'Onda booking cancelled successfully.' } };
    } else {
      return { success: false, error: result.error || 'Onda cancellation failed' };
    }
  } catch (error) {
    console.error('[cancelBooking] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Cancellation failed',
    };
  }
}

// ============================================================================
// Get user bookings
// ============================================================================

export async function getUserBookings(
  user: User,
  supabase: SupabaseClient
): Promise<GetUserBookingsResult> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getUserBookings] Error:', error);
      return { success: false, error: 'Failed to fetch bookings' };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('[getUserBookings] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch bookings',
    };
  }
}

// ============================================================================
// Save booking (Internal/Pre-payment)
// ============================================================================

export async function saveBookingToDatabase(
  params: any,
  user: User,
  supabase: SupabaseClient
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        property_name: params.propertyName,
        property_image: params.propertyImage,
        room_name: params.roomName,
        check_in: params.checkIn,
        check_out: params.checkOut,
        total_price: params.totalPrice,
        currency: params.currency,
        status: params.status || 'pending',
        metadata: params.metadata || {},
        holder_first_name: params.holder?.firstName,
        holder_last_name: params.holder?.lastName,
        holder_email: params.holder?.email,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('[saveBookingToDatabase] Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save booking' };
  }
}
// ============================================================================
// Prebook room (Onda implementation)
// ============================================================================

export async function prebookRoom(params: PrebookParams): Promise<PrebookResult> {
    try {
        // For Onda, prebook is basically a check before booking
        // We'll return the input params as the prebook ID for now
        return {
            success: true,
            data: {
                prebookId: params.offerId,
                price: {
                    total: 0 // Will be determined during actual booking
                },
                status: 'available'
            }
        };
    } catch (error) {
        console.error('[prebookRoom] Error:', error);
        return { success: false, error: 'Prebook failed' };
    }
}

// ============================================================================
// Confirm booking (Legacy/Stripe flow)
// ============================================================================

export async function confirmBooking(params: BookingParams): Promise<BookingResult> {
    try {
        // This is typically called after payment. 
        // For Onda, we use confirmAndSaveBooking in a single step usually.
        return {
            success: false,
            error: 'Use confirmAndSaveBooking for Onda bookings.'
        };
    } catch (error) {
        return { success: false, error: 'Booking confirmation failed' };
    }
}

// ============================================================================
// Get booking details
// ============================================================================

export async function getBookingDetails(
    bookingId: string,
    user: User,
    supabase: SupabaseClient
): Promise<BookingDetailsResult> {
    try {
        const { data: booking, error: fetchError } = await supabase
            .from('bookings')
            .select('*')
            .eq('booking_id', bookingId)
            .single();

        if (fetchError || !booking) {
            return { success: false, error: 'Booking not found' };
        }

        // Basic details response
        return {
            success: true,
            data: {
                bookingId: booking.booking_id,
                status: booking.status,
                hotel: {
                    name: booking.property_name,
                    hotelId: booking.metadata?.propertyId || ''
                },
                bookedRooms: [{
                    roomType: booking.room_name,
                    adults: booking.guests_adults,
                    children: booking.guests_children,
                    rate: {
                        retailRate: {
                            total: { amount: booking.total_price, currency: booking.currency }
                        }
                    }
                }],
                guestInfo: {
                    guestFirstName: booking.holder_first_name,
                    guestLastName: booking.holder_last_name,
                    guestEmail: booking.holder_email
                },
                checkin: booking.check_in,
                checkout: booking.check_out
            }
        };
    } catch (error) {
        console.error('[getBookingDetails] Error:', error);
        return { success: false, error: 'Failed to fetch booking details' };
    }
}

// ============================================================================
// Amend booking (Onda implementation)
// ============================================================================

export async function amendBooking(
    params: AmendBookingParams,
    user: User,
    supabase: SupabaseClient
): Promise<AmendBookingResult> {
    try {
        // Onda typically doesn't support easy amendments via API
        // Usually requires cancel and rebook.
        return {
            success: false,
            error: 'Onda bookings cannot be amended via API. Please cancel and rebook.'
        };
    } catch (error) {
        console.error('[amendBooking] Error:', error);
        return { success: false, error: 'Amendment failed' };
    }
}
