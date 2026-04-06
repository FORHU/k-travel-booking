"use client";

import React, { useCallback, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TiltCard } from '@/components/ui';
import HeroHeadline from './HeroHeadline';
import AISearchBar from './AISearchBar';
import AISuggestionChips from './AISuggestionChips';
import AuroraBackground from './AuroraBackground';
import FloatingCards from './FloatingCards';
import TrustStrip from './TrustStrip';

const Hero = () => {
    const prefersReducedMotion = useReducedMotion();
    const suggestionHandlerRef = useRef<((prompt: string) => void) | null>(null);

    const handleSuggestionReady = useCallback((handler: (prompt: string) => void) => {
        suggestionHandlerRef.current = handler;
    }, []);

    const handleChipClick = useCallback((prompt: string) => {
        suggestionHandlerRef.current?.(prompt);
    }, []);

    return (
        <section className="w-full flex flex-col items-center text-center max-w-4xl mx-auto mt-6 md:mt-10 lg:mt-16 mb-6 md:mb-10 lg:mb-16 landscape-compact:mt-2 landscape-compact:mb-2 relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[600px] h-[200px] sm:h-[300px] bg-alabaster-accent/5 dark:bg-obsidian-accent/10 blur-3xl rounded-full pointer-events-none z-[-1]" />

            {/* Headline */}
            <div className="px-4 w-full flex flex-col items-center">
                <HeroHeadline />
            </div>

            {/* AI Search Bar — floating with bobbing animation */}
            <motion.div
                initial={false}
                animate={{ y: 0, opacity: 1 }}
                className="w-full relative z-10 px-4"
            >
                <motion.div
                    animate={{ y: prefersReducedMotion ? 0 : [0, -10, 0] }}
                    transition={{ duration: 6, repeat: prefersReducedMotion ? 0 : Infinity, ease: "easeInOut" }}
                >
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <TiltCard className="w-full">
                            <AISearchBar onSuggestionReady={handleSuggestionReady} />
                        </TiltCard>
                    </motion.div>
                </motion.div>

                {/* Suggestion Chips — below the floating search bar */}
                <AISuggestionChips onSuggestionClick={handleChipClick} />

                {/* Trust metrics strip */}
                <TrustStrip />
            </div>

            {/* Bottom fade into next section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-alabaster dark:from-obsidian to-transparent pointer-events-none z-10" />
        </section>
    );
};

export default Hero;
