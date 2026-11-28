import { ArrowRight, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { HeroFieldLoader } from "@/components/hero-field-loader";
import { SocialLinks } from "@/components/social-links";
import { TypedRoles } from "@/components/typed-roles";
import { profile } from "@/content/profile";

/**
 * The first screen: the company, what BillingRecon does and the two things to do next,
 * in that order, over a live field of points (hero-field.tsx). The text is rendered on
 * the server and is complete before any script runs; the field arrives later and sits
 * behind it.
 */
export function Hero() {
  const { hero } = profile;

  return (
    // "isolate" gives the hero its own stacking order, so the field's z-index of -1 puts it
    // behind the hero's text and not behind the whole page. overflow-clip cuts the field
    // off at the hero's edges without turning the hero into a scroll container.
    <section
      aria-label="Introduction"
      className="hero relative isolate overflow-clip"
    >
      {/* Decoration, drawn on a canvas and loaded after the first paint. */}
      <HeroFieldLoader
        labels={hero.fieldLabels}
        queryLabel={hero.fieldQueryLabel}
      />

      {/*
        pt-32 leaves a strip above the text where the field shows at full strength on
        narrow screens (BAND in hero-field.tsx). From lg the field has the right-hand side
        to itself, so the text moves up, and hero.css centres it in the first screen.
      */}
      <div className="mx-auto w-full max-w-6xl px-4 pt-32 pb-14 sm:px-6 sm:pb-16 lg:pt-12">
        <div className="max-w-2xl">
          <div className="animate-fade-up flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-medium">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent"
              />
              {hero.badge}
            </p>
            <p className="inline-flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {profile.location}
            </p>
          </div>

          {/*
            One heading for screen readers and search engines, drawn as three lines. The
            lines slide in but do not fade (animate-rise, not animate-fade-up): this is
            the largest text on the first screen and must be visible from the first
            frame; see the note on .animate-rise in globals.css.
          */}
          <h1 className="mt-4">
            <span className="animate-rise block font-sans text-base font-normal lg:text-lg">
              {hero.greeting}{" "}
              <span className="font-semibold text-accent">{profile.name}</span>
              {hero.founderOf}{" "}
              <span className="font-semibold">{profile.brand.name}</span>
            </span>
            <span
              className="animate-rise mt-2.5 block font-sans text-xl font-normal lg:text-2xl"
              style={{ animationDelay: "60ms" }}
            >
              {hero.lead}
            </span>
            <span
              className="hero-statement animate-rise mt-0.5 block font-bold"
              style={{ animationDelay: "120ms" }}
            >
              {hero.statement}{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="text-gradient">{hero.highlight}</span>
                <span aria-hidden="true" className="highlight-ring" />
              </span>
            </span>
          </h1>
          <p
            className="animate-fade-up mt-3.5 max-w-xl text-base text-muted-foreground lg:text-lg"
            style={{ animationDelay: "180ms" }}
          >
            {hero.note}
          </p>

          {/*
            The two things to do next, on the first screen at every width. min-h-11 makes
            each button 44px tall, a comfortable target for a thumb. On a phone the icons
            take a row of their own (basis-full); the negative margin lines the first icon
            up with the text above, since each icon sits in a wider tap area.
          */}
          <div
            className="animate-fade-up mt-5.5 flex flex-wrap items-center gap-3 lg:mt-7"
            style={{ animationDelay: "240ms" }}
          >
            {/*
              data-hero-action marks this button for the header, which shows a small
              copy of it once this one has scrolled off screen (site-header.tsx).
            */}
            <ButtonLink href="#contact" className="min-h-11" data-hero-action>
              {hero.primaryAction}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </ButtonLink>
            <ButtonLink
              href="#projects"
              variant="secondary"
              className="min-h-11"
            >
              {hero.secondaryAction}
            </ButtonLink>
            <SocialLinks className="-ml-2.5 basis-full sm:ml-1 sm:basis-auto" />
          </div>

          <div
            className="animate-fade-up mt-5.5 border-l-2 border-accent/45 pl-3.5 lg:mt-7"
            style={{ animationDelay: "300ms" }}
          >
            {/*
              Screen readers get the roles as one plain sentence; the typed version is
              hidden from them so they do not hear it letter by letter. The prompt mark
              is decoration.
            */}
            <p className="font-mono text-sm text-accent">
              <span aria-hidden="true">&gt; </span>
              <span className="sr-only">
                {hero.rolePrefix} {hero.roles.join(", ")}
              </span>
              <span aria-hidden="true" className="whitespace-nowrap">
                {hero.rolePrefix} <TypedRoles roles={hero.roles} />
              </span>
            </p>
          </div>

          <p
            className="animate-fade-up mt-4.5 max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground lg:text-base"
            style={{ animationDelay: "360ms" }}
          >
            {hero.closing}
          </p>
        </div>
      </div>
    </section>
  );
}
