import { ImageResponse } from "next/og";
import { OgCard, ogSize } from "@/components/og/og-card";
import { profile } from "@/content/profile";
import { loadOgFonts } from "@/lib/og-fonts";
import { siteUrl } from "@/lib/site";

// The preview card for links to the homepage, rendered to a PNG at build time: the
// company's name and line. No chips until the site's product content exists (Step 4).
export const alt = `${profile.brand.name}: ${profile.brand.tagline}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadOgFonts();
  return new ImageResponse(
    (
      <OgCard
        chips={[]}
        heading={profile.brand.name}
        subheading={profile.brand.tagline}
        footerLeft={profile.location}
        footerRight={siteUrl.host}
      />
    ),
    { ...size, fonts },
  );
}
