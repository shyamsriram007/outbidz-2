"use client";

import { useState, useEffect, useCallback } from "react";
import {
    getSocket,
    connectSocket,
    disconnectSocket,
    type RoomState,
    type User,
    type TeamState,
    type BidEntry
} from "./socket";

interface UseSocketReturn {
    isConnected: boolean;
    roomState: RoomState | null;
    myUserId: string | null;
    error: string | null;
    connect: () => void;
    disconnect: () => void;
}

export function useSocket(): UseSocketReturn {
    const [isConnected, setIsConnected] = useState(false);
    const [roomState, setRoomState] = useState<RoomState | null>(null);
    const [myUserId, setMyUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const socket = getSocket();

        function onConnect() {
            setIsConnected(true);
            setError(null);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onConnectError(err: Error) {
            setError(`Connection error: ${err.message}`);
            setIsConnected(false);
        }

        // Room events
        function onUserJoined(data: { user: User; roomState: RoomState }) {
            setRoomState(data.roomState);
        }

        function onUserReadyChanged(data: { oderId: string; isReady: boolean; roomState: RoomState }) {
            setRoomState(data.roomState);
        }

        function onUserDisconnected(data: { oderId: string; userName: string; teamId: string }) {
            // Update room state or show notification
            console.log(`${data.userName} disconnected`);
        }

        function onRoomClosed(data: { reason: string }) {
            setError(data.reason);
            setRoomState(null);
        }

        // Auction events
        function onAuctionStarted(data: { roomState: RoomState }) {
            setRoomState(data.roomState);
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
            setRoomState((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    teams: data.updatedTeams,
                };
            });
        }

        function onPlayerUnsold(data: { player: any }) {
            // Handle unsold player notification
        }

        function onNextPlayer(data: { player: any; playerIndex: number; totalPlayers: number }) {
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
                return {
                    ...prev,
                    status: "finished",
                    teams: data.teams,
                };
            });
        }

        // Subscribe to events
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onConnectError);
        socket.on("user-joined", onUserJoined);
        socket.on("user-ready-changed", onUserReadyChanged);
        socket.on("user-disconnected", onUserDisconnected);
        socket.on("room-closed", onRoomClosed);
        socket.on("auction-started", onAuctionStarted);
        socket.on("bid-placed", onBidPlaced);
        socket.on("timer-update", onTimerUpdate);
        socket.on("player-sold", onPlayerSold);
        socket.on("player-unsold", onPlayerUnsold);
        socket.on("next-player", onNextPlayer);
        socket.on("auction-complete", onAuctionComplete);

        // Cleanup
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onConnectError);
            socket.off("user-joined", onUserJoined);
            socket.off("user-ready-changed", onUserReadyChanged);
            socket.off("user-disconnected", onUserDisconnected);
            socket.off("room-closed", onRoomClosed);
            socket.off("auction-started", onAuctionStarted);
            socket.off("bid-placed", onBidPlaced);
            socket.off("timer-update", onTimerUpdate);
            socket.off("player-sold", onPlayerSold);
            socket.off("player-unsold", onPlayerUnsold);
            socket.off("next-player", onNextPlayer);
            socket.off("auction-complete", onAuctionComplete);
        };
    }, []);

    const connect = useCallback(() => {
        connectSocket();
    }, []);

    const disconnect = useCallback(() => {
        disconnectSocket();
        setRoomState(null);
    }, []);

    return {
        isConnected,
        roomState,
        myUserId,
        error,
        connect,
        disconnect,
    };
}
