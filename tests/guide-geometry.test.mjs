import assert from 'node:assert/strict';
import test from 'node:test';
import {
    buildGuideLayout, guideDistanceAt, routeDistanceAt, dotProgressAt, fadeDistances,
    DOT_TRAVEL, FADE_STEPS, TIP_FADE,
} from '../components/guide-geometry.ts';

const HALF_STROKE = 0.5;
const HERO_DOT_DROP = 96;
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-7, `${actual} != ${expected}`);
// Snapping to the pixel grid moves each coordinate by under a pixel.
const near = (actual, expected, tolerance = 1.5) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} !~ ${expected}`);
const samePoint = (a, b) => a.x === b.x && a.y === b.y;
const snap = value => Math.round(value + HALF_STROKE) - HALF_STROKE;

function fixture(width) {
    const mobile = width < 960;
    const center = width / 2;
    const frame = { left: 24, right: width - 24, top: 896, bottom: 1504 };
    const cardWidth = mobile ? width - 80 : (width - 160) / 2;
    const cards = Array.from({ length: 4 }, (_, i) => {
        const left = mobile ? 56 : (i % 2 === 0 ? 24 : width - 24 - cardWidth);
        const top = 1696 + (mobile ? i : Math.floor(i / 2)) * 380;
        return { left, right: left + cardWidth, top, bottom: top + 300 };
    });
    const projectBottom = cards[3].bottom + 96;
    const quoteBottom = projectBottom + 600;
    const columns = mobile ? 2 : 6;
    const circles = Array.from({ length: 6 }, (_, i) => {
        const x = (i % columns + 0.5) * width / columns;
        const top = quoteBottom + 96 + Math.floor(i / columns) * 160;
        return { left: x - 24, right: x + 24, top, bottom: top + 48 };
    });
    const sections = [
        { kind: 'frame', top: 800, bottom: 1600, boxes: [frame] },
        { kind: 'projects', top: 1600, bottom: projectBottom, boxes: cards, rail: 24 },
        { kind: 'testimonials', top: projectBottom, bottom: quoteBottom, boxes: [0, 1].map(i => ({
            left: mobile ? 24 : i === 0 ? 24 : center + 40,
            right: mobile ? width - 24 : i === 0 ? center - 40 : width - 24,
            top: projectBottom + 96 + (mobile ? i * 230 : 0),
            bottom: projectBottom + (mobile ? 280 + i * 230 : 504),
        })) },
        { kind: 'icons', top: quoteBottom, bottom: circles[5].bottom + 96, boxes: circles },
    ];
    return {
        center, mobile, start: mobile ? 700 : 0, heroBottom: 800,
        heroCtaBottom: 520, heroDotDrop: HERO_DOT_DROP, halfStroke: HALF_STROKE,
        viewportHeight: 800, sections,
    };
}

for (const width of [320, 375, 768, 959, 960, 961, 1024, 1440, 1920]) {
    test(`connected wireframe routes and dot sequencing at ${width}px`, () => {
        const input = fixture(width);
        const layout = buildGuideLayout(input);
        const { routes, dots, stops } = layout;
        assert.equal(dots.length, input.mobile ? 6 : 5);
        assert.equal(routes.filter(route => route.d.includes(' A ')).length, 12);
        assert.equal(guideDistanceAt(stops, input.viewportHeight / 2), 0, 'hero starts empty');
        // Mobile starts at a dot and runs straight down; desktop starts at a dot
        // right of centre, drops, turns left to the centre line, then continues down.
        const heroRun = input.mobile
            ? 800 - input.start + DOT_TRAVEL
            : DOT_TRAVEL + HERO_DOT_DROP + input.center / 2 + (800 - (input.heroCtaBottom + 2 * HERO_DOT_DROP));
        near(guideDistanceAt(stops, 800), heroRun);
        assert.equal(guideDistanceAt(stops, 1e6), layout.length);

        for (const route of routes) {
            assert.ok(Number.isFinite(route.length) && route.length > 0);
            close(route.end - route.start, route.length);
            assert.equal(routeDistanceAt(route, route.start - 1), 0);
            assert.equal(routeDistanceAt(route, route.end + 1), route.length);
            close(routeDistanceAt(route, (route.start + route.end) / 2), route.length / 2);
            if (!route.d.includes(' A ')) {
                const points = [...route.d.matchAll(/[ML] ([\d.-]+) ([\d.-]+)/g)].map(match => ({ x: +match[1], y: +match[2] }));
                points.slice(1).forEach((point, i) => {
                    assert.ok(point.x === points[i].x || point.y === points[i].y, 'only orthogonal connectors');
                });
            }
        }

        for (const [index, dot] of dots.entries()) {
            assert.equal(dot.end - dot.start, DOT_TRAVEL);
            assert.equal(dotProgressAt(dot, dot.start), 0);
            assert.equal(dotProgressAt(dot, (dot.start + dot.end) / 2), 0.5);
            assert.equal(dotProgressAt(dot, dot.end), 1);
            if (index > 0) {
                assert.ok(routes.some(route => route.end === dot.start && samePoint(route.to, dot)), 'incoming line arrives before dot');
            }
            const branches = routes.filter(route => samePoint(route.from, dot) && route.start >= dot.start);
            assert.ok(branches.length > 0);
            for (const branch of branches) {
                assert.ok(branch.start >= dot.end, 'outgoing branch waits for dot');
                assert.equal(routeDistanceAt(branch, (dot.start + dot.end) / 2), 0);
            }
        }

        for (const stop of stops.slice(1, -1)) {
            const before = guideDistanceAt(stops, stop.y - 0.001);
            const after = guideDistanceAt(stops, stop.y + 0.001);
            assert.ok(before < stop.distance && after > stop.distance);
            assert.ok(after - before < 0.1, 'no section jump');
        }
        const heroStart = stops[0].y;
        const step = (800 - heroStart) / 10;
        const increments = Array.from({ length: 9 }, (_, i) =>
            guideDistanceAt(stops, heroStart + (i + 1) * step) - guideDistanceAt(stops, heroStart + i * step));
        increments.forEach(increment => close(increment, increments[0]));

        if (input.mobile) {
            const oldWindow = input.heroBottom - input.start;
            const newWindow = input.heroBottom - heroStart;
            assert.ok(newWindow >= 2 * oldWindow, 'mobile hero has at least twice the scroll travel');
            const previousWindow = input.heroBottom - Math.max(input.viewportHeight / 2, input.start - Math.max(120, input.viewportHeight * 0.2));
            assert.ok(newWindow < previousWindow && newWindow > previousWindow * 0.75, 'hero is modestly faster than the preceding version');
            const iconDot = dots.at(-1);
            const iconBoxes = input.sections.at(-1).boxes;
            close(iconDot.x, snap(input.center));
            close(iconDot.y, snap((iconBoxes[0].top + iconBoxes.at(-1).bottom) / 2));
            const fullyVisibleCursor = Math.max(...iconBoxes.map(box => box.bottom)) - input.viewportHeight / 2;
            close(guideDistanceAt(stops, fullyVisibleCursor), layout.length);
            for (const route of routes.filter(route => route.d.includes(' A '))) {
                fadeDistances(route.length, layout.length - route.start).forEach(value => close(value, route.length));
            }
        } else {
            const boxes = input.sections[1].boxes;
            for (let row = 0; row < 2; row++) {
                const dot = dots[row + 1];
                const box = boxes[row * 2];
                assert.ok(dot.y < box.top + (box.bottom - box.top) / 4);
                const segment = stops.findIndex(stop => stop.distance >= dot.end);
                const a = stops[segment - 1], b = stops[segment];
                const cursor = a.y + (b.y - a.y) * (dot.end - a.distance) / (b.distance - a.distance);
                assert.ok(cursor < box.top + 48, 'row branches start while its top is still near the viewport midpoint');
            }
        }

        // Branches and dot animations reverse deterministically with scroll.
        const samples = [0, 0.1, 0.5, 0.9, 1].map(fraction => fraction * layout.length);
        const forward = samples.map(distance => dots.map(dot => dotProgressAt(dot, distance)));
        const reverse = samples.toReversed().map(distance => dots.map(dot => dotProgressAt(dot, distance))).reverse();
        assert.deepEqual(forward, reverse);
    });
}

test('fade stays behind the front, starts empty and ends completely filled', () => {
    assert.deepEqual(fadeDistances(200, 0), Array(FADE_STEPS).fill(0));
    assert.deepEqual(fadeDistances(200, 200 + TIP_FADE), Array(FADE_STEPS).fill(200));
    const fade = fadeDistances(400, 300);
    assert.equal(fade[0], 300);
    assert.equal(fade.at(-1), 300 - TIP_FADE);
    assert.ok(fade.every((distance, i) => i === 0 || distance < fade[i - 1]));
    // These opacity weights yield a linear alpha ramp, not a glowing overlay.
    let alpha = 0;
    for (let i = 0; i < FADE_STEPS; i++) {
        alpha = alpha + (1 - alpha) / (FADE_STEPS - i);
        close(alpha, (i + 1) / FADE_STEPS);
    }
});

test('desktop card fronts have equal lengths and meet without a parked hard edge', () => {
    for (const width of [960, 1024, 1440, 1920]) {
        const input = fixture(width);
        const layout = buildGuideLayout(input);
        for (const raw of input.sections[1].boxes) {
            const box = { left: snap(raw.left), right: snap(raw.right), top: snap(raw.top), bottom: snap(raw.bottom) };
            const paths = layout.routes.filter(route =>
                route.from.y > box.top && route.from.y < box.bottom
                && (route.from.x === box.left || route.from.x === box.right)
                && route.to.x !== route.from.x);
            assert.equal(paths.length, 2);
            near(paths[0].length, paths[1].length);
            near(paths[0].end, paths[1].end);
            assert.deepEqual(paths[0].to, paths[1].to);
            near(paths[0].to.y, box.top + box.bottom - paths[0].from.y);
            const halfPerimeter = box.right - box.left + box.bottom - box.top;
            near(paths[0].length, halfPerimeter);
            // Even just before meeting, neither front has finished and hardened.
            for (const distance of [paths[0].end - TIP_FADE, paths[0].end - 1]) {
                const fades = paths.map(route => fadeDistances(route.length, distance - route.start));
                assert.deepEqual(fades[0], fades[1]);
                assert.ok(fades.every(fade => fade[0] < halfPerimeter));
            }
        }
    }
});

test('mobile icon anticipation remains continuous across viewport heights', () => {
    for (const viewportHeight of [568, 667, 844, 1024, 1366]) {
        const input = { ...fixture(375), viewportHeight };
        const layout = buildGuideLayout(input);
        const icons = input.sections.at(-1);
        const bottom = Math.max(...icons.boxes.map(box => box.bottom));
        close(guideDistanceAt(layout.stops, bottom - viewportHeight / 2), layout.length);
        layout.stops.slice(1).forEach((stop, index) => {
            assert.ok(stop.y > layout.stops[index].y);
            assert.ok(stop.distance > layout.stops[index].distance);
        });
        const iconDot = layout.dots.at(-1);
        assert.ok(iconDot.end < layout.length);
    }
});

test('fade crosses a section handoff without shrinking or restarting', () => {
    const incomingLength = 200;
    const outgoingLength = 120;
    for (const offset of [-10, 0, 10, 20, 36, 46]) {
        const incoming = fadeDistances(incomingLength, incomingLength + offset);
        const outgoing = fadeDistances(outgoingLength, offset);
        for (let layer = 0; layer < FADE_STEPS; layer++) {
            const combined = incoming[layer] + outgoing[layer];
            close(combined, incomingLength + offset - TIP_FADE * layer / (FADE_STEPS - 1));
        }
    }
    assert.equal(fadeDistances(incomingLength, incomingLength).at(-1), incomingLength - TIP_FADE);
    assert.ok(fadeDistances(incomingLength, incomingLength + 10).at(-1) < incomingLength);
    assert.ok(fadeDistances(outgoingLength, 10)[0] > 0, 'next front is visible before preceding tail catches up');
});

test('layout remeasurement changes routing without stale section handoffs', () => {
    const input = fixture(1024);
    const before = buildGuideLayout(input);
    input.heroBottom += 120;
    for (const section of input.sections) {
        section.top += 120;
        section.bottom += 120;
        for (const box of section.boxes) {
            box.top += 120;
            box.bottom += 120;
        }
    }
    const after = buildGuideLayout(input);
    close(after.length - before.length, 120);
    const heroRun = DOT_TRAVEL + HERO_DOT_DROP + input.center / 2
        + (input.heroBottom - (input.heroCtaBottom + 2 * HERO_DOT_DROP));
    near(guideDistanceAt(after.stops, input.heroBottom), heroRun);
});
