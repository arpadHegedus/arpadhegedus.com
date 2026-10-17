// Pre-generates the responsive portrait sizes the static export serves.
// Source: assets/arpad.webp -> public/arpad-<width>.webp. Keep WIDTHS in sync with image-loader.ts (they match images.deviceSizes/imageSizes in next.config.ts).
import sharp from 'sharp';

const WIDTHS = [206, 384, 512, 640, 828, 1080, 1440];
const source = new URL('../assets/arpad.webp', import.meta.url);

for (const width of WIDTHS) {
    const out = new URL(`../public/arpad-${width}.webp`, import.meta.url);
    const info = await sharp(source.pathname).resize({ width }).webp({ quality: 74, effort: 6 }).toFile(out.pathname);
    console.log(`arpad-${width}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
