import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tối ưu hiệu suất
  reactStrictMode: true,

  // Tối ưu hình ảnh cho SEO
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers bảo mật và SEO
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      // Cache cho static assets
      {
        source: "/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirects (nếu cần)
  async redirects() {
    return [
      // Ví dụ redirect
      // {
      //   source: "/old-page",
      //   destination: "/new-page",
      //   permanent: true,
      // },
    ];
  },

  // Compression
  compress: true,
};

export default nextConfig;
