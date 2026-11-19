import { Sparkles } from "lucide-react";
import { AskBoxLoader } from "@/components/ask-box-loader";
import { Reveal } from "@/components/reveal";
import { profile } from "@/content/profile";

/**
 * "Ask about Ashish": a question box whose answers are written by an AI model from the
 * content of profile.ts. It sits just above the Contact section, well below the first
 * screen, and has no number and no place in the nav: it is a tool, not a section.
 *
 * What the visitor must always be able to read is rendered here, on the server: the
 * heading, the badge that says the answers are AI-generated, and the notice about where
 * a question is sent. Only the working part (the field and the answer) is loaded later,
 * by AskBoxLoader.
 */
export function Ask() {
  const { ask } = profile;

  return (
    <section id="ask" aria-labelledby="ask-heading" className="pb-4 sm:pb-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-3xl">
          {/* A glass card without the hover lift: a form should stay put. */}
          <div className="glass-card rounded-2xl p-5 text-card-foreground sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <h2 id="ask-heading" className="text-title font-semibold">
                {ask.heading}
              </h2>
              {/*
                The look of an accent Badge, written out here because this label is a
                whole sentence and has to be allowed to wrap on a narrow phone, which
                Badge never does.
              */}
              <p className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {ask.aiLabel}
              </p>
            </div>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {ask.intro}
            </p>

            <div className="mt-5">
              <AskBoxLoader />
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {ask.dataNotice}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
