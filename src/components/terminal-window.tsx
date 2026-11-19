"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useReducedMotion } from "motion/react";

// Time is counted in ticks. One tick types one letter, and before each line the cursor
// waits PAUSE ticks at the start of it, as a terminal does between commands.
const TICK_MS = 14;
const PAUSE = 12;
// The longest one pass may take. With more text than fits, the ticks get shorter instead
// of the pass getting longer: text that keeps moving for more than five seconds would
// need a pause control to stay accessible, and this stays well under that.
const MAX_MS = 2800;

// The three dots of a title bar, in fading strengths of the accent colour.
const dots = ["bg-accent/80", "bg-accent/50", "bg-accent/25"];

/** Works out the tick at which each line's first letter appears. */
function schedule(lines: string[]) {
  // Array.from splits a string into whole characters. Cutting by index instead could
  // slice a symbol that is stored as two units, such as an emoji, in half.
  const letters = lines.map((line) => Array.from(line));
  const starts: number[] = [];
  let tick = 0;
  for (const line of letters) {
    tick += PAUSE;
    starts.push(tick);
    tick += line.length;
  }
  return { letters, starts, total: tick };
}

type Props = {
  /** Text in the title bar. It is also the figure's name for a screen reader. */
  title: string;
  lines: string[];
  replayLabel: string;
  /** The horizontal padding that the title bar and the lines share. */
  padding: string;
};

/**
 * A terminal window whose lines type themselves out: once when the window scrolls into
 * view, and again whenever Replay is pressed.
 *
 * The server renders every line in full, so the text is there before any script runs,
 * and it never leaves the page: while a line is being typed, the letters still to come
 * are only made invisible (opacity 0). They keep their place, so nothing moves or wraps
 * differently as the line fills in, and a screen reader reads the whole line at any time.
 *
 * `ticks` is the one piece of state: null shows everything, and a number is how many
 * ticks of the pass have gone by, from which each line works out how much of itself to
 * show. Visitors who prefer reduced motion always get null, and CSS hides Replay.
 */
export function TerminalWindow({ title, lines, replayLabel, padding }: Props) {
  const reduce = useReducedMotion();
  const [ticks, setTicks] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  // Id of the frame callback that is waiting to run, so that it can be cancelled.
  const frame = useRef(0);
  const titleId = useId();

  const { letters, starts, total } = useMemo(() => schedule(lines), [lines]);
  const tickMs = Math.min(TICK_MS, MAX_MS / total);

  const play = useCallback(() => {
    cancelAnimationFrame(frame.current);
    const startedAt = performance.now();
    // Runs before each repaint. The count comes from the clock, not from how often this
    // runs, so a slow frame makes the typing jump ahead instead of falling behind.
    const step = (now: number) => {
      const passed = Math.floor((now - startedAt) / tickMs);
      if (passed >= total) {
        setTicks(null);
        return;
      }
      setTicks(passed);
      frame.current = requestAnimationFrame(step);
    };
    setTicks(0);
    frame.current = requestAnimationFrame(step);
  }, [tickMs, total]);

  useEffect(() => {
    if (reduce) return;
    const list = listRef.current;
    if (!list) return;

    // The observer reports once straight away, and after that whenever the share of the
    // list that is on screen crosses one of the two thresholds: any of it, or half of it.
    let firstReport = true;
    const observer = new IntersectionObserver(
      (entries) => {
        // Several reports can arrive together; only the latest one matters.
        const entry = entries[entries.length - 1];
        if (firstReport) {
          firstReport = false;
          if (entry.isIntersecting) {
            // Some of the text is on screen already (a reload half-way down the page,
            // or coming back from the case study). Emptying the window now would make
            // words vanish in front of the visitor, so it stays as it is.
            observer.disconnect();
            return;
          }
          // Still off screen: empty the window, with the cursor waiting on the first
          // line, so that it is ready to type when it scrolls into view.
          setTicks(0);
          return;
        }
        // Half of the lines have to be on screen before the typing starts.
        if (entry.intersectionRatio >= 0.5) {
          play();
          observer.disconnect();
        }
      },
      { threshold: [0, 0.5] },
    );
    observer.observe(list);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [reduce, play]);

  const shown = reduce ? null : ticks;
  // The line the cursor is on: the last one whose wait has begun. -1 when nothing plays.
  const active =
    shown === null ? -1 : starts.findLastIndex((start) => shown >= start - PAUSE);
  const lastLine = lines.length - 1;

  return (
    /*
      From lg the window has a minimum height, so it reads as a picture with the
      description card resting on it, not as a thin strip beside the text. The spare room
      stays empty under the last line, as it would in a real terminal.
    */
    <figure
      aria-labelledby={titleId}
      className="relative overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-[0_12px_60px_-16px_var(--glow)] lg:min-h-72"
    >
      <figcaption
        className={`flex items-center gap-3 border-b border-border bg-muted/50 py-2.5 ${padding}`}
      >
        <span aria-hidden="true" className="flex shrink-0 gap-1.5">
          {dots.map((dot) => (
            <span key={dot} className={`h-2.5 w-2.5 rounded-full ${dot}`} />
          ))}
        </span>
        <span
          id={titleId}
          className="min-w-0 font-mono text-xs break-words text-muted-foreground"
        >
          {title}
        </span>
        {/*
          The button is 32px tall, a comfortable target for a finger, in a bar whose text
          is 16px tall. The negative margin (8px above and below) hides the difference
          from the layout, so the bar keeps the height it has without the button. That
          leaves 2px between the button and the top of the window, which cuts off
          whatever sticks out of it (overflow-hidden), so the focus ring sits right on
          the button's edge here instead of the usual 2px away. Every window repeats the
          same word, so the button also carries the window's title for screen readers.
        */}
        <button
          type="button"
          onClick={play}
          className="-my-2 ml-auto inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-md px-2 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-offset-0 motion-reduce:hidden"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          {replayLabel}
          <span className="sr-only">: {title}</span>
        </button>
      </figcaption>
      <ul
        ref={listRef}
        className={`space-y-2 py-5 font-mono text-sm leading-relaxed break-words sm:py-6 ${padding}`}
      >
        {lines.map((line, index) => {
          const all = letters[index];
          // How many letters of this line are typed so far.
          const count =
            shown === null
              ? all.length
              : Math.min(Math.max(shown - starts[index], 0), all.length);
          const rest = all.slice(count).join("");
          // The prompt mark appears when the cursor arrives on its line.
          const reached = shown === null || index <= active;

          return (
            <li key={line} className="flex gap-2.5">
              <span
                aria-hidden="true"
                className={`shrink-0 text-muted-foreground select-none ${
                  reached ? "" : "terminal-waiting"
                }`}
              >
                ›
              </span>
              {/*
                min-w-0 lets a long line shrink and wrap instead of pushing the window
                wider. The last line carries the result, so it stands out.
              */}
              <span
                className={`min-w-0 ${
                  index === lastLine ? "font-semibold text-accent" : ""
                }`}
              >
                {all.slice(0, count).join("")}
                {index === active && (
                  <span aria-hidden="true" className="terminal-caret" />
                )}
                {rest && <span className="terminal-waiting">{rest}</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
