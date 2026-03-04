import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

// Format time for timer display
export function formatTime(seconds: number): string {
    return seconds.toString().padStart(2, "0");
}

// Generate random room ID
export function generateRoomId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Delay utility
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Get country flag emoji
export function getCountryFlag(countryCode: string): string {
    const flags: Record<string, string> = {
        IN: "🇮🇳",
        AU: "🇦🇺",
        GB: "🇬🇧",
        NZ: "🇳🇿",
        ZA: "🇿🇦",
        WI: "🏴‍☠️",
        JM: "🇯🇲",
        TT: "🇹🇹",
        AF: "🇦🇫",
        BD: "🇧🇩",
        SL: "🇱🇰",
        PK: "🇵🇰",
    };
    return flags[countryCode] || "🏳️";
}
