'use client';

import { useEffect, useRef } from 'react';

interface StatProps {
    number: number;
    from?: number;
    active?: boolean;
    duration?: number; // Duration in milliseconds
    pre?: string;
    app?: string;
}

export default function Stat({
    number,
    from = 0,
    active = false,
    duration = 1500,
    pre,
    app,
}: StatProps) {
    const nodeRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        // Only run if active is true
        if (!active) return;

        let startTime: number | null = null;
        let animationFrameId: number;

        // Easing function for a more natural slow-down at the end (Ease Out Expo)
        const easeOutExpo = (t: number): number => {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        };

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            
            // Calculate how much time has passed (0 to 1)
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = easeOutExpo(progress);

            // Calculate the current value based on progress
            const currentValue = Math.floor(easedProgress * (number - from) + from);

            // Update the DOM directly for maximum performance
            if (nodeRef.current) {
                nodeRef.current.textContent = new Intl.NumberFormat('en-GB').format(currentValue);
            }

            // If we haven't reached the end, request another frame
            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                // Ensure the final frame lands exactly on the target number
                if (nodeRef.current) {
                    nodeRef.current.textContent = new Intl.NumberFormat('en-GB').format(number);
                }
            }
        };

        // Start the animation
        animationFrameId = requestAnimationFrame(animate);

        // Cleanup function to cancel the animation if the component unmounts
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [active, number, from, duration]);

    // Set the initial value using the UK locale format
    return (
    <div>
        { pre && <span>{pre}</span> }
        <span ref={nodeRef}>{new Intl.NumberFormat('en-GB').format(from)}</span>
        { app && <span>{app}</span> }
    </div>
    );
}