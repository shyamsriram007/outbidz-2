const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { getShuffledPlayers } = require("./players");

const app = express();

// CORS: allow localhost for dev and production Vercel URL
const allowedOrigins = [
    "http://localhost:3000",
    process.env.CLIENT_URL, // Set this on Render to your Vercel URL
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
    },
});

// ============================================================================
// DATA STRUCTURES
// ============================================================================

// Players loaded dynamically via getShuffledPlayers() for each room
console.log("Player data loaded - fresh randomization on each room creation");

// Active rooms storage
const rooms = new Map();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getBidIncrement(currentBid) {
    if (currentBid < 100) return 5;
    if (currentBid < 200) return 10;
    if (currentBid < 500) return 20;
    return 25;
}

function createRoom(roomName, numTeams, initialPurse, hostId, hostName, hostTeamId) {
    const roomId = generateRoomId();
    const room = {
        id: roomId,
        name: roomName,
        numTeams,
        initialPurse: initialPurse * 100, // Convert Cr to Lakhs
        hostId,
        status: "waiting", // waiting, active, finished
        players: getShuffledPlayers(), // Fresh randomized players for each room
        currentPlayerIndex: 0,
        currentBid: 0,
        currentHolderId: null,
        currentHolderTeamId: null,
        timerSeconds: 15,
        timerInterval: null,
        recentBids: [],
        auctionRound: 1,
        unsoldPlayers: [],
        teams: new Map(),
        users: new Map(),
    };

    // Add host as first user
    room.users.set(hostId, {
        id: hostId,
        name: hostName,
        teamId: hostTeamId,
        isReady: true, // Host is always ready
        isHost: true,
        socketId: null,
    });

    room.teams.set(hostTeamId, {
        id: hostTeamId,
        ownerId: hostId,
        purse: room.initialPurse,
        squad: [],
        overseasCount: 0,
    });

    rooms.set(roomId, room);
    return roomId;
}

function joinRoom(roomId, oderId, userName, teamId) {
    const room = rooms.get(roomId);
    if (!room) return { success: false, error: "Room not found" };
    if (room.status !== "waiting") return { success: false, error: "Auction already started" };
    if (room.users.size >= room.numTeams) return { success: false, error: "Room is full" };

    // Check if team is already taken
    for (const user of room.users.values()) {
        if (user.teamId === teamId) {
            return { success: false, error: "Team already taken" };
        }
    }

    room.users.set(oderId, {
        id: oderId,
        name: userName,
        teamId,
        isReady: false,
        isHost: false,
        socketId: null,
    });

    room.teams.set(teamId, {
        id: teamId,
        ownerId: oderId,
        purse: room.initialPurse,
        squad: [],
        overseasCount: 0,
    });

    return { success: true };
}

function getRoomState(roomId) {
    const room = rooms.get(roomId);
    if (!room) return null;

    return {
        id: room.id,
        name: room.name,
        numTeams: room.numTeams,
        status: room.status,
        hostId: room.hostId,
        currentPlayer: room.players[room.currentPlayerIndex] || null,
        currentPlayerIndex: room.currentPlayerIndex,
        totalPlayers: room.players.length,
        currentBid: room.currentBid,
        currentHolderId: room.currentHolderId,
        currentHolderTeamId: room.currentHolderTeamId,
        timerSeconds: room.timerSeconds,
        recentBids: room.recentBids.slice(0, 5),
        auctionRound: room.auctionRound || 1,
        unsoldCount: (room.unsoldPlayers || []).length,
        users: Array.from(room.users.values()),
        teams: Array.from(room.teams.entries()).map(([id, team]) => ({
            id,
            ownerId: team.ownerId,
            purse: team.purse,
            squadSize: team.squad.length,
            overseasCount: team.overseasCount,
            squad: team.squad,
        })),
    };
}

function startAuction(roomId) {
    const room = rooms.get(roomId);
    if (!room) return false;

    room.status = "active";
    room.currentPlayerIndex = 0;
    room.currentBid = room.players[0].basePrice;
    room.currentHolderId = null;
    room.currentHolderTeamId = null;
    room.timerSeconds = 15;
    room.recentBids = [];

    startTimer(roomId);
    return true;
}

function startTimer(roomId) {
    const room = rooms.get(roomId);
    if (!room || room.timerInterval) return;

    room.timerInterval = setInterval(() => {
        room.timerSeconds--;

        io.to(roomId).emit("timer-update", { seconds: room.timerSeconds });

        if (room.timerSeconds <= 0) {
            clearInterval(room.timerInterval);
            room.timerInterval = null;
            handleTimerEnd(roomId);
        }
    }, 1000);
}

function stopTimer(roomId) {
    const room = rooms.get(roomId);
    if (!room || !room.timerInterval) return;

    clearInterval(room.timerInterval);
    room.timerInterval = null;
}

function handleTimerEnd(roomId) {
    const room = rooms.get(roomId);
    if (!room) return;

    const currentPlayer = room.players[room.currentPlayerIndex];

    if (room.currentHolderTeamId) {
        // Player sold - deduct from purse
        const team = room.teams.get(room.currentHolderTeamId);
        if (team) {
            team.purse -= room.currentBid;
            team.squad.push({ player: currentPlayer, price: room.currentBid });
            if (currentPlayer.countryCode !== "IN") {
                team.overseasCount++;
            }
        }

        io.to(roomId).emit("player-sold", {
            player: currentPlayer,
            teamId: room.currentHolderTeamId,
            price: room.currentBid,
            updatedTeams: getRoomState(roomId).teams,
        });
    } else {
        // Player unsold - track for round 2
        if (room.auctionRound === 1) {
            room.unsoldPlayers.push(currentPlayer);
        }
        io.to(roomId).emit("player-unsold", { player: currentPlayer });
    }

    // Move to next player after delay
    setTimeout(() => {
        moveToNextPlayer(roomId);
    }, 3500);
}

function moveToNextPlayer(roomId) {
    const room = rooms.get(roomId);
    if (!room) return;

    const currentPlayer = room.players[room.currentPlayerIndex];
    const currentCategory = currentPlayer?.category;

    room.currentPlayerIndex++;

    if (room.currentPlayerIndex >= room.players.length) {
        if (room.auctionRound === 1 && room.unsoldPlayers.length > 0) {
            // Round 1 complete - start Round 2 with unsold players
            startRound2(roomId);
            return;
        }
        // Auction fully complete
        room.status = "finished";
        const teamRatings = calculateTeamRatings(room);
        io.to(roomId).emit("auction-complete", {
            teams: getRoomState(roomId).teams,
            teamRatings
        });
        return;
    }

    const nextPlayer = room.players[room.currentPlayerIndex];

    // Check if we're transitioning to a new category (new round)
    if (currentCategory && nextPlayer.category !== currentCategory) {
        // Shuffle remaining players in the new category
        shuffleRemainingPlayersInCategory(room, nextPlayer.category, room.currentPlayerIndex);

        // Emit category change event
        io.to(roomId).emit("category-change", {
            previousCategory: currentCategory,
            newCategory: nextPlayer.category
        });
    }

    // Get the (possibly shuffled) next player
    const actualNextPlayer = room.players[room.currentPlayerIndex];

    room.currentBid = actualNextPlayer.basePrice;
    room.currentHolderId = null;
    room.currentHolderTeamId = null;
    room.timerSeconds = 15;
    room.recentBids = [];

    io.to(roomId).emit("next-player", {
        player: actualNextPlayer,
        playerIndex: room.currentPlayerIndex,
        totalPlayers: room.players.length,
    });

    startTimer(roomId);
}

function startRound2(roomId) {
    const room = rooms.get(roomId);
    if (!room) return;

    // Emit round 1 complete
    io.to(roomId).emit("round-complete", {
        round: 1,
        unsoldCount: room.unsoldPlayers.length,
        message: `Round 1 complete! ${room.unsoldPlayers.length} unsold player${room.unsoldPlayers.length === 1 ? '' : 's'} entering Round 2.`
    });

    // Set up round 2 with unsold players
    setTimeout(() => {
        room.auctionRound = 2;
        room.players = room.unsoldPlayers;
        room.unsoldPlayers = [];
        room.currentPlayerIndex = 0;
        room.currentBid = room.players[0].basePrice;
        room.currentHolderId = null;
        room.currentHolderTeamId = null;
        room.timerSeconds = 15;
        room.recentBids = [];

        io.to(roomId).emit("round-started", {
            round: 2,
            totalPlayers: room.players.length,
            player: room.players[0],
        });

        startTimer(roomId);
    }, 4000);
}

// Helper function to shuffle remaining players in a category
function shuffleRemainingPlayersInCategory(room, category, startIndex) {
    // Find all players from startIndex with the same category
    const categoryEndIndex = room.players.findIndex(
        (p, i) => i >= startIndex && p.category !== category
    );
    const endIndex = categoryEndIndex === -1 ? room.players.length : categoryEndIndex;

    // Extract the category slice
    const categoryPlayers = room.players.slice(startIndex, endIndex);

    // Shuffle this slice
    for (let i = categoryPlayers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [categoryPlayers[i], categoryPlayers[j]] = [categoryPlayers[j], categoryPlayers[i]];
    }

    // Put shuffled players back
    for (let i = 0; i < categoryPlayers.length; i++) {
        room.players[startIndex + i] = categoryPlayers[i];
    }
}

function placeBid(roomId, oderId, teamId) {
    const room = rooms.get(roomId);
    if (!room || room.status !== "active") return { success: false, error: "Auction not active" };

    const team = room.teams.get(teamId);
    if (!team) return { success: false, error: "Team not found" };

    // Can't bid if already holding
    if (room.currentHolderTeamId === teamId) {
        return { success: false, error: "You already hold the bid" };
    }

    // Calculate next bid - first bid is at base price, subsequent bids add increment
    let nextBid;
    if (room.currentHolderId === null) {
        // First bid - bid at base price
        nextBid = room.currentBid;
    } else {
        // Subsequent bids - add increment
        const increment = getBidIncrement(room.currentBid);
        nextBid = room.currentBid + increment;
    }

    // Validate budget
    if (team.purse < nextBid) {
        return { success: false, error: "Insufficient budget" };
    }

    // Validate squad limits
    if (team.squad.length >= 25) {
        return { success: false, error: "Squad full" };
    }

    const currentPlayer = room.players[room.currentPlayerIndex];
    if (currentPlayer.countryCode !== "IN" && team.overseasCount >= 8) {
        return { success: false, error: "Overseas limit reached" };
    }

    // Place the bid
    room.currentBid = nextBid;
    room.currentHolderId = oderId;
    room.currentHolderTeamId = teamId;
    room.timerSeconds = 10; // Reset timer

    // Add to recent bids
    room.recentBids.unshift({
        id: `bid-${Date.now()}`,
        teamId,
        oderId,
        amount: nextBid,
        timestamp: Date.now(),
    });

    // Broadcast bid to all users
    io.to(roomId).emit("bid-placed", {
        oderId,
        teamId,
        amount: nextBid,
        timerSeconds: room.timerSeconds,
    });

    return { success: true, newBid: nextBid };
}

// ============================================================================
// SOCKET EVENT HANDLERS
// ============================================================================

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Create a new room
    socket.on("create-room", ({ roomName, numTeams, initialPurse, userName, teamId }, callback) => {
        const oderId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const roomId = createRoom(roomName, numTeams, initialPurse, oderId, userName, teamId);

        // Update socket id for user
        const room = rooms.get(roomId);
        const user = room.users.get(oderId);
        user.socketId = socket.id;

        socket.join(roomId);
        socket.data = { oderId, roomId, teamId };

        console.log(`Room ${roomId} created by ${userName} (${teamId})`);
        callback({ success: true, roomId, oderId, roomState: getRoomState(roomId) });
    });

    // Join existing room
    socket.on("join-room", ({ roomId, userName, teamId }, callback) => {
        const oderId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const result = joinRoom(roomId, oderId, userName, teamId);

        if (!result.success) {
            callback(result);
            return;
        }

        // Update socket id for user
        const room = rooms.get(roomId);
        const user = room.users.get(oderId);
        user.socketId = socket.id;

        socket.join(roomId);
        socket.data = { oderId, roomId, teamId };

        // Notify others
        socket.to(roomId).emit("user-joined", { user: user, roomState: getRoomState(roomId) });

        console.log(`${userName} (${teamId}) joined room ${roomId}`);
        callback({ success: true, oderId, roomState: getRoomState(roomId) });
    });

    // Toggle ready status
    socket.on("toggle-ready", (callback) => {
        const { oderId, roomId } = socket.data || {};
        if (!oderId || !roomId) return callback({ success: false, error: "Not in a room" });

        const room = rooms.get(roomId);
        if (!room) return callback({ success: false, error: "Room not found" });

        const user = room.users.get(oderId);
        if (!user) return callback({ success: false, error: "User not found" });

        user.isReady = !user.isReady;

        io.to(roomId).emit("user-ready-changed", {
            oderId,
            isReady: user.isReady,
            roomState: getRoomState(roomId)
        });
        callback({ success: true, isReady: user.isReady });
    });

    // Start auction (host only)
    socket.on("start-auction", (callback) => {
        const { oderId, roomId } = socket.data || {};
        if (!oderId || !roomId) return callback({ success: false, error: "Not in a room" });

        const room = rooms.get(roomId);
        if (!room) return callback({ success: false, error: "Room not found" });
        if (room.hostId !== oderId) return callback({ success: false, error: "Not the host" });

        // Check all users ready (except host)
        for (const user of room.users.values()) {
            if (!user.isReady && !user.isHost) {
                return callback({ success: false, error: "Not all players are ready" });
            }
        }

        if (room.users.size < 2) {
            return callback({ success: false, error: "Need at least 2 players" });
        }

        startAuction(roomId);
        io.to(roomId).emit("auction-started", { roomState: getRoomState(roomId) });
        callback({ success: true });
    });

    // Place bid
    socket.on("place-bid", (callback) => {
        const { oderId, roomId, teamId } = socket.data || {};
        if (!oderId || !roomId || !teamId) {
            return callback({ success: false, error: "Not in a room" });
        }

        const result = placeBid(roomId, oderId, teamId);
        callback(result);
    });

    // Chat message
    socket.on("chat-message", ({ message }) => {
        const { oderId, roomId } = socket.data || {};
        if (!oderId || !roomId) return;

        const room = rooms.get(roomId);
        if (!room) return;

        const user = room.users.get(oderId);
        if (!user) return;

        io.to(roomId).emit("chat-message", {
            id: `msg-${Date.now()}`,
            username: user.name,
            teamId: user.teamId,
            message,
            timestamp: Date.now(),
        });
    });

    // Get room state
    socket.on("get-room-state", (callback) => {
        const { roomId } = socket.data || {};
        if (!roomId) return callback({ success: false, error: "Not in a room" });

        const roomState = getRoomState(roomId);
        callback({ success: true, roomState });
    });

    // Disconnect handling
    socket.on("disconnect", () => {
        const { oderId, roomId } = socket.data || {};
        console.log(`User disconnected: ${socket.id}`);

        if (oderId && roomId) {
            const room = rooms.get(roomId);
            if (room) {
                const user = room.users.get(oderId);
                if (user) {
                    io.to(roomId).emit("user-disconnected", {
                        oderId,
                        userName: user.name,
                        teamId: user.teamId
                    });

                    // If host leaves and auction hasn't started, close room
                    if (user.isHost && room.status === "waiting") {
                        io.to(roomId).emit("room-closed", { reason: "Host left the room" });
                        stopTimer(roomId);
                        rooms.delete(roomId);
                    } else if (room.status === "active") {
                        // Mark user as disconnected but keep their team
                        user.socketId = null;
                        user.isConnected = false;
                    }
                }
            }
        }
    });
});

// ============================================================================
// TEAM RATING ALGORITHM
// ============================================================================

function calculateTeamRatings(room) {
    const teamRatings = [];

    for (const [teamId, team] of room.teams) {
        const squad = team.squad;
        const rating = calculateSingleTeamRating(squad, team.purse, room.initialPurse);
        teamRatings.push({
            teamId,
            ...rating
        });
    }

    // Sort by overall rating descending
    teamRatings.sort((a, b) => b.overallRating - a.overallRating);

    return teamRatings;
}

function calculateSingleTeamRating(squad, remainingPurse, initialPurse) {
    if (squad.length === 0) {
        return {
            overallRating: 0,
            metrics: {
                squadStrength: 0,
                balance: 0,
                starPower: 0,
                depthScore: 0,
                valueEfficiency: 0,
                overseasQuality: 0
            },
            breakdown: {
                batsmen: 0,
                bowlers: 0,
                allRounders: 0,
                wicketKeepers: 0,
                overseas: 0,
                marquee: 0,
                totalSpent: 0,
                avgPlayerPrice: 0
            }
        };
    }

    // Count players by role and category
    let batsmen = 0, bowlers = 0, allRounders = 0, wicketKeepers = 0;
    let overseas = 0, marqueeCount = 0;
    let totalSpent = 0;
    let starPlayerCount = 0; // Players bought for 100L+

    squad.forEach(item => {
        const player = item.player;
        const price = item.price;
        totalSpent += price;

        // Count by role
        if (player.role === "batsman") batsmen++;
        else if (player.role === "bowler") bowlers++;
        else if (player.role === "all-rounder") allRounders++;
        else if (player.role === "wicket-keeper") wicketKeepers++;

        // Count overseas
        if (player.countryCode !== "IN") overseas++;

        // Count marquee/star players
        if (player.category === "marquee") marqueeCount++;
        if (price >= 100) starPlayerCount++;
    });

    const squadSize = squad.length;
    const avgPrice = totalSpent / squadSize;

    // ============= RATING METRICS (each out of 10) =============

    // 1. SQUAD STRENGTH (0-10): Based on total value and star players
    const spentRatio = totalSpent / initialPurse;
    const starBonus = Math.min(starPlayerCount * 0.5, 2); // Max 2 points from stars
    const squadStrength = Math.min(10, (spentRatio * 6) + starBonus + (marqueeCount * 0.3));

    // 2. BALANCE (0-10): Ideal team has mix of roles
    // Ideal: 4+ batsmen, 5+ bowlers, 2+ all-rounders, 2+ wicketkeepers
    const batsmenScore = Math.min(batsmen / 4, 1) * 2.5;
    const bowlerScore = Math.min(bowlers / 5, 1) * 2.5;
    const arScore = Math.min(allRounders / 2, 1) * 2.5;
    const wkScore = Math.min(wicketKeepers / 2, 1) * 2.5;
    const balance = batsmenScore + bowlerScore + arScore + wkScore;

    // 3. STAR POWER (0-10): Marquee and high-value players
    const marqueeRating = Math.min(marqueeCount * 2, 6);
    const expensivePlayerRating = Math.min(starPlayerCount * 0.8, 4);
    const starPower = marqueeRating + expensivePlayerRating;

    // 4. DEPTH SCORE (0-10): Squad size and backup options
    const sizeScore = Math.min(squadSize / 18, 1) * 6; // 18 is ideal squad
    const backupBatsmen = Math.max(0, batsmen - 4) * 0.5;
    const backupBowlers = Math.max(0, bowlers - 5) * 0.5;
    const depthScore = Math.min(10, sizeScore + backupBatsmen + backupBowlers);

    // 5. VALUE EFFICIENCY (0-10): Getting good players at good prices
    const purseUtilization = (totalSpent / initialPurse);
    const avgPriceScore = avgPrice > 50 ? Math.min((avgPrice - 30) / 70, 1) * 4 : (avgPrice / 50) * 2;
    const valueEfficiency = Math.min(10, (purseUtilization * 5) + avgPriceScore + (squadSize > 12 ? 1 : 0));

    // 6. OVERSEAS QUALITY (0-10): Quality of overseas picks
    const overseasRatio = overseas / Math.max(squadSize, 1);
    const overseasBalance = (overseas >= 3 && overseas <= 8) ? 4 : Math.max(0, 4 - Math.abs(overseas - 5));
    const overseasQuality = Math.min(10, overseasBalance + (overseas * 0.7));

    // ============= OVERALL RATING =============
    // Weighted average of all metrics
    const weights = {
        squadStrength: 0.25,
        balance: 0.20,
        starPower: 0.20,
        depthScore: 0.15,
        valueEfficiency: 0.10,
        overseasQuality: 0.10
    };

    const overallRating = (
        squadStrength * weights.squadStrength +
        balance * weights.balance +
        starPower * weights.starPower +
        depthScore * weights.depthScore +
        valueEfficiency * weights.valueEfficiency +
        overseasQuality * weights.overseasQuality
    );

    return {
        overallRating: Math.round(overallRating * 10) / 10,
        metrics: {
            squadStrength: Math.round(squadStrength * 10) / 10,
            balance: Math.round(balance * 10) / 10,
            starPower: Math.round(starPower * 10) / 10,
            depthScore: Math.round(depthScore * 10) / 10,
            valueEfficiency: Math.round(valueEfficiency * 10) / 10,
            overseasQuality: Math.round(overseasQuality * 10) / 10
        },
        breakdown: {
            batsmen,
            bowlers,
            allRounders,
            wicketKeepers,
            overseas,
            marquee: marqueeCount,
            totalSpent,
            avgPlayerPrice: Math.round(avgPrice)
        }
    };
}

// ============================================================================
// REST API ENDPOINTS
// ============================================================================

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", rooms: rooms.size });
});

app.get("/api/room/:roomId", (req, res) => {
    const roomState = getRoomState(req.params.roomId);
    if (!roomState) {
        return res.status(404).json({ error: "Room not found" });
    }
    res.json(roomState);
});

app.get("/api/room/:roomId/available-teams", (req, res) => {
    const room = rooms.get(req.params.roomId);
    if (!room) {
        return res.status(404).json({ error: "Room not found" });
    }

    const takenTeams = new Set();
    for (const user of room.users.values()) {
        takenTeams.add(user.teamId);
    }

    res.json({
        takenTeams: Array.from(takenTeams),
        spotsLeft: room.numTeams - room.users.size,
    });
});

// DEV TOOL: Force end auction
app.post("/api/room/:roomId/force-end", (req, res) => {
    const room = rooms.get(req.params.roomId);
    if (!room) {
        return res.status(404).json({ error: "Room not found" });
    }

    if (room.timerInterval) {
        clearInterval(room.timerInterval);
        room.timerInterval = null;
    }

    if (room.auctionRound === 1 && room.unsoldPlayers.length > 0) {
        // End round 1, move to round 2 with unsold players
        startRound2(req.params.roomId);
        res.json({
            success: true,
            message: "Round 1 ended - starting Round 2 with unsold players",
            round: 2,
            unsoldCount: room.unsoldPlayers.length,
        });
    } else {
        // End auction completely
        room.status = "finished";
        const teamRatings = calculateTeamRatings(room);
        io.to(req.params.roomId).emit("auction-complete", {
            teams: getRoomState(req.params.roomId).teams,
            teamRatings
        });
        res.json({
            success: true,
            message: "Auction ended",
            teamRatings
        });
    }
});

// Get team ratings for a room
app.get("/api/room/:roomId/ratings", (req, res) => {
    const room = rooms.get(req.params.roomId);
    if (!room) {
        return res.status(404).json({ error: "Room not found" });
    }

    const teamRatings = calculateTeamRatings(room);
    res.json({ teamRatings });
});

// Restart auction (host only)
app.post("/api/room/:roomId/restart", (req, res) => {
    const room = rooms.get(req.params.roomId);
    if (!room) {
        return res.status(404).json({ error: "Room not found" });
    }

    // Clear timer if running
    if (room.timerInterval) {
        clearInterval(room.timerInterval);
        room.timerInterval = null;
    }

    // Reset room state
    room.status = "waiting";
    room.players = getShuffledPlayers(); // Fresh shuffled players on restart
    room.currentPlayerIndex = 0;
    room.currentBid = 0;
    room.currentHolderId = null;
    room.currentHolderTeamId = null;
    room.timerSeconds = 15;
    room.recentBids = [];

    // Reset all team squads and purses
    for (const [teamId, team] of room.teams) {
        team.purse = room.initialPurse;
        team.squad = [];
        team.overseasCount = 0;
    }

    // Reset user ready states
    for (const [userId, user] of room.users) {
        user.isReady = user.isHost; // Host stays ready
    }

    // Notify all clients to return to lobby
    io.to(req.params.roomId).emit("auction-restart", {
        roomId: req.params.roomId
    });

    res.json({ success: true, message: "Auction restarted" });
});

// ============================================================================
// START SERVER
// ============================================================================

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║             OUTBIDZ 2.0 - MULTIPLAYER SERVER          ║
╠═══════════════════════════════════════════════════════╣
║  Server running on http://0.0.0.0:${PORT}               ║
║  WebSocket ready for connections                      ║
║                                                       ║
║  Local:   http://localhost:3000                       ║
║  Network: http://YOUR_IP:3000                         ║
╚═══════════════════════════════════════════════════════╝
  `);
});
