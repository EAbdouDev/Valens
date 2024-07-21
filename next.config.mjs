// next.config.mjs

import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5000mb",
    },
  },
  webpack: (config, { isServer }) => {
    // Add worker-loader for .worker.ts files
    config.module.rules.push({
      test: /\.worker\.(js|ts)$/,
      loader: "worker-loader",
      options: {
        name: "static/[hash].worker.js",
        publicPath: "/_next/",
      },
    });

    // Ensure TypeScript files are handled
    config.resolve.extensions.push(".ts", ".tsx");

    return config;
  },
};

export default nextConfig;
