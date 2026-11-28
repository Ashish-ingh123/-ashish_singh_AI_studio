import {
  ArrowRight,
  BookOpenCheck,
  ChartColumn,
  ClipboardList,
  FileSpreadsheet,
  HandCoins,
  Info,
  Printer,
  Receipt,
  ShieldCheck,
  Undo2,
  Upload,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/badge";
import { cardClasses } from "@/components/card";
import { Roadmap } from "@/components/case-study/roadmap";
import { RevealGroup, RevealItem } from "@/components/reveal";
import { Section } from "@/components/section";
import {
  profile,
  type FeatureIcon,
  type FeatureStatus,
} from "@/content/profile";

// The content file names an icon by key; this lookup turns the key into a component.
// Record<FeatureIcon, ...> makes TypeScript insist that every key has an icon.
const icons: Record<FeatureIcon, LucideIcon> = {
  patients: Users,
  catalogue: ClipboardList,
  bills: Receipt,
  payments: Wallet,
  approvals: Undo2,
  ledger: BookOpenCheck,
  reports: ChartColumn,
  printing: Printer,
  shift: HandCoins,
  export: FileSpreadsheet,
  security: ShieldCheck,
  import: Upload,
};

// Built is the accent badge, Planned the dashed one, as in the case study's tables.
const statusTone: Record<FeatureStatus, BadgeTone> = {
  Built: "accent",
  Planned: "muted-outline",
};

/**
 * What BillingRecon does (Step 4 of the Ashvanta site, 2026-11-28): a card per part, each
 * marked Built or Planned, with any limit said on the card; then the everyday flow of
 * money in six steps; then the releases, the built one first. Every word is
 * profile.product.
 */
export function Features() {
  const { product } = profile;

  return (
    <Section id="features" intro={product.featuresIntro}>
      <RevealGroup>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {product.features.map((feature) => {
            const Icon = icons[feature.icon];
            return (
              <li key={feature.title} className="flex">
                <RevealItem className={`${cardClasses} flex w-full flex-col p-5`}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <Badge tone={statusTone[feature.status]}>
                      {feature.status}
                    </Badge>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.text}
                  </p>
                  {feature.note && (
                    <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
                      <Info
                        className="mt-px h-3.5 w-3.5 shrink-0 text-accent"
                        aria-hidden="true"
                      />
                      {feature.note}
                    </p>
                  )}
                </RevealItem>
              </li>
            );
          })}
        </ul>
      </RevealGroup>

      {/*
        The flow: an ordered list, so a screen reader hears six numbered steps. The arrows
        between them are decoration. Two to a row on a phone, three from sm, all six in one
        row from lg; an arrow is drawn only where the next step is beside it on that row.
      */}
      <h3 className="mt-16 text-lg font-semibold">{product.flowHeading}</h3>
      <ol className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {product.flow.map((step, index) => (
          <li
            key={step.name}
            className="relative rounded-xl border border-border bg-card/60 p-4"
          >
            <span className="font-mono text-xs text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-1 font-semibold">{step.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {step.text}
            </p>
            {index < product.flow.length - 1 && (
              <ArrowRight
                aria-hidden="true"
                className="absolute top-1/2 -right-3 z-10 hidden h-4 w-4 -translate-y-1/2 rounded-full bg-background text-accent lg:block"
              />
            )}
          </li>
        ))}
      </ol>

      <h3 className="mt-16 text-lg font-semibold">{product.releasesHeading}</h3>
      <div className="mt-6 max-w-3xl">
        <Roadmap releases={product.releases} heading="h4" />
      </div>
    </Section>
  );
}
