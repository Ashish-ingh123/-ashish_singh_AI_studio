import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Served at /robots.txt. Every page may be crawled.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
