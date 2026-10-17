// Checks the static export in out/ and zips it for upload: unzip into the web root.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { finalizeExport } from './finalize-export.mjs';

const out = new URL('../out/', import.meta.url).pathname;
const dist = new URL('../dist/', import.meta.url).pathname;
const fail = message => { console.error(`package: ${message}`); process.exit(1); };

for (const file of ['index.html', '404.html', '.htaccess', 'robots.txt', 'sitemap.xml', 'sprite.svg', 'icon.svg']) {
    if (!existsSync(join(out, file))) fail(`out/${file} is missing`);
}
// Unpublished case studies export as pages that show a 404 but answer 200; leave them out so
// the server returns a real 404 until content/projects.ts sets caseStudiesLive = true.
const live = /caseStudiesLive\s*=\s*true/.test(readFileSync(new URL('../content/projects.ts', import.meta.url), 'utf8'));
if (!live) rmSync(join(out, 'work'), { recursive: true, force: true });

if (process.env.KEEP_NEXT_RUNTIME === '1') {
    // Next's runtime needs inline scripts that change every build, so the CSP has to allow them.
    const htaccess = join(out, '.htaccess');
    writeFileSync(htaccess, readFileSync(htaccess, 'utf8').replace("script-src 'self'", "script-src 'self' 'unsafe-inline'"));
    console.log('package: KEEP_NEXT_RUNTIME=1, shipping the Next/React runtime');
}
else {
    const { pages, bytes } = await finalizeExport(out);
    console.log(`package: replaced the Next/React runtime in ${pages} pages with a ${bytes} byte script`);
}

const html = readFileSync(join(out, 'index.html'), 'utf8');
if (html.includes('/_next/image')) fail('index.html still references the image optimiser, which needs a server');
for (const [, src] of html.matchAll(/(?:src|href)="(\/[^"#?]+\.(?:webp|svg|ico))/g)) {
    if (!existsSync(join(out, src))) fail(`index.html references ${src}, which is not in out/`);
}

const list = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? list(join(dir, e.name)) : [join(dir, e.name)]);
const files = list(out);
const bytes = files.reduce((sum, f) => sum + statSync(f).size, 0);

const stamp = new Date().toISOString().slice(0, 10);
const zip = join(dist, `arpadhegedus-site-${stamp}.zip`);
mkdirSync(dist, { recursive: true });
rmSync(zip, { force: true });
try {
    execFileSync('zip', ['-r', '-q', '-X', zip, '.'], { cwd: out });
} catch {
    fail('the `zip` command is not available; install it (apt install zip) or zip the contents of out/ yourself');
}
console.log(`package: ${files.length} files, ${(bytes / 1024).toFixed(0)} KB -> ${zip} (${(statSync(zip).size / 1024).toFixed(0)} KB)`);
