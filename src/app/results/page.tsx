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
    disqualified: boolean;
    disqualifyReason?: string;
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
    const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
    const [error, setError] = useState<string | null>(null);

    const toggleTeam = (teamId: string) => {
        setExpandedTeams(prev => {
            const next = new Set(prev);
            if (next.has(teamId)) {
                next.delete(teamId);
            } else {
                next.add(teamId);
            }
            return next;
        });
    };

    const getRoleLabel = (role: string) => {
        const labels: Record<string, string> = {
            batsman: "Batsman",
            bowler: "Bowler",
            "all-rounder": "All-rounder",
            "wicket-keeper": "Wicket-keeper",
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
                                {rating.disqualified ? "❌" : getMedalEmoji(index)}
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
                                        {rating.disqualified ? (
                                            <>
                                                <div className="text-4xl font-bold text-red-500">DQ</div>
                                                <div className="text-red-400 text-xs">{rating.disqualifyReason}</div>
                                            </>
                                        ) : (
                                            <>
                                                <div className={`text-5xl font-bold ${getRatingColor(rating.overallRating)}`}>
                                                    {rating.overallRating.toFixed(1)}
                                                </div>
                                                <div className="text-gray-500 text-sm">/ 10</div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Metrics Grid - only for qualified teams */}
                                {!rating.disqualified && (
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
                                )}

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
            {teamRatings.length > 0 && !teamRatings[0]?.disqualified && (
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

            {/* View All Squads - Wikipedia Style */}
            {teams.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="max-w-5xl mx-auto mt-12"
                >
                    <h2 className="text-2xl font-bold text-white text-center mb-6">📋 All Squads</h2>
                    <div className="space-y-3">
                        {teams.map((teamState) => {
                            const team = getTeamById(teamState.id);
                            if (!team) return null;
                            const isExpanded = expandedTeams.has(teamState.id);
                            const squad = teamState.squad || [];
                            const totalSpent = squad.reduce((sum: number, p: any) => sum + p.price, 0);

                            return (
                                <div key={teamState.id}>
                                    {/* Wikipedia-style section header */}
                                    <div
                                        className="flex items-center justify-between px-4 py-2.5 border-b-2"
                                        style={{ borderColor: team.color }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold text-white"
                                                style={{ backgroundColor: team.color }}
                                            >
                                                {team.abbr}
                                            </div>
                                            <h3 className="text-lg font-semibold text-white">
                                                {team.name}
                                            </h3>
                                            <span className="text-gray-500 text-sm">
                                                ({squad.length} players · {formatPrice(totalSpent)} spent · {formatPrice(teamState.purse)} remaining)
                                            </span>
                                        </div>
                                        <span
                                            onClick={() => toggleTeam(teamState.id)}
                                            className="text-gray-400 hover:text-white text-lg cursor-pointer transition-transform inline-block"
                                            style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                                        >
                                            ▶
                                        </span>
                                    </div>

                                    {/* Squad table */}
                                    {isExpanded && (
                                        <div className="mt-1 mb-4">
                                            {squad.length === 0 ? (
                                                <p className="text-gray-500 text-sm py-4 pl-4 italic">No players purchased.</p>
                                            ) : (
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b border-gray-700/50">
                                                            <th className="text-left py-2 px-3 text-gray-400 font-medium w-10">#</th>
                                                            <th className="text-left py-2 px-3 text-gray-400 font-medium">Player</th>
                                                            <th className="text-left py-2 px-3 text-gray-400 font-medium">Country</th>
                                                            <th className="text-left py-2 px-3 text-gray-400 font-medium">Role</th>
                                                            <th className="text-right py-2 px-3 text-gray-400 font-medium">Price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {squad.map((item: any, idx: number) => (
                                                            <tr
                                                                key={idx}
                                                                className={idx % 2 === 0 ? "bg-white/[0.02]" : "bg-white/[0.05]"}
                                                            >
                                                                <td className="py-1.5 px-3 text-gray-500">{idx + 1}</td>
                                                                <td className="py-1.5 px-3 text-white font-medium">{item.player.name}</td>
                                                                <td className="py-1.5 px-3 text-gray-400">{item.player.country}</td>
                                                                <td className="py-1.5 px-3 text-gray-300">{getRoleLabel(item.player.role)}</td>
                                                                <td className="py-1.5 px-3 text-right text-neon-gold font-semibold">{formatPrice(item.price)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    )}
                                </div>
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
