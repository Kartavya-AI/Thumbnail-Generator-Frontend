// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
    domains: ["v3.fal.media", "example.com", "cdn.pixabay.com"],
  },
};

module.exports = nextConfig;
