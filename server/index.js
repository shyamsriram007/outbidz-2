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
    // currentBid is in lakhs
    if (currentBid < 100) return 5;       // ₹20L – ₹1Cr: increments of ₹5L
    if (currentBid < 500) return 25;      // ₹1Cr – ₹5Cr: increments of ₹25L
    if (currentBid < 1000) return 50;     // ₹5Cr – ₹10Cr: increments of ₹50L
    if (currentBid < 1500) return 75;     // ₹10Cr – ₹15Cr: increments of ₹75L
    return 100;                            // Above ₹15Cr: increments of ₹1Cr
}

function createRoom(roomName, numTeams, initialPurse, hostId, hostName, hostTeamId) {
    const roomId = generateRoomId();
    const room = {
        id: roomId,
        name: roomName,
        numTeams,
        initialPurse: initialPurse * 100, // Convert Cr to Lakhs
        hostId,
        status: "waiting", // waiting, active, trading, finished
        players: getShuffledPlayers(), // Fresh randomized players for each room
        currentPlayerIndex: 0,
        currentBid: 0,
        currentHolderId: null,
        currentHolderTeamId: null,
        timerSeconds: 25,
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
        tradeHistory: room.tradeHistory || [],
        playingXII: room.playingXII ? Object.fromEntries(room.playingXII) : {},
        submittedTeams: room.submittedTeams ? Array.from(room.submittedTeams) : [],
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
    room.timerSeconds = 25;
    room.recentBids = [];
    room.bidWithdrawals = new Set();

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
        // Auction fully complete - move to trading
        room.status = "trading";
        room.tradeHistory = [];
        const teamRatings = calculateTeamRatings(room);
        io.to(roomId).emit("trade-window-started", {
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
    room.timerSeconds = 25;
    room.recentBids = [];
    room.bidWithdrawals = new Set();

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
        room.timerSeconds = 25;
        room.recentBids = [];
        room.bidWithdrawals = new Set();

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
    if (team.squad.length >= 18) {
        return { success: false, error: "Squad full (max 18)" };
    }

    const currentPlayer = room.players[room.currentPlayerIndex];
    if (currentPlayer.countryCode !== "IN" && team.overseasCount >= 8) {
        return { success: false, error: "Overseas limit reached" };
    }

    // Place the bid
    room.currentBid = nextBid;
    room.currentHolderId = oderId;
    room.currentHolderTeamId = teamId;
    room.timerSeconds = 20; // Reset timer on bid

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

    // Rejoin room after disconnect/reload
    socket.on("rejoin-room", ({ roomId, oderId }, callback) => {
        if (!roomId || !oderId) {
            return callback({ success: false, error: "Missing roomId or oderId" });
        }

        const room = rooms.get(roomId);
        if (!room) {
            return callback({ success: false, error: "Room no longer exists" });
        }

        const user = room.users.get(oderId);
        if (!user) {
            return callback({ success: false, error: "User not found in room" });
        }

        // Re-associate new socket with existing user
        user.socketId = socket.id;
        user.isConnected = true;

        socket.join(roomId);
        socket.data = { oderId, roomId, teamId: user.teamId };

        // Notify others
        io.to(roomId).emit("user-reconnected", {
            oderId,
            userName: user.name,
            teamId: user.teamId,
            roomState: getRoomState(roomId),
        });

        console.log(`${user.name} (${user.teamId}) reconnected to room ${roomId}`);
        callback({ success: true, roomState: getRoomState(roomId) });
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

    // Withdraw bid (once per player per team)
    socket.on("withdraw-bid", (callback) => {
        const { oderId, roomId, teamId } = socket.data || {};
        if (!oderId || !roomId || !teamId) {
            return callback({ success: false, error: "Not in a room" });
        }

        const room = rooms.get(roomId);
        if (!room) return callback({ success: false, error: "Room not found" });
        if (room.status !== "active") return callback({ success: false, error: "Auction not active" });

        // Check if this team is the current highest bidder
        if (room.currentHolderTeamId !== teamId) {
            return callback({ success: false, error: "You are not the current highest bidder" });
        }

        // Check if this team has already withdrawn on this player
        if (!room.bidWithdrawals) room.bidWithdrawals = new Set();
        if (room.bidWithdrawals.has(teamId)) {
            return callback({ success: false, error: "You can only withdraw once per player" });
        }

        // Mark as withdrawn
        room.bidWithdrawals.add(teamId);

        // Revert to previous bid or base price
        const previousBids = room.recentBids.filter(b => b.teamId !== teamId);
        if (previousBids.length > 0) {
            // Revert to previous highest bid
            const prevBid = previousBids[0];
            room.currentBid = prevBid.amount;
            room.currentHolderId = prevBid.oderId;
            room.currentHolderTeamId = prevBid.teamId;
        } else {
            // No previous bids - revert to base price with no holder
            const currentPlayer = room.players[room.currentPlayerIndex];
            room.currentBid = currentPlayer.basePrice;
            room.currentHolderId = null;
            room.currentHolderTeamId = null;
        }

        // Remove this team's bids from recent bids
        room.recentBids = room.recentBids.filter(b => b.teamId !== teamId);

        // Reset timer
        room.timerSeconds = 20;

        // Broadcast withdrawal
        io.to(roomId).emit("bid-withdrawn", {
            withdrawnByTeamId: teamId,
            newBid: room.currentBid,
            newHolderTeamId: room.currentHolderTeamId,
            newHolderId: room.currentHolderId,
            timerSeconds: room.timerSeconds,
            recentBids: room.recentBids.slice(0, 5),
        });

        callback({ success: true });
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

    // ============================================================================
    // TRADE SOCKET EVENTS
    // ============================================================================

    // Propose a trade: Team A offers N players for M of Team B's players
    socket.on("propose-trade", ({ targetTeamId, offeredPlayerNames, requestedPlayerNames }, callback) => {
        const { oderId, roomId, teamId } = socket.data || {};
        if (!oderId || !roomId) return callback({ success: false, error: "Not in a room" });

        const room = rooms.get(roomId);
        if (!room) return callback({ success: false, error: "Room not found" });
        if (room.status !== "trading") return callback({ success: false, error: "Not in trade window" });
        if (teamId === targetTeamId) return callback({ success: false, error: "Cannot trade with yourself" });

        // Support both old single-player format and new array format
        const offered = Array.isArray(offeredPlayerNames) ? offeredPlayerNames : [offeredPlayerNames];
        const requested = Array.isArray(requestedPlayerNames) ? requestedPlayerNames : [requestedPlayerNames];

        if (offered.length === 0 || requested.length === 0) return callback({ success: false, error: "Must offer and request at least one player" });

        const myTeam = room.teams.get(teamId);
        const targetTeam = room.teams.get(targetTeamId);
        if (!myTeam || !targetTeam) return callback({ success: false, error: "Team not found" });

        // Validate all offered players exist on my team
        const offeredEntries = [];
        for (const name of offered) {
            const entry = myTeam.squad.find(s => s.player.name === name);
            if (!entry) return callback({ success: false, error: `You don't own ${name}` });
            offeredEntries.push(entry);
        }

        // Validate all requested players exist on target team
        const requestedEntries = [];
        for (const name of requested) {
            const entry = targetTeam.squad.find(s => s.player.name === name);
            if (!entry) return callback({ success: false, error: `Target team doesn't own ${name}` });
            requestedEntries.push(entry);
        }

        const proposal = {
            id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            fromTeamId: teamId,
            toTeamId: targetTeamId,
            offeredPlayers: offeredEntries.map(e => ({ player: e.player, price: e.price })),
            requestedPlayers: requestedEntries.map(e => ({ player: e.player, price: e.price })),
            status: "pending",
            timestamp: Date.now(),
        };

        if (!room.pendingTrades) room.pendingTrades = [];
        room.pendingTrades.push(proposal);

        io.to(roomId).emit("trade-proposed", { proposal, roomState: getRoomState(roomId) });
        callback({ success: true, proposalId: proposal.id });
    });

    // Respond to a trade proposal (accept/reject)
    socket.on("respond-trade", ({ proposalId, accept }, callback) => {
        const { oderId, roomId, teamId } = socket.data || {};
        if (!oderId || !roomId) return callback({ success: false, error: "Not in a room" });

        const room = rooms.get(roomId);
        if (!room) return callback({ success: false, error: "Room not found" });
        if (room.status !== "trading") return callback({ success: false, error: "Not in trade window" });

        const proposal = (room.pendingTrades || []).find(t => t.id === proposalId);
        if (!proposal) return callback({ success: false, error: "Proposal not found" });
        if (proposal.status !== "pending") return callback({ success: false, error: "Proposal already resolved" });
        if (proposal.toTeamId !== teamId) return callback({ success: false, error: "Not your proposal to respond to" });

        if (!accept) {
            proposal.status = "rejected";
            io.to(roomId).emit("trade-resolved", { proposal, roomState: getRoomState(roomId) });
            return callback({ success: true });
        }

        // Accept — swap all players
        const fromTeam = room.teams.get(proposal.fromTeamId);
        const toTeam = room.teams.get(proposal.toTeamId);
        if (!fromTeam || !toTeam) return callback({ success: false, error: "Team not found" });

        // Verify all players still on their teams
        for (const entry of proposal.offeredPlayers) {
            if (!fromTeam.squad.find(s => s.player.name === entry.player.name)) {
                return callback({ success: false, error: `${entry.player.name} no longer on team` });
            }
        }
        for (const entry of proposal.requestedPlayers) {
            if (!toTeam.squad.find(s => s.player.name === entry.player.name)) {
                return callback({ success: false, error: `${entry.player.name} no longer on team` });
            }
        }

        // Remove offered players from sender, add to receiver
        for (const entry of proposal.offeredPlayers) {
            const idx = fromTeam.squad.findIndex(s => s.player.name === entry.player.name);
            const removed = fromTeam.squad.splice(idx, 1)[0];
            toTeam.squad.push(removed);
        }

        // Remove requested players from receiver, add to sender
        for (const entry of proposal.requestedPlayers) {
            const idx = toTeam.squad.findIndex(s => s.player.name === entry.player.name);
            const removed = toTeam.squad.splice(idx, 1)[0];
            fromTeam.squad.push(removed);
        }

        // Update overseas counts
        fromTeam.overseasCount = fromTeam.squad.filter(s => s.player.countryCode !== "IN").length;
        toTeam.overseasCount = toTeam.squad.filter(s => s.player.countryCode !== "IN").length;

        proposal.status = "accepted";
        if (!room.tradeHistory) room.tradeHistory = [];
        room.tradeHistory.push(proposal);

        io.to(roomId).emit("trade-resolved", { proposal, roomState: getRoomState(roomId) });
        callback({ success: true });
    });

    // ============================================================================
    // PLAYING XII SELECTION SOCKET EVENTS
    // ============================================================================

    // Submit Playing XII selection
    socket.on("submit-playing-12", ({ playerNames }, callback) => {
        const { oderId, roomId, teamId } = socket.data || {};
        if (!oderId || !roomId || !teamId) return callback({ success: false, error: "Not in a room" });

        const room = rooms.get(roomId);
        if (!room) return callback({ success: false, error: "Room not found" });
        if (room.status !== "squad-selection") return callback({ success: false, error: "Not in squad selection phase" });

        // Validate exactly 12 players
        if (!Array.isArray(playerNames) || playerNames.length !== 12) {
            return callback({ success: false, error: "Must select exactly 12 players" });
        }

        const team = room.teams.get(teamId);
        if (!team) return callback({ success: false, error: "Team not found" });

        // Validate all players belong to the team
        const squadNames = team.squad.map(s => s.player.name);
        for (const name of playerNames) {
            if (!squadNames.includes(name)) {
                return callback({ success: false, error: `${name} is not in your squad` });
            }
        }

        // Store the Playing XII
        if (!room.playingXII) room.playingXII = new Map();
        if (!room.submittedTeams) room.submittedTeams = new Set();

        const playingXIIEntries = playerNames.map(name => {
            return team.squad.find(s => s.player.name === name);
        });

        room.playingXII.set(teamId, playingXIIEntries);
        room.submittedTeams.add(teamId);

        // Notify all clients
        io.to(roomId).emit("playing-12-submitted", {
            teamId,
            submittedTeams: Array.from(room.submittedTeams),
        });

        callback({ success: true });

        // Check if all teams have submitted
        if (room.submittedTeams.size >= room.teams.size) {
            // Auto-finalize
            room.status = "finished";
            const teamRatings = calculateTeamRatingsWithPlayingXII(room);
            io.to(roomId).emit("auction-complete", {
                teams: getRoomState(roomId).teams,
                teamRatings
            });
        }
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
                    } else if (room.status === "active" || room.status === "trading") {
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

    // Sort: non-disqualified first by rating desc, then disqualified at the bottom
    teamRatings.sort((a, b) => {
        if (a.disqualified && !b.disqualified) return 1;
        if (!a.disqualified && b.disqualified) return -1;
        return b.overallRating - a.overallRating;
    });

    return teamRatings;
}

function calculateTeamRatingsWithPlayingXII(room) {
    const teamRatings = [];

    for (const [teamId, team] of room.teams) {
        // Use Playing XII if submitted, otherwise DQ the team
        const playingXII = room.playingXII ? room.playingXII.get(teamId) : null;

        if (playingXII && playingXII.length === 12) {
            const rating = calculateSingleTeamRating(playingXII, team.purse, room.initialPurse);
            teamRatings.push({
                teamId,
                ...rating,
                playingXII: playingXII.map(e => ({ player: e.player, price: e.price })),
            });
        } else {
            // Team didn't submit - DQ
            let batsmen = 0, bowlers = 0, allRounders = 0, wicketKeepers = 0;
            let overseas = 0, marqueeCount = 0, totalSpent = 0;
            team.squad.forEach(item => {
                totalSpent += item.price;
                if (item.player.role === "batsman") batsmen++;
                else if (item.player.role === "bowler") bowlers++;
                else if (item.player.role === "all-rounder") allRounders++;
                else if (item.player.role === "wicket-keeper") wicketKeepers++;
                if (item.player.countryCode !== "IN") overseas++;
                if (item.player.category === "marquee") marqueeCount++;
            });
            teamRatings.push({
                teamId,
                overallRating: 0,
                disqualified: true,
                disqualifyReason: "Playing XII not submitted",
                metrics: { squadStrength: 0, balance: 0, starPower: 0, depthScore: 0, valueEfficiency: 0, overseasQuality: 0 },
                breakdown: {
                    batsmen, bowlers, allRounders, wicketKeepers, overseas,
                    marquee: marqueeCount, totalSpent,
                    avgPlayerPrice: team.squad.length > 0 ? Math.round(totalSpent / team.squad.length) : 0
                },
                playingXII: [],
            });
        }
    }

    // Sort: non-disqualified first by rating desc, then disqualified at the bottom
    teamRatings.sort((a, b) => {
        if (a.disqualified && !b.disqualified) return 1;
        if (!a.disqualified && b.disqualified) return -1;
        return b.overallRating - a.overallRating;
    });

    return teamRatings;
}

function calculateSingleTeamRating(squad, remainingPurse, initialPurse) {
    // Disqualified: fewer than 18 players
    if (squad.length < 12) {
        // Still calculate breakdown for display, but mark as disqualified
        let batsmen = 0, bowlers = 0, allRounders = 0, wicketKeepers = 0;
        let overseas = 0, marqueeCount = 0, totalSpent = 0;
        squad.forEach(item => {
            totalSpent += item.price;
            if (item.player.role === "batsman") batsmen++;
            else if (item.player.role === "bowler") bowlers++;
            else if (item.player.role === "all-rounder") allRounders++;
            else if (item.player.role === "wicket-keeper") wicketKeepers++;
            if (item.player.countryCode !== "IN") overseas++;
            if (item.player.category === "marquee") marqueeCount++;
        });
        return {
            overallRating: 0,
            disqualified: true,
            disqualifyReason: `Only ${squad.length} players (minimum 12 required)`,
            metrics: { squadStrength: 0, balance: 0, starPower: 0, depthScore: 0, valueEfficiency: 0, overseasQuality: 0 },
            breakdown: {
                batsmen, bowlers, allRounders, wicketKeepers, overseas,
                marquee: marqueeCount, totalSpent,
                avgPlayerPrice: squad.length > 0 ? Math.round(totalSpent / squad.length) : 0
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
    const sizeScore = Math.min(squadSize / 12, 1) * 6; // 12 is ideal playing XII
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
        disqualified: false,
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

    if (room.auctionRound === 1) {
        // Add all remaining unannounced players to unsold pool
        for (let i = room.currentPlayerIndex; i < room.players.length; i++) {
            room.unsoldPlayers.push(room.players[i]);
        }

        if (room.unsoldPlayers.length > 0) {
            // End round 1, move to round 2 with all unsold + unannounced players
            startRound2(req.params.roomId);
            res.json({
                success: true,
                message: "Round 1 ended - starting Round 2 with unsold players",
                round: 2,
                unsoldCount: room.unsoldPlayers.length,
            });
        } else {
            room.status = "trading";
            room.tradeHistory = [];
            const teamRatings = calculateTeamRatings(room);
            io.to(req.params.roomId).emit("trade-window-started", {
                teams: getRoomState(req.params.roomId).teams,
                teamRatings
            });
            res.json({
                success: true,
                message: "Auction ended - trade window open",
                teamRatings
            });
        }
    } else {
        room.status = "trading";
        room.tradeHistory = [];
        const teamRatings = calculateTeamRatings(room);
        io.to(req.params.roomId).emit("trade-window-started", {
            teams: getRoomState(req.params.roomId).teams,
            teamRatings
        });
        res.json({
            success: true,
            message: "Auction ended - trade window open",
            teamRatings
        });
    }
});

// Skip current category/set (host only)
app.post("/api/room/:roomId/skip-category", (req, res) => {
    const room = rooms.get(req.params.roomId);
    if (!room) {
        return res.status(404).json({ error: "Room not found" });
    }

    if (room.status !== "active") {
        return res.status(400).json({ error: "Auction is not active" });
    }

    // Stop current timer
    if (room.timerInterval) {
        clearInterval(room.timerInterval);
        room.timerInterval = null;
    }

    const currentPlayer = room.players[room.currentPlayerIndex];
    const currentCategory = currentPlayer?.category;

    if (!currentCategory) {
        return res.status(400).json({ error: "No current category" });
    }

    // Collect remaining players in this category as unsold (round 1 only)
    let skippedCount = 0;
    while (room.currentPlayerIndex < room.players.length &&
        room.players[room.currentPlayerIndex].category === currentCategory) {
        if (room.auctionRound === 1) {
            room.unsoldPlayers.push(room.players[room.currentPlayerIndex]);
        }
        room.currentPlayerIndex++;
        skippedCount++;
    }

    // Emit category skipped event
    io.to(req.params.roomId).emit("category-skipped", {
        skippedCategory: currentCategory,
        skippedCount,
    });

    // Check if auction is over
    if (room.currentPlayerIndex >= room.players.length) {
        if (room.auctionRound === 1 && room.unsoldPlayers.length > 0) {
            startRound2(req.params.roomId);
            return res.json({ success: true, message: `Skipped ${skippedCount} ${currentCategory} players. Moving to Round 2.` });
        }
        room.status = "trading";
        room.tradeHistory = [];
        const teamRatings = calculateTeamRatings(room);
        io.to(req.params.roomId).emit("trade-window-started", {
            teams: getRoomState(req.params.roomId).teams,
            teamRatings
        });
        return res.json({ success: true, message: `Skipped ${skippedCount} players. Trade window open.` });
    }

    // Move to next category
    const nextPlayer = room.players[room.currentPlayerIndex];
    shuffleRemainingPlayersInCategory(room, nextPlayer.category, room.currentPlayerIndex);
    const actualNextPlayer = room.players[room.currentPlayerIndex];

    room.currentBid = actualNextPlayer.basePrice;
    room.currentHolderId = null;
    room.currentHolderTeamId = null;
    room.timerSeconds = 15;
    room.recentBids = [];

    io.to(req.params.roomId).emit("category-change", {
        previousCategory: currentCategory,
        newCategory: actualNextPlayer.category
    });

    io.to(req.params.roomId).emit("next-player", {
        player: actualNextPlayer,
        playerIndex: room.currentPlayerIndex,
        totalPlayers: room.players.length,
    });

    startTimer(req.params.roomId);

    res.json({
        success: true,
        message: `Skipped ${skippedCount} ${currentCategory} players. Now in ${actualNextPlayer.category} set.`,
        newCategory: actualNextPlayer.category,
    });
});
// Get remaining players grouped by category
app.get("/api/room/:roomId/remaining-players", (req, res) => {
    const room = rooms.get(req.params.roomId);
    if (!room) {
        return res.status(404).json({ error: "Room not found" });
    }

    if (room.status !== "active") {
        return res.status(400).json({ error: "Auction not active" });
    }

    // Get remaining players (from current index + 1 onward, since current is already being auctioned)
    const remaining = room.players.slice(room.currentPlayerIndex + 1);

    // Group by category in order of appearance
    const groups = [];
    let currentCategory = null;
    let currentGroup = null;

    for (const player of remaining) {
        if (player.category !== currentCategory) {
            currentCategory = player.category;
            currentGroup = {
                category: currentCategory,
                players: [],
            };
            groups.push(currentGroup);
        }
        currentGroup.players.push({
            name: player.name,
            role: player.role,
            basePrice: player.basePrice,
            countryCode: player.countryCode,
        });
    }

    res.json({
        success: true,
        currentCategory: room.players[room.currentPlayerIndex]?.category,
        groups,
    });
});

// End trading window (host only) - move to squad selection phase
app.post("/api/room/:roomId/end-trading", (req, res) => {
    const room = rooms.get(req.params.roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });
    if (room.status !== "trading") return res.status(400).json({ error: "Not in trade window" });

    room.status = "squad-selection";
    // Cancel any pending trades
    if (room.pendingTrades) {
        room.pendingTrades.forEach(t => { if (t.status === "pending") t.status = "cancelled"; });
    }

    // Initialize playing XII storage
    room.playingXII = new Map();
    room.submittedTeams = new Set();

    io.to(req.params.roomId).emit("squad-selection-started", {
        roomState: getRoomState(req.params.roomId)
    });
    res.json({ success: true, message: "Squad selection phase started" });
});

// Finalize results (host only) - end squad selection and go to results
app.post("/api/room/:roomId/finalize-results", (req, res) => {
    const room = rooms.get(req.params.roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });
    if (room.status !== "squad-selection") return res.status(400).json({ error: "Not in squad selection phase" });

    room.status = "finished";

    // Calculate ratings using Playing XII where available, full squad otherwise (DQ)
    const teamRatings = calculateTeamRatingsWithPlayingXII(room);
    io.to(req.params.roomId).emit("auction-complete", {
        teams: getRoomState(req.params.roomId).teams,
        teamRatings
    });
    res.json({ success: true, message: "Results finalized", teamRatings });
});

// Get team ratings for a room
app.get("/api/room/:roomId/ratings", (req, res) => {
    const room = rooms.get(req.params.roomId);
    if (!room) {
        return res.status(404).json({ error: "Room not found" });
    }

    const teamRatings = (room.playingXII && room.playingXII.size > 0)
        ? calculateTeamRatingsWithPlayingXII(room)
        : calculateTeamRatings(room);
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
