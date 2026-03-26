
/**
 * Simplified client-side cancellation fee calculator.
 * Used for immediate feedback in the UI.
 * The server-side engine (cancellation-engine.ts) is the source of truth.
 *
 * KEY INSIGHT: refundableTag determines how to interpret tiers:
 *   RFN  → tiers are "after-deadline penalties"; default (before first tier) = FREE
 *   NRFN → tiers are "before-deadline fees";     default (after all tiers) = FULL PENALTY
 */

export interface CancellationPolicyInfo {
    amount: number;
    currency?: string;
    type?: 'fixed' | 'percent' | 'nights' | string;
    cancelTime?: string; // ISO date
    deadline?: string;   // ISO date (alias)
}

export interface MinimalPolicy {
    refundableTag?: string;
    cancelPolicyInfos?: CancellationPolicyInfo[];
    hotelRemarks?: string[];
}

export interface CancellationFeeResult {
    fee: number;
    refund: number;
    currency: string;
    isFreeCancellation: boolean;
}

// ============================================================================
// Extract special fees from raw policy data
// ============================================================================

/**
 * Normalize hotelRemarks to string[].
 */
function normalizeRemarks(remarks: string | string[] | undefined): string[] {
    if (!remarks) return [];
    if (typeof remarks === 'string') return [remarks];
    if (Array.isArray(remarks)) return remarks;
    return [];
}

export function extractNoShowPenalty(policy: MinimalPolicy | null | undefined): number {
    if (!policy) return 0;

    const infos = policy.cancelPolicyInfos || [];
    const noShowEntry = infos.find(
        (i) => {
            const t = (i.type || '').toUpperCase();
            return t.includes('NO_SHOW') || t.includes('NOSHOW');
        }
    );
    if (noShowEntry) return Number(noShowEntry.amount) || 0;

    const remarks = normalizeRemarks(policy.hotelRemarks);
    for (const remark of remarks) {
        const match = remark.match(/no[- ]?show.*?(\d+[\d,.]*)/i);
        if (match) return parseFloat(match[1].replace(',', '')) || 0;
    }

    return 0;
}

export function extractEarlyDepartureFee(policy: MinimalPolicy | null | undefined): number {
    if (!policy) return 0;

    const infos = policy.cancelPolicyInfos || [];
    const edEntry = infos.find(
        (i) => {
            const t = (i.type || '').toUpperCase();
            return t.includes('EARLY_DEPARTURE') || t.includes('EARLY_CHECKOUT');
        }
    );
    if (edEntry) return Number(edEntry.amount) || 0;

    const remarks = normalizeRemarks(policy.hotelRemarks);
    for (const remark of remarks) {
        const match = remark.match(/early\s+(?:departure|checkout).*?(\d+[\d,.]*)/i);
        if (match) return parseFloat(match[1].replace(',', '')) || 0;
    }

    return 0;
}

export function calculateCancellationFee(
    policy: MinimalPolicy | null | undefined,
    totalPrice: number,
    currency: string
): CancellationFeeResult {
    if (!policy) {
        return {
            fee: totalPrice,
            refund: 0,
            currency,
            isFreeCancellation: false,
        };
    }

    const isRFN =
        policy.refundableTag === 'RFN' ||
        policy.refundableTag === 'REFUNDABLE';
    const isNRFN =
        policy.refundableTag === 'NRFN' ||
        policy.refundableTag === 'NON_REFUNDABLE' ||
        policy.refundableTag === 'NON-REFUNDABLE';

    // ── NRFN: always full penalty ──
    if (isNRFN) {
        return { fee: totalPrice, refund: 0, currency, isFreeCancellation: false };
    }

    const infos = policy.cancelPolicyInfos || [];

    // ── No tier info → use tag only ──
    if (infos.length === 0) {
        if (isRFN) {
            return { fee: 0, refund: totalPrice, currency, isFreeCancellation: true };
        }
        return { fee: totalPrice, refund: 0, currency, isFreeCancellation: false };
    }

    // ── Sort tiers chronologically ──
    const sortedInfos = [...infos].sort((a, b) => {
        const da = new Date(a.cancelTime || a.deadline || '');
        const db = new Date(b.cancelTime || b.deadline || '');
        return da.getTime() - db.getTime();
    });

    const now = new Date();
    let appliedFee: number;

    if (isRFN) {
        appliedFee = 0; // default: free

        for (const info of sortedInfos) {
            const deadline = new Date(info.cancelTime || info.deadline || '');
            const amount = Number(info.amount) || 0;

            if (now >= deadline) {
                if (info.type === 'PERCENT' || info.type === 'percent') {
                    appliedFee = (amount / 100) * totalPrice;
                } else {
                    appliedFee = amount;
                }
            } else {
                break;
            }
        }
    } else {
        appliedFee = totalPrice;
    }

    if (appliedFee > totalPrice) appliedFee = totalPrice;
    if (appliedFee < 0) appliedFee = 0;

    return {
        fee: appliedFee,
        refund: Math.max(0, totalPrice - appliedFee),
        currency,
        isFreeCancellation: appliedFee === 0,
    };
}
