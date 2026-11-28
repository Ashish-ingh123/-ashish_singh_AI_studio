import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";
import { taglineParts } from "@/lib/tagline";

/**
 * Structured data in schema.org form: a small script tag that search engines read to
 * understand who the site is about. Nothing is rendered on screen, and every value comes
 * from profile.ts.
 *
 * Two linked entries in one @graph, the way two rows in two tables are joined by a key:
 *
 *   - the Organization, Ashvanta Technologies, whose site this is;
 *   - the Person, its founder, the owner. Each entry has an @id, and the Organization's
 *     founder points at the Person's @id, much as a foreign key points at a primary key.
 *
 * The LinkedIn and GitHub links are the founder's own, so they stay on the Person.
 */
export function SiteJsonLd() {
  const home = siteUrl.toString();
  const organizationId = `${home}#organization`;
  const personId = `${home}#founder`;
  const degree = profile.education[0];
  // The tagline's parts, then every skill in the Skills section. A Set keeps each name
  // once, in the order it first appears: a skill listed in two groups is not repeated.
  const knowsAbout = [
    ...new Set([
      ...taglineParts,
      ...profile.skills.flatMap((group) => group.items),
    ]),
  ];

  const organization = {
    "@type": "Organization",
    "@id": organizationId,
    name: profile.brand.name,
    slogan: profile.brand.tagline,
    description: profile.brand.description,
    url: home,
    logo: new URL("/brand/ashvanta-logo.svg", siteUrl).toString(),
    email: `mailto:${profile.links.email}`,
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    founder: { "@id": personId },
  };

  const person = {
    "@type": "Person",
    "@id": personId,
    name: profile.name,
    jobTitle: profile.title,
    description: profile.pitch,
    url: home,
    email: `mailto:${profile.links.email}`,
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    sameAs: [profile.links.linkedin, profile.links.github],
    knowsAbout,
    // No worksFor on purpose: the current employer is not named anywhere on the site.
    ...(degree && {
      alumniOf: { "@type": "CollegeOrUniversity", name: degree.institution },
    }),
  };

  // The company's product (Step 8 of the Ashvanta site, 2026-11-28): what it is, for whom,
  // on what, and who makes it. No rating, review, price or offer: none exists, and
  // schema.org's would be read as claims.
  const billingRecon = profile.projects.find((project) => project.slug === "billingrecon");
  const application = billingRecon && {
    "@type": "SoftwareApplication",
    "@id": `${home}#billingrecon`,
    name: billingRecon.name,
    description: billingRecon.seoDescription ?? billingRecon.tagline,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: new URL(`/projects/${billingRecon.slug}`, siteUrl).toString(),
    image: new URL(`/images/billingrecon/dashboard-built.webp`, siteUrl).toString(),
    creator: { "@id": organizationId },
    publisher: { "@id": organizationId },
  };

  const data = {
    "@context": "https://schema.org",
    "@graph": application ? [organization, person, application] : [organization, person],
  };

  return (
    <script
      type="application/ld+json"
      // The JSON is built from our own content; escaping "<" keeps it safe inside a script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "<"),
      }}
    />
  );
}
