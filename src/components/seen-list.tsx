"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A wrapper that tells each of its marked items when it first scrolls into view.
 *
 * An item opts in by carrying data-seen="false". Once two fifths of it are on screen the
 * attribute becomes "true", and from there the stylesheet does the work: the service
 * cards use it to send the dot along their drawing (src/app/styles/services.css) and the
 * case study's architecture diagram uses it to draw itself (case-study.css). Every item
 * is watched on its own, because on a phone a list can be several screens tall and its
 * items arrive one at a time.
 *
 * An item that is still off screen when the page loads also gets data-armed="true". A
 * stylesheet that wants to hide something until the item is seen must ask for both
 * attributes: without script nothing is ever armed, so nothing stays hidden, and an item
 * that is already on screen is never emptied in front of the visitor.
 *
 * Like pipeline-player.tsx, this changes the attributes on the elements themselves and
 * keeps no React state. The items are rendered on the server and arrive as children, and
 * React leaves an attribute alone as long as the value it was given ("false") never
 * changes.
 */
export function SeenList({
  as: Tag = "ul",
  className,
  children,
}: {
  /** The element to render: a list by default, a plain box for anything else. */
  as?: "ul" | "div";
  className?: string;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // The items that have reported at least once.
    const reported = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const item = entry.target;
          if (!(item instanceof HTMLElement)) continue;
          const first = !reported.has(item);
          reported.add(item);
          if (entry.isIntersecting) {
            item.dataset.seen = "true";
            // One time only: scrolling away and back does not play it again.
            observer.unobserve(item);
          } else if (first) {
            item.dataset.armed = "true";
          }
        }
      },
      { threshold: 0.4 },
    );
    for (const item of root.querySelectorAll('[data-seen="false"]')) {
      observer.observe(item);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={(element: HTMLElement | null) => {
        rootRef.current = element;
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}
