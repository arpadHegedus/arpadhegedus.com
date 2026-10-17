import CaseStudy, { caseStudyMetadata } from '@/components/case-study/CaseStudy';
import { getProject } from '@/content/projects';

const project = getProject('ai-engineering');

export const metadata = caseStudyMetadata(project);

export default function Page() {
    return (
        <CaseStudy
            project={project}
            highlights={[
                { value: '100%', label: 'team adoption' },
                { value: '2', label: 'agents in production' },
                { value: '3', label: 'agents in testing' },
            ]}
        >
            <h2>The problem</h2>
            <p>Tasks often started with vague descriptions and unclear expectations, and standards weren&apos;t consistently enforced because the SOPs weren&apos;t ready. The result was misunderstandings before work began and rework afterwards.</p>
            <h2>The approach</h2>
            <p>I wrote the team&apos;s SOPs and a shared way of working with AI: what to delegate to agents, how much human oversight each kind of task needs, which testing applies, the security rules, and how models and budgets are managed.</p>
            <h2>The result</h2>
            <p>The whole team follows the workflow. Tasks now typically start and finish without clarification requests or rework caused by vague specifications.</p>
            <h2>The agents</h2>
            <p>On top of that workflow I build AI agents. Two are in production and three are in testing. They include:</p>
            <ul>
                <li>An intake agent that guides users, by chat or voice, to give complete and correct information, so automations can run and data reaches the team without gaps.</li>
                <li>A time-tracking agent that emails timesheets to management in the required format.</li>
                <li>A multi-skill agent that sends email through Gmail, calculates from input and chooses actions by parameters, looks up information in private documents, and filters answers by what each user is allowed to see.</li>
            </ul>
            <p>They run on Google Cloud and Docker containers, using hosted models such as Gemini, or open models such as DeepSeek and Gemma that I self-host where privacy or budget requires.</p>
            <p>In progress: more technical skills, such as a guided design creator and website deployment, and an AI-led agency helper that produces a solid first draft of brand strategy, information architecture, design, development, SEO and CRO work for experts to improve.</p>
            <p className="meta">Stack: Python, LangChain, LangGraph, Next.js, Gemini, DeepSeek, Gemma, Docker, Google Cloud.</p>
        </CaseStudy>
    );
}
