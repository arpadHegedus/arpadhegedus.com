import CaseStudy, { caseStudyMetadata } from '@/components/case-study/CaseStudy';
import { getProject } from '@/content/projects';

const project = getProject('design-system');

export const metadata = caseStudyMetadata(project);

export default function Page() {
    return (
        <CaseStudy
            project={project}
            highlights={[
                { value: '−75%', label: 'average build time' },
                { value: '30+', label: 'client projects' },
                { value: '5', label: 'versions' },
                { value: '16–24h', label: 'to an MVP' },
            ]}
        >
            <h2>The problem</h2>
            <p>Every client site was designed and built from scratch. Depending on complexity, a project took anywhere from 80 to 300 hours, which capped how many projects the team could take on and how profitable each one was.</p>
            <h2>The approach</h2>
            <p>I designed and built a variable-based design system: a shared foundation of components and design variables that is tailored to each client&apos;s brand and needs, instead of starting from a blank page. It has been through five versions, each shaped by real client projects.</p>
            <h2>The result</h2>
            <p>Across 30+ client projects, the average build time fell from 160 hours to 40, a 75% reduction. The latest version can ship an MVP in 16&ndash;24 hours and has been used on five projects so far.</p>
            <p className="meta">Every project is tailored to its client, so a like-for-like comparison isn&apos;t possible. These figures are averages from my own experience on the projects rather than a controlled measurement.</p>
        </CaseStudy>
    );
}
