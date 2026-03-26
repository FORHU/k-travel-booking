"use client";

import { useState, useCallback } from 'react';
import { usePrebook } from '../mutations/usePrebook';
import { useBooking } from '../mutations/useBooking';
import {
  usePrebookId,
  useSelectedRoom,
  useBookingActions,
} from '@/stores/bookingStore';
import { useCheckoutStore } from '@/stores/checkoutStore';
import type { BookingParams, PrebookResponse, CancellationPolicy } from '@/services';
import { apiFetch } from '@/lib/api/client';

/**
 * Price data from prebook response
 */
export interface PriceData {
  price: number;
  tax: number;
  total: number;
  /** Cancellation policies from prebook */
  cancellationPolicies?: CancellationPolicy;
}

/**
 * Return type for useBookingFlow hook
 */
export interface UseBookingFlowReturn {
  // State
  prebookId: string | null | undefined;
  priceData: PriceData | null;
  isPrebooking: boolean;
  isBooking: boolean;
  isProcessing: boolean;
  prebookError: Error | null;
  bookingError: Error | null;

  /** Payment SDK secret key from prebook */
  secretKey: string | null;
  /** Payment SDK transaction ID from prebook */
  transactionId: string | null;

  // Actions
  startPrebook: (offerId: string, currency: string, voucherCode?: string) => Promise<PrebookResponse>;
  completeBooking: (params: Omit<BookingParams, 'prebookId'>) => Promise<void>;
  refreshPrebook: (offerId: string, currency: string, voucherCode?: string) => Promise<PrebookResponse>;
  /** Re-prebook with a voucher code */
  reprebookWithVoucher: (voucherCode: string) => Promise<PrebookResponse | null>;
  /** Re-prebook without voucher (when voucher is removed) */
  reprebookWithoutVoucher: () => Promise<PrebookResponse | null>;

  // Helpers
  reset: () => void;
}

/**
 * High-level hook that orchestrates the complete booking flow.
 *
 * Flow:
 * 1. startPrebook(offerId, currency) → gets prebookId, secretKey, transactionId
 * 2. User applies voucher → reprebookWithVoucher(code) → gets new credentials
 * 3. Payment SDK renders using secretKey
 * 4. completeBooking() uses local processing
 */
export function useBookingFlow(): UseBookingFlowReturn {
  const prebookId = usePrebookId();
  const selectedRoom = useSelectedRoom();
  const { setPrebookId, setBookingId } = useBookingActions();

  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Prebook mutation
  const prebookMutation = usePrebook({
    onSuccess: (data) => {
      // Update price data if available
      if (data.price) {
        setPriceData({
          price: data.price.subtotal || data.price.total,
          tax: data.price.taxes || 0,
          total: data.price.total,
          cancellationPolicies: data.cancellationPolicies,
        });
      }

      // Store Payment SDK credentials
      if (data.secretKey) {
        setSecretKey(data.secretKey);
      }
      if (data.transactionId) {
        setTransactionId(data.transactionId);
      }
    },
  });

  // Booking mutation
  const bookingMutation = useBooking();

  /**
   * Start the prebook process (with optional voucher code)
   */
  const startPrebook = useCallback(
    async (offerId: string, currency: string, voucherCode?: string): Promise<PrebookResponse> => {
      const params: { offerId: string; currency: string; voucherCode?: string } = { offerId, currency };
      if (voucherCode) params.voucherCode = voucherCode;
      return prebookMutation.mutateAsync(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prebookMutation.mutateAsync]
  );

  /**
   * Refresh an expired prebook session
   */
  const refreshPrebook = useCallback(
    async (offerId: string, currency: string, voucherCode?: string): Promise<PrebookResponse> => {
      const params: { offerId: string; currency: string; voucherCode?: string } = { offerId, currency };
      if (voucherCode) params.voucherCode = voucherCode;

      const result = await apiFetch<PrebookResponse>('/api/booking/prebook', params as unknown as Record<string, unknown>);
      if (!result.success) {
        throw new Error(result.error || 'Refresh prebook failed');
      }
      if (!result.data) {
        throw new Error('Refresh prebook failed');
      }

      prebookMutation.reset();

      if (result.data.prebookId) {
        setPrebookId(result.data.prebookId);
      }
      if (result.data.secretKey) {
        setSecretKey(result.data.secretKey);
      }
      if (result.data.transactionId) {
        setTransactionId(result.data.transactionId);
      }
      return result.data as PrebookResponse;
    },
    [setPrebookId, prebookMutation]
  );

  /**
   * Re-prebook with a voucher code
   */
  const reprebookWithVoucher = useCallback(
    async (voucherCode: string): Promise<PrebookResponse | null> => {
      if (!selectedRoom?.offerId) return null;

      const currentCurrency = useCheckoutStore.getState().selectedCurrency || 'KRW';

      const result = await apiFetch<PrebookResponse>('/api/booking/prebook', {
        offerId: selectedRoom.offerId,
        currency: currentCurrency,
        voucherCode,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to apply voucher to booking');
      }
      if (!result.data) {
        throw new Error('Failed to apply voucher to booking');
      }

      prebookMutation.reset();

      if (result.data.prebookId) setPrebookId(result.data.prebookId);
      if (result.data.secretKey) setSecretKey(result.data.secretKey);
      if (result.data.transactionId) setTransactionId(result.data.transactionId);

      if (result.data.price) {
        setPriceData({
          price: result.data.price.subtotal || result.data.price.total,
          tax: result.data.price.taxes || 0,
          total: result.data.price.total,
          cancellationPolicies: result.data.cancellationPolicies,
        });
      }

      return result.data as PrebookResponse;
    },
    [selectedRoom?.offerId, setPrebookId, prebookMutation]
  );

  /**
   * Re-prebook without voucher
   */
  const reprebookWithoutVoucher = useCallback(
    async (): Promise<PrebookResponse | null> => {
      if (!selectedRoom?.offerId) return null;

      const currentCurrency = useCheckoutStore.getState().selectedCurrency || 'KRW';

      const result = await apiFetch<PrebookResponse>('/api/booking/prebook', {
        offerId: selectedRoom.offerId,
        currency: currentCurrency,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to refresh booking session');
      }
      if (!result.data) {
        throw new Error('Failed to refresh booking session');
      }

      prebookMutation.reset();

      if (result.data.prebookId) setPrebookId(result.data.prebookId);
      if (result.data.secretKey) setSecretKey(result.data.secretKey);
      if (result.data.transactionId) setTransactionId(result.data.transactionId);

      if (result.data.price) {
        setPriceData({
          price: result.data.price.subtotal || result.data.price.total,
          tax: result.data.price.taxes || 0,
          total: result.data.price.total,
          cancellationPolicies: result.data.cancellationPolicies,
        });
      }

      return result.data as PrebookResponse;
    },
    [selectedRoom?.offerId, setPrebookId, prebookMutation]
  );

  /**
   * Complete the booking with provided details.
   */
  const completeBooking = useCallback(
    async (params: Omit<BookingParams, 'prebookId'>): Promise<void> => {
      let currentPrebookId = prebookId;

      if (!currentPrebookId) {
        throw new Error('No prebook ID available. Please select a room first.');
      }

      const bookingParams = { ...params, prebookId: currentPrebookId };

      try {
        await bookingMutation.mutateAsync(bookingParams);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '';
        const errorCode = (error as { code?: string })?.code || errorMessage.match(/\d{4}/)?.[0];
        const isExpiredSession = errorCode === '2012' || errorCode === '2010';

        if (isExpiredSession && selectedRoom?.offerId) {
          const refreshResult = await refreshPrebook(
            selectedRoom.offerId,
            'KRW'
          );

          if (refreshResult?.prebookId) {
            currentPrebookId = refreshResult.prebookId;
            const retryParams = { ...params, prebookId: currentPrebookId };
            await bookingMutation.mutateAsync(retryParams);
          } else {
            throw new Error('Could not refresh booking session');
          }
        } else {
          throw error;
        }
      }
    },
    [prebookId, selectedRoom?.offerId, bookingMutation, refreshPrebook]
  );

  /**
   * Reset booking state
   */
  const reset = useCallback(() => {
    setPrebookId(null);
    setBookingId(null);
    setPriceData(null);
    setSecretKey(null);
    setTransactionId(null);
    prebookMutation.reset();
    bookingMutation.reset();
  }, [setPrebookId, setBookingId, prebookMutation, bookingMutation]);

  return {
    prebookId,
    priceData,
    isPrebooking: prebookMutation.isPending,
    isBooking: bookingMutation.isPending,
    isProcessing: prebookMutation.isPending || bookingMutation.isPending,
    prebookError: prebookMutation.error,
    bookingError: bookingMutation.error,
    secretKey,
    transactionId,
    startPrebook,
    completeBooking,
    refreshPrebook,
    reprebookWithVoucher,
    reprebookWithoutVoucher,
    reset,
  };
}
