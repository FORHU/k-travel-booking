"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingDown, Heart, Bell, BrainCircuit, Zap } from 'lucide-react';

interface FeatureCard {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
    iconBg: string;
    span?: string; // Tailwind col-span
}

const features: FeatureCard[] = [
    {
        icon: <BrainCircuit size={24} />,
        title: 'Smart Search',
        description: 'Natural language search powered by AI. Just describe your dream trip and we\'ll find the perfect match.',
        gradient: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
        iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        span: 'sm:col-span-2',
    },
    {
        icon: <TrendingDown size={24} />,
        title: 'Price Prediction',
        description: 'ML-powered fare forecasting tells you the best time to book for maximum savings.',
        gradient: 'from-emerald-500/10 to-cyan-500/10 dark:from-emerald-500/20 dark:to-cyan-500/20',
        iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
        icon: <Heart size={24} />,
        title: 'Personalized Picks',
        description: 'Recommendations that learn your preferences over time.',
        gradient: 'from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20',
        iconBg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    },
    {
        icon: <Bell size={24} />,
        title: 'Real-time Alerts',
        description: 'Instant notifications when prices drop on your saved routes and destinations.',
        gradient: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
        iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
        icon: <Zap size={24} />,
        title: 'Instant Booking',
        description: 'Book flights and hotels in seconds with our streamlined checkout process.',
        gradient: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20',
        iconBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
        span: 'sm:col-span-2',
    },
];

export const AIFeaturesSection: React.FC = () => {
    return (
        <section className="w-full py-12 md:py-20 lg:py-24 relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full border border-blue-500/20 bg-blue-500/5"
                    >
                        <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            AI-Powered
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-4"
                    >
                        Travel Intelligence,{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
                            Reimagined
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto"
                    >
                        Our AI engine analyzes millions of data points to find you the perfect trip at the best price.
                    </motion.p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, type: 'spring', stiffness: 100, damping: 15 }}
                            whileHover={{ y: -6, scale: 1.02 }}
                            className={`group relative cursor-pointer ${feature.span || ''}`}
                        >
                            {/* Hover glow */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none" />

                            <div className={`relative h-full p-6 md:p-8 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-slate-200/50 dark:border-white/5 backdrop-blur-sm`}>
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.iconBg} mb-4`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg md:text-xl font-display font-bold text-slate-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
