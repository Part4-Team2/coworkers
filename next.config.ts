import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  generateEtags: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: true,
              ref: true,
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
