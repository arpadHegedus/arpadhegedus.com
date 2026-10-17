export interface Technology {
    symbol: string;
    label: string;
}

// Symbols are ids in /public/sprite.svg; the order is the order shown on the page.
export const technologies: Technology[] = [
    { symbol: 'langgraph', label: 'LangGraph' },
    { symbol: 'react', label: 'React' },
    { symbol: 'docker', label: 'Docker' },
    { symbol: 'nodejs', label: 'Node.js' },
    { symbol: 'nextjs', label: 'Next.js' },
    { symbol: 'wordpress', label: 'WordPress' },
    { symbol: 'threejs', label: 'Three.js' },
    { symbol: 'typescript', label: 'TypeScript' },
];
