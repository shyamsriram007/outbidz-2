"use client";

import { motion } from "framer-motion";
import { type Player, formatPrice, getRoleDisplay } from "@/data/players";
import { getTeamById } from "@/data/teams";
import { getCountryFlag } from "@/lib/utils";

interface MyStats {
    teamId: string;
    purse: number;
    squadSize: number;
    overseasCount: number;
}

interface BoughtPlayer {
    player: Player;
    price: number;
}

interface RightSidebarProps {
    myStats: MyStats;
    squad: BoughtPlayer[];
}

export default function RightSidebar({ myStats, squad }: RightSidebarProps) {
    const team = getTeamById(myStats.teamId);

    // Group squad by role
    const groupedSquad = squad.reduce((acc, item) => {
        const role = item.player.role;
        if (!acc[role]) acc[role] = [];
        acc[role].push(item);
        return acc;
    }, {} as Record<string, BoughtPlayer[]>);

    const roleOrder = ["batsman", "bowler", "all-rounder", "wicket-keeper"];

    return (
        <aside className="w-80 flex flex-col bg-stadium-900/50 border-l border-stadium-600/30 h-[calc(100vh-4rem)] sticky top-16">
            {/* My Team Header */}
            <div
                className="p-4 border-b border-stadium-600/30"
                style={{
                    background: team
                        ? `linear-gradient(135deg, ${team.color}15 0%, transparent 100%)`
                        : undefined,
                }}
            >
                <div className="flex items-center gap-3 mb-3">
                    {team && (
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white"
                            style={{ backgroundColor: team.color }}
                        >
                            {team.abbr}
                        </div>
                    )}
                    <div>
                        <h2 className="font-display text-lg font-bold text-white">
                            My Team
                        </h2>
                        {team && (
                            <p className="text-xs text-gray-400">{team.name}</p>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2">
                    {/* Purse */}
                    <div className="glass-card p-3 text-center">
                        <div className="text-lg font-bold text-neon-green font-mono">
                            {(myStats.purse / 100).toFixed(1)}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase">Cr Left</div>
                    </div>

                    {/* Squad Size */}
                    <div className="glass-card p-3 text-center">
                        <div className="text-lg font-bold text-white font-mono">
                            {myStats.squadSize}
                            <span className="text-gray-500">/25</span>
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase">Squad</div>
                    </div>

                    {/* Overseas */}
                    <div className="glass-card p-3 text-center">
                        <div className="text-lg font-bold text-neon-cyan font-mono">
                            {myStats.overseasCount}
                            <span className="text-gray-500">/8</span>
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase">Overseas</div>
                    </div>
                </div>
            </div>

            {/* Squad List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span>My Squad</span>
                    <span className="flex-1 h-px bg-stadium-600/30"></span>
                    <span className="text-white">{squad.length}</span>
                </h3>

                {squad.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-sm">
                        <div className="text-4xl mb-3 opacity-50">🏏</div>
                        <p>No players yet</p>
                        <p className="text-xs mt-1">Start bidding to build your squad!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {roleOrder.map((role) => {
                            const players = groupedSquad[role];
                            if (!players || players.length === 0) return null;

                            return (
                                <div key={role}>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <span>{getRoleDisplay(role as any)}</span>
                                        <span className="text-gray-600">({players.length})</span>
                                    </div>
                                    <div className="space-y-2">
                                        {players.map(({ player, price }, index) => (
                                            <motion.div
                                                key={player.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="glass-card p-3 flex items-center gap-3"
                                            >
                                                {/* Player Mini Avatar */}
                                                <div className="w-10 h-10 rounded-lg bg-stadium-700 flex items-center justify-center text-lg shrink-0">
                                                    {player.countryCode !== "IN" ? (
                                                        <span className="text-xs">✈️</span>
                                                    ) : (
                                                        getCountryFlag(player.countryCode)
                                                    )}
                                                </div>

                                                {/* Player Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-white truncate">
                                                        {player.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {player.country}
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="text-sm font-mono font-bold text-neon-gold shrink-0">
                                                    {formatPrice(price)}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Total Spent Footer */}
            {squad.length > 0 && (
                <div className="p-4 border-t border-stadium-600/30 bg-stadium-800/30">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Total Spent</span>
                        <span className="font-display font-bold text-lg text-neon-gold">
                            {formatPrice(squad.reduce((sum, item) => sum + item.price, 0))}
                        </span>
                    </div>
                </div>
            )}
        </aside>
    );
}
