import type { CSSProperties } from "react";
import { SeenList } from "@/components/seen-list";
import type { ArchitectureLayer } from "@/content/profile";

type Props = {
  layers: ArchitectureLayer[];
  rule: string;
  /** What a screen reader calls the drawing. */
  title: string;
};

// --i is a part's place in the order of drawing: 0 for the innermost layer. The
// stylesheet multiplies it by the time between one layer and the next.
const place = (index: number) => ({ "--i": index }) as CSSProperties;

const PAD = 16;

function Arrowhead({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={`${id}-arrow`}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto"
      >
        <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)" />
      </marker>
    </defs>
  );
}

/** Boxes left to right; each arrow points from a layer to the one it references. */
function WideDiagram({ layers, rule, title, id }: Props & { id: string }) {
  const boxW = 172;
  const boxH = 92;
  const gap = 32;
  const top = 8;
  const width = PAD * 2 + layers.length * boxW + (layers.length - 1) * gap;
  const height = top + boxH + 8;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
      className="h-auto w-full font-sans"
    >
      <title id={`${id}-title`}>{title}</title>
      <desc id={`${id}-desc`}>{rule}</desc>
      <Arrowhead id={id} />
      {layers.map((layer, index) => {
        const x = PAD + index * (boxW + gap);
        const cx = x + boxW / 2;
        const cy = top + boxH / 2;
        return (
          <g key={layer.name}>
            <g className="arch-layer" style={place(index)}>
              <rect
                x={x}
                y={top}
                width={boxW}
                height={boxH}
                rx="12"
                fill="var(--card)"
                stroke="var(--border)"
                strokeWidth="1.5"
              />
              <text
                x={cx}
                y={top + 34}
                textAnchor="middle"
                fill="var(--foreground)"
                fontSize="17"
                fontWeight="600"
              >
                {layer.name}
              </text>
              <text
                x={cx}
                y={top + 57}
                textAnchor="middle"
                fill="var(--muted-foreground)"
                fontSize="14"
              >
                {layer.contents[0]}
              </text>
              <text
                x={cx}
                y={top + 77}
                textAnchor="middle"
                fill="var(--muted-foreground)"
                fontSize="14"
              >
                {layer.contents[1]}
              </text>
            </g>
            {index > 0 && (
              <line
                className="arch-arrow"
                pathLength={1}
                style={place(index)}
                x1={x - 2}
                y1={cy}
                x2={x - gap + 3}
                y2={cy}
                stroke="var(--accent)"
                strokeWidth="2"
                markerEnd={`url(#${id}-arrow)`}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Boxes top to bottom for narrow screens; arrows point up to the referenced layer. */
function NarrowDiagram({ layers, rule, title, id }: Props & { id: string }) {
  const boxW = 280;
  const boxH = 84;
  const gap = 40;
  const width = PAD * 2 + boxW;
  const height = PAD * 2 + layers.length * boxH + (layers.length - 1) * gap;
  const cx = width / 2;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
      className="mx-auto h-auto w-full max-w-xs font-sans"
    >
      <title id={`${id}-title`}>{title}</title>
      <desc id={`${id}-desc`}>{rule}</desc>
      <Arrowhead id={id} />
      {layers.map((layer, index) => {
        const y = PAD + index * (boxH + gap);
        return (
          <g key={layer.name}>
            <g className="arch-layer" style={place(index)}>
              <rect
                x={PAD}
                y={y}
                width={boxW}
                height={boxH}
                rx="12"
                fill="var(--card)"
                stroke="var(--border)"
                strokeWidth="1.5"
              />
              <text
                x={cx}
                y={y + 31}
                textAnchor="middle"
                fill="var(--foreground)"
                fontSize="16"
                fontWeight="600"
              >
                {layer.name}
              </text>
              <text
                x={cx}
                y={y + 53}
                textAnchor="middle"
                fill="var(--muted-foreground)"
                fontSize="13"
              >
                {layer.contents[0]}
              </text>
              <text
                x={cx}
                y={y + 71}
                textAnchor="middle"
                fill="var(--muted-foreground)"
                fontSize="13"
              >
                {layer.contents[1]}
              </text>
            </g>
            {index > 0 && (
              <line
                className="arch-arrow"
                pathLength={1}
                style={place(index)}
                x1={cx}
                y1={y - 2}
                x2={cx}
                y2={y - gap + 3}
                stroke="var(--accent)"
                strokeWidth="2"
                markerEnd={`url(#${id}-arrow)`}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * The dependency diagram, drawn as inline SVG from the layer data so it follows the theme.
 * Two drawings of the same data: a row for wide screens, a column for phones, and only
 * one is ever displayed. Each carries a title and description for screen readers, and the
 * caption repeats the rule in words.
 *
 * The drawing builds itself the first time it scrolls into view: the layers appear from
 * the innermost outwards, and each arrow is drawn back to the layer it points at. The
 * motion is CSS (src/app/styles/case-study.css) hanging off data-seen, which SeenList
 * changes; under reduced motion, and without script, the drawing is simply complete.
 */
export function ArchitectureDiagram({ layers, rule, title }: Props) {
  return (
    <SeenList as="div">
      <figure
        data-seen="false"
        className="arch rounded-xl border border-border bg-muted/40 p-3 sm:p-5"
      >
        <div className="hidden md:block">
          <WideDiagram layers={layers} rule={rule} title={title} id="arch-wide" />
        </div>
        <div className="md:hidden">
          <NarrowDiagram
            layers={layers}
            rule={rule}
            title={title}
            id="arch-narrow"
          />
        </div>
        <figcaption className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {rule}
        </figcaption>
      </figure>
    </SeenList>
  );
}
