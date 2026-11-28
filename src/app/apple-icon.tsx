import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/og/brand-mark";

// The icon iPhones and iPads use when the site is added to the home screen. iOS rounds the
// corners itself and paints see-through areas black, so the mark is drawn on a solid
// square tile.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<BrandMark size={size.width} apple />, size);
}
