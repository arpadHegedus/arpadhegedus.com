import Image from 'next/image';
import { profile, projectEnquiry } from '@/content/profile';
import './Hero.css';

const proof = [
    { value: '15+', label: 'years' },
    { value: '120+', label: 'projects' },
    { value: '−75%', label: 'build time' },
];

export default function Hero() {
    return (
        <div className="hero section first" data-guide-hero>
            <span className="guide-origin" data-guide-origin aria-hidden="true" />
            <div className="header">
                <Image
                    src="/arpad.webp"
                    alt={profile.name}
                    loading="eager"
                    fetchPriority="high"
                    sizes="50vw"
                    width={2565}
                    height={2939}
                />
            </div>
            <div className="main">
                <div className="typo">
                    <h1><strong>Arpad</strong> Hegedus</h1>
                    <p className="title">{profile.jobTitle}</p>
                    <p>{profile.tagline}</p>
                    <ul className="proof">
                        {proof.map(({ value, label }) => (
                            <li key={label}><strong>{value}</strong> {label}</li>
                        ))}
                    </ul>
                    {/* <p className="meta">{profile.availability}</p> */}
                    <div className="actions" data-guide-cta>
                        <a className="button" href="#work">View selected work</a>
                        <a className="button-secondary" href={projectEnquiry}>Get in touch</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
