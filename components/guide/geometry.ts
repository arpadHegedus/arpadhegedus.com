export interface Point {
    x: number;
    y: number;
}

export interface GuideBox {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface GuideSection {
    kind: 'frame' | 'projects' | 'testimonials' | 'icons';
    top: number;
    bottom: number;
    boxes: GuideBox[];
    rail?: number;
}

export interface GuideRoute {
    d: string;
    length: number;
    start: number;
    end: number;
    from: Point;
    to: Point;
}

export interface GuideDot extends Point {
    start: number;
    end: number;
}

export interface GuideStop {
    y: number;
    distance: number;
}

export interface GuideLayout {
    routes: GuideRoute[];
    dots: GuideDot[];
    length: number;
    stops: GuideStop[];
}

export const DOT_TRAVEL = 80;
export const TIP_FADE = 168;
export const FADE_STEPS = 36;

export function buildGuideLayout({
    center, start, heroBottom, heroCtaBottom, heroDotDrop, viewportHeight, mobile, sections, halfStroke,
}: {
    center: number;
    start: number;
    heroBottom: number;
    heroCtaBottom: number;
    heroDotDrop: number;
    viewportHeight: number;
    mobile: boolean;
    sections: GuideSection[];
    halfStroke: number;
}): GuideLayout {
    const routes: GuideRoute[] = [];
    const dots: GuideDot[] = [];
    const heroStart = mobile
        ? Math.max(viewportHeight / 2, start - Math.max(96, viewportHeight * 0.15))
        : viewportHeight / 2;
    const stops: GuideStop[] = [{ y: heroStart, distance: 0 }];
    let clock = 0;
    let position = { x: center, y: start };

    // Snap so a stroke's edge (coord +/- halfStroke) lands on a device pixel;
    // otherwise axis-aligned strokes anti-alias across two pixels at random,
    // making some lines look blurrier/thicker than others for no visible reason.
    const snap = (v: number) => Math.round(v + halfStroke) - halfStroke;
    const snapPoint = ({ x, y }: Point): Point => ({ x: snap(x), y: snap(y) });

    function path(rawPoints: Point[], at = clock) {
        const points = rawPoints.map(snapPoint);
        const length = points.slice(1).reduce((total, p, i) => total + Math.hypot(p.x - points[i].x, p.y - points[i].y), 0);
        if (length === 0) return at;
        routes.push({
            d: points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '),
            length, start: at, end: at + length,
            from: points[0], to: points[points.length - 1],
        });
        return at + length;
    }

    function travel(...points: Point[]) {
        clock = path([position, ...points]);
        position = points[points.length - 1];
    }

    function dot() {
        dots.push({ ...snapPoint(position), start: clock, end: clock + DOT_TRAVEL });
        clock += DOT_TRAVEL;
    }

    function frame(box: GuideBox) {
        const middle = (box.left + box.right) / 2;
        travel({ x: middle, y: box.top });
        const destination = { x: middle, y: box.bottom };
        clock = Math.max(...[box.left, box.right].map(x => path([
            position, { x, y: box.top }, { x, y: box.bottom }, destination,
        ])));
        position = destination;
    }

    function mobileProjects(section: GuideSection) {
        const rail = section.rail;
        if (rail === undefined) throw new Error('Mobile project guides require a rail.');
        const entry = section.top + (section.boxes[0].top - section.top) / 2;
        travel({ x: center, y: entry }, { x: rail, y: entry });
        for (const box of section.boxes) {
            const middle = (box.top + box.bottom) / 2;
            travel({ x: rail, y: middle });
            dot();
            const branchStart = path([position, { x: box.left, y: middle }]);
            clock = Math.max(...[box.top, box.bottom].map(y => path([
                { x: box.left, y: middle }, { x: box.left, y },
                { x: box.right, y }, { x: box.right, y: middle },
            ], branchStart)));
        }
        const last = section.boxes[section.boxes.length - 1];
        const turn = (last.bottom + section.bottom) / 2;
        travel({ x: rail, y: turn }, { x: center, y: turn });
    }

    function pairedFrames(boxes: GuideBox[], middle: number) {
        travel({ x: center, y: middle });
        dot();
        clock = Math.max(...boxes.map((box, index) => {
            const inner = index % 2 === 0 ? box.right : box.left;
            const outer = index % 2 === 0 ? box.left : box.right;
            const entrance = { x: inner, y: middle };
            // Opposite points on the perimeter give both fill fronts equal travel.
            const meeting = { x: outer, y: box.top + box.bottom - middle };
            const branchStart = path([position, entrance]);
            return Math.max(...[box.top, box.bottom].map(y =>
                path([entrance, { x: inner, y }, { x: outer, y }, meeting], branchStart)));
        }));
    }

    function desktopProjects(section: GuideSection) {
        for (let row = 0; row < 2; row++) {
            const boxes = section.boxes.slice(row * 2, row * 2 + 2);
            const top = Math.max(...boxes.map(box => box.top));
            const bottom = Math.min(...boxes.map(box => box.bottom));
            pairedFrames(boxes, top + Math.min(48, (bottom - top) / 4));
            const boundary = row === 0
                ? (Math.max(...boxes.map(box => box.bottom)) + section.boxes[2].top) / 2
                : section.bottom;
            travel({ x: center, y: boundary });
            stops.push({ y: boundary, distance: clock });
        }
    }

    function circle(box: GuideBox, at: number, side?: 'left' | 'right') {
        const x = (box.left + box.right) / 2;
        const y = (box.top + box.bottom) / 2;
        const radius = (box.right - box.left) / 2;
        const from = snapPoint(side ? { x: side === 'left' ? box.left : box.right, y } : { x, y: box.top });
        const to = snapPoint(side ? { x: side === 'left' ? box.right : box.left, y } : { x, y: box.bottom });
        const length = Math.PI * radius;
        for (const sweep of [0, 1]) {
            routes.push({
                d: `M ${from.x} ${from.y} A ${radius} ${radius} 0 0 ${sweep} ${to.x} ${to.y}`,
                length, start: at, end: at + length, from, to,
            });
        }
        return at + length;
    }

    function icons(section: GuideSection) {
        if (mobile) {
            const middle = (section.boxes[0].top + section.boxes[section.boxes.length - 1].bottom) / 2;
            travel({ x: center, y: middle });
            dot();
            clock = Math.max(...section.boxes.map((box, index) => {
                const onLeft = index % 2 === 0;
                const inner = onLeft ? box.right : box.left;
                const rail = (center + inner) / 2;
                const y = (box.top + box.bottom) / 2;
                const at = path([position, { x: rail, y: middle }, { x: rail, y }, { x: inner, y }]);
                return circle(box, at, onLeft ? 'right' : 'left');
            }));
            return;
        }
        const rows: GuideBox[][] = [];
        for (const box of section.boxes) {
            const row = rows.find(row => Math.abs(row[0].top - box.top) < 1);
            if (row) row.push(box);
            else rows.push([box]);
        }
        const rail = Math.min(...section.boxes.map(box => box.left)) - 16;
        rows.forEach((row, index) => {
            const bar = row[0].top - 24;
            if (index > 0) travel({ x: rail, y: position.y }, { x: rail, y: bar });
            travel({ x: center, y: bar });
            dot();
            clock = Math.max(...row.map(box => {
                const x = (box.left + box.right) / 2;
                const circleTop = { x, y: box.top };
                const branchStart = path([position, { x, y: bar }, circleTop]);
                return circle(box, branchStart);
            }));
        });
    }

    if (mobile) {
        dot();
    } else {
        const dotY = heroCtaBottom + heroDotDrop;
        position = { x: center * 1.5, y: dotY };
        dot();
        travel({ x: position.x, y: dotY + heroDotDrop }, { x: center, y: dotY + heroDotDrop });
    }
    travel({ x: center, y: heroBottom });
    stops.push({ y: heroBottom, distance: clock });

    for (const section of sections) {
        if (section.top > position.y) {
            travel({ x: center, y: section.top });
            stops.push({ y: section.top, distance: clock });
        }
        if (section.kind === 'frame') frame(section.boxes[0]);
        if (section.kind === 'projects') {
            if (mobile) mobileProjects(section);
            else desktopProjects(section);
        }
        if (section.kind === 'testimonials') {
            if (mobile) section.boxes.forEach(frame);
            else pairedFrames(section.boxes, (section.boxes[0].top + section.boxes[0].bottom) / 2);
        }
        if (section.kind === 'icons') icons(section);
        else travel({ x: center, y: section.bottom });
        if (stops[stops.length - 1].y !== section.bottom) {
            stops.push({ y: section.bottom, distance: clock });
        }
    }

    clock += TIP_FADE;
    stops[stops.length - 1].distance = clock;
    const iconSection = sections[sections.length - 1];
    if (mobile && iconSection?.kind === 'icons') {
        const lead = Math.min(viewportHeight / 2, (iconSection.top - heroBottom) / 2);
        const leadStart = iconSection.top - 2 * lead;
        // Ramp the shared lead-in forward so the icon timing never breaks the stem.
        for (const stop of stops) {
            stop.y -= Math.max(0, Math.min(lead, (stop.y - leadStart) / 2));
        }
        stops[stops.length - 1].y = Math.max(...iconSection.boxes.map(box => box.bottom)) - lead;
    }
    return { routes, dots, stops, length: clock };
}

export function guideDistanceAt(stops: GuideStop[], y: number): number {
    if (y <= stops[0].y) return 0;
    for (let i = 1; i < stops.length; i++) {
        const previous = stops[i - 1];
        const next = stops[i];
        if (y <= next.y) {
            const progress = (y - previous.y) / (next.y - previous.y);
            return previous.distance + progress * (next.distance - previous.distance);
        }
    }
    return stops[stops.length - 1].distance;
}

export function routeDistanceAt(route: GuideRoute, distance: number): number {
    return Math.max(0, Math.min(route.length, distance - route.start));
}

export function dotProgressAt(dot: GuideDot, distance: number): number {
    const progress = Math.max(0, Math.min(1, (distance - dot.start) / (dot.end - dot.start)));
    return progress * progress * (3 - 2 * progress);
}

export function fadeDistances(length: number, distance: number): number[] {
    return Array.from({ length: FADE_STEPS }, (_, i) =>
        Math.max(0, Math.min(length, distance - TIP_FADE * i / (FADE_STEPS - 1))));
}
