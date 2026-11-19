import type { MetadataRoute } from "next";
import { caseStudies, caseStudyPath } from "@/lib/case-studies";
import { absoluteUrl } from "@/lib/site";

// Served at /sitemap.xml: the list of pages search engines should index.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...caseStudies.map(caseStudyPath)];
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
