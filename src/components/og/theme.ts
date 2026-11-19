/**
 * Colours for the generated images (Open Graph cards and icons). They are drawn outside
 * the page, so CSS variables cannot be used; these mirror the tokens in globals.css.
 */
export const ogTheme = {
  // Dark tokens: the cards are always dark because dark cards read best in link previews.
  background: "#11071f",
  foreground: "#f5f1fc",
  muted: "#b9aed0",
  border: "#2c1b4a",
  accent: "#b78cff",
  // The corner glow on the cards: violet fading to nothing.
  glow: "rgba(139, 61, 255, 0.42)",
  glowEnd: "rgba(139, 61, 255, 0)",
  // The logo's mark: the violet hexagon (--logo-mark), the white letter A on it
  // (--on-brand), and the dot beside it as it is on the dark page (--logo-dot).
  mark: "#7c3aed",
  onBrand: "#ffffff",
  markDot: "#c4a1ff",
} as const;
