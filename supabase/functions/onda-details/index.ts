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
        const { propertyId, checkin, checkout, adults = 2, childrenAges = [], locale = 'en-US' } = body;

        if (!propertyId || !checkin || !checkout) {
            throw new Error("Missing required parameters: propertyId, checkin, checkout");
        }

        const queryParams = new URLSearchParams();
        queryParams.append("checkin", checkin);
        queryParams.append("checkout", checkout);
        queryParams.append("adult", adults.toString());
        
        if (childrenAges && Array.isArray(childrenAges)) {
            childrenAges.forEach((age: number) => {
                queryParams.append("child_age[]", age.toString());
            });
        }

        const url = `${ONDA_BASE_URL}/search/properties/${propertyId}?${queryParams.toString()}`;
        console.log('[onda-hotel-details] Fetching from Onda:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': ONDA_API_KEY,
                'Content-Type': 'application/json',
                'locale': locale
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Onda API responded with ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        // Map Onda response to internal format (LiteAPI-like)
        // Onda Detail Response structure:
        /*
        {
          "property_id": "string",
          "roomtypes": [
            {
              "roomtype_id": "string",
              "roomtype_name": "string",
              "capacity": { "standard": number, "max": number },
              "rateplans": [
                {
                  "rateplan_id": "string",
                  "rateplan_name": "string",
                  "basic_price": number,
                  "sale_price": number,
                  ...
                }
              ]
            }
          ]
        }
        */

        const internalDetails = {
            hotelId: `onda_${data.property_id}`,
            name: data.property_name || `Onda Property ${data.property_id}`,
            roomTypes: data.roomtypes?.map((rt: any) => ({
                id: rt.roomtype_id,
                name: rt.roomtype_name,
                capacity: rt.capacity,
                rates: rt.rateplans?.map((rp: any) => ({
                    id: rp.rateplan_id,
                    name: rp.rateplan_name,
                    price: {
                        amount: rp.sale_price || rp.basic_price,
                        currency: body.currency || "KRW"
                    },
                    is_sold_out: rp.is_sold_out,
                    cancellation_policy: rp.cancellation_policy // Assuming Onda provides this or we fetch it separately
                }))
            })) || []
        };

        return new Response(JSON.stringify({
            success: true,
            provider: 'onda',
            data: internalDetails
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (err: any) {
        console.error('[onda-hotel-details] Error:', err.message);
        return new Response(JSON.stringify({
            success: false,
            error: err.message
        }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
