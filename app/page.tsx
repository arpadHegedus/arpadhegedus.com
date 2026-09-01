import Hero from "@/components/Hero";
import TextSection from "@/components/TextSection";
import TypographyTest from "@/components/TypographyTest";

export default function Home() {
  return (
    <>
      <Hero />
      <TextSection>
        <p className="eyebrow">Values, Mission & Principles</p>
        <h2>The Big Picture: Human-Centric Architecture</h2>
        <p>Great digital products aren't built in silos. My mission is to view every project through a macro lens where website architecture, content strategy, design aesthetics, and technical engineering work in perfect tandem. By keeping human experience at the absolute center, I build websites people actually want to use, while seamlessly driving the business outcomes clients demand.</p>
        <ul>
        <li><strong>Holistic Alignment:</strong> True engineering excellence serves the entire vision. I treat information architecture, pixel-perfect UX, and backend infrastructure as a single, unified ecosystem.</li>
        <li><strong>Human-Centric UX:</strong> Technical performance is meaningless if the end-user experience is flawed. Every system is built to be accessible, intuitive, and engaging.</li>
        <li><strong>Balancing User & Business Goals:</strong> I bridge the gap between user desires and client objectives, transforming complex technical execution into measurable business ROI.</li>
        </ul>
        <div className="actions">
          <a className="button">Request a Consultation</a>
          <a className="button-secondary">Download CV</a>
        </div>
      </TextSection>
      <TypographyTest />
    </>
  );
}