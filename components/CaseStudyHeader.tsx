import { ViewTransition } from 'react';
import Link from 'next/link';
import type { Project } from '@/content/projects';
import './CaseStudyHeader.css';

export default function CaseStudyHeader({ project }: { project: Project }) {
    return (
        <header className="case-header section first" data-guide-hero>
            <span className="guide-origin guide-origin-end" data-guide-origin aria-hidden="true" />
            <div className="typo">
                <p className="eyebrow"><Link href="/#work">&larr; Selected work</Link></p>
                <ViewTransition name={`project-${project.slug}-title`}>
                    <h1>{project.title}</h1>
                </ViewTransition>
                <p className="tagline">{project.tagline}</p>
            </div>
        </header>
    );
}
