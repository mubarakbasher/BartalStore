/**
 * Resolve the API base URL by runtime context.
 *
 * - Browser (client components): the public URL baked at build time
 *   (`NEXT_PUBLIC_API_BASE_URL`), e.g. `http://<VPS_IP>:8081/api`.
 * - Server (SSR, server actions, route handlers, sitemap, middleware): the
 *   internal Docker-network URL (`API_INTERNAL_BASE_URL`) when set, e.g.
 *   `http://api:3001/api` — so server-side fetches go container→container and
 *   don't hairpin through the host's published port (which a host firewall can block).
 *
 * `API_INTERNAL_BASE_URL` is a runtime env (not `NEXT_PUBLIC_*`), so it is only
 * available server-side; the `typeof window` guard ensures the browser never reads it.
 */
export function apiBaseUrl(): string {
  if (typeof window === 'undefined' && process.env.API_INTERNAL_BASE_URL) {
    return process.env.API_INTERNAL_BASE_URL;
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';
}
