import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { cardClasses } from "@/components/card";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { Shot } from "@/components/screenshot";
import { ScreenshotViewer } from "@/components/screenshot-viewer";
import { Section } from "@/components/section";
import { profile } from "@/content/profile";
import { findShot } from "@/lib/screenshots";

/**
 * BillingRecon, the company's product (Step 4 of the Ashvanta site, 2026-11-28): what it
 * is (the intro beside the heading), who it is for, the honest status line and the two
 * ways on, and beside them the promises about money, each a rule that is built. Every
 * word is profile.product.
 */
export function Product() {
  const { product, hero } = profile;
  const homeShot = findShot(product.homeShot);

  return (
    <Section id="product" intro={product.intro}>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <Reveal>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {product.audience}
          </p>
          {/*
            The status line is plain text with a dot, not a badge: it is a sentence, and a
            visitor should read it as one. "Built" here never means "in use".
          */}
          <p className="mt-6 inline-flex items-start gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium">
            <span
              aria-hidden="true"
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent"
            />
            {product.status}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="#contact" className="min-h-11">
              {hero.primaryAction}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </ButtonLink>
            <ButtonLink
              href="#features"
              variant="secondary"
              className="min-h-11"
            >
              {product.featuresAction}
            </ButtonLink>
          </div>
        </Reveal>

        <div className={`${cardClasses} p-6 sm:p-8`}>
          <h3 className="text-lg font-semibold">{product.promiseHeading}</h3>
          <RevealGroup className="mt-5">
            <ul className="grid gap-5 sm:grid-cols-2">
              {product.promises.map((promise) => (
                <li key={promise.title}>
                  <RevealItem className="flex gap-3">
                    <Check
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-medium">{promise.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {promise.text}
                      </p>
                    </div>
                  </RevealItem>
                </li>
              ))}
            </ul>
          </RevealGroup>
        </div>
      </div>

      {/* One real screen of the product under the promises (Step 6); it opens full size. */}
      <Reveal className="mt-12">
        <Shot shot={homeShot} sizes="(min-width: 1152px) 1104px, 92vw" />
      </Reveal>
      <ScreenshotViewer shots={[homeShot]} />
    </Section>
  );
}
