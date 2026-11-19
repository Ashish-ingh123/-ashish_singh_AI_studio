import type { HTMLAttributes, ReactNode } from "react";

/**
 * The card surface (glass-card in globals.css: violet sheen and a bright top edge) with a
 * hover lift and glow. The lift uses the CSS translate property (what Tailwind's translate
 * utilities set), so it only runs when the visitor allows motion (motion-safe); the border
 * tint and glow are colour changes and stay on for everyone.
 */
export const cardClasses =
  "glass-card rounded-2xl text-card-foreground transition-[translate,box-shadow,border-color] duration-300 ease-out motion-safe:hover:-translate-y-1";

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={`${cardClasses} ${className ?? ""}`} {...props}>
      {children}
    </div>
  );
}
