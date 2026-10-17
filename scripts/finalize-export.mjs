// Replaces the Next/React client runtime in the static export with a small framework-free
// script (runtime/main.ts). The pages are fully server-rendered, so the only behaviour they
// need is the scroll guide and the stat counters. Skipped when KEEP_NEXT_RUNTIME=1.
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;
const SCRIPT_PRELOAD = /<link\b[^>]*\brel="preload"[^>]*\bas="script"[^>]*>/g;

/** Strips Next's scripts (external chunks and flight-data pushes), keeps JSON-LD, adds a deferred script tag for `src`. */
export function stripRuntime(html, src) {
    let out = html.replace(SCRIPT_PRELOAD, '');
    out = out.replace(SCRIPT, (tag, attrs, body) => {
        if (/type="application\/ld\+json"/.test(attrs)) return tag;
        if (/\bsrc="/.test(attrs) || /self\.__next_f|globalThis\["TURBOPACK"\]/.test(body)) return '';
        throw new Error(`unexpected inline script: ${tag.slice(0, 80)}`);
    });
    if (!src) return out;
    return out.replace('</body>', `<script src="${src}" defer></script></body>`);
}

const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);

export async function finalizeExport(out) {
    const { build } = await import('esbuild');
    const result = await build({
        entryPoints: [fileURLToPath(new URL('../runtime/main.ts', import.meta.url))],
        bundle: true, minify: true, format: 'iife', target: 'es2022', write: false, legalComments: 'none',
    });
    const code = result.outputFiles[0].text.trim();
    // Content-hashed name under _next/static, so .htaccess caches it as immutable.
    const hash = createHash('sha256').update(code).digest('hex').slice(0, 12);
    const src = `/_next/static/runtime-${hash}.js`;
    mkdirSync(join(out, '_next/static'), { recursive: true });
    writeFileSync(join(out, src), code);
    const pages = walk(out).filter(f => f.endsWith('.html'));
    for (const page of pages) writeFileSync(page, stripRuntime(readFileSync(page, 'utf8'), src));
    // Nothing references these any more (flight payloads are for the client router).
    for (const f of walk(out)) {
        if (f.endsWith(src)) continue;
        if (/\/_next\/static\/chunks\/[^/]+\.js$/.test(f) || /\/__next\.[^/]*\.txt$/.test(f) || /\/_next\/static\/[^/]+\/_(buildManifest|ssgManifest|clientMiddlewareManifest)\.js$/.test(f)) rmSync(f);
    }
    return { pages: pages.length, bytes: code.length };
}
