"use client";

import { motion, AnimatePresence } from "framer-motion";
import { getTeamById } from "@/data/teams";
import { formatPrice, type Player } from "@/data/players";
import { useEffect, useState } from "react";

interface SoldOverlayProps {
    isVisible: boolean;
    player: Player;
    winningTeamId: string;
    soldPrice: number;
    onComplete: () => void;
}

// Confetti Component
function Confetti({ color }: { color: string }) {
    const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        size: Math.random() * 8 + 4,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    initial={{
                        x: `${particle.x}vw`,
                        y: -20,
                        rotate: 0,
                        opacity: 1,
                    }}
                    animate={{
                        y: "110vh",
                        rotate: particle.rotation + 720,
                        opacity: 0,
                    }}
                    transition={{
                        duration: 3,
                        delay: particle.delay,
                        ease: "easeOut",
                    }}
                    className="absolute"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: color,
                        borderRadius: Math.random() > 0.5 ? "50%" : "0",
                    }}
                />
            ))}
        </div>
    );
}

// Gavel Animation
function GavelAnimation() {
    return (
        <motion.div
            initial={{ rotate: -45, scale: 0 }}
            animate={{ rotate: [null, -45, 15, 0], scale: [0, 1, 1, 1] }}
            transition={{ duration: 0.6, times: [0, 0.3, 0.6, 1] }}
            className="text-8xl mb-6"
        >
            🔨
        </motion.div>
    );
}

export default function SoldOverlay({
    isVisible,
    player,
    winningTeamId,
    soldPrice,
    onComplete,
}: SoldOverlayProps) {
    const team = getTeamById(winningTeamId);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShowConfetti(true);
            // Auto-complete after 3 seconds
            const timer = setTimeout(() => {
                onComplete();
                setShowConfetti(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="sold-overlay"
                >
                    {/* Confetti */}
                    {showConfetti && team && <Confetti color={team.color} />}

                    {/* Main Content */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                        className="text-center z-50 relative"
                    >
                        {/* Gavel */}
                        <GavelAnimation />

                        {/* SOLD Text */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                        >
                            <h1 className="sold-text gradient-text-gold text-glow-gold">
                                SOLD!
                            </h1>
                        </motion.div>

                        {/* Player Name */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-4"
                        >
                            <p className="text-2xl text-white font-bold mb-2">
                                {player.name}
                            </p>
                        </motion.div>

                        {/* To Team */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="flex items-center justify-center gap-4 mt-6"
                        >
                            <span className="text-gray-400 text-xl">to</span>
                            {team && (
                                <div
                                    className="flex items-center gap-3 px-6 py-3 rounded-xl"
                                    style={{
                                        backgroundColor: `${team.color}20`,
                                        border: `2px solid ${team.color}`,
                                        boxShadow: `0 0 30px ${team.color}40`,
                                    }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold text-white"
                                        style={{ backgroundColor: team.color }}
                                    >
                                        {team.abbr}
                                    </div>
                                    <span className="font-display text-2xl font-bold text-white">
                                        {team.name}
                                    </span>
                                </div>
                            )}
                        </motion.div>

                        {/* Price */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                            className="mt-8"
                        >
                            <span className="text-gray-400 text-sm uppercase tracking-wider">
                                for
                            </span>
                            <div className="font-display text-5xl font-black text-neon-gold text-glow-gold mt-1">
                                {formatPrice(soldPrice)}
                            </div>
                        </motion.div>

                        {/* Next Player Hint */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="mt-8 text-gray-500 text-sm"
                        >
                            Loading next player...
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
