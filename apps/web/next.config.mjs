/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
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
