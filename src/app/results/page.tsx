"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getTeamById } from "@/data/teams";
import { formatPrice } from "@/data/players";
import { SERVER_URL } from "@/lib/socket";

interface TeamRating {
    teamId: string;
    overallRating: number;
    metrics: {
        squadStrength: number;
        balance: number;
        starPower: number;
        depthScore: number;
        valueEfficiency: number;
        overseasQuality: number;
    };
    breakdown: {
        batsmen: number;
        bowlers: number;
        allRounders: number;
        wicketKeepers: number;
        overseas: number;
        marquee: number;
        totalSpent: number;
        avgPlayerPrice: number;
    };
}

interface TeamState {
    id: string;
    ownerId: string;
    purse: number;
    squad: Array<{ player: any; price: number }>;
    overseasCount: number;
}

function ResultsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomId = searchParams.get("roomId");

    const [teamRatings, setTeamRatings] = useState<TeamRating[]>([]);
    const [teams, setTeams] = useState<TeamState[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getRoleColor = (role: string) => {
        if (role === "batsman") return "text-blue-400";
        if (role === "bowler") return "text-red-400";
        if (role === "all-rounder") return "text-purple-400";
        if (role === "wicket-keeper") return "text-amber-400";
        return "text-gray-400";
    };

    const getRoleLabel = (role: string) => {
        const labels: Record<string, string> = {
            batsman: "BAT",
            bowler: "BOWL",
            "all-rounder": "AR",
            "wicket-keeper": "WK",
        };
        return labels[role] || role;
    };

    const [isHost, setIsHost] = useState(false); // Client-side only to avoid hydration mismatch

    // Initialize isHost on client side only
    useEffect(() => {
        setIsHost(sessionStorage.getItem("isHost") === "true");
    }, []);

    useEffect(() => {
        if (!roomId) {
            setError("No room ID provided");
            setLoading(false);
            return;
        }

        // Fetch team ratings
        fetch(`${SERVER_URL}/api/room/${roomId}/ratings`)
            .then((res) => res.json())
            .then((data) => {
                if (data.teamRatings) {
                    setTeamRatings(data.teamRatings);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch ratings:", err);
                setError("Failed to load ratings");
            });

        // Fetch room state for team details
        fetch(`${SERVER_URL}/api/room/${roomId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.teams) {
                    setTeams(data.teams);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch room:", err);
                setError("Failed to load room data");
                setLoading(false);
            });

        // Listen for auction restart from host via socket
        const { connectSocket } = require("@/lib/socket");
        const socket = connectSocket();

        const handleRestart = (data: { roomId: string }) => {
            router.push(`/lobby?roomId=${data.roomId}`);
        };

        socket.on("auction-restart", handleRestart);

        return () => {
            socket.off("auction-restart", handleRestart);
        };
    }, [roomId, router]);

    const getRatingColor = (rating: number) => {
        if (rating >= 8) return "text-green-400";
        if (rating >= 6) return "text-yellow-400";
        if (rating >= 4) return "text-orange-400";
        return "text-red-400";
    };

    const getRatingBgColor = (rating: number) => {
        if (rating >= 8) return "from-green-500/20 to-green-600/10";
        if (rating >= 6) return "from-yellow-500/20 to-yellow-600/10";
        if (rating >= 4) return "from-orange-500/20 to-orange-600/10";
        return "from-red-500/20 to-red-600/10";
    };

    const getMedalEmoji = (index: number) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return `#${index + 1}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-stadium-950 via-stadium-900 to-stadium-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading results...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-stadium-950 via-stadium-900 to-stadium-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 bg-neon-cyan/20 hover:bg-neon-cyan/30 border border-neon-cyan/50 rounded-lg text-neon-cyan transition-all"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-stadium-950 via-stadium-900 to-stadium-950 p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <h1 className="font-display text-4xl font-bold mb-2">
                    <span className="gradient-text-gold">AUCTION</span>
                    <span className="text-white"> RESULTS</span>
                </h1>
                <p className="text-gray-400">Final Team Rankings & Ratings</p>
            </motion.div>

            {/* Team Rankings */}
            <div className="max-w-5xl mx-auto space-y-6">
                {teamRatings.map((rating, index) => {
                    const team = getTeamById(rating.teamId);
                    const teamState = teams.find((t) => t.id === rating.teamId);

                    if (!team) return null;

                    return (
                        <motion.div
                            key={rating.teamId}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative overflow-hidden rounded-2xl border bg-gradient-to-r ${getRatingBgColor(rating.overallRating)}`}
                            style={{ borderColor: `${team.color}40` }}
                        >
                            {/* Rank Badge */}
                            <div className="absolute top-4 right-4 text-3xl">
                                {getMedalEmoji(index)}
                            </div>

                            <div className="p-6">
                                {/* Team Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div
                                        className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                                        style={{ backgroundColor: team.color }}
                                    >
                                        {team.abbr}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-white">{team.name}</h2>
                                        <p className="text-gray-400">{team.abbr}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-5xl font-bold ${getRatingColor(rating.overallRating)}`}>
                                            {rating.overallRating.toFixed(1)}
                                        </div>
                                        <div className="text-gray-500 text-sm">/ 10</div>
                                    </div>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-6 gap-3 mb-6">
                                    {Object.entries(rating.metrics).map(([key, value]) => (
                                        <div key={key} className="bg-black/20 rounded-lg p-3 text-center">
                                            <div className={`text-lg font-bold ${getRatingColor(value)}`}>
                                                {value.toFixed(1)}
                                            </div>
                                            <div className="text-xs text-gray-500 capitalize">
                                                {key.replace(/([A-Z])/g, " $1").trim()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Squad Breakdown */}
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex gap-4">
                                        <span className="text-gray-400">
                                            <span className="text-blue-400 font-semibold">{rating.breakdown.batsmen}</span> Bat
                                        </span>
                                        <span className="text-gray-400">
                                            <span className="text-red-400 font-semibold">{rating.breakdown.bowlers}</span> Bowl
                                        </span>
                                        <span className="text-gray-400">
                                            <span className="text-purple-400 font-semibold">{rating.breakdown.allRounders}</span> AR
                                        </span>
                                        <span className="text-gray-400">
                                            <span className="text-amber-400 font-semibold">{rating.breakdown.wicketKeepers}</span> WK
                                        </span>
                                        <span className="text-gray-400">
                                            <span className="text-cyan-400 font-semibold">{rating.breakdown.overseas}</span> OS
                                        </span>
                                        <span className="text-gray-400">
                                            <span className="text-yellow-400 font-semibold">{rating.breakdown.marquee}</span> ★
                                        </span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-gray-400">
                                            Spent: <span className="text-neon-gold font-semibold">{formatPrice(rating.breakdown.totalSpent)}</span>
                                        </span>
                                        <span className="text-gray-400">
                                            Avg: <span className="text-white font-semibold">{formatPrice(rating.breakdown.avgPlayerPrice)}</span>
                                        </span>
                                        {teamState && (
                                            <span className="text-gray-400">
                                                Remaining: <span className="text-green-400 font-semibold">{formatPrice(teamState.purse)}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Accent Line */}
                            <div
                                className="h-1 w-full"
                                style={{ background: `linear-gradient(to right, ${team.color}, transparent)` }}
                            />
                        </motion.div>
                    );
                })}
            </div>

            {/* Winner Celebration */}
            {teamRatings.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <h2 className="text-2xl font-bold text-white mb-2">🏆 Best Auction Performance</h2>
                    <p className="text-neon-gold text-xl">
                        {getTeamById(teamRatings[0]?.teamId)?.name || "Unknown Team"} with a rating of {teamRatings[0]?.overallRating.toFixed(1)}/10
                    </p>
                </motion.div>
            )}

            {/* View All Squads */}
            {teams.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="max-w-5xl mx-auto mt-12"
                >
                    <h2 className="text-2xl font-bold text-white text-center mb-6">📋 All Squads</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {teams.map((teamState) => {
                            const team = getTeamById(teamState.id);
                            if (!team) return null;
                            const isExpanded = expandedTeamId === teamState.id;
                            const squad = teamState.squad || [];

                            return (
                                <motion.div
                                    key={teamState.id}
                                    layout
                                    className="rounded-xl border overflow-hidden"
                                    style={{ borderColor: `${team.color}40` }}
                                >
                                    {/* Team Header (clickable) */}
                                    <button
                                        onClick={() => setExpandedTeamId(isExpanded ? null : teamState.id)}
                                        className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-all cursor-pointer"
                                        style={{ backgroundColor: `${team.color}10` }}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
                                            style={{ backgroundColor: team.color }}
                                        >
                                            {team.abbr}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="font-semibold text-white text-sm">{team.name}</p>
                                            <p className="text-xs text-gray-400">
                                                {squad.length} players • {formatPrice(squad.reduce((sum: number, p: any) => sum + p.price, 0))} spent • {formatPrice(teamState.purse)} left
                                            </p>
                                        </div>
                                        <span className={`text-gray-400 text-lg transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                                            ▾
                                        </span>
                                    </button>

                                    {/* Expanded Squad List */}
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-t px-4 py-3 space-y-1"
                                            style={{ borderColor: `${team.color}20` }}
                                        >
                                            {squad.length === 0 ? (
                                                <p className="text-gray-500 text-sm text-center py-4">No players bought</p>
                                            ) : (
                                                <>
                                                    {/* Column headers */}
                                                    <div className="flex items-center text-[10px] text-gray-500 uppercase tracking-wider pb-1 px-1">
                                                        <span className="w-8">#</span>
                                                        <span className="flex-1">Player</span>
                                                        <span className="w-12 text-center">Role</span>
                                                        <span className="w-20 text-right">Price</span>
                                                    </div>
                                                    {squad.map((item: any, idx: number) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-1 py-1.5 px-1 rounded hover:bg-white/5 text-sm"
                                                        >
                                                            <span className="w-8 text-gray-500 text-xs">{idx + 1}</span>
                                                            <div className="flex-1 min-w-0">
                                                                <span className="text-white truncate block">{item.player.name}</span>
                                                                <span className="text-gray-500 text-[11px]">{item.player.country}</span>
                                                            </div>
                                                            <span className={`w-12 text-center text-xs font-semibold ${getRoleColor(item.player.role)}`}>
                                                                {getRoleLabel(item.player.role)}
                                                            </span>
                                                            <span className="w-20 text-right text-neon-gold text-xs font-semibold">
                                                                {formatPrice(item.price)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            <div className="flex justify-center gap-4 mt-8">
                <button
                    onClick={() => router.push("/")}
                    className="px-8 py-3 bg-stadium-700/50 hover:bg-stadium-600/50 border border-stadium-500/30 rounded-lg text-white transition-all"
                >
                    Back to Home
                </button>

                {/* Host Only: Restart Auction Button */}
                {isHost && (
                    <button
                        onClick={async () => {
                            if (!roomId) return;
                            try {
                                const response = await fetch(`${SERVER_URL}/api/room/${roomId}/restart`, {
                                    method: "POST",
                                });
                                if (response.ok) {
                                    router.push(`/lobby?roomId=${roomId}`);
                                }
                            } catch (err) {
                                console.error("Failed to restart auction:", err);
                            }
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-neon-gold to-amber-500 hover:shadow-lg hover:shadow-neon-gold/30 text-stadium-950 font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        🔄 Restart Auction
                    </button>
                )}
            </div>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-stadium-950 via-stadium-900 to-stadium-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading results...</p>
                </div>
            </div>
        }>
            <ResultsPageContent />
        </Suspense>
    );
}
