import { ImageResponse } from "next/og";
import { OgCard, ogSize } from "@/components/og/og-card";
import { profile } from "@/content/profile";
import { caseStudies, findCaseStudy } from "@/lib/case-studies";
import { loadOgFonts } from "@/lib/og-fonts";
import { siteUrl } from "@/lib/site";

type Params = { slug: string };
type Props = { params: Promise<Params> };

// The preview card for links to a case-study page, one per project, rendered at build time.
export const alt = `Project case study by ${profile.brand.name}`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams(): Params[] {
  return caseStudies.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const project = findCaseStudy(slug);
  if (!project) return new Response("Not found", { status: 404 });

  const fonts = await loadOgFonts();
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Case study"
        chips={project.tech.slice(0, 5)}
        heading={project.name}
        subheading={project.tagline}
        badge={project.status}
        footerLeft={profile.brand.name}
        footerRight={siteUrl.host}
      />
    ),
    { ...size, fonts },
  );
}
