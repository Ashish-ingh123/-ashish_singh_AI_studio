"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";

// One trip through the example angles, after which it starts again at the same angle
// and the same speed, so the loop has no visible seam.
const LOOP_MS = 9000;

/**
 * The example angle, in degrees, at a point of the loop (0 to 1). Two sine waves added
 * together: a slow sweep and a smaller, faster correction, which reads like someone
 * steering through gentle bends. It is an illustration and nothing else: no number here
 * comes from the model.
 */
function angleAt(progress: number): number {
  const turn = progress * 2 * Math.PI;
  return 24 * Math.sin(turn + 0.5) + 9 * Math.sin(3 * turn + 1.3);
}

/** "12°", "0°" or "−12°": a real minus sign, and never "−0". */
function formatAngle(angle: number): string {
  const whole = Math.round(angle);
  return `${whole < 0 ? "−" : ""}${Math.abs(whole)}°`;
}

// The three dots of a title bar, as on the terminal windows.
const dots = ["bg-accent/80", "bg-accent/50", "bg-accent/25"];

type Props = {
  /** Text in the title bar. */
  title: string;
  /** What a screen reader calls the picture. */
  description: string;
  caption: string;
  /** The line that says the motion is an example; always visible. */
  illustrative: string;
  pauseLabel: string;
  playLabel: string;
  /** The horizontal padding that the title bar and the body share. */
  padding: string;
};

/**
 * A window like the terminal ones, holding a steering wheel that turns through example
 * angles, with the angle in degrees beside it. It stands beside the steering-angle
 * project, and it says in visible words that the motion is an illustration.
 *
 * The server renders the wheel at the loop's first angle, so there is a complete picture
 * before any script runs; that same still frame is what visitors who prefer reduced
 * motion keep. The loop runs only while the window is on screen and not paused, and it
 * writes the rotation and the number straight onto the elements, with no React state, as
 * pipeline-player.tsx does. Only "paused" is state, because it changes the button.
 *
 * The moving number is hidden from screen readers (it would be read out several times a
 * second); the picture's name and the visible line carry what there is to know.
 */
export function SteeringWheel({
  title,
  description,
  caption,
  illustrative,
  pauseLabel,
  playLabel,
  padding,
}: Props) {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const figureRef = useRef<HTMLElement>(null);
  const rotorRef = useRef<SVGGElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  // How far into the loop the wheel is, in milliseconds. Kept across pauses and across
  // trips off screen, so the wheel carries on from where it stopped.
  const elapsed = useRef(0);
  const titleId = useId();

  useEffect(() => {
    if (reduce || paused) return;
    const figure = figureRef.current;
    if (!figure) return;

    let frame = 0;
    let last = 0;
    let shown = "";

    const step = (now: number) => {
      // A long gap (a hidden tab, a slow frame) counts as one ordinary frame, so the
      // wheel never jumps.
      elapsed.current = (elapsed.current + Math.min(now - last, 50)) % LOOP_MS;
      last = now;
      const angle = angleAt(elapsed.current / LOOP_MS);
      if (rotorRef.current) {
        rotorRef.current.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }
      // The number changes far less often than the wheel moves; write it only then.
      const text = formatAngle(angle);
      if (text !== shown && readoutRef.current) {
        readoutRef.current.textContent = text;
        shown = text;
      }
      frame = requestAnimationFrame(step);
    };

    // Run only while some of the window is on screen.
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) {
        last = performance.now();
        frame = requestAnimationFrame(step);
      }
    });
    observer.observe(figure);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reduce, paused]);

  const start = angleAt(0);

  return (
    <figure
      ref={figureRef}
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
        <span className="min-w-0 font-mono text-xs break-words text-muted-foreground">
          {title}
        </span>
        {/* The full description is the figure's name; the title bar shows the short one. */}
        <span id={titleId} className="sr-only">
          {description}
        </span>
        {/*
          The same size and place as Replay on the terminal windows. A loop that never
          ends needs a way to stop it, and this is it. Hidden under reduced motion,
          where nothing moves.
        */}
        <button
          type="button"
          onClick={() => setPaused((now) => !now)}
          className="-my-2 ml-auto inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-md px-2 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-offset-0 motion-reduce:hidden"
        >
          {paused ? (
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {paused ? playLabel : pauseLabel}
          <span className="sr-only">: {title}</span>
        </button>
      </figcaption>

      <div
        className={`flex flex-col items-center gap-5 py-6 sm:flex-row sm:gap-7 sm:py-8 ${padding}`}
      >
        {/*
          The wheel. The mark above it stays still and shows where "straight ahead" is;
          the accent mark on the rim turns with the wheel, so the angle can be read off
          the gap between the two. Decoration for a screen reader: the figure is named.
        */}
        <svg
          viewBox="-50 -56 100 106"
          aria-hidden="true"
          className="h-36 w-auto shrink-0 text-foreground sm:h-40"
        >
          <path d="M -4 -55 L 4 -55 L 0 -49 Z" className="steering-mark" />
          <g
            ref={rotorRef}
            className="steering-rotor"
            style={{ transform: `rotate(${start.toFixed(2)}deg)` }}
          >
            <circle r="40" fill="none" stroke="currentColor" strokeWidth="7" />
            <path
              d="M -36.5 0 H -11 M 11 0 H 36.5 M 0 11 V 36.5"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle r="11" fill="none" stroke="currentColor" strokeWidth="5" />
            <path d="M -5 -40 H 5" className="steering-rim-mark" />
          </g>
        </svg>

        <div className="min-w-0 text-center sm:text-left">
          <p className="font-mono text-xs text-muted-foreground">{caption}</p>
          {/* tabular-nums and a fixed width: the digits change without moving anything. */}
          <p aria-hidden="true" className="mt-1 font-display text-title font-bold">
            <span
              ref={readoutRef}
              className="inline-block min-w-[4ch] tabular-nums sm:text-left"
            >
              {formatAngle(start)}
            </span>
          </p>
          <p className="mt-3 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
            {illustrative}
          </p>
        </div>
      </div>
    </figure>
  );
}
