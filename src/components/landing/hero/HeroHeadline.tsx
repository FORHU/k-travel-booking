"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
    },
};

const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0, filter: 'blur(10px)' },
    visible: {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
    },
};

const HeroHeadline: React.FC = () => {
    return (
        <>
            {/* AI Badge */}
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 dark:border-cyan-400/20 bg-blue-500/5 dark:bg-cyan-400/5 shadow-sm backdrop-blur-sm"
            >
                <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                </motion.div>
                <span className="text-xs font-semibold text-blue-600 dark:text-cyan-400 tracking-wide uppercase">
                    AI-Powered Travel Platform
                </span>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial={false}
                animate="visible"
                className="mb-4 sm:mb-6"
            >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 dark:text-white tracking-tighter leading-[1.05] mb-3 sm:mb-5">
                    <motion.span variants={itemVariants} className="block">
                        Precision Travel.
                    </motion.span>
                    <motion.span variants={itemVariants} className="block mt-1">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-300">
                            Machined for You.
                        </span>
                    </motion.span>
                </h1>

                <motion.p
                    variants={itemVariants}
                    className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-2"
                >
                    The operating system for the modern voyager.
                    <br className="hidden sm:block" />
                    <span className="text-slate-400 dark:text-slate-500">
                        Ask anything. Book everything.
                    </span>
                </motion.p>
            </motion.div>
        </>
    );
};

export default HeroHeadline;
