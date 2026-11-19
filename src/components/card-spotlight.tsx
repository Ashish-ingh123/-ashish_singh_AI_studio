"use client";

import { useEffect } from "react";

/**
 * Makes a soft light follow the pointer inside every glass card. It renders nothing.
 *
 * Cards are drawn by server components all over the site, so instead of wrapping each one
 * this listens once, on the document. That is event delegation, the trick React itself
 * uses for onClick: a pointer event bubbles up from the element under the pointer, so one
 * listener at the top can ask which card it happened in. It then writes the pointer
 * position onto that card as two CSS variables, and the stylesheet draws the light there
 * (see src/app/styles/spotlight.css).
 *
 * The light only moves when the visitor moves the pointer, so it stays on under reduced
 * motion, the same reasoning as the scroll progress bar.
 */
export function CardSpotlight() {
  useEffect(() => {
    // A touch screen has no pointer resting over the page, so there is nothing to follow.
    if (window.matchMedia("(hover: none)").matches) return;

    // The most recent pointer event, kept until the next frame is drawn.
    let target: EventTarget | null = null;
    let pointerX = 0;
    let pointerY = 0;
    // Id of the frame callback that is waiting to run; 0 means none is waiting.
    let frame = 0;

    function moveLight() {
      frame = 0;
      // instanceof is the "is" check of C#: only an element has closest(), which walks up
      // the parents to the nearest one matching the selector.
      if (!(target instanceof Element)) return;
      const card = target.closest(".glass-card");
      if (!(card instanceof HTMLElement)) return;
      // The event reports viewport coordinates; the stylesheet wants them measured from
      // the card's top-left corner.
      const box = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${pointerX - box.left}px`);
      card.style.setProperty("--spot-y", `${pointerY - box.top}px`);
    }

    function onPointerMove(event: PointerEvent) {
      // On a laptop with a touch screen a finger sends this event too, but never hovers.
      if (event.pointerType === "touch") return;
      target = event.target;
      pointerX = event.clientX;
      pointerY = event.clientY;
      // A mouse can report more often than the screen redraws. Only the latest position
      // is kept, and the styles are written at most once per frame.
      if (frame === 0) frame = requestAnimationFrame(moveLight);
    }

    // passive promises that the handler never cancels the event, so the browser never
    // has to wait for it.
    function listen() {
      document.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    // Wait a moment before listening. This component wakes up before React has finished
    // attaching itself to the cards further down the page (hydration), and writing a style
    // onto a card in that gap makes React's development build report a mismatch.
    const startTimer = window.setTimeout(listen, 1000);

    // Runs when the component unmounts: stop listening and drop anything still waiting.
    return () => {
      window.clearTimeout(startTimer);
      document.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
