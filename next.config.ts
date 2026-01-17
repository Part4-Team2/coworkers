import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  generateEtags: true,
  poweredByHeader: false,
  cacheComponents: true, // "use cache" 지시어 활성화
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
