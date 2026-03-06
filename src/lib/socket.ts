"use client";

import { io, Socket } from "socket.io-client";

// Socket instance (singleton)
let socket: Socket | null = null;

// Use environment variable for server URL (defaults to localhost for development)
// To play from phone: set NEXT_PUBLIC_SERVER_URL=http://YOUR_MAC_IP:3001 in .env.local
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

export function getSocket(): Socket {
    if (!socket) {
        socket = io(SERVER_URL, {
            autoConnect: false,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
    }
    return socket;
}

export function connectSocket(): Socket {
    const s = getSocket();
    if (!s.connected) {
        s.connect();
    }
    return s;
}

export function disconnectSocket(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

// Type definitions for socket events
export interface RoomState {
    id: string;
    name: string;
    numTeams: number;
    status: "waiting" | "active" | "finished";
    hostId: string;
    currentPlayer: any | null;
    currentPlayerIndex: number;
    totalPlayers: number;
    currentBid: number;
    currentHolderId: string | null;
    currentHolderTeamId: string | null;
    timerSeconds: number;
    recentBids: BidEntry[];
    auctionRound: number;
    unsoldCount: number;
    users: User[];
    teams: TeamState[];
}

export interface User {
    id: string;
    name: string;
    teamId: string;
    isReady: boolean;
    isHost: boolean;
}

export interface TeamState {
    id: string;
    ownerId: string;
    purse: number;
    squadSize: number;
    overseasCount: number;
    squad: { player: any; price: number }[];
}

export interface BidEntry {
    id: string;
    teamId: string;
    userId: string;
    amount: number;
    timestamp: number;
}

// Socket event emitters with callbacks
export function createRoom(
    data: {
        roomName: string;
        numTeams: number;
        initialPurse: number;
        userName: string;
        teamId: string;
    },
    callback: (result: { success: boolean; roomId?: string; oderId?: string; roomState?: RoomState; error?: string }) => void
): void {
    const s = connectSocket();
    s.emit("create-room", data, callback);
}

export function joinRoom(
    data: {
        roomId: string;
        userName: string;
        teamId: string;
    },
    callback: (result: { success: boolean; oderId?: string; roomState?: RoomState; error?: string }) => void
): void {
    const s = connectSocket();
    s.emit("join-room", data, callback);
}

export function toggleReady(
    callback: (result: { success: boolean; isReady?: boolean; error?: string }) => void
): void {
    const s = getSocket();
    s?.emit("toggle-ready", callback);
}

export function startAuction(
    callback: (result: { success: boolean; error?: string }) => void
): void {
    const s = getSocket();
    s?.emit("start-auction", callback);
}

export function placeBid(
    callback: (result: { success: boolean; newBid?: number; error?: string }) => void
): void {
    const s = getSocket();
    s?.emit("place-bid", callback);
}

export function sendChatMessage(message: string): void {
    const s = getSocket();
    s?.emit("chat-message", { message });
}

export function getRoomState(
    callback: (result: { success: boolean; roomState?: RoomState; error?: string }) => void
): void {
    const s = getSocket();
    s?.emit("get-room-state", callback);
}
