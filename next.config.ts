import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      // Keep legacy URLs useful while the site focuses on community.
      // The original research source remains in the repository for review.
      { source: "/research/:path*", destination: "/about", permanent: false },
      { source: "/fellowship", destination: "/community", permanent: false },
    ];
  },
};

export default nextConfig;
