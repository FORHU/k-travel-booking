"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    avatar: string;
    rating: number;
    quote: string;
    featured?: boolean;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'Sarah Chen',
        role: 'Frequent Traveler',
        avatar: 'https://i.pravatar.cc/80?u=sarah-chen',
        rating: 5,
        quote: 'CheapestGo saved me over $2,000 on my Asia trip. The AI search understood exactly what I wanted — a quiet beachfront with good food nearby. Incredible!',
        featured: true,
    },
    {
        id: 2,
        name: 'Marco Rossi',
        role: 'Digital Nomad',
        avatar: 'https://i.pravatar.cc/80?u=marco-rossi',
        rating: 5,
        quote: 'The price prediction feature is a game-changer. It told me to wait 3 days and I saved 35% on my flight to Tokyo.',
    },
    {
        id: 3,
        name: 'Emma Williams',
        role: 'Family Traveler',
        avatar: 'https://i.pravatar.cc/80?u=emma-williams',
        rating: 5,
        quote: 'Planning a family trip used to be stressful. With CheapestGo, I just typed what we needed and got perfect options in seconds.',
    },
    {
        id: 4,
        name: 'James Park',
        role: 'Business Traveler',
        avatar: 'https://i.pravatar.cc/80?u=james-park',
        rating: 5,
        quote: 'I switched from our corporate travel tool to CheapestGo. Better prices, better UI, and the real-time alerts are phenomenal.',
    },
    {
        id: 5,
        name: 'Lily Nguyen',
        role: 'Adventure Seeker',
        avatar: 'https://i.pravatar.cc/80?u=lily-nguyen',
        rating: 4,
        quote: 'Found a hidden gem resort in Bali that wasn\'t on any other platform. The personalized recommendations are spot-on.',
    },
    {
        id: 6,
        name: 'David Kim',
        role: 'Budget Traveler',
        avatar: 'https://i.pravatar.cc/80?u=david-kim',
        rating: 5,
        quote: 'Best travel app I\'ve ever used. Period. The AI literally found me a $400 round trip to Europe during peak season.',
    },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={14}
                className={i < rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-600'}
            />
        ))}
    </div>
);

const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = ({ testimonial, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08, type: 'spring', stiffness: 100 }}
        whileHover={{ y: -4 }}
        className={`group relative ${testimonial.featured ? 'sm:col-span-2 lg:col-span-1 lg:row-span-2' : ''}`}
    >
        {/* Glow on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500 pointer-events-none" />

        <div className="relative h-full p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm">
            {/* Quote icon */}
            <Quote size={24} className="text-blue-500/20 dark:text-cyan-500/20 mb-3" />

            {/* Quote text */}
            <p className={`text-slate-700 dark:text-slate-300 leading-relaxed mb-5 ${
                testimonial.featured ? 'text-base md:text-lg' : 'text-sm md:text-base'
            }`}>
                &ldquo;{testimonial.quote}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 mt-auto">
                <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-700"
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {testimonial.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                </div>
                <StarRating rating={testimonial.rating} />
            </div>
        </div>
    </motion.div>
);

export const TestimonialsSection: React.FC = () => {
    return (
        <section className="w-full py-12 md:py-20 lg:py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-10 md:mb-14">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-4"
                    >
                        What Travelers Say
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto"
                    >
                        Join millions of happy travelers who found their perfect trip with CheapestGo
                    </motion.p>
                </div>

                {/* Masonry-like grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {testimonials.map((testimonial, i) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};
