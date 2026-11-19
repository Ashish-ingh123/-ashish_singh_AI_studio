"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type Props = {
  /** Skill names drawn beside a few of the points. A phone has room for the first three. */
  labels: string[];
  /** The word drawn beside the travelling query point. */
  queryLabel: string;
};

type Point = {
  x: number;
  y: number;
  /** Drift in CSS pixels per second. A labelled point does not drift. */
  vx: number;
  vy: number;
  radius: number;
  /** 0 to 1: how brightly the point is lit as one of the query's nearest neighbours. */
  glow: number;
  label: string;
  /** A labelled point sways round this spot, so two labels can never drift into each other. */
  homeX: number;
  homeY: number;
  phase: number;
  swayX: number;
  swayY: number;
};

type Colors = {
  accent: string;
  foreground: string;
  muted: string;
  /** Strength of the mesh lines, 0 to 1. */
  link: number;
  sans: string;
  mono: string;
};

/** From this width the hero has two sides: the text on the left, the field on the right. */
const WIDE = 1024;
/** On narrower screens the field shows at full strength in a strip this tall above the text. */
const BAND = 112;
/** How many of its nearest points each point is joined to. */
const NEIGHBOURS = 3;
const TAU = Math.PI * 2;

/**
 * A small seeded random generator (mulberry32). The same seed gives the same numbers, so
 * the field looks the same on every visit, like new Random(11) in C#.
 */
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

/** 0 below `from`, 1 above `to`, and a smooth S-curve in between. */
function smoothstep(from: number, to: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - from) / (to - from)));
  return x * x * (3 - 2 * x);
}

/** A canvas cannot use CSS variables, so the tokens are read off the page as plain values. */
function readColors(): Colors {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const token = (name: string) => style.getPropertyValue(name).trim();
  return {
    accent: token("--accent"),
    foreground: token("--foreground"),
    muted: token("--muted-foreground"),
    // Thin lines fade more on the dark page, so they are drawn a little stronger there.
    link: root.classList.contains("dark") ? 0.36 : 0.3,
    sans: getComputedStyle(document.body).fontFamily,
    mono: token("--font-geist-mono") || "monospace",
  };
}

/**
 * The picture behind the hero: a field of drifting points joined into a light mesh, drawn
 * on a canvas. It is modelled on a vector search, the step at the heart of a RAG feature:
 * one point is the query, and the points nearest to it light up and link to it. With a
 * mouse the pointer is the query; without one the query wanders by itself.
 *
 * It is decoration, so screen readers skip it, and under reduced motion it draws a single
 * still frame. It never works when it cannot be seen: the loop stops while the hero is
 * scrolled away or the tab is hidden.
 */
export function HeroField({ labels, queryLabel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  // An array prop is a new object on every render. Its text is what the effect depends on.
  const labelKey = labels.join("\n");

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !host || !context) return;
    // The functions below are hoisted, so TypeScript forgets the check above inside them.
    // These three constants carry the checked values under types that cannot be null.
    const surface: HTMLCanvasElement = canvas;
    const section: HTMLElement = host;
    const ctx: CanvasRenderingContext2D = context;

    const names = labelKey ? labelKey.split("\n") : [];
    const still = reduce === true;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    let width = 0;
    let height = 0;
    let wide = false;
    let ratio = 1;
    let points: Point[] = [];
    // Index pairs into points: links[0] is joined to links[1], links[2] to links[3]...
    let links: number[] = [];
    // One flag per point: 1 while it is among the query's nearest.
    let lit = new Uint8Array(0);
    // The labelled points come first in points; this is how many there are.
    let labelled = 0;
    // Width in pixels of each skill name and of the query's name, for the overlap test.
    let labelWidths: number[] = [];
    let queryWidth = 0;
    let metricsStale = true;
    // 0 to 1: how visible the query's name is. It fades while it would cover a skill name.
    let queryInk = 1;
    let colors = readColors();
    let colorsStale = false;
    const pointerSpot = { x: 0, y: 0 };
    let pointer: { x: number; y: number } | null = null;
    const query = { x: 0, y: 0, placed: false };
    let frameId = 0;
    let lastTime = 0;
    let clock = 0;
    let ticks = 0;
    let drawn = 0;
    let onScreen = true;
    let disposed = false;

    /** Joins every point to its nearest few. Done a few times a second, not every frame. */
    function linkPoints() {
      const reach = (wide ? 132 : 100) ** 2;
      const seen = new Set<number>();
      links = [];
      for (let i = 0; i < points.length; i++) {
        const nearest: { index: number; distance: number }[] = [];
        for (let j = 0; j < points.length; j++) {
          if (j === i) continue;
          const distance =
            (points[i].x - points[j].x) ** 2 + (points[i].y - points[j].y) ** 2;
          if (distance < reach) nearest.push({ index: j, distance });
        }
        nearest.sort((a, b) => a.distance - b.distance);
        for (const { index } of nearest.slice(0, NEIGHBOURS)) {
          // The same pair is found from both ends; the key lets it be kept once.
          const key = i < index ? i * 1000 + index : index * 1000 + i;
          if (seen.has(key)) continue;
          seen.add(key);
          links.push(i, index);
        }
      }
    }

    /** Lays the points out afresh for the current size. */
    function seed() {
      const random = seededRandom(11);
      const count = Math.max(
        26,
        Math.min(88, Math.round((width * height) / 11500)),
      );
      // Where the labelled points may sit: the open right-hand side on a wide screen, the
      // strip above the text on a narrow one.
      const zone = wide
        ? { left: width * 0.61, right: width - 120, top: 72, bottom: height - 92 }
        : { left: 18, right: width - 96, top: 26, bottom: BAND - 24 };
      const wanted = wide ? names.length : Math.min(3, names.length);
      const slot = (zone.right - zone.left) / 3;
      points = [];

      for (let tries = 0; points.length < wanted && tries < 600; tries++) {
        const index = points.length;
        // A narrow screen has three slots side by side, alternately high and low. A wide
        // one takes random spots and keeps those clear of the labels already placed.
        const x = wide
          ? zone.left + random() * (zone.right - zone.left)
          : zone.left + index * slot + random() * slot * 0.3;
        const y = wide
          ? zone.top + random() * (zone.bottom - zone.top)
          : index % 2 === 1
            ? zone.bottom - random() * 12
            : zone.top + random() * 12;
        const crowded =
          wide &&
          points.some((other) => {
            const dx = Math.abs(other.x - x);
            const dy = Math.abs(other.y - y);
            return (dx < 140 && dy < 78) || dx * dx + dy * dy < 130 * 130;
          });
        if (crowded) continue;
        points.push({
          x,
          y,
          vx: 0,
          vy: 0,
          radius: 1.9,
          glow: 0,
          label: names[index],
          homeX: x,
          homeY: y,
          phase: random() * TAU,
          swayX: 0.16 + random() * 0.12,
          swayY: 0.13 + random() * 0.1,
        });
      }

      for (let tries = 0; points.length < count && tries < count * 60; tries++) {
        const x = random() * width;
        const y = random() * height;
        // Most points go where there is no text to compete with.
        const keep = wide
          ? 0.2 + 0.8 * smoothstep(0.3, 0.7, x / width)
          : y < BAND
            ? 1
            : 0.42;
        if (random() > keep) continue;
        const tooClose = points.some(
          (other) => (other.x - x) ** 2 + (other.y - y) ** 2 < 34 * 34,
        );
        if (tooClose) continue;
        const angle = random() * TAU;
        const speed = 3 + random() * 5;
        points.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1.1 + random() * 1.2,
          glow: 0,
          label: "",
          homeX: 0,
          homeY: 0,
          phase: 0,
          swayX: 0,
          swayY: 0,
        });
      }

      labelled = points.findIndex((point) => !point.label);
      if (labelled < 0) labelled = points.length;
      lit = new Uint8Array(points.length);
      metricsStale = true;
      linkPoints();
    }

    /** Measures the names in the fonts they are drawn in. */
    function measure() {
      ctx.font = `500 12px ${colors.sans}`;
      labelWidths = [];
      for (let i = 0; i < labelled; i++) {
        labelWidths.push(ctx.measureText(points[i].label).width);
      }
      ctx.font = `500 11px ${colors.mono}`;
      queryWidth = ctx.measureText(queryLabel).width;
      metricsStale = false;
    }

    /** True while the query's name would not sit on top of a skill name. */
    function queryNameIsClear() {
      const nearEdge = query.x > width - 64;
      const left = nearEdge ? query.x - 11 - queryWidth : query.x + 11;
      const right = left + queryWidth;
      const top = query.y - 19;
      const bottom = query.y - 3;
      for (let i = 0; i < labelled; i++) {
        const nameLeft = points[i].x + 10;
        const nameRight = nameLeft + labelWidths[i];
        const overlapsAcross = left < nameRight + 6 && right > nameLeft - 6;
        const overlapsDown = top < points[i].y + 12 && bottom > points[i].y - 12;
        if (overlapsAcross && overlapsDown) return false;
      }
      return true;
    }

    function move(seconds: number) {
      for (const point of points) {
        if (point.label) {
          point.x = point.homeX + 9 * Math.sin(clock * point.swayX + point.phase);
          point.y = point.homeY + 6 * Math.cos(clock * point.swayY + point.phase);
          continue;
        }
        point.x += point.vx * seconds;
        point.y += point.vy * seconds;
        // A point that leaves by one edge comes back in at the opposite one.
        if (point.x < -24) point.x = width + 24;
        else if (point.x > width + 24) point.x = -24;
        if (point.y < -24) point.y = height + 24;
        else if (point.y > height + 24) point.y = -24;
      }
    }

    /** Where the query is heading: the pointer when there is one, otherwise a slow loop. */
    function target() {
      if (pointer) return pointer;
      if (wide) {
        return {
          x: width * (0.72 + 0.15 * Math.sin(clock * 0.21)),
          y: height * (0.46 + 0.24 * Math.sin(clock * 0.29 + 1.1)),
        };
      }
      return {
        x: width * (0.5 + 0.34 * Math.sin(clock * 0.27)),
        y: 56 + 28 * Math.sin(clock * 0.41 + 1.1),
      };
    }

    /** Lights the few points nearest to the query and lets the others fade. */
    function lightNearest(rate: number) {
      const wanted = wide ? 4 : 3;
      lit.fill(0);
      // One pass per pick, with no sorting and nothing allocated: this runs every frame.
      for (let pick = 0; pick < wanted; pick++) {
        let best = -1;
        let bestDistance = Infinity;
        for (let i = 0; i < points.length; i++) {
          if (lit[i]) continue;
          const distance =
            (points[i].x - query.x) ** 2 + (points[i].y - query.y) ** 2;
          if (distance < bestDistance) {
            bestDistance = distance;
            best = i;
          }
        }
        if (best < 0) break;
        lit[best] = 1;
      }
      for (let i = 0; i < points.length; i++) {
        points[i].glow += (lit[i] - points[i].glow) * rate;
      }
    }

    function draw() {
      // From here on one unit is one CSS pixel, whatever the screen's pixel density.
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // The mesh. A line is stronger the closer its two points are.
      const reach = wide ? 132 : 100;
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.accent;
      for (let i = 0; i < links.length; i += 2) {
        const from = points[links[i]];
        const to = points[links[i + 1]];
        const strength = 1 - Math.hypot(from.x - to.x, from.y - to.y) / reach;
        if (strength <= 0) continue;
        ctx.globalAlpha = strength * colors.link + 0.05;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      }

      // The lines from the query to its nearest points.
      ctx.lineWidth = 1.25;
      for (const point of points) {
        if (point.glow <= 0.02) continue;
        ctx.globalAlpha = 0.85 * point.glow;
        ctx.beginPath();
        ctx.moveTo(query.x, query.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }

      // The points, each with a soft halo while it is lit.
      ctx.fillStyle = colors.accent;
      for (const point of points) {
        if (point.glow > 0.02) {
          ctx.globalAlpha = 0.22 * point.glow;
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.radius + 7 * point.glow, 0, TAU);
          ctx.fill();
        }
        ctx.globalAlpha = 0.6 + 0.4 * point.glow;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius + 1.6 * point.glow, 0, TAU);
        ctx.fill();
      }

      // The skill names. A lit point's name turns from the muted colour to the text colour.
      ctx.font = `500 12px ${colors.sans}`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      for (const point of points) {
        if (!point.label) continue;
        ctx.globalAlpha = 0.66 + 0.34 * point.glow;
        ctx.fillStyle = point.glow > 0.5 ? colors.foreground : colors.muted;
        ctx.fillText(point.label, point.x + 10, point.y + 0.5);
      }

      // The query: a small ring. It carries its name only while it travels by itself;
      // under a real pointer the cursor already shows where it is.
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = colors.foreground;
      ctx.fillStyle = colors.foreground;
      ctx.beginPath();
      ctx.arc(query.x, query.y, 6, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(query.x, query.y, 1.8, 0, TAU);
      ctx.fill();
      if (!pointer && queryLabel && queryInk > 0.02) {
        const nearEdge = query.x > width - 64;
        ctx.globalAlpha = 0.7 * queryInk;
        ctx.font = `500 11px ${colors.mono}`;
        ctx.textAlign = nearEdge ? "right" : "left";
        ctx.fillText(queryLabel, query.x + (nearEdge ? -11 : 11), query.y - 11);
      }
      ctx.globalAlpha = 1;
    }

    /** Asks for the next frame, unless one is already waiting or nobody could see it. */
    function schedule() {
      if (frameId === 0 && onScreen && !document.hidden && !disposed) {
        frameId = requestAnimationFrame(frame);
      }
    }

    function frame(now: number) {
      frameId = 0;
      // A narrow screen draws every second frame: the motion is slow, and it halves the
      // work on a phone.
      ticks += 1;
      if (!still && !wide && ticks % 2 === 0) {
        schedule();
        return;
      }
      // Seconds since the last drawn frame, capped so a paused loop does not jump ahead.
      const seconds = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0;
      lastTime = now;
      if (colorsStale) {
        colors = readColors();
        colorsStale = false;
        metricsStale = true;
      }
      if (metricsStale) measure();
      if (!still) {
        clock += seconds;
        move(seconds);
        drawn += 1;
        if (drawn % 12 === 0) linkPoints();
      }

      const goal = target();
      if (still || !query.placed) {
        query.x = goal.x;
        query.y = goal.y;
        query.placed = true;
      } else {
        // Close the same share of the remaining gap each second, whatever the frame rate.
        const share = 1 - Math.pow(0.0015, seconds);
        query.x += (goal.x - query.x) * share;
        query.y += (goal.y - query.y) * share;
      }
      lightNearest(still ? 1 : Math.min(1, seconds * 7));
      const ink = queryNameIsClear() ? 1 : 0;
      queryInk += (ink - queryInk) * (still ? 1 : Math.min(1, seconds * 8));

      draw();
      // hero.css fades the canvas in once it has something to show.
      surface.classList.add("is-ready");
      if (!still) schedule();
    }

    function resize() {
      const box = section.getBoundingClientRect();
      const nextWidth = Math.round(box.width);
      const nextHeight = Math.round(box.height);
      if (nextWidth === 0 || nextHeight === 0) return;
      // A new width is a new layout. A slightly new height (a phone's address bar sliding
      // away) is not, and the points stay where they are.
      const relaid =
        nextWidth !== width || Math.abs(nextHeight - height) > 120;
      width = nextWidth;
      height = nextHeight;
      wide = width >= WIDE;
      // Sharp on a laptop, capped on a phone, where every extra pixel costs battery.
      ratio = Math.min(window.devicePixelRatio || 1, wide ? 2 : 1.5);
      surface.width = Math.round(width * ratio);
      surface.height = Math.round(height * ratio);
      if (relaid || points.length === 0) {
        seed();
        query.placed = false;
      }
      schedule();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(section);

    // Stop drawing while the hero is scrolled out of view, and start again when it returns.
    const viewObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      schedule();
    });
    viewObserver.observe(section);

    // next-themes switches the theme by changing the class on <html>. The colours are read
    // again on the next frame, by which time the new class has taken effect.
    const themeObserver = new MutationObserver(() => {
      colorsStale = true;
      schedule();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    function onVisibility() {
      schedule();
    }
    document.addEventListener("visibilitychange", onVisibility);

    function onPointerMove(event: PointerEvent) {
      // On a laptop with a touch screen a finger sends this event too, but never hovers.
      if (event.pointerType === "touch") return;
      const box = section.getBoundingClientRect();
      pointerSpot.x = event.clientX - box.left;
      pointerSpot.y = event.clientY - box.top;
      pointer = pointerSpot;
    }
    function onPointerLeave() {
      pointer = null;
    }
    // The pointer steers the query only where there is a real one, and only while the
    // field is moving.
    if (finePointer && !still) {
      section.addEventListener("pointermove", onPointerMove, { passive: true });
      section.addEventListener("pointerleave", onPointerLeave);
    }

    // The names are drawn in the page's own fonts, so draw again once those have arrived.
    void document.fonts.ready.then(() => {
      colorsStale = true;
      schedule();
    });

    // Runs when the component unmounts: stop the loop and let go of every listener.
    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [labelKey, queryLabel, reduce]);

  return <canvas ref={canvasRef} aria-hidden="true" className="hero-field" />;
}
