const format = (value: number) => new Intl.NumberFormat('en-GB').format(value);
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Counts a `.stat` element's number up from `data-from` to `data-number` the first
 * time it scrolls into view. The markup (from Stat.tsx) already shows the final number,
 * so crawlers, screen readers and visitors without scripts see real values.
 * Returns a function that cancels any pending work.
 */
export function initStat(root: HTMLElement): () => void {
    const node = root.querySelector<HTMLElement>('.stat-number');
    const number = Number(root.dataset.number);
    const from = Number(root.dataset.from ?? 0);
    const duration = Number(root.dataset.duration ?? 1500);
    if (!node || !Number.isFinite(number)) return () => {};
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

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
}
