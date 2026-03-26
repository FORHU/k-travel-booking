import { createClient } from 'jsr:@supabase/supabase-js@2'
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ONDA_BASE_URL = "https://dapi.tport.dev/gds/diglett";
const ONDA_API_KEY = Deno.env.get("ONDA_API_KEY") || Deno.env.get("ONDA_SECRET_KEY")!;

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req: Request) => {
    console.log('[onda-sync] Starting property static content sync...');
    
    try {
        // 1. Fetch the basic list of all properties
        const listRes = await fetch(`${ONDA_BASE_URL}/properties`, {
            headers: { 'Authorization': ONDA_API_KEY }
        });

        if (!listRes.ok) {
            const err = await listRes.text();
            throw new Error(`Failed to fetch properties list: ${err}`);
        }

        const data = await listRes.json();
        const properties = data.properties || data.data || [];
        console.log(`[onda-sync] Found ${properties.length} total properties.`);

        let syncedCount = 0;

        // 2. Loop through properties and fetch their full details
        for (const prop of properties) {
            // Optional: You could skip disabled properties or sync them all
            // if (prop.status !== 'enabled') continue;

            try {
                const detailRes = await fetch(`${ONDA_BASE_URL}/properties/${prop.id}`, {
                    headers: { 'Authorization': ONDA_API_KEY }
                });

                if (detailRes.ok) {
                    const detailData = await detailRes.json();
                    const detail = detailData.property || {};

                    // Extract coordinates safely
                    let lat = 0;
                    let lng = 0;
                    if (detail.address?.location?.latitude) lat = parseFloat(detail.address.location.latitude);
                    if (detail.address?.location?.longitude) lng = parseFloat(detail.address.location.longitude);

                    // Reconstruct a readable address
                    let fullAddress = 'Seoul, South Korea'; // Fallback
                    if (detail.address) {
                        const parts = [
                            detail.address.address1,
                            detail.address.address2,
                            detail.address.address_detail
                        ].filter(Boolean);
                        if (parts.length > 0) fullAddress = parts.join(' ');
                    }

                    // Extract images (Onda returns array of URL strings or objects)
                    const imagesList: string[] = Array.isArray(detail.images) 
                        ? detail.images.map((img: any) => typeof img === 'string' ? img : (img.url || img.image_url || ''))
                        : [];

                    // 3. Upsert the rich content into database
                    const { error } = await supabaseAdmin.from('onda_properties').upsert({
                        id: String(detail.id || prop.id),
                        name: detail.name || prop.name,
                        address: fullAddress,
                        latitude: lat,
                        longitude: lng,
                        star_rating: detail.grade || detail.star_rating || 0,
                        thumbnail_url: imagesList.length > 0 ? imagesList[0] : '',
                        images: imagesList,
                        amenities: detail.facilities || detail.services || [],
                        description: detail.notice || detail.description || '',
                        status: detail.status || prop.status,
                        last_synced_at: new Date().toISOString()
                    });

                    if (error) {
                        console.error(`[onda-sync] DB Upsert error for property ${prop.id}:`, error.message);
                    } else {
                        syncedCount++;
                    }
                }

                // Add a small delay to respect rate limits
                await new Promise(r => setTimeout(r, 100));

            } catch (e: any) {
                console.error(`[onda-sync] Failed to sync property ${prop.id}`, e.message);
            }
        }

        console.log(`[onda-sync] Sync completed. Successfully synced ${syncedCount} properties.`);
        return new Response(JSON.stringify({ success: true, synced: syncedCount }), { 
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        console.error('[onda-sync] Fatal sync error:', err.message);
        return new Response(JSON.stringify({ success: false, error: err.message }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' }
        });
    }
});
