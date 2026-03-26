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
        const { propertyId, checkin, checkout, rateplans, booker, currency = 'KRW', channelBookingNumber } = body;

        if (!propertyId || !checkin || !checkout || !rateplans || !booker) {
            throw new Error("Missing required parameters: propertyId, checkin, checkout, rateplans, booker");
        }

        const url = `${ONDA_BASE_URL}/properties/${propertyId}/bookings`;
        console.log('[onda-hotel-book] Creating booking via Onda:', url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': ONDA_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                currency,
                channel_booking_number: channelBookingNumber || `CH-${Date.now()}`,
                checkin,
                checkout,
                rateplans: rateplans.map((rp: any) => ({
                    rateplan_id: rp.rateplan_id,
                    amount: rp.amount,
                    guests: rp.guests?.map((g: any) => ({
                        first_name: g.firstName,
                        last_name: g.lastName,
                        email: g.email
                    })) || []
                })),
                booker: {
                    first_name: booker.firstName,
                    last_name: booker.lastName,
                    email: booker.email,
                    phone_country_code: booker.phoneCountryCode || "82",
                    phone_number: booker.phoneNumber || "010-0000-0000"
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Onda Booking API responded with ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        return new Response(JSON.stringify({
            success: true,
            provider: 'onda',
            data: data // returns property_id, property_name, booking_number, status
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (err: any) {
        console.error('[onda-hotel-book] Error:', err.message);
        return new Response(JSON.stringify({
            success: false,
            error: err.message
        }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
