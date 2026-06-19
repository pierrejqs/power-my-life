import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["three"],
  turbopack: {},
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /(^|[/\\])(\.git|\.next|\.npm-cache|node_modules|power-my-life)([/\\]|$)/,
      };
    }

    return config;
  },
};

export default nextConfig;
