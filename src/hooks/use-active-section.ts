"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section the visitor is currently reading, or null.
 *
 * It uses IntersectionObserver: the browser calls us when a section enters or leaves a
 * horizontal band near the top of the viewport, so nothing runs on every scroll frame.
 * Think of it as an event the browser raises, instead of polling the scroll position.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (sections.length === 0) return;

    const inView = new Set<string>();
    const lastId = sections[sections.length - 1].id;

    function atBottom() {
      return (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      );
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inView.add(entry.target.id);
          else inView.delete(entry.target.id);
        }
        // When two sections touch the band at once, the earlier one wins.
        const first = ids.find((id) => inView.has(id));
        if (first) setActive(first);
        // No section in the band means the visitor is above the first one, in the hero,
        // so nothing is highlighted. The one exception is the very bottom of the page,
        // where the band can lie below the last section; onScroll handles that.
        else if (!atBottom()) setActive(null);
      },
      // The band is the area between 20% and 40% down the viewport.
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    for (const section of sections) observer.observe(section);

    // A short last section may never reach the band, so at the very bottom of the page
    // treat it as the active one.
    function onScroll() {
      if (atBottom()) setActive(lastId);
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}
