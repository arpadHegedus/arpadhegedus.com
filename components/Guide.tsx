'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import {
    buildGuideLayout, guideDistanceAt, dotProgressAt, fadeDistances,
    FADE_STEPS, TIP_FADE, type GuideLayout, type GuideSection, type GuideRoute, type GuideDot,
} from './guide-geometry';
import './Guide.css';

const SVG_NS = 'http://www.w3.org/2000/svg';

export default function Guide({ children }: { children: ReactNode }) {
    const id = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const routesRef = useRef<SVGGElement>(null);
    const maskRef = useRef<SVGMaskElement>(null);
    const dotsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        const svg = svgRef.current;
        const routes = routesRef.current;
        const mask = maskRef.current;
        const dots = dotsRef.current;
        if (!root || !svg || !routes || !mask || !dots) return;

        const hero = root.querySelector<HTMLElement>('[data-guide-hero]');
        const origin = root.querySelector<HTMLElement>('[data-guide-origin]');
        const cta = root.querySelector<HTMLElement>('[data-guide-cta]');
        if (!hero || !origin) throw new Error('Guide requires a hero and a guide origin.');
        const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-guide-section]')).map(section => {
            const kind = section.dataset.guideSection;
            if (kind !== 'frame' && kind !== 'projects' && kind !== 'testimonials' && kind !== 'icons') {
                throw new Error(`Unknown guide section: ${kind}`);
            }
            const selector = kind === 'frame' ? '[data-guide-frame]'
                : kind === 'projects' ? '[data-guide-card]'
                : kind === 'testimonials' ? '[data-guide-testimonial]' : '[data-guide-circle]';
            const boxes = Array.from(section.querySelectorAll<HTMLElement>(selector));
            if (!boxes.length || (kind === 'projects' && boxes.length !== 4) || (kind === 'testimonials' && boxes.length !== 2)) {
                throw new Error(`Invalid ${kind} guide geometry.`);
            }
            return { section, kind, boxes } satisfies { section: HTMLElement; kind: GuideSection['kind']; boxes: HTMLElement[] };
        });

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let layout: GuideLayout;
        let rootTop = 0;
        let scheduled = 0;
        let needsMeasurement = true;
        type RouteState = 'idle' | 'active' | 'done';
        let paintedRoutes: {
            route: GuideRoute;
            path: SVGPathElement;
            group: SVGGElement;
            layers: SVGUseElement[] | null;
            state: RouteState | null;
            previous: number;
        }[] = [];

        const createLayer = (path: SVGPathElement, route: GuideRoute, opacity: number) => {
            const layer = document.createElementNS(SVG_NS, 'use');
            layer.setAttribute('href', `#${path.id}`);
            layer.setAttribute('stroke', 'white');
            layer.setAttribute('stroke-opacity', String(opacity));
            layer.setAttribute('stroke-dasharray', `${route.length} ${route.length}`);
            return layer;
        };
        let paintedDots: { dot: GuideDot; element: HTMLSpanElement; previous: number }[] = [];

        const measure = () => {
            const bounds = root.getBoundingClientRect();
            // Read stroke-width from an element that actually carries .guide-stroke
            // (the bare <svg> doesn't inherit it from descendants) so halfStroke -
            // used both for box insets and for pixel-snapping - matches --guide-thickness.
            const strokeSource = svg.querySelector('.guide-stroke') ?? svg;
            const halfStroke = parseFloat(getComputedStyle(strokeSource).strokeWidth) / 2;
            const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
            rootTop = bounds.top + window.scrollY;
            const start = origin.getBoundingClientRect().top - bounds.top;
            layout = buildGuideLayout({
                center: bounds.width / 2,
                start,
                heroBottom: hero.getBoundingClientRect().bottom - bounds.top,
                heroCtaBottom: cta ? cta.getBoundingClientRect().bottom - bounds.top : 0,
                heroDotDrop: 6 * remPx,
                viewportHeight: window.innerHeight,
                mobile: getComputedStyle(origin).getPropertyValue('--guide-mobile').trim() === '1',
                halfStroke,
                sections: sections.map(({ section, kind, boxes }) => {
                    const sectionBounds = section.getBoundingClientRect();
                    return {
                        kind,
                        top: sectionBounds.top - bounds.top,
                        bottom: sectionBounds.bottom - bounds.top,
                        rail: sectionBounds.left - bounds.left + halfStroke,
                        boxes: boxes.map(box => {
                            const rect = box.getBoundingClientRect();
                            return {
                                top: rect.top - bounds.top + halfStroke,
                                bottom: rect.bottom - bounds.top - halfStroke,
                                left: rect.left - bounds.left + halfStroke,
                                right: rect.right - bounds.left - halfStroke,
                            };
                        }),
                    };
                }),
            });
            svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
            routes.replaceChildren();
            mask.replaceChildren();
            dots.replaceChildren();
            paintedRoutes = layout.routes.map((route, index) => {
                const path = document.createElementNS(SVG_NS, 'path');
                path.id = `${id}-route-${index}`;
                path.setAttribute('d', route.d);
                path.dataset.start = String(route.start);
                path.dataset.end = String(route.end);
                routes.append(path);
                const group = document.createElementNS(SVG_NS, 'g');
                mask.append(group);
                return { route, path, group, layers: null, state: null, previous: -1 };
            });
            paintedDots = layout.dots.map(dot => {
                const element = document.createElement('span');
                element.className = 'guide-dot';
                element.style.left = `${dot.x}px`;
                element.style.top = `${dot.y}px`;
                element.dataset.start = String(dot.start);
                element.dataset.end = String(dot.end);
                dots.append(element);
                return { dot, element, previous: -1 };
            });
        };

        const render = () => {
            scheduled = 0;
            if (needsMeasurement) {
                measure();
                needsMeasurement = false;
            }
            const distance = reducedMotion.matches
                ? layout.length
                : guideDistanceAt(layout.stops, window.scrollY + window.innerHeight / 2 - rootTop);
            for (const painted of paintedRoutes) {
                const travelled = Math.max(0, Math.min(painted.route.length + TIP_FADE, distance - painted.route.start));
                if (travelled === painted.previous) continue;
                painted.previous = travelled;
                const { route, path, group } = painted;
                // A route needs the stacked fade layers only while its tip is travelling:
                // before that it paints nothing, and after it a single opaque stroke
                // looks identical to the fully overlapped stack.
                if (travelled <= 0) {
                    if (painted.state !== 'idle') {
                        group.replaceChildren();
                        painted.layers = null;
                        painted.state = 'idle';
                    }
                } else if (travelled >= route.length + TIP_FADE) {
                    if (painted.state !== 'done') {
                        group.replaceChildren(createLayer(path, route, 1));
                        painted.layers = null;
                        painted.state = 'done';
                    }
                } else {
                    if (painted.state !== 'active' || !painted.layers) {
                        // Overlapping alpha steps form a fade along any route, including corners.
                        painted.layers = Array.from({ length: FADE_STEPS }, (_, step) =>
                            createLayer(path, route, 1 / (FADE_STEPS - step)));
                        group.replaceChildren(...painted.layers);
                        painted.state = 'active';
                    }
                    const fade = fadeDistances(route.length, travelled);
                    painted.layers.forEach((layer, step) => {
                        layer.setAttribute('stroke-dashoffset', String(route.length - fade[step]));
                    });
                }
            }
            for (const painted of paintedDots) {
                const progress = dotProgressAt(painted.dot, distance);
                if (progress === painted.previous) continue;
                painted.element.style.setProperty('--dot-progress', String(progress));
                painted.previous = progress;
            }
            root.dataset.guideReady = 'true';
        };

        function schedule() {
            if (!scheduled) scheduled = window.requestAnimationFrame(render);
        }

        function resize() {
            needsMeasurement = true;
            schedule();
        }

        const observer = new ResizeObserver(resize);
        [root, hero, ...sections.flatMap(({ section, boxes }) => [section, ...boxes])].forEach(element => observer.observe(element));
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', resize);
        window.addEventListener('pageshow', resize);
        reducedMotion.addEventListener('change', schedule);
        render();

        return () => {
            observer.disconnect();
            window.cancelAnimationFrame(scheduled);
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pageshow', resize);
            reducedMotion.removeEventListener('change', schedule);
        };
    }, [id]);

    return (
        <div className="guide-system" ref={rootRef}>
            <svg className="guide" ref={svgRef} aria-hidden="true" focusable="false">
                <defs>
                    <g id={`${id}-routes`} ref={routesRef} />
                    <mask id={`${id}-reveal`} className="guide-mask guide-stroke" ref={maskRef} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" />
                </defs>
                <use href={`#${id}-routes`} className="guide-stroke guide-track" />
                <g mask={`url(#${id}-reveal)`}>
                    <rect className="guide-fill" width="100%" height="100%" />
                </g>
            </svg>
            <div className="guide-dots" ref={dotsRef} aria-hidden="true" />
            {children}
        </div>
    );
}
