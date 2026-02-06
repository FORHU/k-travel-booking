'use server';

/**
 * Re-exports from lib/server/bookings.ts
 * Server actions are centralized in lib/server/ for clean architecture.
 * This file exists for Next.js App Router compatibility.
 */

export {
  prebookRoom,
  confirmBooking,
  cancelBooking,
  amendBooking,
  getBookingDetails,
  saveBookingToDatabase,
  getUserBookings,
  updateBookingStatus,
} from '@/lib/server/bookings';

export type {
  PrebookParams,
  PrebookResult,
  BookingParams,
  BookingResult,
  CancelBookingResult,
  AmendBookingParams,
  AmendBookingResult,
  CancellationPolicy,
  CancelPolicyInfo,
  PrebookResponse,
  SaveBookingParams,
  BookingDetailsResult,
  BookingRecord,
} from '@/lib/server/bookings';
