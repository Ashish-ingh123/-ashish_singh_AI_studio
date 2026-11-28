"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck, Send } from "lucide-react";
import { buttonClasses } from "@/components/button-link";
import { profile, type ContactField } from "@/content/profile";
import {
  CONTACT_FIELDS,
  CONTACT_LIMITS,
  HONEYPOT_FIELD,
  emptyContactValues,
  normaliseContact,
  serviceOptions,
  organisationOptions,
  timelineOptions,
  validateContact,
  type ContactValues,
} from "@/lib/contact-form";

const words = profile.contactForm;

// The count under the details is shown only once the text is getting close to the limit.
const COUNT_FROM = CONTACT_LIMITS.details.max - 200;
// How long the server gets before the visitor is told that sending failed.
const TIMEOUT_MS = 15_000;

/** Where a requirement is on its way to the owner's inbox. */
type Phase = "idle" | "sending" | "sent" | "failed";
type Errors = Partial<Record<ContactField, string>>;
type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

type Props = {
  /** Changes whenever something outside (the command palette) asks for the form. */
  focusSignal: number;
};

// 16px text (text-base): anything smaller makes an iPhone zoom in when a field is tapped.
const controlClasses =
  "w-full min-w-0 rounded-xl border bg-muted/60 px-3.5 text-base text-foreground placeholder:text-muted-foreground";

/**
 * The working part of "Request a demo or send your requirement": the fields, the send button and the
 * result. It checks the fields with the same function the server uses
 * (src/lib/contact-form.ts), posts them to /api/contact and says what happened.
 *
 * A mistake is shown under its field and tied to it with aria-describedby, and the
 * cursor goes to the first field that has one, so a screen reader reads the field's
 * name and its message together.
 */
export function ContactForm({ focusSignal }: Props) {
  const [values, setValues] = useState<ContactValues>(emptyContactValues);
  const [errors, setErrors] = useState<Errors>({});
  // Mistakes are shown only after the first try to send; from then on they follow the typing.
  const [tried, setTried] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [problem, setProblem] = useState("");
  // The short line read out by a screen reader: "check the fields", "sending", "sent".
  const [status, setStatus] = useState("");
  // Raised to send the cursor to the first field with a mistake, once it is drawn.
  const [focusFirst, setFocusFirst] = useState(0);
  const controls = useRef<Partial<Record<ContactField, Control | null>>>({});
  const trapRef = useRef<HTMLInputElement>(null);
  const request = useRef<AbortController | null>(null);
  const baseId = useId();

  // The command palette's entry lands here: put the cursor in the first field.
  useEffect(() => {
    if (focusSignal > 0) controls.current.name?.focus();
  }, [focusSignal]);

  useEffect(() => {
    if (focusFirst === 0) return;
    const first = CONTACT_FIELDS.find((field) => errors[field]);
    if (first) controls.current[first]?.focus();
    // Only a new request to move the cursor should run this, not every change of errors.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusFirst]);

  // Cancel whatever is still running when the form goes away.
  useEffect(() => () => request.current?.abort(), []);

  const sending = phase === "sending";

  function change(field: ContactField, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (tried) setErrors(validateContact(normaliseContact(next)));
    if (phase === "sent" || phase === "failed") {
      setPhase("idle");
      setStatus("");
    }
  }

  function showErrors(found: Errors) {
    setTried(true);
    setErrors(found);
    setPhase("idle");
    setStatus(words.checkFields);
    setFocusFirst((count) => count + 1);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const clean = normaliseContact(values);
    const found = validateContact(clean);
    if (Object.keys(found).length > 0) {
      showErrors(found);
      return;
    }

    const controller = new AbortController();
    request.current = controller;
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    setErrors({});
    setProblem("");
    setPhase("sending");
    setStatus(words.sending);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...clean,
          [HONEYPOT_FIELD]: trapRef.current?.value ?? "",
        }),
        signal: controller.signal,
      });
      // The server answers with a ready sentence from profile.ts, and for a form it
      // does not accept, with a message for each field.
      const answer = (await response.json().catch(() => ({}))) as {
        message?: string;
        errors?: Errors;
      };

      if (response.ok) {
        setValues(emptyContactValues);
        setTried(false);
        setPhase("sent");
        setStatus("");
      } else if (response.status === 400 && answer.errors) {
        showErrors(answer.errors);
      } else {
        setProblem(answer.message || words.failed);
        setPhase("failed");
        setStatus("");
      }
    } catch {
      setProblem(words.failed);
      setPhase("failed");
      setStatus("");
    } finally {
      window.clearTimeout(timer);
    }
  }

  /** What every field shares: its ids, its value and the wiring of its error message. */
  function control(field: ContactField, required: boolean, describedBy?: string) {
    const id = `${baseId}-${field}`;
    const error = errors[field];
    const described = [error ? `${id}-error` : "", describedBy ?? ""]
      .filter(Boolean)
      .join(" ");
    return {
      id,
      name: field,
      value: values[field],
      required,
      "aria-invalid": error ? (true as const) : undefined,
      "aria-describedby": described || undefined,
      ref: (element: Control | null) => {
        controls.current[field] = element;
      },
    };
  }

  function label(field: ContactField, required: boolean) {
    return (
      <label htmlFor={`${baseId}-${field}`} className="block text-sm font-medium">
        {words.fields[field].label}
        {!required && (
          <span className="font-normal text-muted-foreground">
            {" "}
            ({words.optional})
          </span>
        )}
      </label>
    );
  }

  function errorLine(field: ContactField) {
    const error = errors[field];
    if (!error) return null;
    return (
      <p
        id={`${baseId}-${field}-error`}
        className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-foreground"
      >
        <CircleAlert
          className="mt-0.5 h-4 w-4 shrink-0 text-accent"
          aria-hidden="true"
        />
        {error}
      </p>
    );
  }

  // A field with a mistake gets the accent border, plus the icon and the words under
  // it, so the mistake is never shown by colour alone.
  const border = (field: ContactField) =>
    errors[field] ? "border-accent" : "border-border";

  function textField(
    field: "name" | "email" | "phone" | "company" | "budget",
    required: boolean,
    type: "text" | "email" | "tel",
    autoComplete: string,
  ) {
    return (
      <div>
        {label(field, required)}
        <input
          {...control(field, required)}
          type={type}
          autoComplete={autoComplete}
          maxLength={CONTACT_LIMITS[field].max}
          placeholder={words.fields[field].placeholder}
          onChange={(event) => change(field, event.target.value)}
          className={`${controlClasses} ${border(field)} mt-2 h-12`}
        />
        {errorLine(field)}
      </div>
    );
  }

  function selectField(
    field: "service" | "timeline" | "organisation",
    required: boolean,
    options: { key: string; label: string }[],
  ) {
    return (
      <div>
        {label(field, required)}
        <select
          {...control(field, required)}
          onChange={(event) => change(field, event.target.value)}
          className={`${controlClasses} ${border(field)} mt-2 h-12`}
        >
          <option value="">{words.choose}</option>
          {options.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
        {errorLine(field)}
      </div>
    );
  }

  const countId = `${baseId}-details-count`;
  const showCount = values.details.length >= COUNT_FROM;

  return (
    <div>
      {/* noValidate: the checks and their messages are ours, so they read the same in
          every browser and can be tied to the fields for a screen reader. */}
      <form onSubmit={onSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          {textField("name", true, "text", "name")}
          {textField("email", true, "email", "email")}
          {textField("phone", false, "tel", "tel")}
          {textField("company", false, "text", "organization")}
          {selectField("organisation", false, organisationOptions)}
          {selectField("service", true, serviceOptions)}
          {textField("budget", false, "text", "off")}
          {selectField("timeline", false, timelineOptions)}
          <div className="sm:col-span-2">
            {label("details", true)}
            <textarea
              {...control("details", true, showCount ? countId : undefined)}
              rows={5}
              maxLength={CONTACT_LIMITS.details.max}
              placeholder={words.fields.details.placeholder}
              onChange={(event) => change("details", event.target.value)}
              className={`${controlClasses} ${border("details")} mt-2 block min-h-36 resize-y py-3 leading-relaxed`}
            />
            <div className="flex items-start justify-between gap-3">
              <div>{errorLine("details")}</div>
              {showCount && (
                <p
                  id={countId}
                  className="mt-1.5 shrink-0 text-xs text-muted-foreground"
                >
                  {values.details.length} / {CONTACT_LIMITS.details.max}
                </p>
              )}
            </div>
          </div>
        </div>

        {/*
          The trap for programs that fill in every field they find. It is moved off the
          screen (contact.css), hidden from screen readers and skipped by the Tab key,
          so a person never meets it.
        */}
        <div className="contact-trap" aria-hidden="true">
          <input
            ref={trapRef}
            type="text"
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        {/* aria-disabled, not disabled: a disabled button would drop the keyboard focus. */}
        <button
          type="submit"
          aria-disabled={sending}
          className={`${buttonClasses("primary")} mt-5 h-12 w-full sm:w-auto ${
            sending ? "opacity-70" : ""
          }`}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {sending ? words.sending : words.submit}
        </button>
      </form>

      {/* Read out when it changes: the fields need checking, the form is being sent. */}
      <p role="status" aria-live="polite" className="sr-only">
        {status}
      </p>

      {/* The thank-you message, read out when it appears. */}
      <div
        role="status"
        aria-live="polite"
        className={
          phase === "sent"
            ? "animate-fade-up mt-4 flex items-start gap-2.5 rounded-xl border border-accent/25 bg-accent/5 p-4 leading-relaxed"
            : "sr-only"
        }
      >
        {phase === "sent" && (
          <>
            <CircleCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-accent"
              aria-hidden="true"
            />
            <p>{words.sent}</p>
          </>
        )}
      </div>

      {/* role="alert" makes a screen reader read a failure out at once. */}
      <div
        role="alert"
        className={
          phase === "failed"
            ? "animate-fade-up mt-4 rounded-xl border border-border bg-muted/60 p-4 text-sm leading-relaxed"
            : "sr-only"
        }
      >
        {phase === "failed" && (
          <p>
            {problem}{" "}
            <a
              href={`mailto:${profile.links.email}`}
              className="font-semibold text-accent underline underline-offset-4"
            >
              {words.emailInstead}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
