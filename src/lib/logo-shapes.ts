/**
 * The geometry of the Ashvanta Technologies mark: a two-tone letter A (a blue left leg
 * and a navy right leg), an orange swoosh across it, and three small squares at its top
 * right. The numbers are the drawing of the company's logo file, point for point
 * (public/brand/ashvanta-mark.svg, inside its group before that file's translate and
 * scale), so the mark here and the logo file are the same picture.
 *
 * It is kept apart from the components because two things draw it: the page
 * (src/components/logo.tsx) and the generated images (src/components/og), which cannot
 * share a component, since one is styled with CSS and the other is not. Drawing both
 * from these numbers keeps them identical.
 *
 * Which colour each part takes is decided where it is drawn: logo.css on the page,
 * og/theme.ts in the images.
 */
export const logoMark = {
  /** The left leg of the A, in the blue. */
  leftLeg: "10,90 46,12 54,12 54,42.3 32,90",
  /** The right leg of the A, in the navy (in near-white on a dark page). */
  rightLeg: "54,12 62,12 98,90 76,90 54,42.3",
  /**
   * The orange swoosh. It is outlined in the colour of the ground it sits on, drawn
   * under the fill (paint-order: stroke), which cuts a thin gap where it crosses the legs.
   */
  swoosh: {
    d: "M0 70 C28 86 74 72 110 36 C78 60 34 68 0 70 Z",
    strokeWidth: 3,
  },
  /**
   * The three squares, in the order they light up on hover: navy, then orange, then
   * blue. The small version of the mark leaves them out.
   */
  squares: [
    { x: 80, y: 6, part: "navy" },
    { x: 91, y: 6, part: "orange" },
    { x: 91, y: 17, part: "blue" },
  ],
  /** Each square's side and corner radius. */
  square: { size: 8, radius: 1 },
} as const;

/**
 * The area the mark is drawn in, as an SVG viewBox: left edge, top edge, width, height.
 * The swoosh's outline reaches 1.5 units past its ends, hence the margin at the sides.
 *
 *   - full:  everything, 114 by 88.
 *   - small: without the three squares, 114 by 82. For 32px and below (the icons),
 *     where a square would be a speck of a pixel or two.
 */
export const logoBox = {
  full: { x: -2, y: 4, width: 114, height: 88 },
  small: { x: -2, y: 10, width: 114, height: 82 },
} as const;
