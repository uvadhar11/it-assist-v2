/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static exports
  images: {
    unoptimized: true, // Required for static export
  },
  // Ensure dynamic routes work properly with static export
  trailingSlash: true,
  // Fallback strategy for dynamic routes not generated at build time
  experimental: {
    // This ensures pages are generated on-demand in development mode
    // and helps with the static export workflow
    appDir: true,
  },
};

module.exports = nextConfig;
