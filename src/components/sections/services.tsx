import {
  CalendarClock,
  Cloud,
  Database,
  Layers,
  Plug,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cardClasses } from "@/components/card";
import { RagPipeline } from "@/components/rag-pipeline";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { Section } from "@/components/section";
import { SeenList } from "@/components/seen-list";
import { ServiceDrawing } from "@/components/service-drawing";
import { profile, type Service, type ServiceIcon } from "@/content/profile";

// The content file names an icon by key; this lookup turns the key into a component.
// Record<ServiceIcon, ...> makes TypeScript insist that every key has an icon.
const icons: Record<ServiceIcon, LucideIcon> = {
  fullStack: Layers,
  backend: Database,
  integrations: Plug,
  cloud: Cloud,
  ai: Sparkles,
  automation: CalendarClock,
  support: Wrench,
};

/**
 * The shape of a card that sits between the card that opens the grid and the one that
 * closes it. The grid has six columns on a wide screen and two on a tablet:
 *
 *   - small: two of the six columns, one of the two;
 *   - half:  three of the six, one of the two;
 *   - wide:  four of the six, and both of the two.
 */
type Shape = "small" | "half" | "wide";

// Written out in full, because Tailwind only generates a class it can find as a whole
// word in the source.
const shapeClasses: Record<Shape, string> = {
  small: "lg:col-span-2",
  half: "lg:col-span-3",
  wide: "sm:col-span-2 lg:col-span-4",
};

// Five cards in between, which is seven services. With the opening card they fill three
// rows of the six columns exactly (4 + 2, 2 + 4, 3 + 3), and on a tablet the wide one
// takes a row to itself between two pairs.
const fiveBetween: Shape[] = ["small", "small", "wide", "half", "half"];

/**
 * The shape of the card at this place among the cards in between. Any other number of
 * them is all small cards, which fills the grid exactly when there are four.
 */
function shapeOf(index: number, count: number): Shape {
  if (count === fiveBetween.length) return fiveBetween.at(index) ?? "small";
  return "small";
}

/** The service's icon in its small tinted square. */
function IconTile({ icon }: { icon: ServiceIcon }) {
  const Icon = icons[icon];
  return (
    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  );
}

/**
 * A wide card. From sm the text and the drawing sit side by side, centred on each other;
 * on a phone the drawing goes under the text. `large` is for the card that opens the
 * grid, which is set in the larger type.
 */
function WideCard({
  service,
  large = false,
}: {
  service: Service;
  large?: boolean;
}) {
  return (
    <article
      className={`${cardClasses} h-full p-5 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-8 sm:p-6`}
    >
      <div>
        <IconTile icon={service.icon} />
        <h3
          className={`mt-4 font-semibold ${large ? "text-title" : "text-lg"}`}
        >
          {service.title}
        </h3>
        <p
          className={`max-w-[30rem] leading-relaxed text-muted-foreground ${
            large ? "mt-2.5" : "mt-2 text-sm"
          }`}
        >
          {service.description}
        </p>
      </div>
      <ServiceDrawing icon={service.icon} className="mt-5 sm:mt-0" />
    </article>
  );
}

/** A small or half card: the icon and the drawing on one line, the text under them. */
function SmallCard({ service }: { service: Service }) {
  return (
    <article className={`${cardClasses} h-full p-5 sm:p-6`}>
      <div className="flex items-start justify-between gap-3">
        <IconTile icon={service.icon} />
        <ServiceDrawing icon={service.icon} />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {service.description}
      </p>
    </article>
  );
}

/**
 * The services as a grid of unequal cells (a "bento"), so the two that matter most are
 * the two largest:
 *
 *   - the first service in the list is the wide card that opens the grid;
 *   - the service the pipeline explains (profile.pipeline.service) is the full-width card
 *     that closes it, with the pipeline under its title and text;
 *   - the others are the cards in between, in the order of the list.
 *
 * On a wide screen the grid has six columns and is drawn for seven services:
 *
 *   opening card 4 + small 2
 *   small 2 + wide 4
 *   half 3 + half 3
 *   closing card 6
 *
 * On a tablet it has two columns (the opening, wide and closing cards take both), and on
 * a phone everything is one column.
 */
export function Services() {
  const { services, pipeline } = profile;
  const featured = services.find((service) => service.icon === pipeline.service);
  // Array destructuring, as in C# list patterns: the first item, then all the others.
  const [lead, ...others] = services.filter((service) => service !== featured);

  return (
    <Section id="services" intro={profile.servicesIntro}>
      <RevealGroup>
        {/*
          SeenList is a <ul> that also tells each card when it first scrolls into view,
          which is what sends the dot along the card's drawing (see services.css).
        */}
        <SeenList className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {lead && (
            <li
              data-seen="false"
              className="service-card sm:col-span-2 lg:col-span-4"
            >
              <RevealItem className="h-full">
                <WideCard service={lead} large />
              </RevealItem>
            </li>
          )}

          {others.map((service, index) => {
            const shape = shapeOf(index, others.length);
            return (
              <li
                key={service.title}
                data-seen="false"
                className={`service-card ${shapeClasses[shape]}`}
              >
                <RevealItem className="h-full">
                  {shape === "wide" ? (
                    <WideCard service={service} />
                  ) : (
                    <SmallCard service={service} />
                  )}
                </RevealItem>
              </li>
            );
          })}

          {/*
            The closing cell: one service and the explanation of how it works, as one
            thing. It has its own Reveal because it comes into view well after the cards
            above it, and no hover lift: a panel this wide should stay put.
          */}
          <li className="sm:col-span-2 lg:col-span-6">
            <Reveal>
              <article className="glass-card rounded-2xl px-5 py-6 text-card-foreground sm:p-8">
                {/* The hairline under this block separates the service from the pipeline. */}
                {featured && (
                  <div className="mb-5 flex flex-col gap-4 border-b border-accent/20 pb-6 sm:flex-row">
                    <IconTile icon={featured.icon} />
                    <div>
                      <h3 className="text-title font-semibold">
                        {featured.title}
                      </h3>
                      <p className="mt-2 max-w-[44rem] leading-relaxed text-muted-foreground">
                        {featured.description}
                      </p>
                    </div>
                  </div>
                )}
                <RagPipeline />
              </article>
            </Reveal>
          </li>
        </SeenList>
      </RevealGroup>
    </Section>
  );
}
