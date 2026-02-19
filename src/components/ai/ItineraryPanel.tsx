'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Map as MapIcon, Calendar, Share2, Save } from 'lucide-react';
import { DailyItinerary } from '@/lib/ai/itinerary/mockItineraryGenerator';
import ItineraryMapPins from '@/components/map/ItineraryMapPins';

interface ItineraryPanelProps {
    isOpen: boolean;
    onClose: () => void;
    itinerary: DailyItinerary[];
}

const ItineraryPanel: React.FC<ItineraryPanelProps> = ({ isOpen, onClose, itinerary }) => {
    const [selectedDay, setSelectedDay] = useState<number>(1);

    // Reset to day 1 when itinerary changes
    useEffect(() => {
        if (itinerary.length > 0) setSelectedDay(1);
    }, [itinerary]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    />

                    {/* Slide-up Panel */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl z-50 overflow-hidden flex flex-col md:flex-row"
                    >
                        {/* Header (Mobile) */}
                        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-lg font-bold">Your AI Itinerary</h2>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content: Left Side (List) */}
                        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50 dark:bg-slate-950">
                            {/* Header (Desktop) */}
                            <div className="hidden md:flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                <div>
                                    <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Trip Plan</h2>
                                    <p className="text-sm text-slate-500">{itinerary.length} Days • Custom Draft</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Day Selector */}
                            <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar">
                                {itinerary.map((day) => (
                                    <button
                                        key={day.day}
                                        onClick={() => setSelectedDay(day.day)}
                                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedDay === day.day
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        Day {day.day}
                                    </button>
                                ))}
                            </div>

                            {/* Activity List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {itinerary
                                    .filter(d => d.day === selectedDay)
                                    .flatMap(day => day.activities.map((activity, idx) => (
                                        <motion.div
                                            key={activity.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 dark:text-white">{activity.title}</h4>
                                                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide font-medium">{activity.time}</p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                                                        {activity.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )))
                                }
                            </div>

                            {/* Mock Actions */}
                            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <Share2 size={16} />
                                    Share
                                </button>
                                <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-opacity shadow-lg shadow-slate-900/20">
                                    <Save size={16} />
                                    Save Trip
                                </button>
                            </div>
                        </div>

                        {/* Content: Right Side (Map) */}
                        <div className="flex-1 relative bg-slate-100 dark:bg-slate-900">
                            <ItineraryMapPins itinerary={itinerary} />

                            {/* Floating Map Controls overlay could go here */}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-slate-200 text-xs font-medium text-slate-600">
                                Showing Day {selectedDay} Route
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ItineraryPanel;
