"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// The form is a chunk of its own, fetched only when it is about to be needed, the same
// way ask-box-loader.tsx loads the question box. ssr: false: it needs a browser to do
// anything, and the card round it (heading, intro, privacy line) is rendered on the server.
const ContactForm = dynamic(
  () => import("@/components/contact-form").then((loaded) => loaded.ContactForm),
  { ssr: false },
);

/** The name of the event that asks for the form; the command palette sends it. */
export const CONTACT_FORM_EVENT = "contact-form:open";

/**
 * Holds the place of the "Send your requirement" form and loads it at the last sensible
 * moment: when the visitor has scrolled to within a screen of it, or when the command
 * palette asks for it. So its code is never part of what the first screen downloads.
 *
 * The placeholder is as tall as the form it stands in for (contact.css), so nothing
 * below it moves when the form arrives.
 */
export function ContactFormLoader() {
  const [wanted, setWanted] = useState(false);
  // Counts requests from outside; the form puts the cursor in its first field on each.
  const [focusSignal, setFocusSignal] = useState(0);
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setWanted(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(holder);

    function onOpen() {
      setWanted(true);
      setFocusSignal((count) => count + 1);
    }
    window.addEventListener(CONTACT_FORM_EVENT, onOpen);

    return () => {
      observer.disconnect();
      window.removeEventListener(CONTACT_FORM_EVENT, onOpen);
    };
  }, []);

  return (
    <div ref={holderRef} className="contact-form-holder">
      {wanted && <ContactForm focusSignal={focusSignal} />}
    </div>
  );
}
