"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Send, Square } from "lucide-react";
import { buttonClasses } from "@/components/button-link";
import { profile } from "@/content/profile";

const words = profile.ask;

// The same limit the server enforces (src/app/api/ask/route.ts).
const MAX_LENGTH = 300;
// The count is shown only once the question is getting close to the limit.
const COUNT_FROM = 240;

/** Where a question is on its way to an answer. */
type Phase = "idle" | "waiting" | "streaming" | "done" | "failed";

type Props = {
  /** Changes whenever something outside (the command palette) asks for the box. */
  focusSignal: number;
};

/**
 * The working part of "Ask about Ashvanta": the question field, the ready-made questions
 * and the answer. It posts the question to /api/ask and shows the answer as it arrives.
 *
 * The answer is plain text from start to finish: it is put on the page as a text node,
 * never as HTML, so nothing the model writes can turn into markup or script.
 *
 * Nothing here imitates typing. The text appears as fast or as slowly as the server
 * sends it, and that is the only movement.
 */
export function AskBox({ focusSignal }: Props) {
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  // The question the current answer belongs to, shown above it.
  const [asked, setAsked] = useState("");
  const [answer, setAnswer] = useState("");
  const [problem, setProblem] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  // Lets Stop, a new question or leaving the page cancel the request in flight.
  const request = useRef<AbortController | null>(null);
  const baseId = useId();

  // The command palette's entry lands here: put the cursor in the field.
  useEffect(() => {
    if (focusSignal > 0) inputRef.current?.focus();
  }, [focusSignal]);

  // Cancel whatever is still running when the box goes away.
  useEffect(() => () => request.current?.abort(), []);

  const busy = phase === "waiting" || phase === "streaming";

  async function ask(text: string, keepFocusInField = true) {
    const wanted = text.trim();
    if (!wanted || wanted.length > MAX_LENGTH) return;

    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;

    setAsked(wanted);
    setAnswer("");
    setProblem("");
    setPhase("waiting");
    // Focus stays in the field whichever button started this, so the next question
    // can be typed straight away.
    if (keepFocusInField) inputRef.current?.focus();

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: wanted }),
        signal: controller.signal,
      });

      // The server answers every failure with a ready sentence from profile.ts.
      if (!response.ok || !response.body) {
        const message = (await response.text().catch(() => "")).trim();
        setProblem(message || words.error);
        setPhase("failed");
        return;
      }

      // Read the answer piece by piece. TextDecoder with stream: true copes with a
      // character whose bytes are split across two pieces.
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let received = "";
      setPhase("streaming");
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        received += decoder.decode(value, { stream: true });
        setAnswer(received);
      }
      received += decoder.decode();

      if (received.trim()) {
        setAnswer(received);
        setPhase("done");
      } else {
        setProblem(words.empty);
        setPhase("failed");
      }
    } catch {
      // Stop was pressed (or a new question replaced this one): keep what has
      // arrived. Anything else is a failed connection.
      if (controller.signal.aborted) {
        setPhase((current) => (current === "streaming" ? "done" : "idle"));
      } else {
        setProblem(words.error);
        setPhase("failed");
      }
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!busy) void ask(question);
  }

  function stop() {
    request.current?.abort();
    inputRef.current?.focus();
  }

  const inputId = `${baseId}-question`;
  const countId = `${baseId}-count`;
  const showCount = question.length >= COUNT_FROM;

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor={inputId} className="block text-sm font-medium">
          {words.inputLabel}
        </label>
        <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
          {/* 16px text: anything smaller makes an iPhone zoom in when the box is tapped. */}
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            maxLength={MAX_LENGTH}
            placeholder={words.placeholder}
            autoComplete="off"
            enterKeyHint="send"
            aria-describedby={showCount ? countId : undefined}
            className="h-12 w-full min-w-0 rounded-xl border border-border bg-muted/60 px-3.5 text-base text-foreground placeholder:text-muted-foreground"
          />
          {busy ? (
            <button
              type="button"
              onClick={stop}
              className={`${buttonClasses("secondary")} h-12 shrink-0`}
            >
              <Square className="h-4 w-4" aria-hidden="true" />
              {words.stop}
            </button>
          ) : (
            <button
              type="submit"
              className={`${buttonClasses("primary")} h-12 shrink-0`}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {words.submit}
            </button>
          )}
        </div>
        {showCount && (
          <p
            id={countId}
            className="mt-1.5 text-right text-xs text-muted-foreground"
          >
            {question.length} / {MAX_LENGTH}
          </p>
        )}
      </form>

      {/* Ready-made questions: one tap fills the field and asks. */}
      <ul className="mt-3.5 flex flex-wrap gap-2">
        {words.suggestions.map((suggestion) => (
          <li key={suggestion}>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setQuestion(suggestion);
                // On a touch screen, focus in the field would bring the keyboard up
                // over the answer the visitor has just asked for, so there the focus
                // stays on the button that was tapped.
                void ask(suggestion, window.matchMedia("(pointer: fine)").matches);
              }}
              className="min-h-9 rounded-full border border-border bg-muted/70 px-3.5 py-1.5 text-left text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-muted disabled:opacity-60"
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>

      {/*
        The answer. aria-live makes a screen reader read it out, and aria-busy holds
        that back while the text is still arriving, so the answer is read once, whole,
        and not piece by piece.
      */}
      <div
        aria-live="polite"
        aria-busy={busy}
        className={
          asked && phase !== "failed" && phase !== "idle"
            ? "animate-fade-up mt-4 rounded-xl border border-accent/25 bg-accent/5 p-4"
            : "sr-only"
        }
      >
        {asked && phase !== "failed" && phase !== "idle" && (
          <>
            <p className="text-sm text-muted-foreground">{asked}</p>
            {/* whitespace-pre-wrap keeps the model's own line breaks. */}
            <p className="mt-2 min-h-6 leading-relaxed whitespace-pre-wrap">
              {answer}
              {busy && <span aria-hidden="true" className="ask-cursor" />}
            </p>
          </>
        )}
      </div>

      {/* role="alert" makes a screen reader read a failure out at once. */}
      <p
        role="alert"
        className={
          phase === "failed"
            ? "animate-fade-up mt-4 rounded-xl border border-border bg-muted/60 p-4 text-sm leading-relaxed"
            : "sr-only"
        }
      >
        {phase === "failed" ? problem : ""}
      </p>
    </div>
  );
}
