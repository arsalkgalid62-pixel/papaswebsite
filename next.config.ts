import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Firebase v12+ exports separate node/browser builds; prefer browser in client bundles
      config.resolve.conditionNames = ["browser", "import", "module", "default"];
    }
    return config;
  },
};

export default nextConfig;
