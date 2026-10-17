import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import ValuesSection from "@/components/sections/ValuesSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import TechnologiesSection from "@/components/sections/TechnologiesSection";
import ContactSection from "@/components/sections/ContactSection";
import Guide from "@/components/guide/Guide";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.jobTitle,
  description: profile.description,
  url: profile.siteUrl,
  image: `${profile.siteUrl}/arpad-1080.webp`,
  address: { "@type": "PostalAddress", addressLocality: "Hereford", addressCountry: "GB" },
  sameAs: [profile.linkedin, profile.github],
  knowsAbout: ["Full stack development", "Next.js", "React", "TypeScript", "Design systems", "AI agents", "Web accessibility", "Technical leadership"],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Guide>
        <main>
          <Hero />
          <ValuesSection />
          <ProjectsSection />
          <TestimonialsSection />
          <TechnologiesSection />
        </main>
        <ContactSection />
      </Guide>
    </>
  );
}
