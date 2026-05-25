"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getTeamById } from "@/data/teams";
import { formatPrice } from "@/data/players";
import { connectSocket, SERVER_URL } from "@/lib/socket";

interface TradeProposal {
    id: string;
    fromTeamId: string;
    toTeamId: string;
    offeredPlayer: { player: any; price: number };
    requestedPlayer: { player: any; price: number };
    status: "pending" | "accepted" | "rejected" | "cancelled";
    timestamp: number;
}

interface TeamState {
    id: string;
    ownerId: string;
    purse: number;
    squadSize: number;
    overseasCount: number;
    squad: Array<{ player: any; price: number }>;
}

function TradePageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomIdParam = searchParams.get("roomId") || "";

    const [myTeamId, setMyTeamId] = useState<string | null>(null);
    const [isHost, setIsHost] = useState(false);
    const [teams, setTeams] = useState<TeamState[]>([]);
    const [tradeHistory, setTradeHistory] = useState<TradeProposal[]>([]);
    const [pendingProposals, setPendingProposals] = useState<TradeProposal[]>([]);
    const [selectedMyPlayer, setSelectedMyPlayer] = useState<string | null>(null);
    const [viewingTeamId, setViewingTeamId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMyTeamId(sessionStorage.getItem("teamId"));
        setIsHost(sessionStorage.getItem("isHost") === "true");
    }, []);

    useEffect(() => {
        const socket = connectSocket();

        // Rejoin room
        const storedOderId = sessionStorage.getItem("oderId") || sessionStorage.getItem("userId");
        if (storedOderId && roomIdParam) {
            socket.emit("rejoin-room", { roomId: roomIdParam, oderId: storedOderId }, (result: any) => {
                if (result.success && result.roomState) {
                    setTeams(result.roomState.teams);
                    setTradeHistory(result.roomState.tradeHistory || []);
                    setLoading(false);
                } else {
                    socket.emit("get-room-state", (result2: any) => {
                        if (result2.success && result2.roomState) {
                            setTeams(result2.roomState.teams);
                            setTradeHistory(result2.roomState.tradeHistory || []);
                        }
                        setLoading(false);
                    });
                }
            });
        } else {
            setLoading(false);
        }

        function onTradeProposed(data: { proposal: TradeProposal; roomState: any }) {
            setPendingProposals(prev => [...prev.filter(p => p.id !== data.proposal.id), data.proposal]);
            setTeams(data.roomState.teams);
        }

        function onTradeResolved(data: { proposal: TradeProposal; roomState: any }) {
            setPendingProposals(prev => prev.filter(p => p.id !== data.proposal.id));
            setTeams(data.roomState.teams);
            if (data.proposal.status === "accepted") {
                setTradeHistory(prev => [...prev, data.proposal]);
            }
        }

        function onAuctionComplete() {
            router.push(`/results?roomId=${roomIdParam}`);
        }

        socket.on("trade-proposed", onTradeProposed);
        socket.on("trade-resolved", onTradeResolved);
        socket.on("auction-complete", onAuctionComplete);

        return () => {
            socket.off("trade-proposed", onTradeProposed);
            socket.off("trade-resolved", onTradeResolved);
            socket.off("auction-complete", onAuctionComplete);
        };
    }, [roomIdParam, router]);

    const handleProposeTrade = (targetTeamId: string, requestedPlayerName: string) => {
        if (!selectedMyPlayer) return;
        const socket = connectSocket();
        socket.emit("propose-trade", {
            targetTeamId,
            offeredPlayerName: selectedMyPlayer,
            requestedPlayerName,
        }, (result: any) => {
            if (!result.success) {
                setError(result.error);
                setTimeout(() => setError(null), 3000);
            } else {
                setSelectedMyPlayer(null);
            }
        });
    };

    const handleRespondTrade = (proposalId: string, accept: boolean) => {
        const socket = connectSocket();
        socket.emit("respond-trade", { proposalId, accept }, (result: any) => {
            if (!result.success) {
                setError(result.error);
                setTimeout(() => setError(null), 3000);
            }
        });
    };

    const handleEndTrading = async () => {
        try {
            const res = await fetch(`${SERVER_URL}/api/room/${roomIdParam}/end-trading`, { method: "POST" });
            const data = await res.json();
            if (!data.success) setError(data.error);
        } catch {
            setError("Failed to end trading");
        }
    };

    const myTeam = teams.find(t => t.id === myTeamId);
    const otherTeams = teams.filter(t => t.id !== myTeamId);
    const myProposals = pendingProposals.filter(p => p.toTeamId === myTeamId && p.status === "pending");
    const myOutgoing = pendingProposals.filter(p => p.fromTeamId === myTeamId && p.status === "pending");

    const getRoleIcon = (role: string) => {
        if (role === "batsman") return "🏏";
        if (role === "bowler") return "🎯";
        if (role === "all-rounder") return "⚡";
        if (role === "wicket-keeper") return "🧤";
        return "🏏";
    };

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
                    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-red-500/90 rounded-lg text-white font-semibold text-sm shadow-lg">
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-30 px-6 py-3 bg-stadium-950/90 backdrop-blur-md border-b border-stadium-600/30">
                <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
                    <div className="flex items-center gap-4">
                        <h1 className="font-display text-xl font-bold">
                            <span className="gradient-text-gold">OUTBIDZ</span>
                            <span className="text-white"> 2.0</span>
                        </h1>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded uppercase flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                            Trade Window
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        {isHost && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleEndTrading}
                                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg text-sm font-bold shadow-lg transition-all"
                            >
                                End Trading → Results
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-20 px-4 pb-8 max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left: My Squad */}
                    <div className="space-y-4">
                        <div className="bg-stadium-900/80 border border-stadium-600/30 rounded-xl p-4">
                            <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getTeamById(myTeamId || "")?.color }}></span>
                                My Squad — {getTeamById(myTeamId || "")?.name}
                            </h2>
                            <p className="text-xs text-gray-500 mb-3">Select a player to offer in trade</p>
                            <div className="space-y-1.5 max-h-[65vh] overflow-y-auto">
                                {myTeam?.squad.map((entry, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.01 }}
                                        onClick={() => setSelectedMyPlayer(selectedMyPlayer === entry.player.name ? null : entry.player.name)}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${selectedMyPlayer === entry.player.name
                                            ? "bg-neon-gold/20 border-neon-gold/50 ring-1 ring-neon-gold/30"
                                            : "bg-stadium-800/50 border-stadium-700/30 hover:border-stadium-600/50"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">{getRoleIcon(entry.player.role)}</span>
                                                <div>
                                                    <div className="text-sm font-medium text-white">{entry.player.name}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                                        <span>{entry.player.country}</span>
                                                        {entry.player.countryCode !== "IN" && <span className="text-[9px] px-1 bg-blue-500/20 text-blue-400 rounded">OS</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs font-mono text-gray-400">{formatPrice(entry.price)}</span>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Center: Other Teams / Trade Target */}
                    <div className="space-y-4">
                        {!viewingTeamId ? (
                            <div className="bg-stadium-900/80 border border-stadium-600/30 rounded-xl p-4">
                                <h2 className="text-lg font-bold mb-3">Other Teams</h2>
                                <p className="text-xs text-gray-500 mb-3">
                                    {selectedMyPlayer
                                        ? `Offering: ${selectedMyPlayer} — Select a team to trade with`
                                        : "First select a player from your squad, then pick a team"
                                    }
                                </p>
                                <div className="grid grid-cols-1 gap-2">
                                    {otherTeams.map(team => {
                                        const teamInfo = getTeamById(team.id);
                                        return (
                                            <motion.button
                                                key={team.id}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => setViewingTeamId(team.id)}
                                                className="flex items-center justify-between px-4 py-3 rounded-lg bg-stadium-800/50 border border-stadium-700/30 hover:border-stadium-600/50 transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: teamInfo?.color }}></span>
                                                    <span className="font-semibold text-sm">{teamInfo?.name}</span>
                                                </div>
                                                <span className="text-xs text-gray-500">{team.squad.length} players</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-stadium-900/80 border border-stadium-600/30 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getTeamById(viewingTeamId)?.color }}></span>
                                        {getTeamById(viewingTeamId)?.name}
                                    </h2>
                                    <button onClick={() => setViewingTeamId(null)} className="text-xs text-gray-500 hover:text-white transition-colors">← Back</button>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">
                                    {selectedMyPlayer ? `Click a player to propose: ${selectedMyPlayer} ↔ their player` : "Select a player from your squad first"}
                                </p>
                                <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
                                    {teams.find(t => t.id === viewingTeamId)?.squad.map((entry, i) => (
                                        <motion.button
                                            key={i}
                                            whileHover={{ scale: 1.01 }}
                                            disabled={!selectedMyPlayer}
                                            onClick={() => selectedMyPlayer && handleProposeTrade(viewingTeamId, entry.player.name)}
                                            className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${selectedMyPlayer
                                                ? "bg-stadium-800/50 border-stadium-700/30 hover:border-purple-500/50 hover:bg-purple-500/10 cursor-pointer"
                                                : "bg-stadium-800/30 border-stadium-700/20 opacity-60 cursor-not-allowed"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base">{getRoleIcon(entry.player.role)}</span>
                                                    <div>
                                                        <div className="text-sm font-medium text-white">{entry.player.name}</div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                                            <span>{entry.player.country}</span>
                                                            {entry.player.countryCode !== "IN" && <span className="text-[9px] px-1 bg-blue-500/20 text-blue-400 rounded">OS</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-mono text-gray-400">{formatPrice(entry.price)}</span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Incoming Proposals + Trade History */}
                    <div className="space-y-4">
                        {/* Incoming Proposals */}
                        <div className="bg-stadium-900/80 border border-stadium-600/30 rounded-xl p-4">
                            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                                📨 Incoming Proposals
                                {myProposals.length > 0 && (
                                    <span className="px-2 py-0.5 bg-purple-500/30 text-purple-300 text-xs rounded-full animate-pulse">{myProposals.length}</span>
                                )}
                            </h2>
                            {myProposals.length === 0 ? (
                                <p className="text-sm text-gray-500">No pending proposals</p>
                            ) : (
                                <div className="space-y-2">
                                    {myProposals.map(proposal => (
                                        <div key={proposal.id} className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-purple-400 uppercase">{getTeamById(proposal.fromTeamId)?.abbr} wants to trade</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm mb-3">
                                                <div className="flex-1 text-center p-2 rounded bg-stadium-800/50">
                                                    <div className="text-xs text-gray-500 mb-0.5">They offer</div>
                                                    <div className="font-semibold text-green-400">{proposal.offeredPlayer.player.name}</div>
                                                    <div className="text-xs text-gray-500">{formatPrice(proposal.offeredPlayer.price)}</div>
                                                </div>
                                                <span className="text-lg">↔</span>
                                                <div className="flex-1 text-center p-2 rounded bg-stadium-800/50">
                                                    <div className="text-xs text-gray-500 mb-0.5">They want</div>
                                                    <div className="font-semibold text-red-400">{proposal.requestedPlayer.player.name}</div>
                                                    <div className="text-xs text-gray-500">{formatPrice(proposal.requestedPlayer.price)}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleRespondTrade(proposal.id, true)} className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg transition-colors">
                                                    ✓ Accept
                                                </button>
                                                <button onClick={() => handleRespondTrade(proposal.id, false)} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg transition-colors">
                                                    ✕ Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Outgoing Proposals */}
                        {myOutgoing.length > 0 && (
                            <div className="bg-stadium-900/80 border border-stadium-600/30 rounded-xl p-4">
                                <h2 className="text-sm font-bold mb-2 text-yellow-400">📤 Sent Proposals</h2>
                                {myOutgoing.map(p => (
                                    <div key={p.id} className="text-xs text-gray-400 p-2 bg-stadium-800/30 rounded mb-1">
                                        {p.offeredPlayer.player.name} ↔ {p.requestedPlayer.player.name} ({getTeamById(p.toTeamId)?.abbr}) — <span className="text-yellow-400">Pending...</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Trade History */}
                        <div className="bg-stadium-900/80 border border-stadium-600/30 rounded-xl p-4">
                            <h2 className="text-lg font-bold mb-3">📋 Trade History</h2>
                            {tradeHistory.length === 0 ? (
                                <p className="text-sm text-gray-500">No completed trades yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {tradeHistory.map((trade, i) => (
                                        <div key={i} className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold" style={{ color: getTeamById(trade.fromTeamId)?.color }}>{getTeamById(trade.fromTeamId)?.abbr}</span>
                                                <span className="text-white font-medium">{trade.offeredPlayer.player.name}</span>
                                                <span className="text-gray-500">↔</span>
                                                <span className="text-white font-medium">{trade.requestedPlayer.player.name}</span>
                                                <span className="text-xs font-bold" style={{ color: getTeamById(trade.toTeamId)?.color }}>{getTeamById(trade.toTeamId)?.abbr}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TradePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-stadium-950 flex items-center justify-center text-white">Loading...</div>}>
            <TradePageContent />
        </Suspense>
    );
}
