"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import LeftSidebar from "@/components/auction/LeftSidebar";
import CenterStage from "@/components/auction/CenterStage";
import RightSidebar from "@/components/auction/RightSidebar";
import SoldOverlay from "@/components/auction/SoldOverlay";
import { getBidIncrement, formatPrice } from "@/data/players";
import {
    getSocket,
    connectSocket,
    placeBid as socketPlaceBid,
    withdrawBid as socketWithdrawBid,
    type RoomState,
    type TeamState,
    type BidEntry,
    SERVER_URL,
} from "@/lib/socket";
import { getTeamById } from "@/data/teams";

interface TeamStatus {
    teamId: string;
    purse: number;
    squadSize: number;
    overseasCount: number;
    isCurrentHolder: boolean;
    canAffordBid: boolean;
}

interface BoughtPlayer {
    player: any;
    price: number;
}

function AuctionPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomIdParam = searchParams.get("roomId");

    // Get user info from session (deferred to client-side to avoid hydration mismatch)
    const [myTeamId, setMyTeamId] = useState<string | null>(null);
    const [isHost, setIsHost] = useState(false);

    useEffect(() => {
        setMyTeamId(sessionStorage.getItem("teamId"));
        setIsHost(sessionStorage.getItem("isHost") === "true");
    }, []);

    // Room state from server
    const [roomState, setRoomState] = useState<RoomState | null>(null);

    // Sold overlay state
    const [showSoldOverlay, setShowSoldOverlay] = useState(false);
    const [soldInfo, setSoldInfo] = useState<{
        player: any;
        teamId: string;
        price: number;
    } | null>(null);

    // Connection and error state
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [roundMessage, setRoundMessage] = useState<string | null>(null);
    const [hasWithdrawn, setHasWithdrawn] = useState(false);
    const [viewingSquadTeamId, setViewingSquadTeamId] = useState<string | null>(null);
    const [showSetPreview, setShowSetPreview] = useState(false);
    const [setPreviewData, setSetPreviewData] = useState<any>(null);

    // Socket event handlers
    useEffect(() => {
        const socket = connectSocket();

        function onConnect() {
            setIsConnected(true);
            setError(null);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onBidPlaced(data: { oderId: string; teamId: string; amount: number; timerSeconds: number }) {
            setRoomState((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    currentBid: data.amount,
                    currentHolderId: data.oderId,
                    currentHolderTeamId: data.teamId,
                    timerSeconds: data.timerSeconds,
                    recentBids: [
                        {
                            id: `bid-${Date.now()}`,
                            teamId: data.teamId,
                            oderId: data.oderId,
                            amount: data.amount,
                            timestamp: Date.now(),
                        } as any,
                        ...(prev.recentBids || []).slice(0, 4),
                    ],
                };
            });
        }

        function onTimerUpdate(data: { seconds: number }) {
            setRoomState((prev) => {
                if (!prev) return prev;
                return { ...prev, timerSeconds: data.seconds };
            });
        }

        function onPlayerSold(data: { player: any; teamId: string; price: number; updatedTeams: TeamState[] }) {
            setSoldInfo({
                player: data.player,
                teamId: data.teamId,
                price: data.price,
            });
            setShowSoldOverlay(true);
            setRoomState((prev) => {
                if (!prev) return prev;
                return { ...prev, teams: data.updatedTeams };
            });
        }

        function onPlayerUnsold(data: { player: any }) {
            // Could show an "Unsold" overlay here
            console.log("Player unsold:", data.player.name);
        }

        function onNextPlayer(data: { player: any; playerIndex: number; totalPlayers: number }) {
            setShowSoldOverlay(false);
            setSoldInfo(null);
            setHasWithdrawn(false);
            setRoomState((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    currentPlayer: data.player,
                    currentPlayerIndex: data.playerIndex,
                    totalPlayers: data.totalPlayers,
                    currentBid: data.player.basePrice,
                    currentHolderId: null,
                    currentHolderTeamId: null,
                    timerSeconds: 25,
                    recentBids: [],
                };
            });
        }

        function onAuctionComplete(data: { teams: TeamState[] }) {
            setRoomState((prev) => {
                if (!prev) return prev;
                return { ...prev, status: "finished", teams: data.teams };
            });
            // Redirect to results page
            setTimeout(() => {
                router.push(`/results?roomId=${roomIdParam}`);
            }, 1000);
        }

        function onBidWithdrawn(data: { withdrawnByTeamId: string; newBid: number; newHolderTeamId: string | null; newHolderId: string | null; timerSeconds: number; recentBids: BidEntry[] }) {
            setRoomState((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    currentBid: data.newBid,
                    currentHolderId: data.newHolderId,
                    currentHolderTeamId: data.newHolderTeamId,
                    timerSeconds: data.timerSeconds,
                    recentBids: data.recentBids,
                };
            });
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("bid-placed", onBidPlaced);
        socket.on("timer-update", onTimerUpdate);
        socket.on("player-sold", onPlayerSold);
        socket.on("player-unsold", onPlayerUnsold);
        socket.on("next-player", onNextPlayer);
        socket.on("auction-complete", onAuctionComplete);
        socket.on("bid-withdrawn", onBidWithdrawn);

        // Listen for auction restart from host
        socket.on("auction-restart", (data: { roomId: string }) => {
            router.push(`/lobby?roomId=${data.roomId}`);
        });

        // Listen for round transitions
        function onRoundComplete(data: { round: number; unsoldCount: number; message: string }) {
            setRoundMessage(data.message);
        }

        function onRoundStarted(data: { round: number; totalPlayers: number; player: any }) {
            setRoundMessage(null);
            setShowSoldOverlay(false);
            setSoldInfo(null);
            setRoomState((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    auctionRound: data.round,
                    currentPlayer: data.player,
                    currentPlayerIndex: 0,
                    totalPlayers: data.totalPlayers,
                    currentBid: data.player.basePrice,
                    currentHolderId: null,
                    currentHolderTeamId: null,
                    timerSeconds: 25,
                    recentBids: [],
                };
            });
        }

        socket.on("round-complete", onRoundComplete);
        socket.on("round-started", onRoundStarted);

        // Auto-rejoin on connect using stored session data
        const storedOderId = sessionStorage.getItem("oderId") || sessionStorage.getItem("userId");
        const storedRoomId = roomIdParam;

        if (storedOderId && storedRoomId) {
            socket.emit("rejoin-room", { roomId: storedRoomId, oderId: storedOderId }, (result: any) => {
                if (result.success && result.roomState) {
                    setRoomState(result.roomState);
                } else {
                    socket.emit("get-room-state", (result2: { success: boolean; roomState?: RoomState }) => {
                        if (result2.success && result2.roomState) {
                            setRoomState(result2.roomState);
                        }
                    });
                }
            });
        } else {
            socket.emit("get-room-state", (result: { success: boolean; roomState?: RoomState }) => {
                if (result.success && result.roomState) {
                    setRoomState(result.roomState);
                }
            });
        }

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("bid-placed", onBidPlaced);
            socket.off("timer-update", onTimerUpdate);
            socket.off("player-sold", onPlayerSold);
            socket.off("player-unsold", onPlayerUnsold);
            socket.off("next-player", onNextPlayer);
            socket.off("auction-complete", onAuctionComplete);
            socket.off("auction-restart");
            socket.off("round-complete", onRoundComplete);
            socket.off("round-started", onRoundStarted);
            socket.off("bid-withdrawn", onBidWithdrawn);
        };
    }, []);

    // Handle bid
    const handleBid = useCallback(() => {
        socketPlaceBid((result) => {
            if (!result.success) {
                setError(result.error || "Failed to place bid");
                setTimeout(() => setError(null), 3000);
            }
        });
    }, []);

    // Handle bid withdrawal
    const handleWithdraw = useCallback(() => {
        socketWithdrawBid((result) => {
            if (!result.success) {
                setError(result.error || "Failed to withdraw bid");
                setTimeout(() => setError(null), 3000);
            } else {
                setHasWithdrawn(true);
            }
        });
    }, []);

    // Handle sold overlay complete
    const handleSoldComplete = useCallback(() => {
        setShowSoldOverlay(false);
        setSoldInfo(null);
    }, []);

    // DEV TOOL: Force end auction
    const handleForceEndAuction = useCallback(async () => {
        if (!roomIdParam) return;
        try {
            const response = await fetch(`${SERVER_URL}/api/room/${roomIdParam}/force-end`, {
                method: "POST",
            });
            const data = await response.json();
            if (response.ok && data.round !== 2) {
                // Only redirect if auction is fully over (not transitioning to round 2)
                router.push(`/results?roomId=${roomIdParam}`);
            }
        } catch (err) {
            console.error("Failed to end round:", err);
        }
    }, [roomIdParam, router]);

    const handleSkipCategory = useCallback(async () => {
        if (!roomIdParam) return;
        try {
            await fetch(`${SERVER_URL}/api/room/${roomIdParam}/skip-category`, {
                method: "POST",
            });
        } catch (err) {
            console.error("Failed to skip set:", err);
        }
    }, [roomIdParam]);

    // Loading state
    if (!roomState) {
        return (
            <div className="min-h-screen flex items-center justify-center stadium-bg">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Connecting to auction...</p>
                </div>
            </div>
        );
    }

    // Auction complete state
    if (roomState.status === "finished") {
        return (
            <div className="min-h-screen flex items-center justify-center stadium-bg p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card-strong p-8 max-w-4xl w-full text-center"
                >
                    <h1 className="font-display text-4xl font-bold gradient-text-gold mb-6">
                        🏆 Auction Complete!
                    </h1>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {roomState.teams.map((team) => (
                            <div key={team.id} className="glass-card p-4">
                                <div className="font-bold text-white mb-2">{team.id.toUpperCase()}</div>
                                <div className="text-sm text-gray-400">
                                    {team.squadSize} players • {formatPrice(team.squad.reduce((sum, p) => sum + p.price, 0))} spent
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition"
                    >
                        Return Home
                    </button>
                </motion.div>
            </div>
        );
    }

    // Get current player
    const currentPlayer = roomState.currentPlayer;
    if (!currentPlayer) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <p>Waiting for auction to start...</p>
            </div>
        );
    }

    // Calculate team statuses
    const getTeamStatuses = (): TeamStatus[] => {
        return roomState.teams.map((team) => {
            const isFirstBid = roomState.currentHolderId === null;
            const nextBid = isFirstBid ? roomState.currentBid : roomState.currentBid + getBidIncrement(roomState.currentBid);
            return {
                teamId: team.id,
                purse: team.purse,
                squadSize: team.squadSize,
                overseasCount: team.overseasCount,
                isCurrentHolder: roomState.currentHolderTeamId === team.id,
                canAffordBid: team.purse >= nextBid,
            };
        });
    };

    // My team info
    const myTeam = roomState.teams.find((t) => t.id === myTeamId);
    const myStats = myTeam
        ? {
            teamId: myTeam.id,
            purse: myTeam.purse,
            squadSize: myTeam.squadSize,
            overseasCount: myTeam.overseasCount,
        }
        : { teamId: myTeamId || "", purse: 0, squadSize: 0, overseasCount: 0 };

    const isHolding = roomState.currentHolderTeamId === myTeamId;
    const isFirstBid = roomState.currentHolderId === null;
    const nextBid = isFirstBid ? roomState.currentBid : roomState.currentBid + getBidIncrement(roomState.currentBid);
    const canBid =
        myTeam &&
        myTeam.purse >= nextBid &&
        myTeam.squadSize < 25 &&
        (currentPlayer.countryCode === "IN" || myTeam.overseasCount < 8) &&
        !isHolding;

    // Format bids for activity log
    const recentBids = (roomState.recentBids || []).map((bid: any) => ({
        id: bid.id,
        teamId: bid.teamId,
        amount: bid.amount,
        timestamp: bid.timestamp,
    }));

    return (
        <div className="min-h-screen flex bg-stadium-950 pt-16 overflow-y-auto">
            {/* Left Sidebar - Competition */}
            <LeftSidebar
                teams={getTeamStatuses()}
                currentBid={roomState.currentBid}
                myTeamId={myTeamId || ""}
                onTeamClick={(teamId: string) => setViewingSquadTeamId(teamId)}
            />

            {/* Center Stage */}
            <CenterStage
                player={currentPlayer}
                currentBid={roomState.currentBid}
                currentHolderTeamId={roomState.currentHolderTeamId}
                timerSeconds={roomState.timerSeconds}
                maxTimerSeconds={25}
                isTimerActive={true}
                canBid={canBid ?? false}
                isHolding={isHolding}
                isFirstBid={isFirstBid}
                canWithdraw={isHolding && !hasWithdrawn}
                recentBids={recentBids}
                onBid={handleBid}
                onWithdraw={handleWithdraw}
                onTimeout={() => { }}
            />

            {/* Right Sidebar - My Dashboard */}
            <RightSidebar
                myStats={myStats}
                squad={myTeam?.squad || []}
            />

            {/* Squad Popup Overlay */}
            {viewingSquadTeamId && (() => {
                const viewTeam = roomState.teams.find(t => t.id === viewingSquadTeamId);
                const viewTeamInfo = getTeamById(viewingSquadTeamId);
                if (!viewTeam || !viewTeamInfo) return null;
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                        onClick={() => setViewingSquadTeamId(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="glass-card-strong rounded-xl p-6 max-w-lg w-full max-h-[70vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                                        style={{ backgroundColor: viewTeamInfo.color }}
                                    >
                                        {viewTeamInfo.abbr}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{viewTeamInfo.name}</h3>
                                        <p className="text-xs text-gray-400">{viewTeam.squadSize} players • ₹{(viewTeam.purse / 100).toFixed(1)}Cr remaining</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setViewingSquadTeamId(null)}
                                    className="text-gray-400 hover:text-white text-xl"
                                >✕</button>
                            </div>
                            {viewTeam.squad.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No players bought yet</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-gray-500 text-xs uppercase border-b border-stadium-600/30">
                                            <th className="text-left py-2">Player</th>
                                            <th className="text-left py-2">Role</th>
                                            <th className="text-right py-2">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewTeam.squad.map((item: any, i: number) => (
                                            <tr key={i} className="border-b border-stadium-700/20">
                                                <td className="py-2 text-white flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">{item.player.countryCode}</span>
                                                    {item.player.name}
                                                </td>
                                                <td className="py-2 text-gray-400 capitalize text-xs">{item.player.role}</td>
                                                <td className="py-2 text-neon-gold text-right font-mono">{formatPrice(item.price)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </motion.div>
                    </motion.div>
                );
            })()}
            {/* Set Preview Popup */}
            {showSetPreview && setPreviewData && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                    onClick={() => setShowSetPreview(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-stadium-900 border border-stadium-600/40 rounded-xl max-w-md w-full max-h-[75vh] overflow-y-auto shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Current set header */}
                        {setPreviewData.groups.length > 0 && (() => {
                            const getCategoryLabel = (cat: string) =>
                                cat === "marquee" ? "MARQUEE SET" :
                                    cat === "batsman" ? "BATSMEN" :
                                        cat === "bowler" ? "BOWLERS" :
                                            cat === "wicket-keeper" ? "WICKET-KEEPERS" :
                                                cat === "all-rounder" ? "ALL ROUNDERS" : "UNCAPPED";

                            const currentCat = setPreviewData.currentCategory;
                            const currentGroup = setPreviewData.groups.find((g: any) => g.category === currentCat);
                            const otherGroups = setPreviewData.groups.filter((g: any) => g !== currentGroup);

                            return (
                                <>
                                    {/* Current set with player names */}
                                    {currentGroup && (
                                        <>
                                            <div className="bg-stadium-700/50 px-4 py-3 text-center border-b border-stadium-600/30">
                                                <span className="text-white font-bold text-sm uppercase tracking-wider">
                                                    {getCategoryLabel(currentGroup.category)}
                                                </span>
                                                <span className="text-gray-400 text-xs ml-2">({currentGroup.players.length} remaining)</span>
                                            </div>
                                            <div className="divide-y divide-stadium-700/30">
                                                {currentGroup.players.map((p: any, i: number) => (
                                                    <div key={i} className="px-4 py-2.5 flex items-center justify-between hover:bg-stadium-800/30">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-white text-sm font-medium">{p.name}</span>
                                                            {p.countryCode !== "IN" && (
                                                                <span className="text-[10px] px-1 py-0.5 bg-blue-500/20 text-blue-400 rounded">{p.countryCode}</span>
                                                            )}
                                                        </div>
                                                        <span className="text-gray-500 text-xs font-mono">{formatPrice(p.basePrice)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* Subsequent sets as collapsed headers */}
                                    {otherGroups.map((group: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="bg-stadium-800/40 px-4 py-3 text-center border-t border-stadium-600/30"
                                        >
                                            <span className="text-gray-300 font-semibold text-sm uppercase tracking-wider">
                                                {getCategoryLabel(group.category)}
                                            </span>
                                            <span className="text-gray-500 text-xs ml-2">({group.players.length})</span>
                                        </div>
                                    ))}
                                </>
                            );
                        })()}

                        {/* Close button */}
                        <div className="p-3 border-t border-stadium-600/30 text-center">
                            <button
                                onClick={() => setShowSetPreview(false)}
                                className="text-gray-500 hover:text-white text-xs transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Sold Overlay */}
            {soldInfo && (
                <SoldOverlay
                    isVisible={showSoldOverlay}
                    player={soldInfo.player}
                    winningTeamId={soldInfo.teamId}
                    soldPrice={soldInfo.price}
                    onComplete={handleSoldComplete}
                />
            )}

            {/* Round Transition Overlay */}
            {roundMessage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-card-strong p-8 max-w-md text-center"
                    >
                        <div className="text-5xl mb-4">🔄</div>
                        <h2 className="text-2xl font-bold text-white mb-3">Round 1 Complete</h2>
                        <p className="text-gray-300">{roundMessage}</p>
                        <p className="text-sm text-gray-500 mt-3">Starting Round 2 shortly...</p>
                    </motion.div>
                </motion.div>
            )}

            {/* Error Toast */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm z-50"
                >
                    {error}
                </motion.div>
            )}

            {/* Header Bar */}
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-30 px-6 py-3 bg-stadium-950/80 backdrop-blur-md border-b border-stadium-600/30"
            >
                <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
                    <div className="flex items-center gap-4">
                        <h1 className="font-display text-xl font-bold">
                            <span className="gradient-text-gold">OUTBIDZ</span>
                            <span className="text-white"> 2.0</span>
                        </h1>
                        <span className="px-2 py-1 bg-neon-green/10 text-neon-green text-xs font-semibold rounded uppercase flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
                            Live
                        </span>
                        {roomState.auctionRound === 2 && (
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded uppercase">
                                Round 2 — Unsold
                            </span>
                        )}
                        <span className="text-xs text-gray-500 font-mono">
                            Room: {roomState.id}
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                        {/* Current Category Button - Click to see set preview */}
                        {roomState.currentPlayer?.category && (
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await fetch(`${SERVER_URL}/api/room/${roomIdParam}/remaining-players`);
                                        const data = await res.json();
                                        if (data.success) {
                                            setSetPreviewData(data);
                                            setShowSetPreview(true);
                                        }
                                    } catch (err) {
                                        console.error("Failed to fetch set preview:", err);
                                    }
                                }}
                                className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                                <span className="text-yellow-400 font-semibold text-xs uppercase tracking-wide">
                                    {roomState.currentPlayer.category === "marquee" ? "Marquee Set" :
                                        roomState.currentPlayer.category === "batsman" ? "Capped Batsmen" :
                                            roomState.currentPlayer.category === "bowler" ? "Capped Bowlers" :
                                                roomState.currentPlayer.category === "wicket-keeper" ? "Capped Wicket-Keepers" :
                                                    roomState.currentPlayer.category === "all-rounder" ? "Capped All-Rounders" :
                                                        "Uncapped Players"}
                                </span>
                                <span className="text-yellow-500/60 text-xs">▼</span>
                            </button>
                        )}

                        <div className="text-gray-400">
                            Player{" "}
                            <span className="text-white font-bold">
                                {roomState.currentPlayerIndex + 1}
                            </span>
                            <span className="text-gray-500">/{roomState.totalPlayers}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-neon-cyan" : "bg-red-500"} animate-pulse`}></span>
                            <span className="text-gray-400">
                                {roomState.teams.length} Teams
                            </span>
                        </div>
                        {/* Host Only: Force End Auction Button */}
                        {isHost && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleSkipCategory}
                                    className="px-3 py-1 text-xs bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-400 rounded transition-all"
                                    title="Skip remaining players in this set (Host Only)"
                                >
                                    Skip Set ⏭
                                </button>
                                <button
                                    onClick={handleForceEndAuction}
                                    className="px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded transition-all"
                                    title={`End ${roomState.auctionRound === 1 ? '1st Round' : '2nd Round'} (Host Only)`}
                                >
                                    {roomState.auctionRound === 1 ? 'End 1st Round' : 'End 2nd Round'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function AuctionPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center stadium-bg">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Connecting to auction...</p>
                </div>
            </div>
        }>
            <AuctionPageContent />
        </Suspense>
    );
}
