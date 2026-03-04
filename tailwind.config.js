/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Base colors - Electric Stadium Night
                stadium: {
                    950: '#030712',  // Deepest black
                    900: '#0a0f1a',  // Deep navy black
                    800: '#111827',  // Dark navy
                    700: '#1e2a3a',  // Lighter navy
                    600: '#2d3a4d',  // Border color
                },
                // Neon accents
                neon: {
                    gold: '#ffd700',       // Bidding highlight
                    goldDark: '#b8960f',   // Gold muted
                    pink: '#ff1493',       // Hot pink
                    pinkGlow: '#ff69b4',   // Pink glow
                    cyan: '#00d4ff',       // Timer accent
                    cyanGlow: '#00e5ff',   // Cyan glow
                    green: '#00ff88',      // Success
                    red: '#ff3366',        // Warning/error
                },
                // Team colors (will be used dynamically)
                ipl: {
                    csk: '#ffc107',    // Chennai Super Kings - Yellow
                    mi: '#004ba0',     // Mumbai Indians - Blue
                    rcb: '#d4001f',    // Royal Challengers Bangalore - Red
                    kkr: '#3a225d',    // Kolkata Knight Riders - Purple
                    dc: '#0066b3',     // Delhi Capitals - Blue
                    pbks: '#ed1b24',   // Punjab Kings - Red
                    rr: '#ea1a85',     // Rajasthan Royals - Pink
                    srh: '#ff822a',    // Sunrisers Hyderabad - Orange
                    lsg: '#a72056',    // Lucknow Super Giants - Teal
                    gt: '#1c1c1c',     // Gujarat Titans - Navy
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            fontSize: {
                'bid': ['4rem', { lineHeight: '1', fontWeight: '800' }],
                'mega': ['6rem', { lineHeight: '1', fontWeight: '900' }],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'glow-gold': 'glowGold 1.5s ease-in-out infinite alternate',
                'countdown': 'countdown 1s linear infinite',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'fade-in': 'fadeIn 0.5s ease-out',
                'scale-up': 'scaleUp 0.3s ease-out',
                'ticker': 'ticker 20s linear infinite',
                'confetti': 'confetti 3s ease-out forwards',
                'gavel': 'gavel 0.5s ease-out',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
                    '100%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)' },
                },
                glowGold: {
                    '0%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)' },
                    '100%': { boxShadow: '0 0 50px rgba(255, 215, 0, 0.8)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleUp: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                ticker: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                confetti: {
                    '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
                    '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
                },
                gavel: {
                    '0%': { transform: 'rotate(-45deg)' },
                    '50%': { transform: 'rotate(15deg)' },
                    '100%': { transform: 'rotate(0deg)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'stadium-glow': 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
