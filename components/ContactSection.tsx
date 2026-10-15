import { profile, projectEnquiry, roleEnquiry } from '@/content/profile';
import './ContactSection.css';

export default function ContactSection() {
    return (
        <footer className="contact section">
            <div className="typo">
                <p className="h1"><strong>Arpad</strong> Hegedus</p>
                <p className="title">{profile.jobTitle}</p>
                <p className="meta">{profile.country}</p>
                <div className="actions">
                    <a className="button" href={roleEnquiry}>Hiring? Let&apos;s talk</a>
                    <a className="button-secondary" href={projectEnquiry}>Have a project?</a>
                </div>
                <div className="actions social">
                    <a href={profile.github} aria-label="GitHub" rel="me">
                        <svg aria-hidden="true" viewBox="0 0 24 24"><use href="/sprite.svg#github" /></svg>
                    </a>
                    <a href={profile.linkedin} aria-label="LinkedIn" rel="me">
                        <svg aria-hidden="true" viewBox="0 0 24 24"><use href="/sprite.svg#linkedin" /></svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}
