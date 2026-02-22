"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Plane } from 'lucide-react';

interface FloatingDestination {
    city: string;
    country: string;
    price: string;
    rating: number;
    image: string;
}

const destinations: FloatingDestination[] = [
    {
        city: 'Santorini',
        country: 'Greece',
        price: '$899',
        rating: 4.9,
        image: 'https://images.pexels.com/photos/1029011/pexels-photo-1029011.jpeg',
    },
    {
        city: 'Tokyo',
        country: 'Japan',
        price: '$1,249',
        rating: 4.8,
        image: 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg',
    },
    {
        city: 'Bali',
        country: 'Indonesia',
        price: '$659',
        rating: 4.7,
        image: 'https://images.pexels.com/photos/6965301/pexels-photo-6965301.jpeg',
    },
];

const FloatingCard: React.FC<{
    destination: FloatingDestination;
    className: string;
    delay: number;
    floatDuration: number;
    floatY: number;
}> = ({ destination, className, delay, floatDuration, floatY }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute hidden lg:block z-20 ${className}`}
    >
        <motion.div
            animate={{ y: [0, floatY, 0] }}
            transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut' }}
        >
            <div className="group cursor-pointer">
                {/* Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/40 to-cyan-500/40 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />

                <div className="relative w-48 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl overflow-hidden border border-white/50 dark:border-white/10 shadow-xl dark:shadow-black/40 hover:scale-105 transition-transform duration-300">
                    {/* Image */}
                    <div className="relative h-28 overflow-hidden">
                        <img
                            src={destination.image}
                            alt={`${destination.city}, ${destination.country}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                        {/* Rating badge */}
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full">
                            <Star size={10} className="text-amber-500 fill-amber-500" />
                            <span className="text-[10px] font-bold text-slate-900 dark:text-white">{destination.rating}</span>
                        </div>

                        {/* Price */}
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                            from {destination.price}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-2.5">
                        <div className="flex items-center gap-1">
                            <MapPin size={12} className="text-blue-500 shrink-0" />
                            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                {destination.city}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Plane size={10} className="text-slate-400" />
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">{destination.country}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    </motion.div>
);

const FloatingCards: React.FC = () => {
    return (
        <>
            <FloatingCard
                destination={destinations[0]}
                className="-left-56 top-24"
                delay={1.2}
                floatDuration={7}
                floatY={-12}
            />
            <FloatingCard
                destination={destinations[1]}
                className="-right-56 top-16"
                delay={1.5}
                floatDuration={8}
                floatY={-15}
            />
            <FloatingCard
                destination={destinations[2]}
                className="-left-48 bottom-20"
                delay={1.8}
                floatDuration={6}
                floatY={-10}
            />
        </>
    );
};

export default FloatingCards;
