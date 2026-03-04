"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    getSocket,
    connectSocket,
    toggleReady,
    startAuction as socketStartAuction,
    sendChatMessage,
    type RoomState,
    type User
} from "@/lib/socket";

const IPL_TEAMS = [
    { id: "csk", name: "Chennai Super Kings", color: "#ffc107" },
    { id: "mi", name: "Mumbai Indians", color: "#004ba0" },
    { id: "rcb", name: "Royal Challengers Bangalore", color: "#d4001f" },
    { id: "kkr", name: "Kolkata Knight Riders", color: "#3a225d" },
    { id: "dc", name: "Delhi Capitals", color: "#0066b3" },
    { id: "pbks", name: "Punjab Kings", color: "#ed1b24" },
    { id: "rr", name: "Rajasthan Royals", color: "#ea1a85" },
    { id: "srh", name: "Sunrisers Hyderabad", color: "#ff822a" },
    { id: "lsg", name: "Lucknow Super Giants", color: "#a72056" },
    { id: "gt", name: "Gujarat Titans", color: "#1c1c1c" },
];

const getTeam = (teamId: string) => IPL_TEAMS.find(t => t.id === teamId);

interface ChatMessage {
    id: string;
    username: string;
    teamId?: string;
    message: string;
    timestamp: number;
}

function LobbyPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomIdParam = searchParams.get("roomId");

    const [roomState, setRoomState] = useState<RoomState | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Get user info from session (deferred to client-side to avoid hydration mismatch)
    const [oderId, setOderId] = useState<string | null>(null);
    const [myTeamId, setMyTeamId] = useState<string | null>(null);
    const [isHost, setIsHost] = useState(false);

    useEffect(() => {
        setOderId(sessionStorage.getItem("oderId"));
        setMyTeamId(sessionStorage.getItem("teamId"));
        setIsHost(sessionStorage.getItem("isHost") === "true");
    }, []);

    // Socket event handlers
    useEffect(() => {
        const socket = connectSocket();

        function onUserJoined(data: { user: User; roomState: RoomState }) {
            setRoomState(data.roomState);
            setChatMessages((prev) => [
                ...prev,
                {
                    id: `sys-${Date.now()}`,
                    username: "System",
                    message: `${data.user.name} joined the room!`,
                    timestamp: Date.now(),
                },
            ]);
        }

        function onUserReadyChanged(data: { oderId: string; isReady: boolean; roomState: RoomState }) {
            setRoomState(data.roomState);
        }

        function onUserDisconnected(data: { oderId: string; userName: string; teamId: string }) {
            setChatMessages((prev) => [
                ...prev,
                {
                    id: `sys-${Date.now()}`,
                    username: "System",
                    message: `${data.userName} left the room`,
                    timestamp: Date.now(),
                },
            ]);
        }

        function onRoomClosed(data: { reason: string }) {
            setError(data.reason);
            setTimeout(() => router.push("/"), 2000);
        }

        function onAuctionStarted(data: { roomState: RoomState }) {
            router.push(`/auction?roomId=${roomIdParam}`);
        }

        function onChatMessage(msg: ChatMessage) {
            setChatMessages((prev) => [...prev, msg]);
        }

        socket.on("user-joined", onUserJoined);
        socket.on("user-ready-changed", onUserReadyChanged);
        socket.on("user-disconnected", onUserDisconnected);
        socket.on("room-closed", onRoomClosed);
        socket.on("auction-started", onAuctionStarted);
        socket.on("chat-message", onChatMessage);

        // Get initial room state
        socket.emit("get-room-state", (result: { success: boolean; roomState?: RoomState }) => {
            if (result.success && result.roomState) {
                setRoomState(result.roomState);
            }
        });

        return () => {
            socket.off("user-joined", onUserJoined);
            socket.off("user-ready-changed", onUserReadyChanged);
            socket.off("user-disconnected", onUserDisconnected);
            socket.off("room-closed", onRoomClosed);
            socket.off("auction-started", onAuctionStarted);
            socket.off("chat-message", onChatMessage);
        };
    }, [roomIdParam, router]);

    const handleToggleReady = () => {
        toggleReady((result) => {
            if (result.success) {
                setIsReady(result.isReady || false);
            }
        });
    };

    const handleStartAuction = () => {
        setIsLoading(true);
        socketStartAuction((result) => {
            setIsLoading(false);
            if (!result.success) {
                setError(result.error || "Failed to start auction");
            }
        });
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        sendChatMessage(newMessage);
        setNewMessage("");
    };

    const copyRoomId = () => {
        if (roomState?.id) {
            navigator.clipboard.writeText(roomState.id);
        }
    };

    // Check if all users are ready
    const allReady = roomState?.users.every((u) => u.isReady || u.isHost) ?? false;
    const canStart = roomState && roomState.users.length >= 2 && allReady;

    if (!roomState) {
        return (
            <div className="min-h-screen flex items-center justify-center stadium-bg">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Connecting to room...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex stadium-bg">
            {/* Main Content */}
            <div className="flex-1 flex flex-col p-6 max-w-5xl mx-auto">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="font-display text-3xl font-bold text-white mb-2">
                        {roomState.name}
                    </h1>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <button
                            onClick={copyRoomId}
                            className="px-4 py-2 glass-card flex items-center gap-2 hover:bg-stadium-700/50 transition cursor-pointer"
                        >
                            <span className="text-gray-400 text-sm">Room ID:</span>
                            <span className="font-mono text-neon-cyan font-bold tracking-widest">
                                {roomState.id}
                            </span>
                            <span className="text-gray-400 text-sm hover:text-white">📋</span>
                        </button>
                        <div className="px-4 py-2 glass-card flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
                            <span className="text-sm text-gray-300">
                                {roomState.users.length}/{roomState.numTeams} Teams
                            </span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}
                </motion.header>

                {/* Teams Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {Array.from({ length: roomState.numTeams }).map((_, index) => {
                        const user = roomState.users[index];
                        const team = user ? getTeam(user.teamId) : null;
                        const isMe = user?.teamId === myTeamId;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                                className={`glass-card-strong p-4 text-center relative ${user?.isHost ? "ring-2 ring-neon-gold" : ""
                                    } ${isMe ? "ring-2 ring-neon-cyan" : ""}`}
                            >
                                {user ? (
                                    <>
                                        {/* Host Badge */}
                                        {user.isHost && (
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-neon-gold text-stadium-950 text-[10px] font-bold rounded-full uppercase">
                                                Host
                                            </div>
                                        )}

                                        {/* You Badge */}
                                        {isMe && !user.isHost && (
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-neon-cyan text-stadium-950 text-[10px] font-bold rounded-full uppercase">
                                                You
                                            </div>
                                        )}

                                        {/* Team Logo */}
                                        <div
                                            className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center text-2xl font-bold text-white mb-3"
                                            style={{
                                                backgroundColor: team?.color || "#666",
                                                boxShadow: `0 0 20px ${team?.color}40`,
                                            }}
                                        >
                                            {team?.id.toUpperCase().substring(0, 3) || "?"}
                                        </div>

                                        {/* User Name */}
                                        <p className="font-medium text-white mb-1">{user.name}</p>
                                        <p className="text-xs text-gray-400 mb-3">{team?.name}</p>

                                        {/* Ready Status */}
                                        <div
                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${user.isReady || user.isHost
                                                ? "bg-neon-green/20 text-neon-green"
                                                : "bg-gray-600/20 text-gray-400"
                                                }`}
                                        >
                                            {user.isReady || user.isHost ? "✓ Ready" : "● Not Ready"}
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-8 text-gray-500">
                                        <div className="w-16 h-16 mx-auto rounded-xl bg-stadium-700/50 flex items-center justify-center text-3xl mb-3 opacity-50">
                                            ?
                                        </div>
                                        <p className="text-sm">Waiting...</p>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-auto space-y-4"
                >
                    {/* Ready Button (for non-host) */}
                    {!isHost && (
                        <button
                            onClick={handleToggleReady}
                            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${isReady
                                ? "bg-neon-green/20 text-neon-green border border-neon-green/50"
                                : "bg-gray-700 text-white hover:bg-gray-600"
                                }`}
                        >
                            {isReady ? "✓ Ready!" : "Click when Ready"}
                        </button>
                    )}

                    {/* Start Button (for host) */}
                    {isHost && (
                        <>
                            <button
                                onClick={handleStartAuction}
                                disabled={!canStart || isLoading}
                                className={`px-8 py-4 rounded-xl font-display font-bold text-xl uppercase tracking-wider transition-all ${canStart
                                    ? "bg-gradient-to-r from-neon-gold to-amber-500 text-stadium-950 hover:shadow-lg hover:shadow-neon-gold/30 hover:scale-105"
                                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                {isLoading ? "Starting..." : canStart ? "🏏 Start Auction" : "Waiting for players..."}
                            </button>
                            {!canStart && (
                                <p className="text-gray-500 text-sm">
                                    {roomState.users.length < 2
                                        ? "Need at least 2 players"
                                        : "All players must be ready"}
                                </p>
                            )}
                        </>
                    )}
                </motion.div>
            </div>

            {/* Chat Sidebar */}
            <motion.aside
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="w-80 bg-stadium-900/50 border-l border-stadium-600/30 flex flex-col"
            >
                <div className="p-4 border-b border-stadium-600/30">
                    <h2 className="font-display font-bold text-white flex items-center gap-2">
                        💬 Lobby Chat
                    </h2>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {chatMessages.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-8">
                            No messages yet. Say hi! 👋
                        </p>
                    ) : (
                        chatMessages.map((msg) => {
                            const msgTeam = msg.teamId ? getTeam(msg.teamId) : null;
                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card p-3"
                                >
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span
                                            className="font-semibold text-sm"
                                            style={{ color: msgTeam?.color || "#00d4ff" }}
                                        >
                                            {msg.username}
                                        </span>
                                        <span className="text-gray-600 text-xs">
                                            {new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm">{msg.message}</p>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-stadium-600/30">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 bg-stadium-800/50 border border-stadium-600 rounded-lg text-white text-sm placeholder-gray-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            </motion.aside>
        </div>
    );
}

export default function LobbyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center stadium-bg">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading lobby...</p>
                </div>
            </div>
        }>
            <LobbyPageContent />
        </Suspense>
    );
}
