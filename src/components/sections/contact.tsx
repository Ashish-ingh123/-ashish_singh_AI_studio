import type { ComponentType } from "react";
import { Mail, Phone } from "lucide-react";
import { CopyEmailButton } from "@/components/copy-email-button";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { ContactFormLoader } from "@/components/contact-form-loader";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { Section } from "@/components/section";
import { profile } from "@/content/profile";

type IconProps = { className?: string; "aria-hidden"?: "true" };

/** One round icon button in the row at the bottom of the section. */
type IconLink = {
  /** The link's accessible name, also shown as its tooltip. */
  label: string;
  href: string;
  Icon: ComponentType<IconProps>;
  /** External links open in a new tab. */
  external: boolean;
};

// The email address and the phone number as large links. On small phones the size follows
// the screen width (16px at 320px, 18px from 360px up), so the email address still fits
// on one line beside its icon. Narrower than about 280px it wraps (break-all on its text)
// instead of pushing the page sideways.
const detailLinkClasses =
  "group flex items-center gap-2 rounded-md py-2 font-display text-[clamp(0.875rem,5vw,1.125rem)] leading-snug font-semibold text-foreground transition-colors duration-200 hover:text-accent sm:gap-3 sm:text-2xl";

const detailIconClasses = "h-5 w-5 shrink-0 text-accent sm:h-6 sm:w-6";

// The underline sits on the text only, so it does not run under the icon. link-draw
// (globals.css) draws it in from the left when the link is hovered or focused.
const detailTextClasses = "link-draw";

// Round icon buttons. The hover lift and the press use the CSS translate and scale
// properties (what Tailwind's utilities set), so the transition list names those, and
// they only run when the visitor allows motion (motion-safe). The colour changes and the
// glow under the button stay on for everyone.
const iconLinkClasses =
  "inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/60 text-foreground transition-[translate,scale,box-shadow,background-color,color,border-color] duration-200 ease-out hover:border-accent/50 hover:bg-muted hover:text-accent hover:shadow-[0_10px_24px_-10px_var(--glow)] motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.96]";

export function Contact() {
  const { email, phone, linkedin, github } = profile.links;
  const labels = profile.labels.contact;
  const form = profile.contactForm;
  const emailHref = `mailto:${email}`;
  // A tel: link works like mailto: but starts a call. It takes the bare number: the
  // leading plus and the digits, without the spaces used for display.
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  // Email and phone are the two large links, so the row of round buttons under them holds
  // only the places to look further. Listing all four again would repeat the section.
  const iconLinks: IconLink[] = [
    { label: labels.linkedin, href: linkedin, Icon: LinkedInIcon, external: true },
    { label: labels.github, href: github, Icon: GitHubIcon, external: true },
  ];

  return (
    <Section
      id="contact"
      intro={profile.contactNote}
      space="roomy"
      align="center"
    >
      {/*
        "isolate" gives this block its own stacking order, so the glow's negative z-index
        puts it behind the links here and not behind the whole page.
      */}
      <div className="relative isolate">
        {/* A soft glow behind the details, purely decorative; see contact.css. */}
        <div aria-hidden="true" className="contact-halo" />

        <RevealGroup className="flex flex-col items-center text-center">
          {/* address is the HTML element for "how to reach this person". */}
          <address className="flex flex-col items-center not-italic">
            <RevealItem>
              <a href={emailHref} className={detailLinkClasses}>
                <Mail className={detailIconClasses} aria-hidden="true" />
                <span className={`${detailTextClasses} min-w-0 break-all`}>
                  {email}
                </span>
              </a>
            </RevealItem>
            <RevealItem>
              <a href={phoneHref} className={detailLinkClasses}>
                <Phone className={detailIconClasses} aria-hidden="true" />
                <span className={`${detailTextClasses} whitespace-nowrap`}>
                  {phone}
                </span>
              </a>
            </RevealItem>
          </address>

          {/* The space above leaves room for the button's "Email copied" toast. */}
          <RevealItem className="mt-10">
            <CopyEmailButton email={email} />
          </RevealItem>

          <ul
            aria-label={labels.links}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {iconLinks.map(({ label, href, Icon, external }) => (
              <li key={label}>
                <RevealItem>
                  <a
                    href={href}
                    aria-label={label}
                    title={label}
                    className={iconLinkClasses}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </RevealItem>
              </li>
            ))}
          </ul>
        </RevealGroup>
      </div>

      {/*
        "Request a demo or send your requirement". What a visitor must always be able to read is rendered
        here, on the server: the heading, the intro and the line about what happens to
        the details. Only the working part (the fields and the result) is loaded later,
        by ContactFormLoader. A glass card without the hover lift: a form should stay put.
      */}
      <Reveal className="mx-auto mt-14 max-w-2xl text-left sm:mt-16">
        <div
          id="requirement"
          className="glass-card rounded-2xl p-5 text-card-foreground sm:p-7"
        >
          <h3 className="text-title font-semibold">{form.heading}</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            {form.intro}
          </p>

          <div className="mt-5">
            <ContactFormLoader />
            <noscript>
              <p className="text-sm leading-relaxed">{form.noScript}</p>
            </noscript>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {form.privacy}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
