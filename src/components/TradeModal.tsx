"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoomState, proposeTrade, respondTrade } from '@/lib/socket';
import { getTeamById } from '@/data/teams';

interface TradeModalProps {
    roomState: RoomState;
    myTeamId: string;
    onClose: () => void;
}

export default function TradeModal({ roomState, myTeamId, onClose }: TradeModalProps) {
    const [targetTeamId, setTargetTeamId] = useState<string>('');
    const [offerPlayers, setOfferPlayers] = useState<string[]>([]);
    const [requestPlayers, setRequestPlayers] = useState<string[]>([]);
    const [offerAmount, setOfferAmount] = useState<number>(0);
    const [requestAmount, setRequestAmount] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'propose' | 'pending'>('propose');

    const myTeam = roomState.teams.find(t => t.id === myTeamId);
    const targetTeam = roomState.teams.find(t => t.id === targetTeamId);

    // Filter active trades for my team
    const pendingTrades = roomState.trades?.filter(t => t.status === 'pending' && (t.toTeamId === myTeamId || t.fromTeamId === myTeamId)) || [];

    const handleProposeTrade = () => {
        if (!targetTeamId) {
            setError("Please select a team to trade with.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        proposeTrade(targetTeamId, offerPlayers, offerAmount, requestPlayers, requestAmount, (res) => {
            setIsSubmitting(false);
            if (res.success) {
                setActiveTab('pending');
                setOfferPlayers([]);
                setRequestPlayers([]);
                setOfferAmount(0);
                setRequestAmount(0);
            } else {
                setError(res.error || "Trade proposal failed.");
            }
        });
    };

    const handleRespondTrade = (tradeId: string, accept: boolean) => {
        setIsSubmitting(true);
        respondTrade(tradeId, accept, (res) => {
            setIsSubmitting(false);
            if (!res.success) {
                setError(res.error || "Trade response failed.");
            }
        });
    };

    const togglePlayer = (list: string[], setList: (l: string[]) => void, playerId: string) => {
        if (list.includes(playerId)) {
            setList(list.filter(id => id !== playerId));
        } else {
            setList([...list, playerId]);
        }
    };

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-stadium-900 border border-white/20 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-white/10 bg-stadium-800/50">
                        <h2 className="text-2xl font-bold font-display text-white">Trade Center</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-white/10">
                        <button 
                            className={\`flex-1 py-3 font-bold \${activeTab === 'propose' ? 'bg-primary/20 text-primary border-b-2 border-primary' : 'text-gray-400 hover:bg-white/5'}\`}
                            onClick={() => setActiveTab('propose')}
                        >
                            Propose Trade
                        </button>
                        <button 
                            className={\`flex-1 py-3 font-bold flex items-center justify-center gap-2 \${activeTab === 'pending' ? 'bg-primary/20 text-primary border-b-2 border-primary' : 'text-gray-400 hover:bg-white/5'}\`}
                            onClick={() => setActiveTab('pending')}
                        >
                            Pending Trades
                            {pendingTrades.length > 0 && (
                                <span className="w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">{pendingTrades.length}</span>
                            )}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm">{error}</div>}

                        {activeTab === 'propose' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Select Target Team</label>
                                    <select 
                                        value={targetTeamId}
                                        onChange={e => setTargetTeamId(e.target.value)}
                                        className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                    >
                                        <option value="">-- Select Team --</option>
                                        {roomState.teams.filter(t => t.id !== myTeamId).map(t => (
                                            <option key={t.id} value={t.id}>{getTeamById(t.id)?.name || t.id.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>

                                {targetTeamId && myTeam && targetTeam && (
                                    <div className="grid grid-cols-2 gap-6">
                                        {/* My Team (Offer) */}
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                            <h3 className="font-bold text-primary mb-4 border-b border-white/10 pb-2">You Offer</h3>
                                            
                                            <div className="mb-4">
                                                <label className="block text-xs text-gray-400 mb-1">Cash (Cr)</label>
                                                <input 
                                                    type="number" 
                                                    min="0" 
                                                    max={(myTeam.purse / 100).toFixed(1)} 
                                                    value={offerAmount} 
                                                    onChange={e => setOfferAmount(Number(e.target.value))}
                                                    className="w-full bg-black/50 border border-white/20 rounded p-2 text-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs text-gray-400 mb-2">Players</label>
                                                <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                                                    {myTeam.squad.length === 0 ? (
                                                        <div className="text-gray-500 text-sm text-center py-4">No players to offer</div>
                                                    ) : (
                                                        myTeam.squad.map(p => (
                                                            <div 
                                                                key={p.player.id}
                                                                onClick={() => togglePlayer(offerPlayers, setOfferPlayers, p.player.id)}
                                                                className={\`p-2 text-sm rounded cursor-pointer border \${offerPlayers.includes(p.player.id) ? 'bg-primary/20 border-primary text-white' : 'border-transparent text-gray-300 hover:bg-white/10'}\`}
                                                            >
                                                                {p.player.name} <span className="text-xs text-gray-500">(₹{(p.price / 100).toFixed(1)}Cr)</span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Target Team (Request) */}
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                            <h3 className="font-bold text-neon-cyan mb-4 border-b border-white/10 pb-2">You Request from {getTeamById(targetTeamId)?.abbr}</h3>
                                            
                                            <div className="mb-4">
                                                <label className="block text-xs text-gray-400 mb-1">Cash (Cr)</label>
                                                <input 
                                                    type="number" 
                                                    min="0" 
                                                    max={(targetTeam.purse / 100).toFixed(1)} 
                                                    value={requestAmount} 
                                                    onChange={e => setRequestAmount(Number(e.target.value))}
                                                    className="w-full bg-black/50 border border-white/20 rounded p-2 text-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs text-gray-400 mb-2">Players</label>
                                                <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                                                    {targetTeam.squad.length === 0 ? (
                                                        <div className="text-gray-500 text-sm text-center py-4">No players to request</div>
                                                    ) : (
                                                        targetTeam.squad.map(p => (
                                                            <div 
                                                                key={p.player.id}
                                                                onClick={() => togglePlayer(requestPlayers, setRequestPlayers, p.player.id)}
                                                                className={\`p-2 text-sm rounded cursor-pointer border \${requestPlayers.includes(p.player.id) ? 'bg-neon-cyan/20 border-neon-cyan text-white' : 'border-transparent text-gray-300 hover:bg-white/10'}\`}
                                                            >
                                                                {p.player.name} <span className="text-xs text-gray-500">(₹{(p.price / 100).toFixed(1)}Cr)</span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {targetTeamId && (
                                    <button 
                                        onClick={handleProposeTrade}
                                        disabled={isSubmitting || (offerPlayers.length === 0 && requestPlayers.length === 0 && offerAmount === 0 && requestAmount === 0)}
                                        className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Propose Trade'}
                                    </button>
                                )}
                            </div>
                        )}

                        {activeTab === 'pending' && (
                            <div className="space-y-4">
                                {pendingTrades.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">No pending trades.</div>
                                ) : (
                                    pendingTrades.map(trade => {
                                        const isReceived = trade.toTeamId === myTeamId;
                                        const partnerTeamId = isReceived ? trade.fromTeamId : trade.toTeamId;
                                        
                                        return (
                                            <div key={trade.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className={\`text-xs font-bold px-2 py-1 rounded \${isReceived ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}\`}>
                                                        {isReceived ? 'RECEIVED FROM' : 'SENT TO'} {getTeamById(partnerTeamId)?.name}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                                    <div className="bg-black/30 p-3 rounded">
                                                        <span className="text-gray-400 block mb-1">{isReceived ? 'They Offered' : 'You Offered'}:</span>
                                                        {trade.offerAmount > 0 && <div className="text-green-400 font-bold mb-1">+ ₹{trade.offerAmount} Cr</div>}
                                                        {trade.offerPlayers.length > 0 && trade.offerPlayers.map(pid => <div key={pid}>• Player ID: {pid}</div>)}
                                                        {trade.offerAmount === 0 && trade.offerPlayers.length === 0 && <div className="text-gray-500">Nothing</div>}
                                                    </div>
                                                    
                                                    <div className="bg-black/30 p-3 rounded">
                                                        <span className="text-gray-400 block mb-1">{isReceived ? 'They Requested' : 'You Requested'}:</span>
                                                        {trade.requestAmount > 0 && <div className="text-red-400 font-bold mb-1">- ₹{trade.requestAmount} Cr</div>}
                                                        {trade.requestPlayers.length > 0 && trade.requestPlayers.map(pid => <div key={pid}>• Player ID: {pid}</div>)}
                                                        {trade.requestAmount === 0 && trade.requestPlayers.length === 0 && <div className="text-gray-500">Nothing</div>}
                                                    </div>
                                                </div>

                                                {isReceived ? (
                                                    <div className="flex gap-4">
                                                        <button 
                                                            onClick={() => handleRespondTrade(trade.id, true)}
                                                            disabled={isSubmitting}
                                                            className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50 py-2 rounded font-bold"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button 
                                                            onClick={() => handleRespondTrade(trade.id, false)}
                                                            disabled={isSubmitting}
                                                            className="flex-1 bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/50 py-2 rounded font-bold"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-gray-500 italic text-sm">
                                                        Waiting for response...
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
