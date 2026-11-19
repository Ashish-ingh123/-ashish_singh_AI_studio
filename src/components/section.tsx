import { Fragment, type CSSProperties, type ReactNode } from "react";
import { SeenList } from "@/components/seen-list";
import { profile, type SectionId } from "@/content/profile";

/** How much room a section takes from top to bottom. */
type Space = "compact" | "normal" | "roomy";

// Short sections sit closer together and the ones that matter most get more air, so the
// page has a rhythm instead of seven equal gaps.
const spacing: Record<Space, string> = {
  compact: "py-12 sm:py-16",
  normal: "py-16 sm:py-24",
  roomy: "py-20 sm:py-28",
};

/** A short accent-coloured line beside the section number, purely decorative. */
function Rule() {
  return <span className="h-px w-10 bg-accent/40" />;
}

/**
 * Shared shell for a homepage section: the anchor id the navbar links to, a hairline that
 * separates it from the section above, and a heading taken from the nav list in profile.ts
 * with the section's number over it. An optional intro line sits beside the heading on
 * wide screens and under it on narrow ones.
 *
 * Sections line up on the left edge. align="center" is for a section that closes the
 * page as a single centred block.
 */
export function Section({
  id,
  intro,
  space = "normal",
  align = "start",
  children,
}: {
  id: SectionId;
  intro?: string;
  space?: Space;
  align?: "start" | "center";
  children: ReactNode;
}) {
  const index = profile.nav.findIndex((entry) => entry.id === id);
  const item = profile.nav[index];
  const heading = item?.heading ?? item?.label ?? id;
  const headingId = `${id}-heading`;
  // "01", "02" and so on, from the section's place in the nav list.
  const number = String(index + 1).padStart(2, "0");
  const centred = align === "center";
  const words = heading.split(" ");
  // The wait between one word and the next. Each word takes 200ms to rise, and the whole
  // heading must be done within 350ms, so the waits share the 150ms that is left, and a
  // long heading gets shorter ones.
  const wordStep = words.length > 1 ? Math.min(50, 150 / (words.length - 1)) : 0;

  return (
    <section id={id} aria-labelledby={headingId}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* The hairline is as wide as the content, not the screen. */}
        <div className={`border-t border-border/70 ${spacing[space]}`}>
          {/*
            From lg the header is two equal columns whose bottoms line up: the number and
            the heading on the left, the intro on the right. Below lg, and when centred,
            the parts simply stack.
          */}
          <header
            className={
              centred
                ? "text-center"
                : "grid gap-x-12 gap-y-5 lg:grid-cols-2 lg:items-end"
            }
          >
            <div>
              {/* Decoration: a screen reader gets the order from the headings themselves. */}
              {index >= 0 && (
                <p
                  aria-hidden="true"
                  className={`flex items-center gap-3 font-mono text-sm text-accent ${
                    centred ? "justify-center" : ""
                  }`}
                >
                  {centred && <Rule />}
                  {number}
                  <Rule />
                </p>
              )}
              {/*
                The heading rises in word by word the first time it scrolls into view.
                Each word is a span carrying --i, its place in the heading, and waits --i
                times --step for its turn (sections.css). The spaces stay ordinary text
                between the spans, so a screen reader and a search engine still get one
                plain heading. SeenList marks the heading when it arrives.
              */}
              <SeenList as="div">
                <h2
                  id={headingId}
                  data-seen="false"
                  className="heading-reveal mt-3 text-heading font-bold"
                  style={{ "--step": `${wordStep}ms` } as CSSProperties}
                >
                  {words.map((word, position) => (
                    <Fragment key={`${word}-${position}`}>
                      {position > 0 && " "}
                      <span
                        className="heading-word"
                        style={{ "--i": position } as CSSProperties}
                      >
                        {word}
                      </span>
                    </Fragment>
                  ))}
                </h2>
              </SeenList>
            </div>
            {intro && (
              <p
                className={`text-lg leading-relaxed text-muted-foreground ${
                  centred ? "mx-auto mt-5 max-w-2xl" : "max-w-xl"
                }`}
              >
                {intro}
              </p>
            )}
          </header>
          <div className="mt-10 sm:mt-12">{children}</div>
        </div>
      </div>
    </section>
  );
}
