/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Configure for Cloudflare Pages
  // For running on Cloudflare Pages, we need to tweak some settings
  experimental: {
    optimizeCss: true,
    serverActions: true,
  },
};

module.exports = nextConfig;