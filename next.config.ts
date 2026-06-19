import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["three"],
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/.next/**",
          "**/.npm-cache/**",
          "**/node_modules/**",
          "**/power-my-life/**",
        ],
      };
    }

    return config;
  },
};

export default nextConfig;
