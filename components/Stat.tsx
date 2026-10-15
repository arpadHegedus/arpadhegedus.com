'use client';

import { useEffect, useRef } from 'react';

interface StatProps {
    number: number;
    from?: number;
    active?: boolean;
    duration?: number;
    pre?: string;
    app?: string;
    unit?: string;
}

const format = (value: number) => new Intl.NumberFormat('en-GB').format(value);
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export default function Stat({ number, from = 0, active = false, duration = 1500, pre, app, unit }: StatProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const nodeRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        const node = nodeRef.current;
        if (!active || !root || !node) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let frame = 0;
        const run = () => {
            let startTime: number | null = null;
            const tick = (now: number) => {
                startTime ??= now;
                const progress = Math.min((now - startTime) / duration, 1);
                const value = progress === 1 ? number : Math.floor(easeOutExpo(progress) * (number - from) + from);
                node.textContent = format(value);
                if (progress < 1) frame = requestAnimationFrame(tick);
            };
            node.textContent = format(from);
            frame = requestAnimationFrame(tick);
        };

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            run();
        }, { threshold: 0.6 });
        observer.observe(root);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [active, number, from, duration]);

    return (
        <div className="stat" ref={rootRef}>
            {pre && <span className="stat-pre">{pre}</span>}
            <span className="stat-number" ref={nodeRef}>{format(number)}</span>
            {app && <span className="stat-app">{app}</span>}
            {unit && <span className="stat-unit">{unit}</span>}
        </div>
    );
}
