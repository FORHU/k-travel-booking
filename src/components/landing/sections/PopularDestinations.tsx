"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';

interface Destination {
    id: number;
    city: string;
    country: string;
    price: string;
    image: string;
    featured?: boolean;
}

const destinations: Destination[] = [
    {
        id: 1,
        city: 'Santorini',
        country: 'Greece',
        price: 'From $899',
        image: 'https://images.pexels.com/photos/28186824/pexels-photo-28186824.jpeg',
        featured: true,
    },
    {
        id: 2,
        city: 'Tokyo',
        country: 'Japan',
        price: 'From $1,249',
        image: 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg',
    },
    {
        id: 3,
        city: 'Bali',
        country: 'Indonesia',
        price: 'From $659',
        image: 'https://images.pexels.com/photos/6965301/pexels-photo-6965301.jpeg',
    },
    {
        id: 4,
        city: 'Paris',
        country: 'France',
        price: 'From $799',
        image: 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg',
    },
    {
        id: 5,
        city: 'New York',
        country: 'USA',
        price: 'From $549',
        image: 'https://images.pexels.com/photos/424254/pexels-photo-424254.jpeg',
    },
    {
        id: 6,
        city: 'Maldives',
        country: 'Indian Ocean',
        price: 'From $1,499',
        image: 'https://images.pexels.com/photos/9215864/pexels-photo-9215864.jpeg',
    },
];

const DestinationCard: React.FC<{ destination: Destination; index: number }> = ({ destination, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08, type: 'spring', stiffness: 100 }}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl ${
            destination.featured
                ? 'sm:col-span-2 sm:row-span-2'
                : ''
        }`}
    >
        {/* Image */}
        <div className={`relative overflow-hidden ${destination.featured ? 'h-64 sm:h-full' : 'h-48 sm:h-56'}`}>
            <motion.img
                src={destination.image}
                alt={`${destination.city}, ${destination.country}`}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.6 }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Content overlay */}
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
                <div className="flex items-center gap-1.5 mb-1">
                    <MapPin size={14} className="text-white/80" />
                    <span className="text-xs text-white/70 font-medium">{destination.country}</span>
                </div>
                <h3 className={`font-display font-bold text-white mb-1 ${
                    destination.featured ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
                }`}>
                    {destination.city}
                </h3>
                <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-white/90 font-semibold">{destination.price}</span>
                    <motion.div
                        className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ x: 3 }}
                    >
                        Explore <ArrowRight size={12} />
                    </motion.div>
                </div>
            </div>
        </div>
    </motion.div>
);

export const PopularDestinations: React.FC = () => {
    return (
        <section className="w-full py-12 md:py-20 relative">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-end justify-between mb-8 md:mb-10">
                    <div>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-sm font-semibold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mb-2"
                        >
                            Trending Now
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight"
                        >
                            Popular Destinations
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1"
                        >
                            Explore trending locations handpicked by our AI
                        </motion.p>
                    </div>
                    <motion.a
                        href="/search"
                        whileHover={{ x: 5 }}
                        className="hidden md:flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-cyan-400 group"
                    >
                        View all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 auto-rows-auto">
                    {destinations.map((dest, i) => (
                        <DestinationCard key={dest.id} destination={dest} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};
