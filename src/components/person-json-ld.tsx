import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";
import { taglineParts } from "@/lib/tagline";

/**
 * Structured data about the site owner in schema.org "Person" form: a small script tag
 * that search engines read to understand who the site is about. Nothing is rendered on
 * screen, and every value comes from profile.ts.
 */
export function PersonJsonLd() {
  const degree = profile.education[0];
  // The tagline's parts, then every skill in the Skills section. A Set keeps each name
  // once, in the order it first appears: a skill listed in two groups is not repeated.
  const knowsAbout = [
    ...new Set([
      ...taglineParts,
      ...profile.skills.flatMap((group) => group.items),
    ]),
  ];

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.pitch,
    url: siteUrl.toString(),
    email: `mailto:${profile.links.email}`,
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    sameAs: [profile.links.linkedin, profile.links.github],
    knowsAbout,
    // No worksFor on purpose: the current employer is not named anywhere on the site.
    ...(degree && {
      alumniOf: { "@type": "CollegeOrUniversity", name: degree.institution },
    }),
  };

  return (
    <script
      type="application/ld+json"
      // The JSON is built from our own content; escaping "<" keeps it safe inside a script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\u003c"),
      }}
    />
  );
}
