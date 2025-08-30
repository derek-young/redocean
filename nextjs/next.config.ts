import type { NextConfig } from "next";

const getBackendUrl = (): string => {
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:2550";
  }

  return "https://backend-250945466278.us-east4.run.app";
};

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const backendUrl = getBackendUrl();

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
