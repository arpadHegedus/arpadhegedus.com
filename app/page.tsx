import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TextSection from "@/components/TextSection";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import TechnologiesSection from "@/components/TechnologiesSection";
import ContactSection from "@/components/ContactSection";
import Guide from "@/components/Guide";
import { profile, projectEnquiry } from "@/content/profile";

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
  image: `${profile.siteUrl}/arpad.webp`,
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
        <Hero />
        <TextSection>
          <p className="eyebrow">Values, Mission & Principles</p>
          <h2>The Big Picture: Human-Centric Architecture</h2>
          <p>Great digital products aren&apos;t built in silos. My mission is to view every project through a macro lens where website architecture, content strategy, design aesthetics, and technical engineering work in perfect tandem. By keeping human experience at the absolute center, I build websites people actually want to use, while seamlessly driving the business outcomes clients demand.</p>
          <ul>
            <li><strong>Holistic Alignment:</strong> True engineering excellence serves the entire vision. I treat information architecture, pixel-perfect UX, and backend infrastructure as a single, unified ecosystem.</li>
            <li><strong>Human-Centric UX:</strong> Technical performance is meaningless if the end-user experience is flawed. Every system is built to be accessible, intuitive, and engaging.</li>
            <li><strong>Balancing User & Business Goals:</strong> I bridge the gap between user desires and client objectives, transforming complex technical execution into measurable business ROI.</li>
          </ul>
          <div className="actions">
            <a className="button" href={projectEnquiry}>Discuss a project</a>
            <a className="button-secondary" href={profile.linkedin}>Connect on LinkedIn</a>
          </div>
        </TextSection>
        <ProjectsSection />
        <TestimonialsSection />
        <TechnologiesSection />
        <ContactSection />
      </Guide>
    </>
  );
}