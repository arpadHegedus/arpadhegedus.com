import { ViewTransition } from 'react';
import Link from 'next/link';
import Stat from '@/components/ui/Stat';
import { caseStudiesLive, projects } from '@/content/projects';
import './ProjectsSection.css';

export default function ProjectsSection() {
    return (
        <section className="projects section" id="work" data-guide-section="projects" aria-label="Selected work">
            <div className="projects-grid" data-guide-projects>
                {projects.map(({ slug, title, summary, stat }) => (
                    <article className="project-card" data-guide-card key={slug}>
                        <div className="typo">
                            <Stat {...stat} active />
                            {caseStudiesLive ? (
                                <ViewTransition name={`project-${slug}-title`}>
                                    <h3><Link className="card-link" href={`/work/${slug}`}>{title}</Link></h3>
                                </ViewTransition>
                            ) : (
                                <h3>{title}</h3>
                            )}
                            <p>{summary}</p>
                            {caseStudiesLive && <p className="card-cta" aria-hidden="true">Read the case study</p>}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
