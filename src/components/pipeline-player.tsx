"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { buttonClasses } from "@/components/button-link";

type Props = {
  /** The line over the stages. It also names the list for a screen reader. */
  title: string;
  replayLabel: string;
  /** The stages, as list items, already rendered on the server. */
  children: ReactNode;
};

/**
 * Plays the pipeline's animation: once when the list of stages scrolls into view, and
 * again whenever Replay is pressed.
 *
 * All the motion is CSS (src/app/styles/pipeline.css) and hangs off the list's data-state
 * attribute: "idle" is the dim starting look and "play" runs the pulse. This component
 * only flips that attribute. It changes the attribute on the element itself and keeps no
 * React state for it, because nothing else on the page needs to know, and React leaves an
 * attribute alone as long as the value it was given ("idle") never changes.
 *
 * The stages arrive as children that the server has already rendered, so the only script
 * the browser downloads for the pipeline is this file.
 */
export function PipelinePlayer({ title, replayLabel, children }: Props) {
  const listRef = useRef<HTMLOListElement>(null);
  // useId gives an id that is the same on the server and in the browser, and unique on
  // the page. It ties the list to the line that names it.
  const titleId = useId();

  function play() {
    const list = listRef.current;
    if (!list) return;
    // Back to the start first. Reading a layout value in between makes the browser apply
    // that state at once; without it the two changes would be merged into "no change"
    // and the animation would not start again.
    list.dataset.state = "idle";
    void list.offsetWidth;
    list.dataset.state = "play";
  }

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    // Start when about a third of the list is on screen, then stop watching: scrolling
    // away and back does not replay it.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        list.dataset.state = "play";
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="pipeline-head">
        <p id={titleId} className="font-mono text-sm text-accent">
          {title}
        </p>
        {/* pipeline.css hides the button under reduced motion, where nothing plays. */}
        <button
          type="button"
          onClick={play}
          className={`${buttonClasses("secondary")} pipeline-replay min-h-10 shrink-0`}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {replayLabel}
        </button>
      </div>
      <ol
        ref={listRef}
        aria-labelledby={titleId}
        className="pipeline-stages"
        data-state="idle"
      >
        {children}
      </ol>
    </>
  );
}
