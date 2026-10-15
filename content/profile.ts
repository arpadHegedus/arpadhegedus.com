export const profile = {
    name: 'Arpad Hegedus',
    jobTitle: 'Tech Lead & Senior Full Stack Developer',
    tagline: 'UX-led engineering and AI-enabled delivery: faster builds, fewer surprises, and products people actually want to use.',
    availability: 'Open to engineering leadership roles and selective freelance work.',
    description: 'Tech lead and senior full stack developer in Hereford, UK. UX-led engineering, AI agents and automation, design systems, and fast, accessible websites.',
    location: 'Hereford, UK',
    country: 'Based in the UK',
    siteUrl: 'https://arpadhegedus.com',
    email: 'hegedus.arpad@gmail.com',
    linkedin: 'https://linkedin.com/in/arpad-hegedus',
    github: 'https://github.com/arpadhegedus',
} as const;

const mailto = (subject: string) => `mailto:${profile.email}?subject=${encodeURIComponent(subject)}`;

export const roleEnquiry = mailto('Role enquiry');
export const projectEnquiry = mailto('Project enquiry');
