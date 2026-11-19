import { profile } from "@/content/profile";

/**
 * The absolute address of the site, used wherever a link has to be absolute: the canonical
 * link, Open Graph tags, the sitemap, robots.txt and the structured data.
 *
 * Order of preference: the address in profile.ts, then the production URL that Vercel
 * provides at build time, then localhost for local builds.
 */
function resolveSiteUrl(): URL {
  const configured = profile.siteUrl.trim();
  if (configured) return new URL(configured);
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelHost) return new URL(`https://${vercelHost}`);
  return new URL("http://localhost:3000");
}

export const siteUrl = resolveSiteUrl();

/** Turns a site path such as "/projects/billingrecon" into an absolute URL string. */
export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}
