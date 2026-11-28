import { profile, type ContactField } from "@/content/profile";
import {
  CONTACT_FIELDS,
  HONEYPOT_FIELD,
  cleanLine,
  emptyContactValues,
  fill,
  isEmail,
  normaliseContact,
  serviceLabel,
  organisationLabel,
  timelineLabel,
  validateContact,
  type ContactValues,
} from "@/lib/contact-form";
import { allowedOrigin, clientAddress, createLimiter } from "@/lib/request-guard";
import { siteUrl } from "@/lib/site";

/*
  The server side of the "Send your requirement" form. The browser posts the fields as
  JSON; this handler checks them again (the browser's own check is only a courtesy) and
  sends the site's owner one plain-text email through Resend's REST API. Like /api/ask,
  it is a small ASP.NET minimal API endpoint between the page and the provider, so the
  API key never leaves the server.

  Nothing is stored: the details exist here only for the length of the request.
*/

const RESEND_URL = "https://api.resend.com/emails";
/**
 * Resend's shared sender, used when CONTACT_FROM_EMAIL is not set. Without a verified
 * domain it is the only sender Resend accepts, and it delivers only to the address the
 * Resend account was registered with.
 */
const DEFAULT_FROM = "onboarding@resend.dev";
/** Resend rejects a request that carries no User-Agent (403, error 1010). */
const USER_AGENT = "portfolio-contact-form/1.0";
/** The values .env.example ships with. They are placeholders, so they count as "not set". */
const PLACEHOLDER_KEY = "your-key-here";
const PLACEHOLDER_TO = "you@example.com";

/** A full form is about 3 KB; anything much larger is not from the form. */
const MAX_BODY_LENGTH = 16_000;
/** How long Resend gets to answer before the visitor is told it failed. */
const SEND_TIMEOUT_MS = 10_000;

/** How many messages one address may send within the window. */
const LIMIT = 3;
const WINDOW_MS = 10 * 60_000;

const overLimit = createLimiter(LIMIT, WINDOW_MS);

type Errors = Partial<Record<ContactField, string>>;

/** Every answer is JSON and is never cached: { message } and, for a 400, { errors }. */
function reply(message: string, status: number, errors?: Errors): Response {
  return Response.json(errors ? { message, errors } : { message }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

/** The email's text: one line per field, then the details, then where it came from. */
function emailText(values: ContactValues): string {
  const words = profile.contactForm;
  const shown: Record<ContactField, string> = {
    ...values,
    organisation: organisationLabel(values.organisation) ?? "",
    service: serviceLabel(values.service) ?? "",
    timeline: timelineLabel(values.timeline) ?? "",
  };
  const lines = CONTACT_FIELDS.filter((field) => field !== "details").map(
    (field) => `${words.fields[field].label}: ${shown[field] || words.email.notGiven}`,
  );
  return [
    ...lines,
    "",
    `${words.fields.details.label}:`,
    values.details,
    "",
    fill(words.email.footer, { site: siteUrl.host }),
  ].join("\n");
}

export async function POST(request: Request): Promise<Response> {
  const words = profile.contactForm;

  if (!allowedOrigin(request.headers.get("origin"))) {
    return reply(words.failed, 403);
  }
  if (overLimit(clientAddress(request))) return reply(words.busy, 429);

  // The body must be a JSON object whose fields are all text.
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_LENGTH) return reply(words.failed, 400);
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return reply(words.failed, 400);
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return reply(words.failed, 400);
  }

  // The trap field: people never fill it. Answer as if all went well and send nothing,
  // so the program that filled it learns nothing.
  const trap = body[HONEYPOT_FIELD];
  if (trap !== undefined && trap !== "") return reply(words.sent, 200);

  const typed: ContactValues = { ...emptyContactValues };
  for (const field of CONTACT_FIELDS) {
    const value = body[field];
    if (value === undefined) continue;
    if (typeof value !== "string") return reply(words.failed, 400);
    typed[field] = value;
  }
  const values = normaliseContact(typed);
  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) {
    return reply(words.checkFields, 400, errors);
  }

  // Read at request time, never at module level and never from a NEXT_PUBLIC_ variable:
  // the build then passes with nothing set, and nothing is put into a bundle. The
  // receiving address comes only from the environment, never from profile.ts.
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (
    !apiKey ||
    apiKey === PLACEHOLDER_KEY ||
    !to ||
    to === PLACEHOLDER_TO ||
    !isEmail(to)
  ) {
    return reply(words.unavailable, 503);
  }
  const from = cleanLine(process.env.CONTACT_FROM_EMAIL ?? "") || DEFAULT_FROM;

  // The subject and Reply-To become email headers. Their parts went through cleanLine
  // in normaliseContact, and the whole subject goes through it once more, so nothing
  // typed by a visitor can start a new header line.
  const subject = cleanLine(
    fill(words.email.subject, {
      name: values.name,
      service: serviceLabel(values.service) ?? "",
    }),
  );

  try {
    const sent = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text: emailText(values),
        reply_to: values.email,
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });
    if (!sent.ok) {
      // Only the status is logged. What the visitor typed never goes into a log.
      console.error("contact: the provider returned an error", sent.status);
      return reply(words.failed, 502);
    }
    return reply(words.sent, 200);
  } catch {
    console.error("contact: the provider could not be reached");
    return reply(words.failed, 502);
  }
}
