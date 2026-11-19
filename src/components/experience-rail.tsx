"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

/**
 * One job in the Experience section, as an <article> that knows which of its cards the
 * visitor is reading.
 *
 * The card being read is the last one whose top edge has passed the middle of the
 * screen. Every card (data-work) and every line of the pinned outline (data-rail) gets
 * data-state: "past", "active" or "ahead", and src/app/styles/experience.css does the
 * rest: it fills the progress line, lights the dots and highlights the card.
 *
 * Like pipeline-player.tsx, this changes the attributes on the elements themselves and
 * keeps no React state. The header, the outline and the cards are rendered on the server
 * and arrive as children, and React leaves an attribute alone as long as the value it
 * was given ("ahead") never changes.
 *
 * The position is worked out on scroll, at most once per frame, and only while the job
 * is on screen: an IntersectionObserver switches the scroll listener on when the job
 * arrives and off when it leaves.
 */
export function ExperienceRail({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-work]"));
    const lines = Array.from(root.querySelectorAll<HTMLElement>("[data-rail]"));
    if (cards.length === 0) return;

    // -2 is "not worked out yet", so that the first result is always applied.
    let active = -2;
    // Id of the frame callback that is waiting to run; 0 means none is waiting.
    let frame = 0;
    let listening = false;

    function update() {
      frame = 0;
      const middle = window.innerHeight / 2;
      let next = -1;
      cards.forEach((card, index) => {
        if (card.getBoundingClientRect().top <= middle) next = index;
      });
      if (next === active) return;
      active = next;
      for (const list of [cards, lines]) {
        list.forEach((item, index) => {
          item.dataset.state =
            index < next ? "past" : index === next ? "active" : "ahead";
        });
      }
    }

    // Scrolling can report more often than the screen redraws; one update per frame.
    function onScroll() {
      if (frame === 0) frame = requestAnimationFrame(update);
    }

    function listen(on: boolean) {
      if (on === listening) return;
      listening = on;
      if (on) {
        // passive promises that the handler never cancels the scroll.
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
      } else {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    }

    const observer = new IntersectionObserver((entries) => {
      listen(entries[entries.length - 1].isIntersecting);
      update();
    });
    observer.observe(root);

    return () => {
      observer.disconnect();
      listen(false);
      cancelAnimationFrame(frame);
    };
  }, []);

  /**
   * A click on a line of the outline brings its card to the middle of the screen, where
   * it becomes the card being read. One handler on the article serves every link (event
   * delegation). Without script the link still works as an ordinary jump to the card.
   * Whether the scroll glides or jumps is left to the page's scroll-behavior, which is
   * "auto" for visitors who prefer reduced motion.
   */
  function onClick(event: MouseEvent<HTMLElement>) {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest("a[data-rail-link]");
    const id = link?.getAttribute("href")?.slice(1);
    const card = id ? document.getElementById(id) : null;
    if (!card) return;
    event.preventDefault();
    card.scrollIntoView({ block: "center" });
  }

  return (
    <article ref={rootRef} className={className} onClick={onClick}>
      {children}
    </article>
  );
}
