import type { Metadata } from "next";
import { SiteJsonLd } from "@/components/site-json-ld";
import { About } from "@/components/sections/about";
import { Ask } from "@/components/sections/ask";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { Product } from "@/components/sections/product";
import { Projects } from "@/components/sections/projects";
import { Services } from "@/components/sections/services";
import { Skills } from "@/components/sections/skills";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// The order here is the order of profile.nav, which numbers the sections.
export default function Home() {
  return (
    <>
      <SiteJsonLd />
      <Hero />
      <Product />
      <Features />
      <About />
      <Services />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <Ask />
      <Contact />
    </>
  );
}
