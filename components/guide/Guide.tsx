'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { initGuide } from './runtime';
import './Guide.css';

export default function Guide({ children }: { children: ReactNode }) {
    const id = useId();
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => (rootRef.current ? initGuide(rootRef.current) : undefined), []);

    return (
        <div className="guide-system" ref={rootRef}>
            <svg className="guide" aria-hidden="true" focusable="false">
                <defs>
                    <g id={`${id}-routes`} />
                    <mask id={`${id}-reveal`} className="guide-mask guide-stroke" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" />
                </defs>
                <use href={`#${id}-routes`} className="guide-stroke guide-track" />
                <g mask={`url(#${id}-reveal)`}>
                    <rect className="guide-fill" width="100%" height="100%" />
                </g>
            </svg>
            <div className="guide-dots" aria-hidden="true" />
            {children}
        </div>
    );
}
