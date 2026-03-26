import { BookingPolicyType, PolicyTier } from '@/types/booking-policy';
import { formatCurrency, formatDate } from './utils';

// ============================================================================
// UI Mapping Helpers
// ============================================================================

export function getPolicyTitle(type: BookingPolicyType): string {
    switch (type) {
        case 'free_cancellation':
            return 'Free Cancellation';
        case 'non_refundable':
            return 'Non-Refundable';
        case 'partial_refund':
            return 'Partial Refund Available';
        case 'tiered':
            return 'Conditional Cancellation';
    default:
            return 'Cancellation Policy';
    }
}

export function getPolicyBadgeColor(type: BookingPolicyType): string {
    switch (type) {
        case 'free_cancellation':
            return 'bg-emerald-500 text-white';
        case 'non_refundable':
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        case 'partial_refund':
        case 'tiered':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
        default:
            return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
}

// ============================================================================
// Formatter Functions
// ============================================================================

export function formatDeadline(dateStr: string): string {
    if (!dateStr) return '';
    try {
        return formatDate(dateStr, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
    } catch (e) {
        return dateStr;
    }
}

export function formatTierRow(tier: PolicyTier, currency: string): string {
    const date = formatDeadline(tier.cancelDeadline);

    let penaltyText = '';
    if (tier.penaltyType === 'percent') {
        penaltyText = `${tier.penaltyAmount}% penalty`;
    } else if (tier.penaltyType === 'nights') {
        penaltyText = `${tier.penaltyAmount} night(s) penalty`;
    } else {
        penaltyText = `${formatCurrency(tier.penaltyAmount, currency)} penalty`;
    }

    return `After ${date}: ${penaltyText}`;
}

export function formatPolicyDescription(
    type: BookingPolicyType,
    freeDeadline: string | null
): string {
    if (type === 'non_refundable') {
        return 'This booking is non-refundable. You will be charged the full amount if you cancel.';
    }

    if (type === 'free_cancellation' && freeDeadline) {
        return `You can cancel for free until ${formatDeadline(freeDeadline)}. After this date, cancellation fees will apply.`;
    }

    if (type === 'free_cancellation') {
        return 'You can cancel for free.';
    }

    if (type === 'partial_refund') {
        return 'The free cancellation period has passed. A cancellation fee applies — see the breakdown below.';
    }

    if (type === 'tiered') {
        return 'Cancellation fees increase as the check-in date approaches. See the timeline below.';
    }

    return 'Cancellation fees apply based on the timeline below.';
}

/**
 * Generates a complete list of UI-ready statements from policy data.
 */
export function generatePolicyNuances(
    type: BookingPolicyType,
    tiers: PolicyTier[],
    currency: string,
    noShowPenalty: number,
    earlyDepartureFee: number
): string[] {
    const lines: string[] = [];

    // 1. Tiers
    if (type === 'non_refundable') {
        lines.push('Non-refundable: 100% penalty applies immediately.');
    } else {
        const sorted = [...tiers].sort(
            (a, b) => new Date(a.cancelDeadline).getTime() - new Date(b.cancelDeadline).getTime()
        );

        if (sorted.length === 0 && type === 'free_cancellation') {
            lines.push('No cancellation fees.');
        }

        sorted.forEach((tier) => {
            lines.push(formatTierRow(tier, currency));
        });
    }

    // 2. No-Show
    if (noShowPenalty > 0) {
        lines.push(`No-show penalty: ${formatCurrency(noShowPenalty, currency)}`);
    }

    // 3. Early Departure
    if (earlyDepartureFee > 0) {
        lines.push(`Early departure fee: ${formatCurrency(earlyDepartureFee, currency)}`);
    }

    return lines;
}

// ============================================================================
// Bridge: Provider Data → BookingPolicyType
// ============================================================================

interface RawCancelPolicyInfo {
    cancelTime: string;
    amount: number;
    currency: string;
    type: string;
}

/**
 * Derives a BookingPolicyType from raw cancellation data.
 */
export function derivePolicyType(
    refundableTag?: string,
    cancelPolicyInfos?: RawCancelPolicyInfo[]
): BookingPolicyType {
    const isRFN = refundableTag === 'RFN' || refundableTag === 'REFUNDABLE';
    const isNRFN = refundableTag === 'NRFN' || refundableTag === 'NON_REFUNDABLE';

    const policies = cancelPolicyInfos ?? [];

    if (policies.length > 0) {
        const hasFreePeriod = policies.some((p) => p.amount === 0);
        const hasPenalty = policies.some((p) => p.amount > 0);

        if (isRFN) {
            return 'free_cancellation';
        }

        if (isNRFN) {
            return 'non_refundable';
        }

        if (hasFreePeriod && !hasPenalty) return 'free_cancellation';
        if (hasFreePeriod && hasPenalty) return 'tiered';
        if (!hasFreePeriod && hasPenalty) return 'partial_refund';
        return 'free_cancellation';
    }

    if (isNRFN) return 'non_refundable';
    if (isRFN) return 'free_cancellation';
    return 'non_refundable';
}

/**
 * Extracts the free cancellation deadline from raw cancelPolicyInfos.
 */
export function getFreeCancelDeadline(
    cancelPolicyInfos?: RawCancelPolicyInfo[],
    refundableTag?: string
): string | null {
    if (!cancelPolicyInfos?.length) return null;

    const sorted = [...cancelPolicyInfos].sort(
        (a, b) => new Date(a.cancelTime).getTime() - new Date(b.cancelTime).getTime()
    );

    const isRFN = refundableTag === 'RFN' || refundableTag === 'REFUNDABLE';
    if (isRFN) {
        return sorted[0]?.cancelTime ?? null;
    }

    const freePolicy = sorted.find((p) => p.amount === 0);
    return freePolicy?.cancelTime ?? null;
}
