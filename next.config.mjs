import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
            {
                protocol: 'https',
                hostname: 'i.pravatar.cc',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            }
        ],
    },
    experimental: {
        serverActions: {
            allowedOrigins: ['unsalivating-trace-spikily.ngrok-free.dev', 'localhost:3000']
        }
    }
};

export default withPWA(nextConfig);