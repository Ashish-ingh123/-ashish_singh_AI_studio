import { siteUrl } from "@/lib/site";

/*
  What the site's two server routes (/api/ask and /api/contact) share to keep strangers'
  scripts out: a check of where a request comes from, and a small limiter. Server only.
*/

/**
 * The origins the routes answer: the site's own address (src/lib/site.ts), the address
 * of the Vercel deployment it is running in (so preview deployments work), and, outside
 * production, any localhost port. A browser always sends Origin with a POST made by
 * script, so another site's page cannot use the routes from its visitors' browsers.
 * It does not stop a script that fakes the header; the rate limits are for that.
 */
export function allowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  const allowed = new Set([siteUrl.origin]);
  for (const host of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) {
    if (host) allowed.add(`https://${host}`);
  }
  if (allowed.has(origin)) return true;
  if (process.env.NODE_ENV !== "production") {
    return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  }
  return false;
}

/** Behind Vercel the visitor's address is the first entry of x-forwarded-for. */
export function clientAddress(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  );
}

/**
 * Makes a best-effort limiter: `limit` requests per address within `windowMs`. Each
 * route makes its own, so each has its own count. The returned function records the
 * request and says whether the address is over its limit.
 *
 * The count is kept in this server's memory. On Vercel every server instance has its
 * own copy and loses it when it is recycled, so this only slows down a single noisy
 * visitor. The real limit is a firewall rule, set in the Vercel dashboard.
 */
export function createLimiter(
  limit: number,
  windowMs: number,
): (address: string) => boolean {
  const recent = new Map<string, number[]>();

  return function overLimit(address: string): boolean {
    const now = Date.now();
    const times = (recent.get(address) ?? []).filter(
      (time) => now - time < windowMs,
    );
    if (times.length >= limit) {
      recent.set(address, times);
      return true;
    }
    times.push(now);
    recent.set(address, times);
    // Keep the map from growing without end: drop addresses with nothing recent.
    if (recent.size > 500) {
      for (const [key, value] of recent) {
        if (value.every((time) => now - time >= windowMs)) recent.delete(key);
      }
    }
    return false;
  };
}
