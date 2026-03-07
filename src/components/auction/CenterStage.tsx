"use client";

import { motion, AnimatePresence } from "framer-motion";
import PlayerCard from "./PlayerCard";
import BidButton from "./BidButton";
import Timer from "./Timer";
import ActivityLog, { type BidEntry } from "./ActivityLog";
import { type Player, formatPrice } from "@/data/players";
import { getTeamById } from "@/data/teams";

interface CenterStageProps {
    player: Player;
    currentBid: number;
    currentHolderTeamId: string | null;
    timerSeconds: number;
    maxTimerSeconds: number;
    isTimerActive: boolean;
    canBid: boolean;
    isHolding: boolean;
    canWithdraw: boolean;
    recentBids: BidEntry[];
    onBid: () => void;
    onWithdraw: () => void;
    onTimeout: () => void;
}

export default function CenterStage({
    player,
    currentBid,
    currentHolderTeamId,
    timerSeconds,
    maxTimerSeconds,
    isTimerActive,
    canBid,
    isHolding,
    canWithdraw,
    recentBids,
    onBid,
    onWithdraw,
    onTimeout,
}: CenterStageProps) {
    const holderTeam = currentHolderTeamId ? getTeamById(currentHolderTeamId) : null;

    return (
        <div className="flex-1 flex flex-col min-h-0 p-6">
            {/* Top Section - Player Card */}
            <div className="flex justify-center mb-6">
                <div className="w-full max-w-sm">
                    <PlayerCard player={player} />
                </div>
            </div>

            {/* Middle Section - Bidding Terminal */}
            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Current Bid Display */}
                <motion.div
                    key={currentBid}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-center mb-2"
                >
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Current Bid
                    </div>
                    <motion.div
                        key={currentBid}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="font-display text-mega text-neon-gold text-glow-gold"
                    >
                        {formatPrice(currentBid)}
                    </motion.div>
                </motion.div>

                {/* Current Holder */}
                <AnimatePresence mode="wait">
                    {holderTeam ? (
                        <motion.div
                            key={holderTeam.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex items-center gap-3 px-4 py-2 mb-8 rounded-full border"
                            style={{
                                backgroundColor: `${holderTeam.color}15`,
                                borderColor: `${holderTeam.color}40`,
                            }}
                        >
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                                style={{ backgroundColor: holderTeam.color }}
                            >
                                {holderTeam.abbr}
                            </div>
                            <span className="font-semibold text-white">{holderTeam.name}</span>
                            <span className="text-gray-400">holds the bid</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="px-4 py-2 mb-8 text-gray-500 text-sm"
                        >
                            Waiting for first bid...
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Timer and Bid Button Row */}
                <div className="flex items-center justify-center gap-12 mb-8">
                    {/* Timer */}
                    <Timer
                        seconds={timerSeconds}
                        maxSeconds={maxTimerSeconds}
                        onTimeout={onTimeout}
                        isActive={isTimerActive}
                    />

                    {/* Bid Button */}
                    <BidButton
                        currentBid={currentBid}
                        canBid={canBid}
                        onBid={onBid}
                        isHolding={isHolding}
                    />

                    {/* Withdraw Button */}
                    {canWithdraw && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={onWithdraw}
                            className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-400 rounded-lg text-sm font-semibold transition-all"
                        >
                            ↩ Withdraw
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Bottom Section - Activity Log */}
            <div className="mt-auto pt-4">
                <ActivityLog bids={recentBids} maxDisplay={5} />
            </div>
        </div>
    );
}
