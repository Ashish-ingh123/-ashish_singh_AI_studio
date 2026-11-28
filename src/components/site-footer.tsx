import { Logo } from "@/components/logo";
import { SocialLinks } from "@/components/social-links";
import { Year } from "@/components/year";
import { profile } from "@/content/profile";

const { footer } = profile.labels;

// The footer's section links, with the menu's labels: BillingRecon and Contact.
const footerLinks = footer.links.map((id) => {
  const item = profile.nav.find((entry) => entry.id === id);
  if (!item) throw new Error(`labels.footer.links names "${id}", which is not in profile.nav`);
  return item;
});

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        {/*
          The company's logo beside the copyright line. Here it is decoration, hidden from
          screen readers: the header's logo already gives the name, and the line beside it
          says it again in words. On a phone the parts stack, like the rest of the footer.
        */}
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:gap-4 sm:text-left">
          <Logo size="sm" />
          <p>
            &copy; <Year /> {profile.brand.name}. {profile.brand.tagline}
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
          <nav aria-label={footer.nav}>
            <ul className="flex items-center gap-4">
              {footerLinks.map((item) => (
                <li key={item.id}>
                  <a
                    href={`/#${item.id}`}
                    className="rounded-sm font-medium transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
