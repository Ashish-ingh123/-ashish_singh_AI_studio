import type { CSSProperties } from "react";
import { SeenList } from "@/components/seen-list";
import type { ApprovalDemo as ApprovalDemoContent } from "@/content/profile";

/**
 * The maker-checker illustration: who does what, in order, down a line of dots, until the
 * posting. The steps appear one after another the first time it scrolls into view (the
 * .seq rules in case-study.css); the last dot, the posting, is filled. An ordered list, so
 * a screen reader hears it in order; without script or under reduced motion it is
 * simply complete.
 */
export function ApprovalDemo({ demo }: { demo: ApprovalDemoContent }) {
  const last = demo.steps.length - 1;
  return (
    <figure className="mt-10">
      <h3 className="text-lg font-semibold">{demo.heading}</h3>
      <SeenList as="div" className="mt-4">
        <ol
          data-seen="false"
          className="seq relative ml-2 border-l border-border pl-6"
          style={{ "--step": "0.35s" } as CSSProperties}
        >
          {demo.steps.map((step, index) => (
            <li
              key={`${step.who}-${step.what}`}
              className="seq-item relative pb-5 last:pb-0"
              style={{ "--i": index } as CSSProperties}
            >
              <span
                aria-hidden="true"
                className={`absolute top-1.5 left-[calc(-1.5rem_-_6px)] h-3 w-3 rounded-full border-2 ${
                  index === last
                    ? "border-accent bg-accent"
                    : "border-accent bg-background"
                }`}
              />
              <p className="text-xs font-medium tracking-wide text-accent uppercase">
                {step.who}
              </p>
              <p className="mt-0.5 text-sm">{step.what}</p>
            </li>
          ))}
        </ol>
      </SeenList>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {demo.caption}
      </figcaption>
    </figure>
  );
}
