import { technologies } from '@/content/technologies';
import './TechnologiesSection.css';

export default function TechnologiesSection() {
    return (
        <section className="technologies section" data-guide-section="icons" aria-label="Technologies">
            <div className="technology-grid">
                {technologies.map(({ symbol, label }) => (
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
