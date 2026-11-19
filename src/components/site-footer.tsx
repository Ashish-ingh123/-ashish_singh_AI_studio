import { Logo } from "@/components/logo";
import { SocialLinks } from "@/components/social-links";
import { Year } from "@/components/year";
import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        {/*
          The logo beside the copyright line ties the brand to its owner's name. Here it
          is decoration, hidden from screen readers: the header's logo already gives the
          brand's name. On a phone the two stack, like the rest of the footer.
        */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Logo size="sm" />
          <p>
            &copy; <Year /> {profile.name}. {profile.title}.
          </p>
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
}
