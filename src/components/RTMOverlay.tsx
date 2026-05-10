import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoomState, exerciseRtm, rtmPriceHike, rtmMatch } from '@/lib/socket';

interface RTMOverlayProps {
    roomState: RoomState;
    myTeamId: string | null;
}

export default function RTMOverlay({ roomState, myTeamId }: RTMOverlayProps) {
    const { rtmState, rtmPlayer, rtmOriginalTeam, rtmWinningTeam, rtmPrice, timerSeconds } = roomState;
    
    const [hikeAmount, setHikeAmount] = useState<number | ''>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Reset submission state when phase changes
    useEffect(() => {
        setIsSubmitting(false);
        if (rtmState === "hike" && rtmPrice) {
            setHikeAmount(rtmPrice + 1); // Default to slightly higher
        }
    }, [rtmState, rtmPrice]);

    if (!rtmPlayer || !rtmOriginalTeam || !rtmWinningTeam || !rtmPrice) {
        return null;
    }

    const isOriginalTeam = myTeamId === rtmOriginalTeam;
    const isWinningTeam = myTeamId === rtmWinningTeam;

    const handleExerciseRtm = (use: boolean) => {
        setIsSubmitting(true);
        exerciseRtm(use, () => setIsSubmitting(false));
    };

    const handleHike = (useHike: boolean) => {
        setIsSubmitting(true);
        if (!useHike) {
            rtmPriceHike(0, () => setIsSubmitting(false));
        } else {
            const amount = typeof hikeAmount === 'number' ? hikeAmount : rtmPrice + 1;
            rtmPriceHike(amount, () => setIsSubmitting(false));
        }
    };

    const handleMatch = (match: boolean) => {
        setIsSubmitting(true);
        rtmMatch(match, () => setIsSubmitting(false));
    };

    return (
        <AnimatePresence>
            {roomState.status === "rtm_decision" && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-surface border border-primary/50 shadow-[0_0_50px_rgba(var(--primary),0.3)] rounded-2xl max-w-2xl w-full p-8 text-center"
                    >
                        {/* Header */}
                        <div className="mb-8">
                            <div className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary font-bold text-sm tracking-widest uppercase mb-4 animate-pulse">
                                Right to Match (RTM)
                            </div>
                            <h2 className="text-3xl font-display font-bold text-white mb-2">{rtmPlayer.name}</h2>
                            <p className="text-gray-400">
                                Current Price: <span className="text-gold font-bold text-xl">₹{rtmPrice} Cr</span>
                            </p>
                        </div>

                        {/* RTM Phases */}
                        <div className="min-h-[150px] flex flex-col items-center justify-center">
                            
                            {/* Phase 1: Initial RTM Prompt to Original Team */}
                            {rtmState === "prompt" && (
                                <div className="space-y-6 w-full">
                                    <p className="text-xl">
                                        <span className="font-bold text-primary">{rtmOriginalTeam.toUpperCase()}</span> can exercise RTM to match the winning bid of ₹{rtmPrice} Cr by <span className="font-bold">{rtmWinningTeam.toUpperCase()}</span>.
                                    </p>
                                    
                                    {isOriginalTeam ? (
                                        <div className="flex justify-center gap-4">
                                            <button 
                                                disabled={isSubmitting}
                                                onClick={() => handleExerciseRtm(true)}
                                                className="btn-primary py-3 px-8 text-lg w-48"
                                            >
                                                Use RTM
                                            </button>
                                            <button 
                                                disabled={isSubmitting}
                                                onClick={() => handleExerciseRtm(false)}
                                                className="py-3 px-8 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-xl font-bold border border-red-500/50 transition-all w-48"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 italic animate-pulse">
                                            Waiting for {rtmOriginalTeam.toUpperCase()}'s decision...
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Phase 2: Price Hike Prompt to Winning Team */}
                            {rtmState === "hike" && (
                                <div className="space-y-6 w-full">
                                    <p className="text-xl">
                                        <span className="font-bold text-primary">{rtmOriginalTeam.toUpperCase()}</span> has exercised RTM! 
                                        <br/>
                                        <span className="font-bold">{rtmWinningTeam.toUpperCase()}</span> can increase the price.
                                    </p>

                                    {isWinningTeam ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold text-gold">₹</span>
                                                <input 
                                                    type="number"
                                                    value={hikeAmount}
                                                    onChange={(e) => setHikeAmount(Number(e.target.value))}
                                                    min={rtmPrice + 1}
                                                    className="w-32 bg-background border border-white/20 rounded-xl px-4 py-3 text-2xl text-center text-white focus:outline-none focus:border-primary"
                                                />
                                                <span className="text-gray-400">Cr</span>
                                            </div>
                                            <div className="flex justify-center gap-4">
                                                <button 
                                                    disabled={isSubmitting || !hikeAmount || hikeAmount <= rtmPrice}
                                                    onClick={() => handleHike(true)}
                                                    className="btn-primary py-3 px-8 text-lg w-48"
                                                >
                                                    Hike Price
                                                </button>
                                                <button 
                                                    disabled={isSubmitting}
                                                    onClick={() => handleHike(false)}
                                                    className="py-3 px-8 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-white transition-all w-48"
                                                >
                                                    Pass
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 italic animate-pulse">
                                            Waiting for {rtmWinningTeam.toUpperCase()} to hike price...
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Phase 3: Final Match Prompt to Original Team */}
                            {rtmState === "match" && (
                                <div className="space-y-6 w-full">
                                    <p className="text-xl">
                                        <span className="font-bold">{rtmWinningTeam.toUpperCase()}</span> hiked the price to <span className="font-bold text-gold text-2xl">₹{rtmPrice} Cr</span>.
                                    </p>
                                    <p className="text-gray-400">
                                        Does <span className="font-bold text-primary">{rtmOriginalTeam.toUpperCase()}</span> still want to match this price?
                                    </p>

                                    {isOriginalTeam ? (
                                        <div className="flex justify-center gap-4 mt-6">
                                            <button 
                                                disabled={isSubmitting}
                                                onClick={() => handleMatch(true)}
                                                className="btn-primary py-3 px-8 text-lg w-48"
                                            >
                                                Match ₹{rtmPrice}Cr
                                            </button>
                                            <button 
                                                disabled={isSubmitting}
                                                onClick={() => handleMatch(false)}
                                                className="py-3 px-8 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-xl font-bold border border-red-500/50 transition-all w-48"
                                            >
                                                Withdraw RTM
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 italic animate-pulse mt-6">
                                            Waiting for {rtmOriginalTeam.toUpperCase()}'s final decision...
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Timer */}
                        <div className="mt-8 pt-6 border-t border-white/10 flex justify-center items-center gap-3">
                            <div className="w-12 h-12 rounded-full border-4 border-primary flex items-center justify-center font-bold text-xl">
                                {timerSeconds}
                            </div>
                            <span className="text-gray-400 uppercase tracking-widest text-sm font-bold">Seconds Left</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
