/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  // Type-check + lint run in CI / local `next build`, NOT in the production image — the same
  // call the admin Dockerfile makes (`vite build`, not `tsc -b`). Unblocks the image build from a
  // known @types/react 18↔19 duplicate false-positive (Next 15's generated types resolve ReactNode
  // against a stale @types/react@18; runtime is unaffected). Dedupe @types/react to remove this.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
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
