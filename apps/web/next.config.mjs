/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  // Self-contained server output for a slim Docker runtime.
  output: 'standalone',
  // Trace from the monorepo root so the @bartal/shared pnpm symlink + its dist are bundled.
  outputFileTracingRoot: join(__dirname, '../../'),
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.bartal.sd' },
      { protocol: 'https', hostname: '*.r2.dev' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  // The Tailwind utility list grows large with bilingual + RTL; speed up dev compile.
  experimental: {
    optimizePackageImports: ['@bartal/shared'],
  },
};

export default nextConfig;
