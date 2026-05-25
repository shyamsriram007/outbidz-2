"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createRoom, joinRoom, connectSocket, SERVER_URL } from "@/lib/socket";

// IPL Teams data
const IPL_TEAMS = [
    { id: "csk", name: "Chennai Super Kings", abbr: "CSK", color: "#ffc107" },
    { id: "mi", name: "Mumbai Indians", abbr: "MI", color: "#004ba0" },
    { id: "rcb", name: "Royal Challengers Bangalore", abbr: "RCB", color: "#d4001f" },
    { id: "kkr", name: "Kolkata Knight Riders", abbr: "KKR", color: "#3a225d" },
    { id: "dc", name: "Delhi Capitals", abbr: "DC", color: "#0066b3" },
    { id: "pbks", name: "Punjab Kings", abbr: "PBKS", color: "#ed1b24" },
    { id: "rr", name: "Rajasthan Royals", abbr: "RR", color: "#ea1a85" },
    { id: "srh", name: "Sunrisers Hyderabad", abbr: "SRH", color: "#ff822a" },
    { id: "lsg", name: "Lucknow Super Giants", abbr: "LSG", color: "#a72056" },
    { id: "gt", name: "Gujarat Titans", abbr: "GT", color: "#1c1c1c" },
];

export default function Home() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"create" | "join">("create");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Create room form state
    const [roomName, setRoomName] = useState("");
    const [numTeams, setNumTeams] = useState(8);
    const [initialPurse, setInitialPurse] = useState(100);
    const [createUserName, setCreateUserName] = useState("");
    const [createSelectedTeam, setCreateSelectedTeam] = useState("");

    // Join room form state
    const [roomId, setRoomId] = useState("");
    const [joinUserName, setJoinUserName] = useState("");
    const [joinSelectedTeam, setJoinSelectedTeam] = useState("");
    const [takenTeams, setTakenTeams] = useState<string[]>([]);

    // Check available teams when room ID is entered
    useEffect(() => {
        if (roomId.length === 6) {
            fetch(`${SERVER_URL}/api/room/${roomId}/available-teams`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.takenTeams) {
                        setTakenTeams(data.takenTeams);
                    }
                })
                .catch(() => setTakenTeams([]));
        } else {
            setTakenTeams([]);
        }
    }, [roomId]);

    const handleCreateRoom = () => {
        if (!roomName || !createUserName || !createSelectedTeam) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        setError(null);

        createRoom(
            {
                roomName,
                numTeams,
                initialPurse,
                userName: createUserName,
                teamId: createSelectedTeam,
            },
            (result) => {
                setIsLoading(false);
                if (result.success && result.roomId) {
                    // Store user info in sessionStorage
                    sessionStorage.setItem("userId", result.oderId || "");
                    sessionStorage.setItem("oderId", result.oderId || "");
                    sessionStorage.setItem("roomId", result.roomId);
                    sessionStorage.setItem("teamId", createSelectedTeam);
                    sessionStorage.setItem("userName", createUserName);
                    sessionStorage.setItem("isHost", "true");

                    router.push(`/lobby?roomId=${result.roomId}`);
                } else {
                    setError(result.error || "Failed to create room");
                }
            }
        );
    };

    const handleJoinRoom = () => {
        if (!roomId || !joinUserName || !joinSelectedTeam) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        setError(null);

        joinRoom(
            {
                roomId: roomId.toUpperCase(),
                userName: joinUserName,
                teamId: joinSelectedTeam,
            },
            (result) => {
                setIsLoading(false);
                if (result.success) {
                    // Store user info in sessionStorage
                    sessionStorage.setItem("oderId", result.oderId || "");
                    sessionStorage.setItem("roomId", roomId.toUpperCase());
                    sessionStorage.setItem("teamId", joinSelectedTeam);
                    sessionStorage.setItem("userName", joinUserName);
                    sessionStorage.setItem("isHost", "false");

                    router.push(`/lobby?roomId=${roomId.toUpperCase()}`);
                } else {
                    setError(result.error || "Failed to join room");
                }
            }
        );
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 md:p-8" suppressHydrationWarning>
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-gold/3 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="font-display text-4xl md:text-5xl font-black mb-2"
                    >
                        <span className="gradient-text-gold">OUTBIDZ</span>
                        <span className="text-white"> 2.0</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-500 mt-2 text-sm"
                    >
                        Real-time multiplayer auction experience
                    </motion.p>
                </div>

                {/* Glass Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="glass-card-strong p-6 md:p-8"
                >
                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Tabs */}
                    <div className="flex mb-6 bg-stadium-800/50 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab("create")}
                            className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${activeTab === "create"
                                ? "bg-gradient-to-r from-neon-gold to-amber-500 text-stadium-950"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Create Room
                        </button>
                        <button
                            onClick={() => setActiveTab("join")}
                            className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${activeTab === "join"
                                ? "bg-gradient-to-r from-neon-cyan to-cyan-400 text-stadium-950"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Join Room
                        </button>
                    </div>

                    {/* Create Room Form */}
                    {activeTab === "create" && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-5"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    value={createUserName}
                                    onChange={(e) => setCreateUserName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 bg-stadium-800/50 border border-stadium-600 rounded-lg text-white placeholder-gray-500 focus:border-neon-gold focus:ring-1 focus:ring-neon-gold transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Room Name
                                </label>
                                <input
                                    type="text"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    placeholder="e.g., Champions League"
                                    className="w-full px-4 py-3 bg-stadium-800/50 border border-stadium-600 rounded-lg text-white placeholder-gray-500 focus:border-neon-gold focus:ring-1 focus:ring-neon-gold transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Teams
                                    </label>
                                    <select
                                        value={numTeams}
                                        onChange={(e) => setNumTeams(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-stadium-800/50 border border-stadium-600 rounded-lg text-white focus:border-neon-gold focus:ring-1 focus:ring-neon-gold transition-all"
                                    >
                                        {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                            <option key={n} value={n}>
                                                {n} Teams
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Purse
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={initialPurse}
                                            onChange={(e) => setInitialPurse(Number(e.target.value))}
                                            min={50}
                                            max={200}
                                            className="w-full px-4 py-3 bg-stadium-800/50 border border-stadium-600 rounded-lg text-white focus:border-neon-gold focus:ring-1 focus:ring-neon-gold transition-all"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                            Cr
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Select Your Team
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    {IPL_TEAMS.map((team) => (
                                        <button
                                            key={team.id}
                                            type="button"
                                            onClick={() => setCreateSelectedTeam(team.id)}
                                            className={`p-2 rounded-lg border-2 transition-all ${createSelectedTeam === team.id
                                                ? "border-neon-gold bg-neon-gold/10"
                                                : "border-stadium-600 hover:border-stadium-500"
                                                }`}
                                        >
                                            <div
                                                className="w-full aspect-square rounded-md flex items-center justify-center text-xs font-bold text-white"
                                                style={{ backgroundColor: team.color }}
                                            >
                                                {team.abbr}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleCreateRoom}
                                disabled={isLoading}
                                className="w-full py-3.5 bg-gradient-to-r from-neon-gold to-amber-500 text-stadium-950 font-bold rounded-lg hover:shadow-lg hover:shadow-neon-gold/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Creating..." : "Create Auction Room"}
                            </button>
                        </motion.div>
                    )}

                    {/* Join Room Form */}
                    {activeTab === "join" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-5"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Room ID
                                </label>
                                <input
                                    type="text"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                                    placeholder="Enter 6-digit room code"
                                    maxLength={6}
                                    className="w-full px-4 py-3 bg-stadium-800/50 border border-stadium-600 rounded-lg text-white placeholder-gray-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all font-mono tracking-widest text-center text-lg uppercase"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    value={joinUserName}
                                    onChange={(e) => setJoinUserName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 bg-stadium-800/50 border border-stadium-600 rounded-lg text-white placeholder-gray-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Select Team {takenTeams.length > 0 && <span className="text-gray-500">(grayed = taken)</span>}
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    {IPL_TEAMS.map((team) => {
                                        const isTaken = takenTeams.includes(team.id);
                                        return (
                                            <button
                                                key={team.id}
                                                type="button"
                                                onClick={() => !isTaken && setJoinSelectedTeam(team.id)}
                                                disabled={isTaken}
                                                className={`p-2 rounded-lg border-2 transition-all ${isTaken
                                                    ? "border-stadium-700 opacity-30 cursor-not-allowed"
                                                    : joinSelectedTeam === team.id
                                                        ? "border-neon-cyan bg-neon-cyan/10"
                                                        : "border-stadium-600 hover:border-stadium-500"
                                                    }`}
                                            >
                                                <div
                                                    className="w-full aspect-square rounded-md flex items-center justify-center text-xs font-bold text-white"
                                                    style={{ backgroundColor: team.color }}
                                                >
                                                    {team.abbr}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={handleJoinRoom}
                                disabled={isLoading}
                                className="w-full py-3.5 bg-gradient-to-r from-neon-cyan to-cyan-400 text-stadium-950 font-bold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Joining..." : "Join Auction Room"}
                            </button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Instructions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-6 text-gray-500 text-xs space-y-1"
                >
                    <p className="font-semibold text-gray-400">How to Play with Friends:</p>
                    <p>1. One person creates a room and shares the Room ID</p>
                    <p>2. Friends join using the Room ID and pick their team</p>
                    <p>3. Host starts the auction when everyone is ready!</p>
                    <button
                        onClick={() => router.push("/rules")}
                        className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 bg-stadium-700/40 hover:bg-stadium-600/50 border border-stadium-500/30 text-gray-300 rounded-full text-xs font-medium transition-all hover:text-white"
                    >
                        📜 Rules & Regulations
                    </button>
                </motion.div>
            </motion.div>
        </main>
    );
}
