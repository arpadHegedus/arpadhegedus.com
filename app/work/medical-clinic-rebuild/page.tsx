import CaseStudy, { caseStudyMetadata } from '@/components/case-study/CaseStudy';
import { getProject } from '@/content/projects';

const project = getProject('medical-clinic-rebuild');

export const metadata = caseStudyMetadata(project);

export default function Page() {
    return (
        <CaseStudy
            project={project}
            highlights={[
                { value: '+108%', label: 'conversions' },
                { value: '+53%', label: 'organic traffic' },
            ]}
        >
            <h2>The problem</h2>
            <p>The clinic&apos;s existing website ran on a legacy backend, and the way visitors moved through it needed rethinking.</p>
            <h2>The approach</h2>
            <p>I led the information architecture and UX, replaced the legacy backend entirely, and refactored the front end around how visitors actually move through the site.</p>
            <h2>The result</h2>
            <p>Conversions rose 108% and organic traffic 53% in the months after launch, measured against the previous site using the agency&apos;s analytics.</p>
            <p className="meta">Client details are confidential, so the clinic isn&apos;t named.</p>
        </CaseStudy>
    );
}
