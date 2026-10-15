import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Guide from './Guide';
import TextSection from './TextSection';
import CaseStudyHeader from './CaseStudyHeader';
import ContactSection from './ContactSection';
import { notFound } from 'next/navigation';
import { caseStudiesLive, projects, type Project } from '@/content/projects';
import { profile, projectEnquiry, roleEnquiry } from '@/content/profile';
import './CaseStudy.css';

export function caseStudyMetadata(project: Project): Metadata {
    const url = `/work/${project.slug}`;
    return {
        title: project.title,
        description: `${project.tagline} ${project.summary}`,
        alternates: { canonical: url },
        robots: caseStudiesLive ? undefined : { index: false, follow: false },
        openGraph: {
            type: 'article',
            url,
            title: `${project.title} | ${profile.name}`,
            description: project.tagline,
        },
    };
}

export default function CaseStudy({ project, highlights, children }: {
    project: Project;
    highlights: { value: string; label: string }[];
    children: ReactNode;
}) {
    if (!caseStudiesLive && process.env.NODE_ENV === 'production') notFound();
    const next = projects[(projects.indexOf(project) + 1) % projects.length];
    return (
        <>
            <Guide>
                <CaseStudyHeader project={project} />
                <TextSection>
                    <p className="eyebrow">{project.sector}</p>
                    <ul className="highlights">
                        {highlights.map(({ value, label }) => (
                            <li key={label}><strong>{value}</strong> <span>{label}</span></li>
                        ))}
                    </ul>
                    {children}
                    <div className="actions">
                        <a className="button" href={roleEnquiry}>Hiring? Let&apos;s talk</a>
                        <a className="button-secondary" href={projectEnquiry}>Need something similar?</a>
                    </div>
                </TextSection>
            </Guide>
            <nav className="case-next" aria-label="Next case study">
                <p className="meta">Next case study</p>
                <Link href={`/work/${next.slug}`}>{next.title} &rarr;</Link>
            </nav>
            <ContactSection />
        </>
    );
}
