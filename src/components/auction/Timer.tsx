"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TimerProps {
    seconds: number;
    maxSeconds: number;
    onTimeout: () => void;
    isActive: boolean;
}

export default function Timer({
    seconds,
    maxSeconds,
    onTimeout,
    isActive,
}: TimerProps) {
    const progress = seconds / maxSeconds;
    const circumference = 2 * Math.PI * 54; // radius = 54
    const strokeDashoffset = circumference * (1 - progress);

    // Color based on time remaining
    const getColor = () => {
        if (seconds <= 3) return "#ff3366"; // Red - urgent
        if (seconds <= 5) return "#ff8c00"; // Orange - warning
        return "#00d4ff"; // Cyan - normal
    };

    return (
        <div className="relative flex items-center justify-center">
            {/* Background glow for urgency */}
            {seconds <= 5 && isActive && (
                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="absolute inset-[-20px] rounded-full"
                    style={{
                        background: `radial-gradient(circle, ${getColor()}30 0%, transparent 70%)`,
                    }}
                />
            )}

            {/* SVG Circle */}
            <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="rgba(45, 58, 77, 0.5)"
                    strokeWidth="8"
                />

                {/* Progress circle */}
                <motion.circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke={getColor()}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                        filter: `drop-shadow(0 0 8px ${getColor()}80)`,
                    }}
                    initial={false}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.3, ease: "linear" }}
                />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    key={seconds}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="font-display text-4xl font-black"
                    style={{ color: getColor() }}
                >
                    {seconds}
                </motion.span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {isActive ? "seconds" : "paused"}
                </span>
            </div>

            {/* Pulse effect on low time */}
            {seconds <= 3 && isActive && (
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: getColor() }}
                />
            )}
        </div>
    );
}
