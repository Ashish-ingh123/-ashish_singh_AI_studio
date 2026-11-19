"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// The question box is a chunk of its own, fetched only when it is about to be needed.
// ssr: false: it needs a browser to do anything, and the card round it (its heading,
// its notice) is already rendered on the server.
const AskBox = dynamic(
  () => import("@/components/ask-box").then((loaded) => loaded.AskBox),
  { ssr: false },
);

/** The name of the event that asks for the box; the command palette sends it. */
export const ASK_EVENT = "ask:open";

/**
 * Holds the place of the question box and loads it at the last sensible moment: when the
 * visitor has scrolled to within a screen of it, or when the command palette asks for
 * it. So its code is never part of what the first screen downloads.
 *
 * The placeholder is as tall as the box it stands in for, so nothing below it moves
 * when the box arrives.
 */
export function AskBoxLoader() {
  const [wanted, setWanted] = useState(false);
  // Counts requests from outside; the box puts the cursor in its field on each one.
  const [focusSignal, setFocusSignal] = useState(0);
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;

    // rootMargin stretches the "screen" by 600px above and below, so the box is
    // loaded a little before it scrolls into view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setWanted(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(holder);

    function onOpen() {
      setWanted(true);
      setFocusSignal((count) => count + 1);
    }
    window.addEventListener(ASK_EVENT, onOpen);

    return () => {
      observer.disconnect();
      window.removeEventListener(ASK_EVENT, onOpen);
    };
  }, []);

  return (
    <div ref={holderRef} className="ask-holder">
      {wanted && <AskBox focusSignal={focusSignal} />}
    </div>
  );
}
