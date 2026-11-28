import type { ReactNode } from "react";
import { Hammer } from "lucide-react";
import { cardClasses } from "@/components/card";
import { Reveal } from "@/components/reveal";
import { SocialLinks } from "@/components/social-links";
import { Section } from "@/components/section";
import { profile } from "@/content/profile";

/**
 * One fact of the panel: a small label over its value. A wide fact takes both columns of
 * the panel, for a value too long for half its width.
 */
function Fact({
  label,
  wide = false,
  children,
}: {
  label: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={wide ? "col-span-2" : undefined}>
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium sm:text-base">{children}</dd>
    </div>
  );
}

/**
 * The company (Step 7 of the Ashvanta site, 2026-11-28): its story on the left with the
 * founder's card under it, and beside them the company at a glance, a panel of facts. The
 * panel adds no content of its own: its labels come from profile.labels.about and every
 * value is read from the field that already holds it, so nothing is typed twice. The
 * founder's text names no employer.
 */
export function About() {
  const labels = profile.labels.about;
  const { company } = profile;
  const productItem = profile.nav.find((item) => item.id === "product");

  return (
    <Section id="about" space="compact">
      <Reveal className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          {company.story.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-4 text-lg leading-relaxed text-muted-foreground first:mt-0"
            >
              {paragraph}
            </p>
          ))}

          {/* The founder: a card of his own, with his links. */}
          <div className={`${cardClasses} mt-8 p-5 sm:p-6`}>
            <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {company.founderHeading}
            </h3>
            <p className="mt-2 text-lg font-semibold">
              {profile.name}
              <span className="font-normal text-muted-foreground">
                {" "}
                · {company.founderRole}
              </span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {company.founderText}
            </p>
            <SocialLinks className="-ml-2.5 mt-3" />
          </div>
        </div>

        {/*
          dl is the HTML list for name and value pairs: each dt names a fact and the dd
          after it gives the value, so a screen reader reads them as pairs. Inside, the
          facts sit in two columns.
        */}
        <dl
          className={`${cardClasses} grid grid-cols-2 gap-x-6 gap-y-5 p-5 sm:p-6 lg:col-span-5 lg:self-start`}
        >
          <Fact label={labels.founder}>{profile.name}</Fact>
          <Fact label={labels.location}>{profile.location}</Fact>
          <Fact label={labels.focus} wide>
            {profile.hero.badge}
          </Fact>
          <Fact label={labels.product} wide>
            <a href="#product" className="text-accent">
              <span className="link-draw">{productItem?.label}</span>
            </a>
          </Fact>
          <Fact label={labels.availability} wide>
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent"
              />
              {profile.product.status}
            </span>
          </Fact>

          {/* What is being built now is the freshest fact, so it gets a row of its own. */}
          <div className="col-span-2 border-t border-accent/20 pt-5">
            <dt className="flex items-center gap-2 text-sm font-semibold text-accent">
              <Hammer className="h-4 w-4" aria-hidden="true" />
              {labels.now}
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed">
              {profile.currentlyBuilding}
            </dd>
          </div>
        </dl>
      </Reveal>
    </Section>
  );
}
