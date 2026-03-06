"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function RulesPage() {
    const router = useRouter();

    const sections = [
        {
            emoji: "🏏",
            title: "Overview",
            items: [
                "OUTBIDZ is a multiplayer IPL-style cricket auction game where 2–10 players compete to build the best squad.",
                "Each player manages one IPL franchise and bids on cricketers using a limited purse.",
                "The goal is to assemble the strongest, most balanced squad within your budget.",
            ],
        },
        {
            emoji: "🚀",
            title: "Getting Started",
            items: [
                "The host creates a room and shares the Room ID with friends.",
                "Each player joins with the Room ID and picks an IPL team (no duplicates allowed).",
                "Once everyone marks Ready, the host starts the auction.",
            ],
        },
        {
            emoji: "💰",
            title: "Purse & Budget",
            items: [
                "Each team starts with a purse (default: ₹100 Cr, configurable by host).",
                "The purse is used to bid on players — once it runs out, you can no longer bid.",
                "Plan wisely: spending big on marquee stars may leave gaps in your squad.",
            ],
        },
        {
            emoji: "🔨",
            title: "Auction Mechanics",
            items: [
                "Players are presented one at a time with a base price. Categories appear in order: Marquee → Batsmen → Bowlers → Wicket-keepers → All-rounders → Uncapped.",
                "Each player has a 15-second countdown timer. Place a bid before time runs out.",
                "Each bid raises the price by a fixed increment based on the current amount.",
                "If the timer expires with a bid, the highest bidder wins the player. If no one bids, the player goes unsold.",
            ],
        },
        {
            emoji: "📊",
            title: "Bid Increments",
            items: [
                "₹20L – ₹1Cr: increments of ₹5L",
                "₹1Cr – ₹5Cr: increments of ₹25L",
                "₹5Cr – ₹10Cr: increments of ₹50L",
                "₹10Cr – ₹15Cr: increments of ₹75L",
                "Above ₹15Cr: increments of ₹1Cr",
            ],
        },
        {
            emoji: "🔄",
            title: "Two-Round System",
            items: [
                "Round 1: All players go through the auction in category order.",
                "Round 2: Unsold players from Round 1 return for a second chance at their base price.",
                "Players unsold in Round 2 are permanently unsold.",
                "The host can skip the remaining players in a round using the End Round button.",
            ],
        },
        {
            emoji: "🌍",
            title: "Overseas Player Limit",
            items: [
                "As in real IPL rules, each team can have a maximum of 8 overseas (non-Indian) players in their squad.",
                "If you already have 8 overseas players, you cannot bid on more overseas cricketers.",
            ],
        },
        {
            emoji: "⭐",
            title: "Scoring & Ratings",
            items: [
                "After the auction ends, each team is rated on a scale of 1–10.",
                "Ratings are based on: squad balance (batting, bowling, all-rounders), star power (marquee picks), squad depth (total players), budget efficiency, and overseas utilization.",
                "The team with the highest overall rating wins the Best Auction Performance award!",
            ],
        },
        {
            emoji: "💡",
            title: "Tips & Strategy",
            items: [
                "Don't blow your budget early — save funds for later categories.",
                "Ensure squad balance: you need batsmen, bowlers, wicket-keepers, and all-rounders.",
                "Uncapped Indian players are often bargains — they can fill your squad cheaply.",
                "Watch your overseas count — don't waste picks on players you can't use.",
                "Let rivals overpay: sometimes the best move is not bidding.",
            ],
        },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-stadium-950 via-stadium-900 to-stadium-950 py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <button
                        onClick={() => router.push("/")}
                        className="text-gray-500 hover:text-white text-sm mb-6 inline-flex items-center gap-1 transition-colors"
                    >
                        ← Back to Home
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        📜 Rules & Regulations
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Everything you need to know about the IPL Auction Game
                    </p>
                </div>

                {/* Rules Sections */}
                <div className="space-y-6">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-card-strong p-5 rounded-xl"
                        >
                            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                                <span className="text-xl">{section.emoji}</span>
                                {section.title}
                            </h2>
                            <ul className="space-y-2">
                                {section.items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                                        <span className="text-neon-gold mt-0.5 shrink-0">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-10"
                >
                    <button
                        onClick={() => router.push("/")}
                        className="px-8 py-3 bg-gradient-to-r from-neon-gold to-amber-500 text-stadium-950 font-bold rounded-lg hover:shadow-lg hover:shadow-neon-gold/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Start Playing →
                    </button>
                </motion.div>
            </motion.div>
        </main>
    );
}
