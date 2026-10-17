// Static exports have no image optimiser, so next/image resolves widths to the
// files made by scripts/generate-images.mjs (the next size up from what it asks for).
const WIDTHS = [206, 384, 512, 640, 828, 1080, 1440];

export default function imageLoader({ src, width }: { src: string; width: number }): string {
    const target = WIDTHS.find(candidate => candidate >= width) ?? WIDTHS[WIDTHS.length - 1];
    return src.replace(/\.webp$/, `-${target}.webp`);
}
