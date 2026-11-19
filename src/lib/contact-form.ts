import {
  profile,
  type ContactField,
  type ContactTimeline,
  type ServiceIcon,
} from "@/content/profile";

/*
  The rules of the "Send your requirement" form, in one place. The form in the browser
  and the server route both call validateContact, so a rule can never differ between the
  two. Think of one validator class used by a Blazor form and again by the controller
  it posts to: the browser's check is for the visitor's comfort, the server's is the one
  that counts.

  Nothing here needs a server, so the file is safe to load in the browser.
*/

/** The fields in the order they are shown; focus goes to the first one with a mistake. */
export const CONTACT_FIELDS: ContactField[] = [
  "name",
  "email",
  "phone",
  "company",
  "service",
  "budget",
  "timeline",
  "details",
];

/** Shortest and longest text each typed field accepts, counted after trimming. */
export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  // 254 is the longest address the email standards allow.
  email: { min: 3, max: 254 },
  phone: { min: 0, max: 30 },
  company: { min: 0, max: 100 },
  budget: { min: 0, max: 60 },
  details: { min: 20, max: 2000 },
} as const;

/**
 * The name of the trap field. People never see it and never fill it; a program that
 * fills in every field it finds does, and its message is then dropped.
 */
export const HONEYPOT_FIELD = "website";

/** What "What you need" may hold: a service, named by its icon key, or "other". */
export type ContactService = ServiceIcon | "other";

/** Everything the form sends, as text. An empty string means "left empty". */
export type ContactValues = Record<ContactField, string>;

export const emptyContactValues: ContactValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  budget: "",
  timeline: "",
  details: "",
};

/** The lines of "What you need": every service in profile.ts, then "Other". */
export const serviceOptions: { key: ContactService; label: string }[] = [
  ...profile.services.map((service) => ({
    key: service.icon,
    label: service.title,
  })),
  { key: "other", label: profile.contactForm.otherService },
];

export const timelineOptions: { key: ContactTimeline; label: string }[] =
  profile.contactForm.timelines;

/** The text shown for a chosen service or timeline; undefined for an unknown key. */
export function serviceLabel(key: string): string | undefined {
  return serviceOptions.find((option) => option.key === key)?.label;
}

export function timelineLabel(key: string): string | undefined {
  return timelineOptions.find((option) => option.key === key)?.label;
}

/** Puts values into a sentence from profile.ts: "{max}" becomes the value named max. */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? String(values[key]) : whole,
  );
}

/**
 * Makes one-line text safe for a single line: line breaks, tabs and other control
 * characters become spaces, and runs of spaces become one. Anything that goes into an
 * email header (the subject, Reply-To) must pass through here, so a visitor cannot
 * start a new header line.
 */
export function cleanLine(text: string): string {
  return text
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Tidies what was typed: one-line fields are cleaned, the details keep their lines. */
export function normaliseContact(values: ContactValues): ContactValues {
  return {
    name: cleanLine(values.name),
    email: cleanLine(values.email),
    phone: cleanLine(values.phone),
    company: cleanLine(values.company),
    service: values.service.trim(),
    budget: cleanLine(values.budget),
    timeline: values.timeline.trim(),
    // Windows line ends become plain ones, so the count is the same everywhere.
    details: values.details.replace(/\r\n?/g, "\n").trim(),
  };
}

// One @, no spaces, and a dot somewhere in the part after it. The only real proof of an
// address is a reply that arrives, so this just catches typing mistakes.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[\d\s()+-]*$/;

/** True for text that has the shape of one email address. */
export function isEmail(text: string): boolean {
  return text.length <= CONTACT_LIMITS.email.max && EMAIL_PATTERN.test(text);
}

function withinLimits(text: string, field: keyof typeof CONTACT_LIMITS): boolean {
  const { min, max } = CONTACT_LIMITS[field];
  return text.length >= min && text.length <= max;
}

/**
 * Checks values that have been through normaliseContact. Returns the message for every
 * field that breaks its rule; an empty object means the form may be sent.
 */
export function validateContact(
  values: ContactValues,
): Partial<Record<ContactField, string>> {
  const words = profile.contactForm.fields;
  const errors: Partial<Record<ContactField, string>> = {};
  const fail = (field: ContactField) => {
    const limits =
      field in CONTACT_LIMITS
        ? CONTACT_LIMITS[field as keyof typeof CONTACT_LIMITS]
        : { min: 0, max: 0 };
    errors[field] = fill(words[field].error, limits);
  };

  if (!withinLimits(values.name, "name")) fail("name");
  if (!withinLimits(values.email, "email") || !EMAIL_PATTERN.test(values.email)) {
    fail("email");
  }
  if (!withinLimits(values.phone, "phone") || !PHONE_PATTERN.test(values.phone)) {
    fail("phone");
  }
  if (!withinLimits(values.company, "company")) fail("company");
  if (!serviceLabel(values.service)) fail("service");
  if (!withinLimits(values.budget, "budget")) fail("budget");
  // The timeline may be left empty; anything else must be one of the offered answers.
  if (values.timeline && !timelineLabel(values.timeline)) fail("timeline");
  if (!withinLimits(values.details, "details")) fail("details");

  return errors;
}
