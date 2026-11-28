import { ApiError, GoogleGenAI } from "@google/genai";
import { profile } from "@/content/profile";
import { askSystemInstruction } from "@/lib/ask-context";
import { allowedOrigin, clientAddress, createLimiter } from "@/lib/request-guard";

/*
  The server side of "Ask about Ashvanta". The browser posts one question; this handler
  sends it to Google's Gemini API together with the facts from profile.ts and streams the
  answer back as plain text. Think of it as a small ASP.NET minimal API endpoint that
  sits between the page and the provider, so the API key never leaves the server.

  It is single turn: no earlier question is accepted, and nothing is stored.
*/

/** Used when GEMINI_MODEL is not set. Change the model here, in one place. */
const DEFAULT_MODEL = "gemini-3.5-flash-lite";
/** The value .env.example ships with. It is not a key, so it counts as "no key". */
const PLACEHOLDER_KEY = "your-key-here";

const MAX_QUESTION_LENGTH = 300;
/** A 120-word answer is roughly 200 tokens; this leaves room and still bounds the cost. */
const MAX_OUTPUT_TOKENS = 400;

/** How many questions one address may ask within the window. */
const LIMIT = 5;
const WINDOW_MS = 60_000;

// At most LIMIT questions per address within the window (src/lib/request-guard.ts).
const overLimit = createLimiter(LIMIT, WINDOW_MS);

/** A short plain-text reply. no-store: an answer must never be cached and replayed. */
function reply(message: string, status: number): Response {
  return new Response(message, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  const messages = profile.ask;

  if (!allowedOrigin(request.headers.get("origin"))) {
    return reply(messages.error, 403);
  }

  const address = clientAddress(request);
  if (overLimit(address)) return reply(messages.busy, 429);

  // The body must be JSON of the shape { question: string }.
  let question: unknown;
  try {
    const body: unknown = await request.json();
    question =
      typeof body === "object" && body !== null && "question" in body
        ? body.question
        : undefined;
  } catch {
    return reply(messages.error, 400);
  }
  if (typeof question !== "string") return reply(messages.error, 400);
  const asked = question.trim();
  if (asked.length === 0 || asked.length > MAX_QUESTION_LENGTH) {
    return reply(messages.error, 400);
  }

  // Read at request time, never at module level and never from a NEXT_PUBLIC_ variable:
  // the build then passes with no key set, and the key is never put into a bundle.
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === PLACEHOLDER_KEY) {
    return reply(messages.unavailable, 503);
  }
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;

  // Stops the call to Gemini when the visitor leaves or presses Stop. The SDK's note on
  // this: the request is cancelled on our side; Google may still count work already done.
  const upstream = new AbortController();
  request.signal.addEventListener("abort", () => upstream.abort(), { once: true });

  try {
    const ai = new GoogleGenAI({ apiKey });
    const chunks = await ai.models.generateContentStream({
      model,
      contents: asked,
      config: {
        systemInstruction: askSystemInstruction,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        // Low: the answer should restate the profile, not improvise.
        temperature: 0.2,
        abortSignal: upstream.signal,
      },
    });

    // Wait for the first piece before answering. A quota error usually arrives here,
    // and once a streamed response has started its status can no longer be changed.
    const iterator = chunks[Symbol.asyncIterator]();
    const first = await iterator.next();

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          let next = first;
          while (!next.done) {
            const text = next.value.text;
            if (text) controller.enqueue(encoder.encode(text));
            next = await iterator.next();
          }
          controller.close();
        } catch {
          // The provider failed half-way, or the visitor stopped it. What has been
          // sent stays; the stream simply ends.
          controller.close();
        }
      },
      // The browser closed the connection or cancelled the read.
      cancel() {
        upstream.abort();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    // Only the status is logged. The visitor's question never goes into a log.
    const status = error instanceof ApiError ? error.status : undefined;
    console.error("ask: the provider returned an error", status ?? "unknown");
    // 429 is Gemini's quota and rate-limit answer (RESOURCE_EXHAUSTED).
    if (status === 429) return reply(messages.busy, 429);
    return reply(messages.error, 502);
  }
}
