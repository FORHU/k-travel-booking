"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, TrendingDown, Star } from 'lucide-react';

interface TrustMetric {
    icon: React.ReactNode;
    value: string;
    label: string;
}

const metrics: TrustMetric[] = [
    { icon: <Users size={18} />, value: '2M+', label: 'Happy Travelers' },
    { icon: <Globe size={18} />, value: '500+', label: 'Destinations' },
    { icon: <TrendingDown size={18} />, value: '40%', label: 'Avg. Savings' },
    { icon: <Star size={18} />, value: '4.9', label: 'User Rating' },
];

const TrustStrip: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="w-full max-w-3xl mx-auto mt-8 sm:mt-12"
        >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                {metrics.map((metric, i) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.2 + i * 0.1, duration: 0.5 }}
                        className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-slate-200/50 dark:border-white/5"
                    >
                        <div className="text-blue-600 dark:text-cyan-400 mb-0.5">
                            {metric.icon}
                        </div>
                        <span className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
                            {metric.value}
                        </span>
                        <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {metric.label}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default TrustStrip;
