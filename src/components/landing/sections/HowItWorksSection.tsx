"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, CreditCard, Plane } from 'lucide-react';

interface Step {
    number: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    iconBg: string;
}

const steps: Step[] = [
    {
        number: '01',
        icon: <Search size={28} />,
        title: 'Search',
        description: 'Tell us where you want to go, or let AI suggest the perfect destination based on your preferences.',
        color: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-500/10',
    },
    {
        number: '02',
        icon: <CreditCard size={28} />,
        title: 'Book',
        description: 'Compare prices across hundreds of providers and book with confidence. Best price guaranteed.',
        color: 'text-indigo-600 dark:text-indigo-400',
        iconBg: 'bg-indigo-500/10',
    },
    {
        number: '03',
        icon: <Plane size={28} />,
        title: 'Travel',
        description: 'Enjoy your trip with 24/7 support, real-time updates, and all your bookings in one place.',
        color: 'text-cyan-600 dark:text-cyan-400',
        iconBg: 'bg-cyan-500/10',
    },
];

export const HowItWorksSection: React.FC = () => {
    return (
        <section className="w-full py-12 md:py-20 lg:py-24 relative overflow-hidden">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-transparent to-slate-50/50 dark:from-slate-900/30 dark:via-transparent dark:to-slate-900/30 pointer-events-none" />

            <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-4"
                    >
                        How It Works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base sm:text-lg text-slate-500 dark:text-slate-400"
                    >
                        Three simple steps to your perfect journey
                    </motion.p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
                    {/* Connector line (desktop only) */}
                    <div className="hidden md:block absolute top-16 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px]">
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full h-full bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-cyan-500/30 origin-left"
                        />
                    </div>

                    {steps.map((step, i) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + i * 0.15, type: 'spring', stiffness: 100 }}
                            className="relative flex flex-col items-center text-center"
                        >
                            {/* Step number + icon */}
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className={`relative w-20 h-20 rounded-2xl ${step.iconBg} flex items-center justify-center mb-6 shadow-lg`}
                            >
                                <span className={step.color}>{step.icon}</span>
                                {/* Step number badge */}
                                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center">
                                    <span className="text-xs font-bold text-white dark:text-slate-900 font-mono">
                                        {step.number}
                                    </span>
                                </div>
                            </motion.div>

                            <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 dark:text-white mb-3">
                                {step.title}
                            </h3>
                            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
