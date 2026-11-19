import type { ComponentType } from "react";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { profile } from "@/content/profile";

type IconProps = { className?: string; "aria-hidden"?: "true" };

export type SocialLink = {
  label: string;
  href: string;
  Icon: ComponentType<IconProps>;
  external: boolean;
};

/** The three ways to get in touch, in display order, built from profile.links. */
export function getSocialLinks(): SocialLink[] {
  return [
    {
      label: "Email",
      href: `mailto:${profile.links.email}`,
      Icon: Mail,
      external: false,
    },
    {
      label: "LinkedIn",
      href: profile.links.linkedin,
      Icon: LinkedInIcon,
      external: true,
    },
    {
      label: "GitHub",
      href: profile.links.github,
      Icon: GitHubIcon,
      external: true,
    },
  ];
}

/** Attributes that make an external link open in a new tab safely. */
export function externalProps(external: boolean) {
  return external ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

/** Icon-only links with accessible names, used in the hero and the footer. */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul
      className={`flex items-center gap-1 ${className ?? ""}`}
      aria-label="Social links"
    >
      {getSocialLinks().map(({ label, href, Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={label}
            title={label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            {...externalProps(external)}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
