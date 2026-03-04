"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getBidIncrement, formatPrice } from "@/data/players";

interface BidButtonProps {
    currentBid: number;
    canBid: boolean;
    onBid: () => void;
    isHolding: boolean;
}

export default function BidButton({
    currentBid,
    canBid,
    onBid,
    isHolding,
}: BidButtonProps) {
    const increment = getBidIncrement(currentBid);
    const nextBid = currentBid + increment;

    return (
        <div className="flex flex-col items-center">
            {/* Next Bid Preview */}
            <AnimatePresence mode="wait">
                {canBid && !isHolding && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-3 px-4 py-1.5 bg-neon-gold/10 border border-neon-gold/30 rounded-full"
                    >
                        <span className="text-sm text-neon-gold font-medium">
                            Next bid: {formatPrice(nextBid)}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Bid Button */}
            <motion.button
                onClick={onBid}
                disabled={!canBid || isHolding}
                whileHover={canBid && !isHolding ? { scale: 1.05 } : {}}
                whileTap={canBid && !isHolding ? { scale: 0.95 } : {}}
                className={`
          relative w-36 h-36 rounded-full font-display font-bold text-xl uppercase tracking-wider
          transition-all duration-300 flex flex-col items-center justify-center
          ${isHolding
                        ? "bg-gradient-to-br from-green-600 to-green-800 text-white cursor-default"
                        : canBid
                            ? "bid-button animate-pulse-slow cursor-pointer"
                            : "bg-gradient-to-br from-gray-700 to-gray-800 text-gray-500 cursor-not-allowed"
                    }
        `}
            >
                {/* Pulsating Ring */}
                {canBid && !isHolding && (
                    <>
                        <span className="absolute inset-0 rounded-full bg-neon-gold/20 animate-ping"></span>
                        <span className="absolute inset-[-4px] rounded-full border-2 border-neon-gold/30 animate-pulse"></span>
                    </>
                )}

                {/* Button Content */}
                <div className="relative z-10 flex flex-col items-center">
                    {isHolding ? (
                        <>
                            <span className="text-2xl mb-1">✓</span>
                            <span className="text-sm font-semibold">HOLDING</span>
                        </>
                    ) : (
                        <>
                            <span className="text-sm opacity-70">RAISE</span>
                            <span className="text-2xl font-black">BID</span>
                            {canBid && (
                                <span className="text-xs mt-1 opacity-70">
                                    +{increment >= 100 ? `${increment / 100}Cr` : `${increment}L`}
                                </span>
                            )}
                        </>
                    )}
                </div>
            </motion.button>

            {/* Status Message */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-sm"
            >
                {isHolding ? (
                    <span className="text-neon-green">You have the highest bid!</span>
                ) : canBid ? (
                    <span className="text-gray-400">Click to place your bid</span>
                ) : (
                    <span className="text-neon-red">Cannot afford this bid</span>
                )}
            </motion.p>
        </div>
    );
}
