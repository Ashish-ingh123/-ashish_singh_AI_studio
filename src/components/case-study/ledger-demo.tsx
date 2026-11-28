import type { CSSProperties } from "react";
import { CheckCircle2 } from "lucide-react";
import { SeenList } from "@/components/seen-list";
import type { LedgerDemo as LedgerDemoContent } from "@/content/profile";

/**
 * The double-entry illustration: a real table whose rows are written in order the first
 * time it scrolls into view, a document's heading row and then its debit and credit,
 * ending on the line that says the two sides are equal. Sample amounts, said so in the
 * caption; the account names are BillingRecon's own. The motion is the .seq rules in
 * case-study.css; without script or under reduced motion the table is simply complete.
 */
export function LedgerDemo({ demo }: { demo: LedgerDemoContent }) {
  let order = 0;
  const next = () => ({ "--i": order++ }) as CSSProperties;

  return (
    <figure className="mt-8">
      <h3 className="text-lg font-semibold">{demo.heading}</h3>
      <SeenList as="div" className="mt-4">
        <div
          data-seen="false"
          className="seq overflow-x-auto rounded-xl border border-border bg-card/70"
          style={{ "--step": "0.18s" } as CSSProperties}
        >
          <table className="w-full min-w-[22rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                <th scope="col" className="px-4 py-2.5 font-medium">
                  {demo.columns[0]}
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">
                  {demo.columns[1]}
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">
                  {demo.columns[2]}
                </th>
              </tr>
            </thead>
            {demo.steps.map((step) => (
              <tbody key={step.document} className="border-b border-border/70">
                <tr className="seq-item" style={next()}>
                  <th
                    scope="rowgroup"
                    colSpan={3}
                    className="px-4 pt-3 pb-1 text-left font-semibold text-accent"
                  >
                    {step.document}
                  </th>
                </tr>
                {step.lines.map((line) => (
                  <tr key={`${step.document}-${line.account}`} className="seq-item" style={next()}>
                    <td className={`px-4 py-1.5 ${line.credit ? "pl-10" : ""}`}>
                      {line.account}
                    </td>
                    <td className="px-4 py-1.5 text-right font-mono tabular-nums">
                      {line.debit ?? ""}
                    </td>
                    <td className="px-4 py-1.5 text-right font-mono tabular-nums">
                      {line.credit ?? ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
            <tfoot>
              <tr className="seq-item font-semibold" style={next()}>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
                    {demo.totalLabel}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{demo.total}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{demo.total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </SeenList>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {demo.caption}
      </figcaption>
    </figure>
  );
}
