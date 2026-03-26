// Server layer barrel exports

// Auth
export { getAuthenticatedUser, getUserProfile, type AuthResult } from './auth';

// Bookings
export {
    verifyBookingOwnership,
    prebookRoom,
    confirmBooking,
    confirmAndSaveBooking,
    cancelBooking,
    amendBooking,
    getBookingDetails,
    saveBookingToDatabase,
    getUserBookings,
} from './bookings';

// Vouchers
export {
    validateVoucherServer,
    getAvailableVouchersServer,
    recordVoucherUsage,
} from './vouchers';

// Search
export { autocompleteDestinations } from './search';

// Email
export { sendBookingConfirmationEmail, sendFlightBookingConfirmationEmail, sendFlightAwaitingTicketEmail, sendFlightRefundEmail } from './email';

// Onda gateway
export {
    searchOndaApi,
    getOndaPropertyDetails,
    bookOndaApi,
    cancelBookingOndaApi,
} from './onda';

// Types
export type {
    ApiResult,
    PrebookParams,
    BookingParams,
    AmendBookingParams,
    SaveBookingParams,
    PrebookResult,
    BookingResult,
    CancelBookingResult,
    AmendBookingResult,
    CancellationPolicy,
    GetUserBookingsResult,
    BookingDetailsResult,
    ConfirmAndSaveInput,
    ConfirmAndSaveResult,
} from './types';
