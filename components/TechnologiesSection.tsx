import './TechnologiesSection.css';

const technologies = [
    ['langgraph', 'LangGraph'],
    ['react', 'React'],
    ['docker', 'Docker'],
    ['nodejs', 'Node.js'],
    ['nextjs', 'Next.js'],
    ['wordpress', 'WordPress'],
    ['threejs', 'Three.js'],
    ['typescript', 'TypeScript'],
];

export default function TechnologiesSection() {
    return (
        <section className="technologies section" data-guide-section="icons" aria-label="Technologies">
            <div className="technology-grid">
                {technologies.map(([symbol, label]) => (
                    <div className="technology-circle" data-guide-circle key={symbol}>
                        <svg role="img" aria-label={label} viewBox="0 0 24 24">
                            <use href={`/sprite.svg#${symbol}`} />
                        </svg>
                    </div>
                ))}
            </div>
        </section>
    );
}
