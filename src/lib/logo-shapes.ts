/**
 * The geometry of the logo's mark: a hexagon carrying the letter A, whose crossbar runs
 * on through the hexagon's right edge to a dot outside it.
 *
 * It is kept apart from the components because two things draw it: the page
 * (src/components/logo.tsx) and the generated images (src/components/og), which cannot
 * share a component, since one is styled with CSS and the other is not. Drawing both
 * from these numbers keeps them identical.
 *
 * All coordinates are relative to the hexagon's centre, (0, 0).
 */
export const logoMark = {
  /**
   * The hexagon. It is filled, and outlined in its own colour with round joins: the
   * outline is what rounds the six corners.
   */
  hexagon: { d: "M0 -60 L52 -30 L52 30 L0 60 L-52 30 L-52 -30 Z", strokeWidth: 10 },
  /** The two legs of the letter A, as one open line with round ends and a round peak. */
  letter: { d: "M-26 30 L0 -32 L26 30", strokeWidth: 11 },
  /** The A's crossbar, with square ends. It reaches just past the hexagon's edge. */
  crossbar: { x1: -14, y1: 10, x2: 57.5, y2: 10, strokeWidth: 8 },
  /** The dot, level with the crossbar. The small version of the mark leaves it out. */
  dot: { cx: 76, cy: 10, r: 8 },
} as const;

/**
 * The area the mark is drawn in, as an SVG viewBox: left edge, top edge, width, height.
 *
 *   - full:  everything, 141 by 130.
 *   - small: without the dot, 114.5 by 130. For 32px and below (the browser-tab icon),
 *     where the dot would be a speck.
 */
export const logoBox = {
  full: { x: -57, y: -65, width: 141, height: 130 },
  small: { x: -57, y: -65, width: 114.5, height: 130 },
} as const;
