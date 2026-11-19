"use client";

import { useEffect, useRef, useState } from "react";

export type TocItem = {
  /** The id of the section's element on the page. */
  id: string;
  label: string;
};

// A section counts as being read once its top is this close to the top of the screen.
// A jump to a section lands it 80px down (the scroll padding that clears the header),
// so the line sits a little below that.
const LINE = 120;

/**
 * The links to a case study's sections, with the one being read marked.
 *
 * The section being read is the last one whose top has passed a line just under the
 * header; at the very bottom of the page it is the last section, which may be too short
 * ever to reach that line. The position is worked out on scroll, at most once per frame,
 * and not at all while the list is hidden (the page shows this list twice, pinned in the
 * margin on wide screens and folded away at the top on narrow ones, and only one of the
 * two is displayed).
 *
 * The links are ordinary in-page links, so they work without script and each section has
 * an address that can be shared.
 */
export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    if (sections.length === 0) return;

    // Id of the frame callback that is waiting to run; 0 means none is waiting.
    let frame = 0;

    function update() {
      frame = 0;
      // offsetParent is null for an element inside something with display: none.
      if (listRef.current?.offsetParent === null) return;
      let current: string | null = null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= LINE) current = section.id;
      }
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = sections[sections.length - 1].id;
      setActive(current);
    }

    function onScroll() {
      if (frame === 0) frame = requestAnimationFrame(update);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    // The line down the left is the list's border; each link draws its own piece over
    // it (-ml-px), which turns accent-coloured for the section being read.
    <ol ref={listRef} className="border-l border-border">
      {items.map((item) => {
        const current = item.id === active;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={current ? "location" : undefined}
              className={`-ml-px block border-l py-1.5 pl-4 text-sm leading-snug transition-colors motion-reduce:transition-none ${
                current
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
