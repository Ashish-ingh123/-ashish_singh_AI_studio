import type { CSSProperties } from "react";
import { SeenList } from "@/components/seen-list";
import type { FlowStep } from "@/content/profile";

/**
 * A workflow as a strip of numbered steps, joined by lines (Step 5 of the Ashvanta site,
 * 2026-11-28). The first time it scrolls into view the steps light up one after another
 * and each line draws itself towards the next step; the motion is CSS in
 * src/app/styles/case-study.css (.seq), started by SeenList's data-seen. Without script,
 * under reduced motion, or when the strip is on screen as the page loads, it is simply
 * complete. It is an ordered list, so a screen reader hears the steps in order; the
 * numbers and lines are decoration.
 *
 * A row from sm (each line runs to the right), a column on a phone (each line runs down).
 */
export function FlowStrip({ steps, label }: { steps: FlowStep[]; label: string }) {
  return (
    <SeenList as="div">
      <ol
        data-seen="false"
        aria-label={label}
        className="seq grid gap-3 sm:auto-cols-fr sm:grid-flow-col sm:gap-6"
      >
        {steps.map((step, index) => (
          <li
            key={step.name}
            className="seq-item flow-step relative rounded-xl border border-border bg-card/70 px-4 py-3"
            style={{ "--i": index } as CSSProperties}
          >
            <span aria-hidden="true" className="font-mono text-xs text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="font-semibold">{step.name}</p>
            {step.text && (
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            )}
            {index < steps.length - 1 && (
              <span aria-hidden="true" className="flow-link" />
            )}
          </li>
        ))}
      </ol>
    </SeenList>
  );
}
