import Image from "next/image";
import Link from "next/link";
import Stat from "@/components/Stat";
import './page.css';

export default function Home() {
  return (
    <>
      <main>
        <div className="section hero">
          <span className="guide"></span>
          <div className="header">
            <Image
              src="/arpad.webp"
              alt="Arpad Hegedus"
              priority={true}
              width={2565}
              height={2939}
            />
          </div>
          <div className="section main">
            <div className="type">
              <h1><strong>Arpad</strong> Hegedus</h1>
              <p className="meta">UX Architect</p>
              <p>Bridging high-end UX and resilient full-stack architecture to scale enterprise web assets and boost agency profitability.</p>
              <div className="actions">
                <a className="button">View Projects</a>
                <a className='primary-button'>Request a Consultation</a>
                <a className='cv-button'>Download CV <span>❯</span></a>
              </div>
            </div>
          </div>
        </div>
        <div className="section principles">
          <span className="guide start"></span>
          <div className="main type">
            <p className="eyebrow">Values, Mission & Principles</p>
            <h2>The Big Picture: Human-Centric Architecture</h2>
            <p>Great digital products aren't built in silos. My mission is to view every project through a macro lens where website architecture, content strategy, design aesthetics, and technical engineering work in perfect tandem. By keeping human experience at the absolute center, I build websites people actually want to use, while seamlessly driving the business outcomes clients demand.</p>
            <ul>
              <li><strong>Holistic Alignment:</strong> True engineering excellence serves the entire vision. I treat information architecture, pixel-perfect UX, and backend infrastructure as a single, unified ecosystem.</li>
              <li><strong>Human-Centric UX:</strong> Technical performance is meaningless if the end-user experience is flawed. Every system is built to be accessible, intuitive, and engaging.</li>
              <li><strong>Balancing User & Business Goals:</strong> I bridge the gap between user desires and client objectives, transforming complex technical execution into measurable business ROI.</li>
            </ul>
            <div className="actions">
              <a className='primary-button'>Request a Consultation</a>
            </div>
            <span className="guide horizontal start"></span>
            <span className="guide vertical start"></span>
            <span className="guide vertical end"></span>
            <span className="guide horizontal end"></span>
          </div>
          <span className="guide end"></span>
        </div>
        <div className="section projects">
          <div className="main">
            <h2>Featured Projects</h2>
            <div className='project'>
              <div className="main">
                <Stat pre='-' number={75} app='%' active />
                <p>Architected and rolled out a variable-based internal design system for top-tier London agencies, slashing average bespoke project development cycles from 160 down to 40 hours while directly boosting profit margins.</p>
              </div>
              <div className="footer">
                <p className="tech">Core tech: Sass, JSON, Node.js, React, TypeScript</p>
                <Link href="/projects/design-system" className="button">View Project</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="section testimonial">
          <div className="main">
            <h2>Endorsements</h2>
            <div className="quotes">
              <blockquote>
                <p>Arpad doesn't just manage code; he owns the big picture. From translating complex Information Architecture into revenue-driving web assets to pioneering internal R&D, his strategic execution has significantly boosted our agency's technical capabilities and profit margins.</p>
                <cite>CTO / Agency Director</cite>
              </blockquote>
              <blockquote>
                <p>As a Tech Lead, Arpad creates environments developers thrive in. His mentorship, clear technical specifications, and strict TypeScript/Next.js code reviews didn't just cut our team's rework cycles by 40%—they made us better engineers.</p>
                <cite>Full Stack Engineer (Mentee)</cite>
              </blockquote>
            </div>
          </div>
        </div>
        <div className="section technologies">
          <div className="main">
            <svg aria-label="Next.js Logo" role="img"><use href="/sprite.svg#nextjs" /></svg>
            <svg aria-label="React Logo" role="img"><use href="/sprite.svg#react" /></svg>
            <svg aria-label="TypeScript Logo" role="img"><use href="/sprite.svg#typescript" /></svg>
            <svg aria-label="Node.js Logo" role="img"><use href="/sprite.svg#nodejs" /></svg>
            <svg aria-label="WordPress Logo" role="img"><use href="/sprite.svg#wordpress" /></svg>
            <svg aria-label="Docker Logo" role="img"><use href="/sprite.svg#docker" /></svg>
            <svg aria-label="Three.js Logo" role="img"><use href="/sprite.svg#threejs" /></svg>
            <svg aria-label="LangGraph Logo" role="img"><use href="/sprite.svg#langgraph" /></svg>
          </div>
        </div>
        <div className="section contact">
          <div className="main">
            <p><strong>Arpad</strong> Hegedus</p>
            <p className="title">Lead Full Stack Developer & Tech Lead (Lead UX Architect)</p>
            <div className="actions">
              <a className='primary-button'>Request a Consultation</a>
              <a className='cv-button'>Download CV <span>❯</span></a>
              <div className='socials'>
                <a href="https://github.com/arpadhegedus" target="_blank" rel="noopener noreferrer">
                  <svg aria-label="GitHub Logo" role="img"><use href="/sprite.svg#github" /></svg>
                </a>
                <a href="https://linkedin.com/in/arpadhegedus" target="_blank" rel="noopener noreferrer">
                  <svg aria-label="LinkedIn Logo" role="img"><use href="/sprite.svg#linkedin" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
