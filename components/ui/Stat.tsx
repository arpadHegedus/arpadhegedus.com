'use client';

import { useEffect, useRef } from 'react';
import { initStat } from './stat-runtime';

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

export default function Stat({ number, from = 0, active = false, duration = 1500, pre, app, unit }: StatProps) {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => (active && rootRef.current ? initStat(rootRef.current) : undefined), [active]);

    return (
        <div
            className="stat"
            ref={rootRef}
            data-stat={active ? '' : undefined}
            data-number={active ? number : undefined}
            data-from={active ? from : undefined}
            data-duration={active ? duration : undefined}
        >
            {pre && <span className="stat-pre">{pre}</span>}
            <span className="stat-number">{format(number)}</span>
            {app && <span className="stat-app">{app}</span>}
            {unit && <span className="stat-unit">{unit}</span>}
        </div>
    );
}
