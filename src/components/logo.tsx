import type { CSSProperties } from "react";
import { profile } from "@/content/profile";
import { logoBox, logoMark } from "@/lib/logo-shapes";

/**
 * Which parts of the logo to draw:
 *
 *   - "mark":     the Ashvanta A alone;
 *   - "wordmark": the mark, then "Ashvanta" as real text;
 *   - "full":     the mark, then "Ashvanta", "TECHNOLOGIES" and the tagline in three
 *                 rows. Only legible large, so only for the lg size.
 */
export type LogoVariant = "mark" | "wordmark" | "full";

/**
 * How large the logo is, as a step of the type scale (see globals.css). The step is the
 * wordmark's text size; the mark's height follows from it.
 */
const sizes = {
  /** 16px text, a mark 28px tall: the footer. */
  sm: "text-base",
  /** 18px text, a mark 31.5px tall: the header. */
  md: "text-lg",
  /** 28 to 40px text, a mark 49 to 70px tall: the logo standing by itself. */
  lg: "text-heading",
} as const;

/**
 * The mark's height, measured in the wordmark's text size (em), so that one text-size
 * class scales the mark and the word together.
 */
const MARK_EM = 1.75;

type MarkProps = {
  /** The small version, without the three squares. */
  small: boolean;
};

/**
 * The drawing. It is always hidden from screen readers: where the logo needs a name,
 * the Logo component supplies it as text. Each part carries a class that logo.css ties
 * to a colour token, so the mark follows the theme with no script.
 */
function Mark({ small }: MarkProps) {
  const box = small ? logoBox.small : logoBox.full;
  const { leftLeg, rightLeg, swoosh, squares, square } = logoMark;
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
      <polygon className="logo-blue" points={leftLeg} />
      <polygon className="logo-navy" points={rightLeg} />
      <path
        className="logo-swoosh"
        d={swoosh.d}
        strokeWidth={swoosh.strokeWidth}
        strokeLinejoin="round"
        paintOrder="stroke"
      />
      {!small &&
        squares.map((s, i) => (
          <rect
            key={s.part}
            className={`logo-square logo-${s.part}`}
            x={s.x}
            y={s.y}
            width={square.size}
            height={square.size}
            rx={square.radius}
            // Its turn in the hover effect: the squares light up one after another.
            style={{ "--i": i } as CSSProperties}
          />
        ))}
    </svg>
  );
}

type Props = {
  variant?: LogoVariant;
  size?: keyof typeof sizes;
  /**
   * Draw the small version of the mark: no squares. The rule is to use it at 32px and
   * below, where a square would be a speck. Every use on the page is larger than that;
   * the icons are the ones that are not (src/components/og/brand-mark.tsx).
   */
  small?: boolean;
  /**
   * Give the logo its name, profile.brand.label, as text that only screen readers get.
   * Use it where the logo is all a link contains, as in the header. Left out, the whole
   * logo is decoration and screen readers skip it.
   */
  labelled?: boolean;
  /**
   * Light the three squares one after another each time the logo is hovered (see
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
 * The Ashvanta Technologies logo. Its words come from profile.brand, its shapes from
 * src/lib/logo-shapes.ts and its colours from src/app/styles/logo.css, where each part
 * is tied to a design token, so the logo changes with the theme like everything else.
 *
 * It is the mark with "Ashvanta" set as real text beside it, not the company's lockup
 * file: at header and footer sizes the lockup's "TECHNOLOGIES" and tagline are a few
 * pixels tall and cannot be read, while text stays sharp at any size.
 *
 * It has no script of its own and can be rendered on the server.
 *
 * Accessibility: the word beside the mark is a picture of a name, so it is hidden from
 * screen readers (the name would otherwise be read twice). With `labelled` the full name
 * is given once, as hidden text. In the full variant the tagline is a sentence in its
 * own right and stays readable, unless the whole logo is decoration.
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
  const full = variant === "full";

  return (
    <span
      aria-hidden={labelled ? undefined : true}
      className={`logo inline-flex items-center gap-[0.45em] leading-none ${sizes[size]} ${animated ? "logo-animated" : ""} ${className ?? ""}`}
    >
      {labelled && <span className="sr-only">{brand.label}</span>}
      <Mark small={small} />
      {variant !== "mark" && (
        <span
          className={`${full ? "grid gap-[0.3em]" : ""} ${wordsClassName ?? ""}`}
        >
          <span
            aria-hidden="true"
            className="logo-word font-display font-bold whitespace-nowrap"
          >
            {brand.wordmark}
          </span>
          {full && (
            <>
              <span
                aria-hidden="true"
                className="logo-kind text-xs font-semibold tracking-[0.3em] whitespace-nowrap uppercase"
              >
                {brand.kind}
              </span>
              <span className="logo-tagline text-xs italic whitespace-nowrap">
                {brand.tagline}
              </span>
            </>
          )}
        </span>
      )}
    </span>
  );
}
