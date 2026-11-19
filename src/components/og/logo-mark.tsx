import { ogTheme } from "@/components/og/theme";
import { logoBox, logoMark } from "@/lib/logo-shapes";

type Props = {
  /** Height in pixels. The width follows from the mark's proportions. */
  height: number;
  /**
   * The small version, without the dot: for 32px and below, where the dot would be a
   * speck. The icons use it at every size, so that they all show the same picture.
   */
  small?: boolean;
};

/**
 * The logo's mark for the generated images: the icons and the Open Graph cards. It is
 * the same drawing as the page's logo (src/components/logo.tsx), made from the same
 * numbers (src/lib/logo-shapes.ts). Only the colours differ in where they come from:
 * next/og draws outside the page, where CSS variables do not reach, so they are read
 * from ogTheme, which mirrors the tokens.
 */
export function LogoMark({ height, small = false }: Props) {
  const box = small ? logoBox.small : logoBox.full;
  const { hexagon, letter, crossbar, dot } = logoMark;
  return (
    <svg
      width={(height * box.width) / box.height}
      height={height}
      viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
    >
      <path
        d={hexagon.d}
        fill={ogTheme.mark}
        stroke={ogTheme.mark}
        strokeWidth={hexagon.strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d={letter.d}
        fill="none"
        stroke={ogTheme.onBrand}
        strokeWidth={letter.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1={crossbar.x1}
        y1={crossbar.y1}
        x2={crossbar.x2}
        y2={crossbar.y2}
        stroke={ogTheme.onBrand}
        strokeWidth={crossbar.strokeWidth}
        strokeLinecap="butt"
      />
      {small ? null : (
        <circle cx={dot.cx} cy={dot.cy} r={dot.r} fill={ogTheme.markDot} />
      )}
    </svg>
  );
}
