import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "OUTBIDZ 2.0 | Cricket Auction Simulator",
    description: "Real-time multiplayer Cricket Auction experience with live bidding, squad management, and dynamic budget tracking.",
    keywords: ["OUTBIDZ", "Auction", "Cricket", "IPL", "Fantasy"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="stadium-bg antialiased">
                {children}
            </body>
        </html>
    );
}
