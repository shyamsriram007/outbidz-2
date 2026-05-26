"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getTeamById } from "@/data/teams";
import { formatPrice } from "@/data/players";
import { connectSocket, SERVER_URL } from "@/lib/socket";

interface TeamState {
    id: string;
    ownerId: string;
    purse: number;
    squadSize: number;
    overseasCount: number;
    squad: Array<{ player: any; price: number }>;
}

function SquadSelectionContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomIdParam = searchParams.get("roomId") || "";

    const [myTeamId, setMyTeamId] = useState<string | null>(null);
    const [isHost, setIsHost] = useState(false);
    const [teams, setTeams] = useState<TeamState[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [submittedTeams, setSubmittedTeams] = useState<Set<string>>(new Set());
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMyTeamId(sessionStorage.getItem("teamId"));
        setIsHost(sessionStorage.getItem("isHost") === "true");
    }, []);

    useEffect(() => {
        const socket = connectSocket();
        const storedOderId = sessionStorage.getItem("oderId") || sessionStorage.getItem("userId");
        if (storedOderId && roomIdParam) {
            socket.emit("rejoin-room", { roomId: roomIdParam, oderId: storedOderId }, (result: any) => {
                if (result.success && result.roomState) {
                    setTeams(result.roomState.teams);
                    setSubmittedTeams(new Set(result.roomState.submittedTeams || []));
                    setLoading(false);
                } else {
                    socket.emit("get-room-state", (result2: any) => {
                        if (result2.success && result2.roomState) {
                            setTeams(result2.roomState.teams);
                            setSubmittedTeams(new Set(result2.roomState.submittedTeams || []));
                        }
                        setLoading(false);
                    });
                }
            });
        } else {
            setLoading(false);
        }

        function onPlaying12Submitted(data: { teamId: string; submittedTeams: string[] }) {
            setSubmittedTeams(new Set(data.submittedTeams));
        }

        function onAuctionComplete() {
            router.push(`/results?roomId=${roomIdParam}`);
        }

        socket.on("playing-12-submitted", onPlaying12Submitted);
        socket.on("auction-complete", onAuctionComplete);

        return () => {
            socket.off("playing-12-submitted", onPlaying12Submitted);
            socket.off("auction-complete", onAuctionComplete);
        };
    }, [roomIdParam, router]);

    const togglePlayer = (name: string) => {
        if (hasSubmitted) return;

        setSelectedPlayers(prev => {
            if (prev.includes(name)) {
                return prev.filter(n => n !== name);
            }
            if (prev.length >= 12) {
                setError("Maximum 12 players — deselect someone first");
                setTimeout(() => setError(null), 2500);
                return prev;
            }
            return [...prev, name];
        });
    };

    const handleSubmit = () => {
        if (selectedPlayers.length !== 12 || hasSubmitted) return;
        const socket = connectSocket();
        socket.emit("submit-playing-12", { playerNames: selectedPlayers }, (result: any) => {
            if (!result.success) {
                setError(result.error || "Failed to submit");
                setTimeout(() => setError(null), 3000);
            } else {
                setHasSubmitted(true);
            }
        });
    };

    const handleForceFinalize = async () => {
        try {
            const res = await fetch(`${SERVER_URL}/api/room/${roomIdParam}/finalize-results`, { method: "POST" });
            const data = await res.json();
            if (!data.success) {
                setError(data.error || "Failed to finalize");
                setTimeout(() => setError(null), 3000);
            }
        } catch {
            setError("Failed to finalize results");
            setTimeout(() => setError(null), 3000);
        }
    };

    const myTeam = teams.find(t => t.id === myTeamId);
    const mySquad = myTeam?.squad || [];
    const isDisqualified = mySquad.length < 12;

    // Calculate selection breakdown
    const selectionBreakdown = selectedPlayers.reduce(
        (acc, name) => {
            const entry = mySquad.find(s => s.player.name === name);
            if (!entry) return acc;
            const role = entry.player.role;
            if (role === "batsman") acc.batsmen++;
            else if (role === "bowler") acc.bowlers++;
            else if (role === "all-rounder") acc.allRounders++;
            else if (role === "wicket-keeper") acc.wicketKeepers++;
            if (entry.player.countryCode !== "IN") acc.overseas++;
            return acc;
        },
        { batsmen: 0, bowlers: 0, allRounders: 0, wicketKeepers: 0, overseas: 0 }
    );

    const getRoleIcon = (role: string) =>
        role === "batsman" ? "🏏" : role === "bowler" ? "🎯" : role === "all-rounder" ? "⚡" : role === "wicket-keeper" ? "🧤" : "🏏";

    const progressPercent = (selectedPlayers.length / 12) * 100;

    // Count eligible teams (those with >= 12 players)
    const eligibleTeams = teams.filter(t => (t.squad?.length || 0) >= 12);
    const eligibleCount = eligibleTeams.length;

    if (loading) {
        return (
            <div className="min-h-screen bg-stadium-950 flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-neon-gold border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stadium-950 text-white">
            {/* Error Toast */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-red-500/90 rounded-lg text-white font-semibold text-sm shadow-lg"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-30 px-6 py-3 bg-stadium-950/90 backdrop-blur-md border-b border-stadium-600/30">
                <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
                    <div className="flex items-center gap-4">
                        <h1 className="font-display text-xl font-bold">
                            <span className="gradient-text-gold">OUTBIDZ</span><span className="text-white"> 2.0</span>
                        </h1>
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-400 text-xs font-bold rounded uppercase flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                            Playing XII Selection
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {isHost && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleForceFinalize}
                                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg text-sm font-bold shadow-lg transition-all"
                            >
                                Force Finalize → Results
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-20 px-4 pb-8 max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Player Selection Grid or DQ Message */}
                    <div className="lg:col-span-2 space-y-4">
                        {isDisqualified ? (
                            /* DQ'd — not enough players */
                            <div className="bg-stadium-900/80 border border-red-500/30 rounded-xl p-5">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-16"
                                >
                                    <div className="text-7xl mb-6">❌</div>
                                    <h3 className="text-2xl font-bold text-red-400 mb-3">Disqualified</h3>
                                    <p className="text-gray-400 text-lg mb-2">
                                        Your squad has only <span className="text-white font-bold">{mySquad.length}</span> player{mySquad.length === 1 ? "" : "s"}
                                    </p>
                                    <p className="text-gray-500">
                                        You need at least <span className="text-red-400 font-semibold">12 players</span> to select a Playing XII.
                                    </p>
                                    <div className="mt-8 inline-block px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                                        <p className="text-sm text-red-400 font-medium">Your team will receive a rating of 0.</p>
                                        <p className="text-xs text-gray-500 mt-1">Waiting for other teams to finish selection...</p>
                                    </div>
                                </motion.div>
                            </div>
                        ) : (
                        <div className="bg-stadium-900/80 border border-stadium-600/30 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getTeamById(myTeamId || "")?.color }}></span>
                                    Select Your Playing XII — {getTeamById(myTeamId || "")?.name}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className={`text-2xl font-bold font-mono ${selectedPlayers.length === 12 ? "text-neon-green" : "text-white"}`}>
                                        {selectedPlayers.length}
                                    </span>
                                    <span className="text-gray-500 text-lg">/12</span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-stadium-700/50 rounded-full mb-5 overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full ${selectedPlayers.length === 12
                                        ? "bg-gradient-to-r from-neon-green to-emerald-400"
                                        : "bg-gradient-to-r from-neon-cyan to-blue-500"
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            </div>

                            {hasSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="text-6xl mb-4">✅</div>
                                    <h3 className="text-2xl font-bold text-neon-green mb-2">Playing XII Submitted!</h3>
                                    <p className="text-gray-400">Waiting for other teams to submit...</p>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {mySquad.map((entry, i) => {
                                        const isSelected = selectedPlayers.includes(entry.player.name);
                                        const selectionIndex = selectedPlayers.indexOf(entry.player.name);
                                        const isImpactPlayer = isSelected && selectionIndex === 11; // 12th player (0-indexed = 11)

                                        return (
                                            <motion.button
                                                key={i}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => togglePlayer(entry.player.name)}
                                                className={`relative w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 ${isSelected
                                                    ? isImpactPlayer
                                                        ? "bg-gradient-to-r from-amber-500/15 to-orange-500/10 border-neon-gold/60 ring-1 ring-neon-gold/30 shadow-lg shadow-neon-gold/10"
                                                        : "bg-neon-cyan/10 border-neon-cyan/40 ring-1 ring-neon-cyan/20 shadow-lg shadow-neon-cyan/5"
                                                    : "bg-stadium-800/50 border-stadium-700/30 hover:border-stadium-500/50 hover:bg-stadium-800/70"
                                                    }`}
                                            >
                                                {/* Impact Player Badge */}
                                                {isImpactPlayer && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-neon-gold to-amber-500 text-stadium-950 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg"
                                                    >
                                                        ⭐ Impact Player
                                                    </motion.div>
                                                )}

                                                {/* Selection Number Badge */}
                                                {isSelected && !isImpactPlayer && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-neon-cyan text-stadium-950 text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                                                    >
                                                        {selectionIndex + 1}
                                                    </motion.div>
                                                )}

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {/* Selection indicator */}
                                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected
                                                            ? isImpactPlayer
                                                                ? "border-neon-gold bg-neon-gold/20"
                                                                : "border-neon-cyan bg-neon-cyan/20"
                                                            : "border-stadium-500/50"
                                                            }`}>
                                                            {isSelected && (
                                                                <motion.span
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    className={isImpactPlayer ? "text-neon-gold text-xs" : "text-neon-cyan text-xs"}
                                                                >
                                                                    ✓
                                                                </motion.span>
                                                            )}
                                                        </div>

                                                        <span className="text-xl">{getRoleIcon(entry.player.role)}</span>
                                                        <div>
                                                            <div className={`text-sm font-semibold ${isSelected ? "text-white" : "text-gray-200"}`}>
                                                                {entry.player.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                                                <span>{entry.player.country}</span>
                                                                {entry.player.countryCode !== "IN" && (
                                                                    <span className="text-[9px] px-1 bg-blue-500/20 text-blue-400 rounded">OS</span>
                                                                )}
                                                                <span className="text-gray-600">•</span>
                                                                <span className="capitalize">{entry.player.role.replace("-", " ")}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-mono text-gray-400">{formatPrice(entry.price)}</span>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        )}
                    </div>

                    {/* Right Column: Summary & Status */}
                    <div className="space-y-4">
                        {/* Selection Summary — only show for eligible teams */}
                        {!isDisqualified && (
                        <div className="bg-stadium-900/80 border border-stadium-600/30 rounded-xl p-5">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                📊 Selection Summary
                            </h3>

                            {/* Role Breakdown */}
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <div className="bg-stadium-800/50 rounded-lg p-3 text-center">
                                    <div className="text-2xl mb-1">🏏</div>
                                    <div className="text-lg font-bold text-blue-400">{selectionBreakdown.batsmen}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Batsmen</div>
                                </div>
                                <div className="bg-stadium-800/50 rounded-lg p-3 text-center">
                                    <div className="text-2xl mb-1">🎯</div>
                                    <div className="text-lg font-bold text-red-400">{selectionBreakdown.bowlers}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Bowlers</div>
                                </div>
                                <div className="bg-stadium-800/50 rounded-lg p-3 text-center">
                                    <div className="text-2xl mb-1">⚡</div>
                                    <div className="text-lg font-bold text-purple-400">{selectionBreakdown.allRounders}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">All-rounders</div>
                                </div>
                                <div className="bg-stadium-800/50 rounded-lg p-3 text-center">
                                    <div className="text-2xl mb-1">🧤</div>
                                    <div className="text-lg font-bold text-amber-400">{selectionBreakdown.wicketKeepers}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">Wicket-keepers</div>
                                </div>
                            </div>

                            {/* Overseas count */}
                            <div className="flex items-center justify-between bg-stadium-800/50 rounded-lg p-3 mb-5">
                                <span className="text-sm text-gray-400 flex items-center gap-2">
                                    ✈️ Overseas in XII
                                </span>
                                <span className="text-lg font-bold text-neon-cyan font-mono">
                                    {selectionBreakdown.overseas}
                                </span>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={selectedPlayers.length === 12 && !hasSubmitted ? { scale: 1.03 } : {}}
                                whileTap={selectedPlayers.length === 12 && !hasSubmitted ? { scale: 0.97 } : {}}
                                onClick={handleSubmit}
                                disabled={selectedPlayers.length !== 12 || hasSubmitted}
                                className={`w-full py-4 rounded-xl text-base font-bold transition-all ${selectedPlayers.length === 12 && !hasSubmitted
                                    ? "bg-gradient-to-r from-neon-gold to-amber-500 text-stadium-950 shadow-lg shadow-neon-gold/30 hover:shadow-neon-gold/50 cursor-pointer"
                                    : hasSubmitted
                                        ? "bg-neon-green/20 text-neon-green border border-neon-green/30 cursor-not-allowed"
                                        : "bg-stadium-700/50 text-gray-500 border border-stadium-600/30 cursor-not-allowed"
                                    }`}
                            >
                                {hasSubmitted
                                    ? "✓ Submitted"
                                    : selectedPlayers.length === 12
                                        ? "🏏 Submit Playing XII"
                                        : `Select ${12 - selectedPlayers.length} more player${12 - selectedPlayers.length === 1 ? "" : "s"}`
                                }
                            </motion.button>
                        </div>
                        )}

                        {/* Team Submission Status */}
                        <div className="bg-stadium-900/80 border border-stadium-600/30 rounded-xl p-5">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                📋 Team Status
                                <span className="text-xs font-normal text-gray-500">
                                    ({submittedTeams.size}/{eligibleCount} eligible submitted)
                                </span>
                            </h3>
                            <div className="space-y-2">
                                {teams.map(team => {
                                    const teamInfo = getTeamById(team.id);
                                    const isSubmitted = submittedTeams.has(team.id);
                                    const teamDQ = (team.squad?.length || 0) < 12;
                                    return (
                                        <div
                                            key={team.id}
                                            className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${isSubmitted
                                                ? "bg-neon-green/10 border-neon-green/30"
                                                : teamDQ
                                                    ? "bg-red-500/10 border-red-500/20"
                                                    : "bg-stadium-800/50 border-stadium-700/30"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: teamInfo?.color }}></span>
                                                <span className="font-semibold text-sm">{teamInfo?.name}</span>
                                                {teamDQ && (
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded font-bold">
                                                        {team.squad?.length || 0} players
                                                    </span>
                                                )}
                                            </div>
                                            {isSubmitted ? (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-neon-green text-sm font-bold flex items-center gap-1"
                                                >
                                                    ✓ Submitted
                                                </motion.span>
                                            ) : teamDQ ? (
                                                <span className="text-red-400 text-sm font-bold">❌ DQ</span>
                                            ) : (
                                                <span className="text-gray-500 text-sm flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-yellow-500/60 animate-pulse"></span>
                                                    Pending...
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Impact Player Info — only for eligible teams */}
                        {!isDisqualified && (
                        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-neon-gold/20 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">⭐</span>
                                <h4 className="text-sm font-bold text-neon-gold">Impact Player</h4>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                The 12th player you select becomes your <span className="text-neon-gold font-semibold">Impact Player</span> — a tactical substitute who can change the game. Choose your 12th pick wisely!
                            </p>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SquadSelectionPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-stadium-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-neon-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading squad selection...</p>
                </div>
            </div>
        }>
            <SquadSelectionContent />
        </Suspense>
    );
}
