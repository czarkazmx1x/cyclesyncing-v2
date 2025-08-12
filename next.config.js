/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  // Configure for Cloudflare Pages
  output: 'export',
  distDir: 'out',
  // Enable the transpilePackages option to further optimize build size
  transpilePackages: [],
  // Disable webpack's cache to reduce build size
  webpack: (config, { dev, isServer }) => {
    // Only use cache in development mode
    if (!dev) {
      config.cache = false;
    }
    
    // Optimize image imports
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
            fallback: 'file-loader',
            publicPath: '/_next/static/images/',
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
          },
        },
      ],
    });

    // Split chunks more aggressively to reduce individual chunk sizes
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        maxSize: 20 * 1024 * 1024, // 20 MB max chunk size
      };
    }

    return config;
  },
}