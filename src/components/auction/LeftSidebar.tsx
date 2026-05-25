"use client";

import { motion } from "framer-motion";
import { getTeamById, type Team } from "@/data/teams";

interface TeamStatus {
    teamId: string;
    purse: number; // in lakhs
    squadSize: number;
    overseasCount: number;
    isCurrentHolder: boolean;
    canAffordBid: boolean;
}

interface LeftSidebarProps {
    teams: TeamStatus[];
    currentBid: number;
    myTeamId: string;
    onTeamClick?: (teamId: string) => void;
}

export default function LeftSidebar({ teams, currentBid, myTeamId, onTeamClick }: LeftSidebarProps) {
    // Sort teams - current holder first, then by remaining purse
    const sortedTeams = [...teams]
        .filter((t) => t.teamId !== myTeamId)
        .sort((a, b) => {
            if (a.isCurrentHolder) return -1;
            if (b.isCurrentHolder) return 1;
            return b.purse - a.purse;
        });

    return (
        <aside className="w-72 flex flex-col bg-stadium-900/50 border-r border-stadium-600/30 h-[calc(100vh-4rem)] sticky top-16">
            {/* Header */}
            <div className="p-4 border-b border-stadium-600/30">
                <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
                    Competition
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                    {teams.length} teams in auction
                </p>
            </div>

            {/* Team List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {sortedTeams.map((teamStatus, index) => {
                    const team = getTeamById(teamStatus.teamId);
                    if (!team) return null;

                    return (
                        <motion.div
                            key={team.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`team-card cursor-pointer hover:ring-1 hover:ring-white/20 ${!teamStatus.canAffordBid ? "dimmed" : ""
                                } ${teamStatus.isCurrentHolder ? "current-holder" : ""}`}
                            onClick={() => onTeamClick?.(teamStatus.teamId)}
                        >
                            {/* Team Logo/Badge */}
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
                                style={{ backgroundColor: team.color }}
                            >
                                {team.abbr}
                            </div>

                            {/* Team Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white text-sm truncate">
                                        {team.abbr}
                                    </span>
                                    {teamStatus.isCurrentHolder && (
                                        <span className="px-1.5 py-0.5 bg-neon-gold/20 text-neon-gold text-[10px] font-bold rounded uppercase">
                                            Holding
                                        </span>
                                    )}
                                </div>

                                {/* Stats Row */}
                                <div className="flex items-center gap-2 mt-1">
                                    {/* Purse */}
                                    <span
                                        className={`text-xs font-mono ${teamStatus.canAffordBid
                                            ? "text-neon-green"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        ₹{(teamStatus.purse / 100).toFixed(1)}Cr
                                    </span>

                                    {/* Divider */}
                                    <span className="text-stadium-600">•</span>

                                    {/* Squad Size */}
                                    <span className="text-xs text-gray-400">
                                        {teamStatus.squadSize}/25
                                    </span>

                                    {/* Overseas */}
                                    <span className="text-xs text-gray-400">
                                        ({teamStatus.overseasCount}✈)
                                    </span>
                                </div>
                            </div>

                            {/* Can't Afford Indicator */}
                            {!teamStatus.canAffordBid && (
                                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                                    <span className="text-red-400 text-xs">✕</span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Summary Footer */}
            <div className="p-4 border-t border-stadium-600/30 bg-stadium-800/30">
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Active Bidders</span>
                    <span className="text-neon-green font-mono">
                        {teams.filter((t) => t.canAffordBid).length}/{teams.length}
                    </span>
                </div>
            </div>
        </aside>
    );
}
