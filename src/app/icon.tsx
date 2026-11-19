import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/og/brand-mark";

// Two sizes of the same icon: a small one for browser tabs and a larger one that meets
// Google's rule for icons shown in search results (a multiple of 48 pixels).
const sizes = { small: 32, large: 192 } as const;
type IconId = keyof typeof sizes;

export function generateImageMetadata() {
  return (Object.keys(sizes) as IconId[]).map((id) => ({
    id,
    size: { width: sizes[id], height: sizes[id] },
    contentType: "image/png",
  }));
}

// Like params, the id arrives as a Promise and must be awaited. The icon is a drawing
// with no letters in it, so no font is loaded.
export default async function Icon({ id }: { id: Promise<string> }) {
  const px = sizes[(await id) as IconId] ?? sizes.small;
  return new ImageResponse(<BrandMark size={px} />, { width: px, height: px });
}
