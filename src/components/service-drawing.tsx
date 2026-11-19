import type { CSSProperties, ReactNode } from "react";
import { profile, type ServiceIcon } from "@/content/profile";

/** One drawing: a few thin lines, sometimes a few words, and a dot that travels. */
type Drawing = {
  /** Size in pixels. The shapes inside are measured in the same units. */
  width: number;
  height: number;
  lines: ReactNode;
  words?: ReactNode;
  /** The dot: where its centre starts, its radius, and how far it goes across and down. */
  dot: { x: number; y: number; r: number; dx: number; dy: number };
};

// The full-stack card: three layers, one under the other, joined by a rail on the right.
// These are the tops of the three bars; each bar is 32 high.
const layerTops = [1, 46, 91];

const stack: Drawing = {
  width: 208,
  height: 124,
  lines: (
    <>
      {layerTops.map((top) => (
        <rect key={top} x={1} y={top} width={168} height={32} rx={8} />
      ))}
      {/* A short link from the middle of each bar to the rail, then the rail itself. */}
      <path d="M169 17h30M169 62h30M169 107h30M199 17v90" />
    </>
  ),
  words: profile.labels.services.stack.map((label, index) => (
    <text
      key={label}
      x={14}
      y={layerTops[index] + 20.5}
      className="service-label"
    >
      {label}
    </text>
  )),
  // Down the rail, from the top layer to the bottom one.
  dot: { x: 199, y: 17, r: 4, dx: 0, dy: 90 },
};

// The cloud card: three containers hanging under a cloud, the last one linked to a cache.
// These are the left edges of the three containers; each is 34 wide and 34 high.
const containerLefts = [2, 46, 90];

const cloud: Drawing = {
  width: 208,
  height: 124,
  lines: (
    <>
      {/* The cloud's outline: three bumps, small, large and small, over a flat base. */}
      <path d="M47 37A10 10 0 0 1 47 17A15 15 0 0 1 76.7 15.1A11 11 0 1 1 78 37Z" />
      {/* A stem from the cloud down to a rail, and from the rail a drop to each container. */}
      <path d="M63 37v43M19 58h88M19 58v22M107 58v22" />
      {containerLefts.map((left) => (
        <rect key={left} x={left} y={80} width={34} height={34} rx={8} />
      ))}
      {/* The cache, a cylinder: its lid, then its two sides and its rounded base. */}
      <ellipse cx={188} cy={86} rx={19} ry={6} />
      <path d="M169 86v22a19 6 0 0 0 38 0V86" />
      {/* The link from the last container to the cache. */}
      <path d="M124 97h45" strokeDasharray="2 5" />
    </>
  ),
  // Along the link, from the container to the cache.
  dot: { x: 124, y: 97, r: 4, dx: 45, dy: 0 },
};

// The content file names a service by its icon key; this lookup gives the key a drawing.
// Record<ServiceIcon, ...> makes TypeScript insist that every key is listed, so a new
// service cannot be added without deciding what it shows here.
const drawings: Record<ServiceIcon, Drawing | null> = {
  fullStack: stack,
  // Rows of data beside a rail; the dot runs down the rail.
  backend: {
    width: 92,
    height: 44,
    lines: <path d="M4 5v34M16 5h66M16 16h46M16 28h58M16 39h36" />,
    dot: { x: 4, y: 5, r: 3.5, dx: 0, dy: 34 },
  },
  // Two systems and the link between them; the dot crosses from one to the other.
  integrations: {
    width: 92,
    height: 44,
    lines: (
      <>
        <rect x={1} y={9} width={26} height={26} rx={7} />
        <rect x={65} y={9} width={26} height={26} rx={7} />
        <path d="M27 22h38" strokeDasharray="2 5" />
      </>
    ),
    dot: { x: 27, y: 22, r: 3.5, dx: 38, dy: 0 },
  },
  // A timeline with a tick for every run; the dot runs along it.
  automation: {
    width: 92,
    height: 44,
    lines: <path d="M4 22h84M4 15v14M25 18v8M46 15v14M67 18v8M88 15v14" />,
    dot: { x: 4, y: 22, r: 3.5, dx: 84, dy: 0 },
  },
  // A pulse trace, as on a monitor; the dot runs along its baseline.
  support: {
    width: 92,
    height: 44,
    lines: <path d="M3 26h24l7-17 8 28 7-15 5 4h35" />,
    dot: { x: 3, y: 26, r: 3.5, dx: 86, dy: 0 },
  },
  cloud,
  // The AI card shows the pipeline instead.
  ai: null,
};

/**
 * The small line drawing on a service card. Decoration, so screen readers skip it: the
 * card's title and text already say what the service is.
 *
 * The dot is drawn at the start of its trip. --dx and --dy tell the stylesheet
 * (src/app/styles/services.css) how far it has to go, and the stylesheet decides when.
 */
export function ServiceDrawing({
  icon,
  className,
}: {
  icon: ServiceIcon;
  className?: string;
}) {
  const drawing = drawings[icon];
  if (!drawing) return null;
  const { width, height, dot } = drawing;

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={`service-drawing ${className ?? ""}`}
      style={{ "--dx": `${dot.dx}px`, "--dy": `${dot.dy}px` } as CSSProperties}
    >
      <g className="service-lines">{drawing.lines}</g>
      {drawing.words}
      <circle className="service-dot" cx={dot.x} cy={dot.y} r={dot.r} />
    </svg>
  );
}
