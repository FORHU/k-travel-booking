import { type MappableProperty } from '@/components/map/types';
import { formatCurrency } from '@/lib/utils';

export const buildGeoJson = (properties: MappableProperty[]) => {
    return {
        type: 'FeatureCollection' as const,
        features: properties.map((p) => ({
            type: 'Feature' as const,
            properties: {
                id: p.id,
                price: p.price ?? 0,
                formattedPrice: formatCurrency(p.price ?? 0),
                // Add other properties if needed for popups/filtering
                name: p.name || '',
                rating: p.rating ?? 0,
                image: p.image || (p.images && p.images.length > 0 ? p.images[0] : ''),
            },
            geometry: {
                type: 'Point' as const,
                coordinates: [p.coordinates.lng, p.coordinates.lat],
            },
        })),
    };
};
