import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

// "group" lets icons inside react to the hover state with group-hover: classes.
const base =
  "group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-[translate,scale,box-shadow,background-color,color,border-color] duration-200 ease-out";

const variants: Record<Variant, string> = {
  // Violet gradient with a glow underneath that grows on hover.
  primary:
    "brand-gradient text-on-brand shadow-[0_8px_24px_-10px_var(--glow)] hover:shadow-[0_12px_32px_-8px_var(--glow)] motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98]",
  // See-through panel with a border that picks up the accent on hover.
  secondary:
    "border border-border bg-card/60 text-foreground hover:border-accent/50 hover:bg-muted motion-safe:active:scale-[0.98]",
};

export function buttonClasses(variant: Variant = "primary") {
  return `${base} ${variants[variant]}`;
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  children: ReactNode;
};

/** An anchor styled as a button, for links that act as calls to action. */
export function ButtonLink({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={`${buttonClasses(variant)} ${className ?? ""}`} {...props}>
      {children}
    </a>
  );
}
