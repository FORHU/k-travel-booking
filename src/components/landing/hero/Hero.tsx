"use client";

import React, { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { TiltCard } from '@/components/ui';
import HeroHeadline from './HeroHeadline';
import AISearchBar from './AISearchBar';
import AISuggestionChips from './AISuggestionChips';
import AuroraBackground from './AuroraBackground';
import FloatingCards from './FloatingCards';
import TrustStrip from './TrustStrip';

const Hero = () => {
    const suggestionHandlerRef = useRef<((prompt: string) => void) | null>(null);

    const handleSuggestionReady = useCallback((handler: (prompt: string) => void) => {
        suggestionHandlerRef.current = handler;
    }, []);

    const handleChipClick = useCallback((prompt: string) => {
        suggestionHandlerRef.current?.(prompt);
    }, []);

    return (
        <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4">
            {/* Aurora animated background */}
            <AuroraBackground />

            {/* Main hero content */}
            <div className="relative z-10 w-full flex flex-col items-center text-center max-w-4xl mx-auto mt-6 md:mt-10 lg:mt-0">
                {/* Floating destination cards - visible on large screens */}
                <FloatingCards />

                {/* Headline */}
                <HeroHeadline />

                {/* AI Search Bar — floating with bobbing animation */}
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.8 }}
                    className="w-full relative z-10"
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
