export interface ProjectStat {
    pre?: string;
    number: number;
    app?: string;
    unit: string;
}

export interface Project {
    slug: string;
    title: string;
    sector: string;
    tagline: string;
    summary: string;
    stat: ProjectStat;
}

// Flip to true when the case-study pages are ready to publish: it links the
// cards, lists the pages in the sitemap, allows indexing, and serves them in production.
export const caseStudiesLive = false;

export const projects: Project[] = [
    {
        slug: 'design-system',
        title: 'Variable-based design system',
        sector: 'Internal platform, KD Web',
        tagline: 'How one design system turned 160-hour builds into 40-hour builds.',
        summary: 'Cut average build time from 160 to 40 hours across 30+ client projects.',
        stat: { pre: '−', number: 75, app: '%', unit: 'build time' },
    },
    {
        slug: 'medical-clinic-rebuild',
        title: 'Medical clinic rebuild',
        sector: 'Healthcare',
        tagline: 'A full-stack rebuild and UX rethink that more than doubled conversions.',
        summary: 'Rebuilt a medical clinic’s website around its users’ journeys and more than doubled conversions.',
        stat: { pre: '+', number: 108, app: '%', unit: 'conversions' },
    },
    {
        slug: 'sla-automation',
        title: 'SLA maintenance automation',
        sector: 'Internal engineering, KD Web',
        tagline: 'From two hours to forty minutes per maintenance update.',
        summary: 'GitHub Actions and Docker cut each maintenance update from 2 hours to 40 minutes across 30 clients.',
        stat: { pre: '~', number: 40, unit: 'hrs saved / month' },
    },
    {
        slug: 'ai-engineering',
        title: 'AI-enabled engineering',
        sector: 'Engineering leadership, KD Web',
        tagline: 'A team-wide way of working with AI, and the agents built on top of it.',
        summary: 'An AI workflow and SOPs adopted by the whole team, alongside 2 production agents.',
        stat: { number: 100, app: '%', unit: 'team adoption' },
    },
];

export function getProject(slug: string): Project {
    const project = projects.find(item => item.slug === slug);
    if (!project) throw new Error(`Unknown project: ${slug}`);
    return project;
}
