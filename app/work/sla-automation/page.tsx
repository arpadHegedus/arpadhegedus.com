import CaseStudy, { caseStudyMetadata } from '@/components/case-study/CaseStudy';
import { getProject } from '@/content/projects';

const project = getProject('sla-automation');

export const metadata = caseStudyMetadata(project);

export default function Page() {
    return (
        <CaseStudy
            project={project}
            highlights={[
                { value: '2h → 40min', label: 'per maintenance update' },
                { value: '~40h', label: 'saved a month (estimate)' },
                { value: '15 → 2min', label: 'deployment time' },
                { value: '30', label: 'SLA clients' },
            ]}
        >
            <h2>The problem</h2>
            <p>The agency maintains websites for around 30 clients under service-level agreements. Each maintenance update took about two hours, and local development environments differed from production, which caused avoidable surprises.</p>
            <h2>The approach</h2>
            <p>I built GitHub Actions automations and Docker-based local environments that mirror production, plus custom command-line tooling in Node.js so repeatable steps run the same way every time.</p>
            <h2>The result</h2>
            <p>The average maintenance update dropped from two hours to 40 minutes. With about 30 clients on roughly one update a month, that is an estimated 40 hours saved each month. Deployments went from 15 minutes to 2.</p>
            <p className="meta">Update cycles are scheduled dynamically and average about once a month, so the monthly saving is an estimate rather than a measured figure.</p>
            <p className="meta">Stack: GitHub Actions, Docker, Node.js, Commander.</p>
        </CaseStudy>
    );
}
