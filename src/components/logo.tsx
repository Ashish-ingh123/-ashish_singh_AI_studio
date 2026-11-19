import type { CSSProperties } from "react";
import { profile } from "@/content/profile";
import { logoBox, logoMark } from "@/lib/logo-shapes";

/**
 * Which parts of the logo to draw:
 *
 *   - "mark":     the hexagon with the letter A, and the dot beside it;
 *   - "wordmark": the mark, then the brand's name in two colours;
 *   - "tagline":  the same, with the brand's line under the name.
 */
export type LogoVariant = "mark" | "wordmark" | "tagline";

/**
 * How large the logo is, as a step of the type scale (see globals.css). The step is the
 * wordmark's text size; the mark's height follows from it.
 */
const sizes = {
  /** 16px text, a mark 30px tall: the footer. */
  sm: "text-base",
  /** 18px text, a mark 34px tall: the header. */
  md: "text-lg",
  /** 28 to 40px text, a mark 52 to 75px tall: the logo standing by itself. */
  lg: "text-heading",
} as const;

/**
 * The mark's height, measured in the wordmark's text size (em). In the artwork the
 * hexagon is 1.875 times as tall as the wordmark's letters are large, so sizing it in em
 * keeps that proportion at every size, and one class scales the whole logo.
 */
const MARK_EM = 1.875;

type MarkProps = {
  /** The small version, without the dot. */
  small: boolean;
};

/**
 * The drawing. It is always hidden from screen readers: where the logo needs a name,
 * the Logo component supplies it as text.
 */
function Mark({ small }: MarkProps) {
  const box = small ? logoBox.small : logoBox.full;
  const { hexagon, letter, crossbar, dot } = logoMark;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
      className="logo-mark"
      // Both sides are given, so the browser knows the mark's size before it draws it
      // and nothing beside it moves.
      style={{
        height: `${MARK_EM}em`,
        width: `${((MARK_EM * box.width) / box.height).toFixed(4)}em`,
      }}
    >
      <path
        className="logo-hexagon"
        d={hexagon.d}
        strokeWidth={hexagon.strokeWidth}
        strokeLinejoin="round"
      />
      <path
        className="logo-letter"
        d={letter.d}
        strokeWidth={letter.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        className="logo-letter"
        x1={crossbar.x1}
        y1={crossbar.y1}
        x2={crossbar.x2}
        y2={crossbar.y2}
        strokeWidth={crossbar.strokeWidth}
        strokeLinecap="butt"
      />
      {!small && (
        <circle
          className="logo-dot"
          cx={dot.cx}
          cy={dot.cy}
          r={dot.r}
          // Where the dot's trip starts, for the stylesheet: the crossbar's left end,
          // measured from the dot's own place. Negative, because that is to the left.
          style={{ "--logo-trip": `${crossbar.x1 - dot.cx}px` } as CSSProperties}
        />
      )}
    </svg>
  );
}

type Props = {
  variant?: LogoVariant;
  size?: keyof typeof sizes;
  /**
   * Draw the small version of the mark: no dot. The rule is to use it at 32px and below,
   * where the dot would be a speck. Every use on the page is larger than that; the
   * browser-tab icon is the one that is not (src/components/og/brand-mark.tsx).
   */
  small?: boolean;
  /**
   * Give the logo its name, profile.brand.label, as text that only screen readers get.
   * Use it where the logo is all a link contains, as in the header. Left out, the whole
   * logo is decoration and screen readers skip it.
   */
  labelled?: boolean;
  /**
   * Let the dot run once along the crossbar each time the logo is hovered (see
   * styles/logo.css). For the header's logo; nothing plays until a pointer is over it.
   */
  animated?: boolean;
  /**
   * Classes for the words alone, for example to hide them at the screen widths where
   * only the mark fits. The logo's name for screen readers is not affected.
   */
  wordsClassName?: string;
  className?: string;
};

/**
 * The Ashline logo. Its words come from profile.brand, its shapes from
 * src/lib/logo-shapes.ts and its colours from src/app/styles/logo.css, where each part
 * is tied to a design token, so the logo changes with the theme like everything else.
 *
 * It has no script of its own and can be rendered on the server.
 *
 * Accessibility: a logo's letters are a picture of a name, so they are hidden from
 * screen readers (the name would otherwise be read twice, or letter group by letter
 * group). With `labelled` the name is given once, as hidden text. The tagline is a
 * sentence in its own right and stays readable, unless the whole logo is decoration.
 */
export function Logo({
  variant = "wordmark",
  size = "md",
  small = false,
  labelled = false,
  animated = false,
  wordsClassName,
  className,
}: Props) {
  const { brand } = profile;
  const withTagline = variant === "tagline";

  return (
    <span
      aria-hidden={labelled ? undefined : true}
      className={`logo inline-flex items-center gap-[0.55em] font-sans leading-none ${sizes[size]} ${animated ? "logo-animated" : ""} ${className ?? ""}`}
    >
      {labelled && <span className="sr-only">{brand.label}</span>}
      <Mark small={small} />
      {variant !== "mark" && (
        // With a tagline the words are three rows, the outer two of equal height: that
        // keeps the name level with the middle of the mark and hangs the tagline below.
        <span
          className={`${withTagline ? "grid grid-rows-[1fr_auto_1fr]" : ""} ${wordsClassName ?? ""}`}
        >
          {/*
            Raised by a twelfth of its size: a line of text is centred on its whole box,
            which leaves the small letters sitting low. Raised, their middle is level
            with the middle of the hexagon, as in the artwork.
          */}
          <span
            aria-hidden="true"
            className={`relative -top-[0.08em] whitespace-nowrap ${withTagline ? "row-start-2" : ""}`}
          >
            <span className="logo-lead font-medium">{brand.wordmark.lead}</span>
            <span className="logo-accent font-normal">
              {brand.wordmark.accent}
            </span>
          </span>
          {withTagline && (
            <span className="logo-tagline row-start-3 mt-1 self-start text-xs leading-none font-normal tracking-wider whitespace-nowrap">
              {brand.tagline.before}{" "}
              <span className="logo-accent">{brand.tagline.accent}</span>{" "}
              {brand.tagline.after}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
