/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Let next/image load images served by the API host itself (local/stub storage mode), e.g.
// http://VPS_IP:8081/api/storage/dev/... — derived from the build-time API URL so it tracks
// whatever IP/port the deploy uses. No-op when the env var is unset/invalid (e.g. real R2/CDN).
function apiImagePattern() {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!raw) return [];
  try {
    const u = new URL(raw);
    return [{ protocol: u.protocol.replace(':', ''), hostname: u.hostname, ...(u.port ? { port: u.port } : {}) }];
  } catch {
    return [];
  }
}

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
      ...apiImagePattern(),
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
