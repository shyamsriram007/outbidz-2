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
    type RoomState,
    type TeamState,
    type BidEntry,
    SERVER_URL,
} from "@/lib/socket";

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
                    timerSeconds: 15,
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

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("bid-placed", onBidPlaced);
        socket.on("timer-update", onTimerUpdate);
        socket.on("player-sold", onPlayerSold);
        socket.on("player-unsold", onPlayerUnsold);
        socket.on("next-player", onNextPlayer);
        socket.on("auction-complete", onAuctionComplete);

        // Listen for auction restart from host
        socket.on("auction-restart", (data: { roomId: string }) => {
            router.push(`/lobby?roomId=${data.roomId}`);
        });

        // Get initial room state
        socket.emit("get-room-state", (result: { success: boolean; roomState?: RoomState }) => {
            if (result.success && result.roomState) {
                setRoomState(result.roomState);
            }
        });

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
            if (response.ok) {
                router.push(`/results?roomId=${roomIdParam}`);
            }
        } catch (err) {
            console.error("Failed to force end auction:", err);
        }
    }, [roomIdParam, router]);

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
            const nextBid = roomState.currentBid + getBidIncrement(roomState.currentBid);
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
    const nextBid = roomState.currentBid + getBidIncrement(roomState.currentBid);
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
            />

            {/* Center Stage */}
            <CenterStage
                player={currentPlayer}
                currentBid={roomState.currentBid}
                currentHolderTeamId={roomState.currentHolderTeamId}
                timerSeconds={roomState.timerSeconds}
                maxTimerSeconds={15}
                isTimerActive={true}
                canBid={canBid ?? false}
                isHolding={isHolding}
                recentBids={recentBids}
                onBid={handleBid}
                onTimeout={() => { }}
            />

            {/* Right Sidebar - My Dashboard */}
            <RightSidebar
                myStats={myStats}
                squad={myTeam?.squad || []}
            />

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
                        <span className="text-xs text-gray-500 font-mono">
                            Room: {roomState.id}
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                        {/* Current Category Display */}
                        {roomState.currentPlayer?.category && (
                            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                                <span className="text-yellow-400 font-semibold text-xs uppercase tracking-wide">
                                    {roomState.currentPlayer.category === "marquee" ? "Marquee Set" :
                                        roomState.currentPlayer.category === "batsman" ? "Capped Batsmen" :
                                            roomState.currentPlayer.category === "bowler" ? "Capped Bowlers" :
                                                roomState.currentPlayer.category === "wicket-keeper" ? "Capped Wicket-Keepers" :
                                                    roomState.currentPlayer.category === "all-rounder" ? "Capped All-Rounders" :
                                                        "Uncapped Players"}
                                </span>
                            </div>
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
                            <button
                                onClick={handleForceEndAuction}
                                className="px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded transition-all"
                                title="End Auction (Host Only)"
                            >
                                End Auction
                            </button>
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
