"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getTeamById } from "@/data/teams";
import { formatPrice } from "@/data/players";

export interface BidEntry {
    id: string;
    teamId: string;
    amount: number;
    timestamp: number;
}

interface ActivityLogProps {
    bids: BidEntry[];
    maxDisplay?: number;
}

export default function ActivityLog({ bids, maxDisplay = 5 }: ActivityLogProps) {
    const displayBids = bids.slice(0, maxDisplay);

    return (
        <div className="w-full overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                    Recent Bids
                </span>
                <div className="flex-1 h-px bg-stadium-600/30"></div>
            </div>

            <div className="relative">
                <AnimatePresence mode="popLayout">
                    {displayBids.length > 0 ? (
                        <div className="space-y-2">
                            {displayBids.map((bid, index) => {
                                const team = getTeamById(bid.teamId);
                                if (!team) return null;

                                return (
                                    <motion.div
                                        key={bid.id}
                                        initial={{ opacity: 0, x: -20, height: 0 }}
                                        animate={{ opacity: 1, x: 0, height: "auto" }}
                                        exit={{ opacity: 0, x: 20, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${index === 0
                                                ? "bg-neon-gold/10 border border-neon-gold/30"
                                                : "bg-stadium-800/30"
                                            }`}
                                    >
                                        {/* Team Badge */}
                                        <div
                                            className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                                            style={{ backgroundColor: team.color }}
                                        >
                                            {team.abbr}
                                        </div>

                                        {/* Bid Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-white font-medium truncate">
                                                    {team.name}
                                                </span>
                                                {index === 0 && (
                                                    <span className="px-1.5 py-0.5 bg-neon-gold/20 text-neon-gold text-[8px] font-bold rounded uppercase">
                                                        Latest
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bid Amount */}
                                        <span
                                            className={`font-mono text-sm font-bold ${index === 0 ? "text-neon-gold" : "text-gray-400"
                                                }`}
                                        >
                                            {formatPrice(bid.amount)}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-4 text-gray-500 text-sm"
                        >
                            No bids yet. Be the first to bid!
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
