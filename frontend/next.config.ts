import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  cacheComponents: true,
  // The repo root has its own lockfile; pin Turbopack to this app.
  turbopack: { root: __dirname },
  cacheLife: {
    // Live monitoring data: shared on the server for 15s, never prerendered
    // (expire < 5 min makes it a request-time "dynamic hole").
    monitoring: {
      stale: 30,
      revalidate: 15,
      expire: 60,
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
