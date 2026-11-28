import { ogTheme, type MarkColours } from "@/components/og/theme";
import { logoBox, logoMark } from "@/lib/logo-shapes";

type Props = {
  /** Height in pixels. The width follows from the mark's proportions. */
  height: number;
  /**
   * The small version, without the three squares: for 32px and below, where a square
   * would be a speck. The icons use it at every size, so that they all show the same
   * picture.
   */
  small?: boolean;
  /** The colours of the parts; the dark page's by default (the Open Graph cards). */
  colours?: MarkColours;
};

/**
 * The Ashvanta mark for the generated images: the icons and the Open Graph cards. It is
 * the same drawing as the page's logo (src/components/logo.tsx), made from the same
 * numbers (src/lib/logo-shapes.ts). Only the colours differ in where they come from:
 * next/og draws outside the page, where CSS variables do not reach, so they are read
 * from ogTheme, which mirrors the tokens.
 */
export function LogoMark({ height, small = false, colours = ogTheme.mark }: Props) {
  const box = small ? logoBox.small : logoBox.full;
  const { leftLeg, rightLeg, swoosh, squares, square } = logoMark;
  return (
    <svg
      width={(height * box.width) / box.height}
      height={height}
      viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
    >
      <polygon points={leftLeg} fill={colours.blue} />
      <polygon points={rightLeg} fill={colours.navy} />
      {/*
        The outline in the ground's colour cuts a thin gap where the swoosh crosses the
        legs. next/og may not honour paint-order, so the outline is drawn as its own path
        first and the fill on top of it, which gives the same picture.
      */}
      <path
        d={swoosh.d}
        fill="none"
        stroke={colours.cut}
        strokeWidth={swoosh.strokeWidth * 2}
        strokeLinejoin="round"
      />
      <path d={swoosh.d} fill={colours.orange} />
      {small
        ? null
        : squares.map((s) => (
            <rect
              key={s.part}
              x={s.x}
              y={s.y}
              width={square.size}
              height={square.size}
              rx={square.radius}
              fill={colours[s.part]}
            />
          ))}
    </svg>
  );
}
