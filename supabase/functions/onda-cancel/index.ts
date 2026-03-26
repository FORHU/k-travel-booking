import { getCorsHeaders } from '../_shared/cors.ts';
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

declare const Deno: any;

const ONDA_BASE_URL = "https://dapi.tport.dev/gds/diglett";
const ONDA_API_KEY = Deno.env.get("ONDA_API_KEY")!;

Deno.serve(async (req: Request) => {
    const corsHeaders = getCorsHeaders(req);

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const body = await req.json();
        const { propertyId, bookingNumber, canceledBy = 'user', reason = 'Canceled by user' } = body;

        if (!propertyId || !bookingNumber) {
            throw new Error("Missing required parameters: propertyId, bookingNumber");
        }

        const url = `${ONDA_BASE_URL}/properties/${propertyId}/bookings/${bookingNumber}/cancel`;
        console.log('[onda-hotel-cancel] Canceling booking via Onda:', url);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': ONDA_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                canceled_by: canceledBy,
                reason: reason
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Onda Cancellation API responded with ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        return new Response(JSON.stringify({
            success: true,
            provider: 'onda',
            data: data // returns booking_number, status, canceled_at, cancellation_fee, refund_amount
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (err: any) {
        console.error('[onda-hotel-cancel] Error:', err.message);
        return new Response(JSON.stringify({
            success: false,
            error: err.message
        }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
