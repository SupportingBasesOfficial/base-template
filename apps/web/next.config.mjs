import bundleAnalyzer from "@next/bundle-analyzer";
import "./env.ts";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(process.env.BUILD_STANDALONE === "true" ? { output: "standalone" } : {}),
  transpilePackages: ["@repo/ui", "@repo/supabase", "@repo/tailwind-config", "@repo/logger"],
  // React Compiler — otimiza re-renders automaticamente (React 19)
  // Ative com ENABLE_REACT_COMPILER=true
  ...(process.env.ENABLE_REACT_COMPILER === "true"
    ? {
        experimental: {
          reactCompiler: true,
        },
      }
    : {}),
  // Partial Prerendering — mistura static + dynamic na mesma rota
  // Ative com ENABLE_PPR=true (Next.js 15 experimental)
  ...(process.env.ENABLE_PPR === "true"
    ? {
        experimental: {
          ppr: "incremental",
        },
      }
    : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://*.supabase.co",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
