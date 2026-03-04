"use client";

import { motion } from "framer-motion";
import { type Player, formatPrice, getRoleBadgeColor, getRoleDisplay } from "@/data/players";
import { getCountryFlag } from "@/lib/utils";

interface PlayerCardProps {
    player: Player;
}

export default function PlayerCard({ player }: PlayerCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="player-card relative"
        >
            {/* Decorative Corner Accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-neon-cyan/30 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-neon-pink/30 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-neon-pink/30 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-neon-cyan/30 rounded-br-xl"></div>

            {/* Player Image Area */}
            <div className="relative mb-4">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-stadium-700 to-stadium-800 border-4 border-stadium-600 overflow-hidden flex items-center justify-center">
                    <div className="text-5xl opacity-50">
                        {player.role === "batsman" && "🏏"}
                        {player.role === "bowler" && "🎯"}
                        {player.role === "all-rounder" && "⚡"}
                        {player.role === "wicket-keeper" && "🧤"}
                    </div>
                </div>

                {/* Country Flag */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-stadium-800 border border-stadium-600 rounded-full flex items-center gap-1">
                    <span className="text-lg">{getCountryFlag(player.countryCode)}</span>
                    <span className="text-xs text-gray-300 font-medium">{player.country}</span>
                </div>
            </div>

            {/* Player Name */}
            <h3 className="font-display text-2xl font-bold text-white mt-4 mb-2">
                {player.name}
            </h3>

            {/* Role Badge */}
            <div className="flex justify-center mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(player.role)}`}>
                    {getRoleDisplay(player.role)}
                </span>
            </div>

            {/* Stats Row */}
            {player.stats && (
                <div className="grid grid-cols-3 gap-2 mb-4 px-4">
                    {player.stats.matches && (
                        <div className="text-center">
                            <div className="text-lg font-bold text-white">
                                {player.stats.matches}
                            </div>
                            <div className="text-[10px] text-gray-500 uppercase">Matches</div>
                        </div>
                    )}
                    {player.stats.runs && (
                        <div className="text-center">
                            <div className="text-lg font-bold text-neon-cyan">
                                {player.stats.runs.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-gray-500 uppercase">Runs</div>
                        </div>
                    )}
                    {player.stats.wickets && (
                        <div className="text-center">
                            <div className="text-lg font-bold text-neon-pink">
                                {player.stats.wickets}
                            </div>
                            <div className="text-[10px] text-gray-500 uppercase">Wickets</div>
                        </div>
                    )}
                </div>
            )}

            {/* Base Price */}
            <div className="mt-4 pt-4 border-t border-stadium-600/50">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Base Price
                </div>
                <div className="font-display text-xl font-bold gradient-text-gold">
                    {formatPrice(player.basePrice)}
                </div>
            </div>
        </motion.div>
    );
}
