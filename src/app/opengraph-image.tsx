import { ImageResponse } from "next/og";
import { OgCard, ogSize } from "@/components/og/og-card";
import { profile } from "@/content/profile";
import { loadOgFonts } from "@/lib/og-fonts";
import { siteUrl } from "@/lib/site";
import { taglineParts } from "@/lib/tagline";

// The preview card for links to the homepage, rendered to a PNG at build time.
export const alt = `${profile.name}, ${profile.title}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadOgFonts();
  return new ImageResponse(
    (
      <OgCard
        chips={taglineParts}
        heading={profile.name}
        subheading={profile.title}
        footerLeft={profile.location}
        footerRight={siteUrl.host}
      />
    ),
    { ...size, fonts },
  );
}
