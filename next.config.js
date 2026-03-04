/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['localhost'],
        unoptimized: true,
    },
};

module.exports = nextConfig;
