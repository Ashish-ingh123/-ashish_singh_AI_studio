import type { Metadata } from "next";
import Link from "next/link";
import { buttonClasses } from "@/components/button-link";

// Next.js adds the noindex tag for 404 responses itself; only the title is needed here.
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">
        Page not found
      </h1>
      <p className="mt-3 text-muted-foreground">
        That address does not exist on this site.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className={buttonClasses("primary")}>
          Back to the homepage
        </Link>
        <Link href="/#projects" className={buttonClasses("secondary")}>
          View projects
        </Link>
      </div>
    </section>
  );
}
