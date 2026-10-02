import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js from advertising itself via X-Powered-By header
  poweredByHeader: false,

  // Security headers applied to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent MIME type sniffing — stops browsers from guessing file types
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Prevent clickjacking — disallow embedding this site in iframes
          { key: "X-Frame-Options", value: "DENY" },
          // Control referrer information sent with outgoing requests
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Restrict browser features/APIs the site can use
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          // Enable HTTPS Strict Transport Security in production (1 year)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Legacy XSS filter hint for older browsers
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};

export default nextConfig;
