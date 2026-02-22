"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, Sparkles } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setEmail('');
        }, 4000);
    };

    return (
        <section className="w-full py-12 md:py-20 relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden"
                >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600" />

                    {/* Animated mesh orbs */}
                    <motion.div
                        className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"
                        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                        className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-400/20 rounded-full blur-3xl"
                        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Dot pattern */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                            backgroundSize: '20px 20px',
                        }}
                    />

                    {/* Content */}
                    <div className="relative px-6 sm:px-10 md:px-16 py-12 md:py-16 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm mb-6"
                        >
                            <Sparkles size={14} className="text-white" />
                            <span className="text-xs font-semibold text-white uppercase tracking-wider">
                                Exclusive Deals
                            </span>
                        </motion.div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-4 tracking-tight">
                            Stay in the Loop
                        </h2>
                        <p className="text-base sm:text-lg text-white/80 max-w-lg mx-auto mb-8">
                            Get exclusive deals, travel tips, and AI-powered recommendations straight to your inbox.
                        </p>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <div className="flex-1 relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-5 py-3.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <AnimatePresence mode="wait">
                                {isSubmitted ? (
                                    <motion.div
                                        key="success"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold"
                                    >
                                        <Check size={18} />
                                        Subscribed!
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        key="submit"
                                        type="submit"
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-blue-600 text-sm font-bold shadow-lg hover:shadow-xl transition-shadow"
                                    >
                                        <Send size={16} />
                                        Subscribe
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </form>

                        <p className="text-xs text-white/50 mt-4">
                            No spam, unsubscribe anytime.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
