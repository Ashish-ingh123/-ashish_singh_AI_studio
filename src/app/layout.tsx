import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { CardSpotlight } from "@/components/card-spotlight";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";

// next/font downloads the fonts at build time and serves them from this site, so there is
// no request to Google at run time and no layout shift while they load.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Headings only. Poppins is not a variable font, so each weight is its own file; two
// weights keep the download small.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700"],
});

// The site belongs to the company: its name and line make the title, its description the
// search-result text. The founder stays the author.
const { brand } = profile;
const description = brand.description;
const title = `${brand.name} | ${brand.tagline}`;

export const metadata: Metadata = {
  // Every relative address in the metadata (Open Graph url, image routes) resolves
  // against this, the way a base address on an HttpClient completes relative paths.
  metadataBase: siteUrl,
  title: {
    default: title,
    // Inner pages set only their own name; the template appends the company.
    template: `%s | ${brand.name}`,
  },
  description,
  applicationName: brand.name,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  publisher: brand.name,
  // What chat apps, LinkedIn and X show when a link to the site is shared. The image
  // comes from src/app/opengraph-image.tsx automatically.
  openGraph: {
    type: "website",
    siteName: brand.name,
    title,
    description,
    url: "/",
  },
  // Title, description and image are copied from each page's Open Graph fields.
  twitter: { card: "summary_large_image" },
  // Stops mobile browsers from turning digit sequences into phone links.
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: next-themes sets the theme class and color-scheme style on
    // <html> before React hydrates, so server and client markup differ on purpose here.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {/* Decorative glows behind every page; see .backdrop in globals.css. */}
        {/*
          Each glow sits in a layer of its own. The glow drifts by itself; the layer
          moves with the page's scrolling, each at its own speed, which gives the
          background a little depth.
        */}
        <div aria-hidden="true" className="backdrop">
          <div className="backdrop-layer backdrop-layer-a">
            <div className="backdrop-glow backdrop-glow-a" />
          </div>
          <div className="backdrop-layer backdrop-layer-b">
            <div className="backdrop-glow backdrop-glow-b" />
          </div>
        </div>
        <Providers>
          {/* Renders nothing; it makes the light on glass cards follow the pointer. */}
          <CardSpotlight />
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
          >
            Skip to content
          </a>
          <SiteHeader />
          {/*
            overflow-x-clip: the decorative glows and orbit rings are wider than a small
            phone. Clipping them sideways here stops the page from scrolling left and
            right, while they may still spill up and down between sections.
          */}
          <main id="content" className="flex-1 overflow-x-clip">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
