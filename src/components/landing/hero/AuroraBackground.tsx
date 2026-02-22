"use client";

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated aurora / gradient mesh background for the hero section.
 * Uses multiple overlapping blurred orbs with slow drift animations.
 */
const AuroraBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Base gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent dark:from-blue-950/30 dark:via-transparent dark:to-transparent" />

            {/* Primary aurora orb - blue */}
            <motion.div
                className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(59,130,246,0) 70%)',
                }}
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, 50, -30, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Secondary aurora orb - cyan */}
            <motion.div
                className="absolute top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-25 dark:opacity-15"
                style={{
                    background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(6,182,212,0) 70%)',
                }}
                animate={{
                    x: [0, -80, 40, 0],
                    y: [0, 60, -40, 0],
                    scale: [1, 0.8, 1.1, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 2,
                }}
            />

            {/* Tertiary aurora orb - indigo/violet */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-20 dark:opacity-10"
                style={{
                    background: 'radial-gradient(ellipse, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)',
                }}
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 10, -10, 0],
                    opacity: [0.2, 0.3, 0.15, 0.2],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 4,
                }}
            />

            {/* Small accent orb - warm accent */}
            <motion.div
                className="absolute bottom-20 left-1/3 w-[300px] h-[300px] rounded-full opacity-15 dark:opacity-10"
                style={{
                    background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)',
                }}
                animate={{
                    x: [0, 60, -30, 0],
                    y: [0, -40, 20, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 6,
                }}
            />

            {/* Dot grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />
        </div>
    );
};

export default AuroraBackground;
