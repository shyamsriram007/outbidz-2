"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PLAYERS, Player } from '@/data/players';
import { RoomState, submitRetentions } from '@/lib/socket';

interface RetentionPhaseProps {
    roomState: RoomState;
    myTeamId: string;
}

export default function RetentionPhase({ roomState, myTeamId }: RetentionPhaseProps) {
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isSubmitted = roomState.retentionComplete?.includes(myTeamId);

    // Get 2026 squad
    const squad2026 = useMemo(() => {
        return PLAYERS.filter(p => p.team2026 === myTeamId);
    }, [myTeamId]);

    // Calculate slots and costs
    const retentionDetails = useMemo(() => {
        let cappedCount = 0;
        let uncappedCount = 0;
        let overseasCount = 0;
        let totalCost = 0;

        const details = selectedPlayers.map(pid => {
            const player = squad2026.find(p => p.id === pid)!;
            const isOverseas = player.countryCode !== "IN";
            let cost = 0;

            if (isOverseas) overseasCount++;

            if (!player.isCapped) {
                uncappedCount++;
                cost = 4; // 4 Cr
            } else {
                cappedCount++;
                if (cappedCount === 1) cost = 18;
                else if (cappedCount === 2) cost = 14;
                else if (cappedCount === 3) cost = 11;
                else if (cappedCount === 4) cost = 18;
                else if (cappedCount === 5) cost = 14;
            }

            totalCost += cost;

            return { player, cost, isOverseas, isCapped: player.isCapped };
        });

        return { details, cappedCount, uncappedCount, overseasCount, totalCost };
    }, [selectedPlayers, squad2026]);

    const handleTogglePlayer = (playerId: string) => {
        if (selectedPlayers.includes(playerId)) {
            setSelectedPlayers(prev => prev.filter(id => id !== playerId));
            setError(null);
            return;
        }

        if (selectedPlayers.length >= 6) {
            setError("Maximum 6 players can be retained.");
            return;
        }

        const player = squad2026.find(p => p.id === playerId)!;
        const isOverseas = player.countryCode !== "IN";

        // Check constraints
        if (isOverseas && retentionDetails.overseasCount >= 3) {
            setError("Maximum 3 overseas players can be retained.");
            return;
        }

        if (player.isCapped && retentionDetails.cappedCount >= 5) {
            setError("Maximum 5 capped players can be retained.");
            return;
        }

        if (!player.isCapped && retentionDetails.uncappedCount >= 2) {
            setError("Maximum 2 uncapped players can be retained.");
            return;
        }

        setError(null);
        setSelectedPlayers(prev => [...prev, playerId]);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        const payload = retentionDetails.details.map((d, index) => ({
            player: d.player,
            cost: d.cost,
            slot: index + 1
        }));

        submitRetentions(payload, (result) => {
            setIsSubmitting(false);
            if (!result.success) {
                setError(result.error || "Failed to submit retentions.");
            }
        });
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-surface border border-white/10 rounded-xl h-full">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-2xl font-bold mb-2">Retentions Submitted</h2>
                <p className="text-gray-400">Waiting for other teams to finalize their retentions...</p>
                <div className="mt-8 flex gap-4">
                    {roomState.users.map(u => (
                        <div key={u.id} className={\`w-3 h-3 rounded-full \${roomState.retentionComplete?.includes(u.teamId) ? 'bg-primary' : 'bg-gray-600 animate-pulse'}\`} title={u.name}></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[80vh]">
            {/* Left Column: Player Selection */}
            <div className="flex-1 bg-surface border border-white/10 rounded-xl p-6 flex flex-col h-full overflow-hidden">
                <h2 className="text-2xl font-bold mb-4 font-display">Select Retentions (2026 Squad)</h2>
                {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                
                <div className="overflow-y-auto pr-2 space-y-2 flex-1 custom-scrollbar">
                    {squad2026.map(player => {
                        const isSelected = selectedPlayers.includes(player.id);
                        const isOverseas = player.countryCode !== "IN";
                        return (
                            <div 
                                key={player.id}
                                onClick={() => handleTogglePlayer(player.id)}
                                className={\`p-4 rounded-lg border cursor-pointer transition-all flex justify-between items-center \${isSelected ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/10 hover:bg-white/10'}\`}
                            >
                                <div>
                                    <div className="font-bold flex items-center gap-2">
                                        {player.name}
                                        {isOverseas && <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">✈️ OS</span>}
                                        {!player.isCapped && <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">⭐ UC</span>}
                                    </div>
                                    <div className="text-sm text-gray-400 capitalize">{player.role}</div>
                                </div>
                                <div className={\`w-6 h-6 rounded-full border-2 flex items-center justify-center \${isSelected ? 'border-primary bg-primary' : 'border-gray-500'}\`}>
                                    {isSelected && <svg className="w-4 h-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Column: Summary & Confirmation */}
            <div className="w-full lg:w-96 flex flex-col gap-6">
                <div className="bg-surface border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 font-display text-primary">Summary</h3>
                    
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-gray-400">Total Retained</span>
                            <span className="font-bold text-xl">{selectedPlayers.length} <span className="text-sm text-gray-500 font-normal">/ 6 max</span></span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-gray-400">Capped (Max 5)</span>
                            <span className="font-bold">{retentionDetails.cappedCount}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-gray-400">Uncapped (Max 2)</span>
                            <span className="font-bold">{retentionDetails.uncappedCount}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-gray-400">Overseas (Max 3)</span>
                            <span className="font-bold">{retentionDetails.overseasCount}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                            <span className="text-gray-300">Purse Deduction</span>
                            <span className="font-bold text-red-400 text-xl">- ₹{retentionDetails.totalCost} Cr</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg mt-2">
                            <span className="text-gray-300">RTM Cards</span>
                            <span className="font-bold text-primary text-xl">{6 - selectedPlayers.length}</span>
                        </div>
                    </div>

                    <h4 className="font-bold mb-2 text-sm text-gray-400 uppercase tracking-wider">Selected Players</h4>
                    <div className="space-y-2 mb-6 min-h-[150px]">
                        {retentionDetails.details.length === 0 ? (
                            <div className="text-gray-500 text-sm text-center py-4">No players selected</div>
                        ) : (
                            retentionDetails.details.map(d => (
                                <div key={d.player.id} className="flex justify-between text-sm">
                                    <span>{d.player.name}</span>
                                    <span className="text-gray-400">₹{d.cost} Cr</span>
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full btn-primary py-3 relative overflow-hidden group"
                    >
                        <span className="relative z-10">{isSubmitting ? 'Submitting...' : 'Confirm Retentions'}</span>
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-3">Warning: This action cannot be undone.</p>
                </div>
            </div>
        </div>
    );
}
