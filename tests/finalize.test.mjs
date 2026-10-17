import assert from 'node:assert/strict';
import test from 'node:test';
import { stripRuntime } from '../scripts/finalize-export.mjs';

const page = [
    '<html><head><link rel="preload" as="script" href="/_next/static/chunks/a.js"/>',
    '<link rel="preload" as="font" href="/f.woff2"/></head><body><h1>Hi</h1>',
    '<script src="/_next/static/chunks/a.js" async=""></script>',
    '<script type="application/ld+json">{"@type":"Person"}</script>',
    '<script>(self.__next_f=self.__next_f||[]).push([0])</script>',
    '<script id="_R_">(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([])</script>',
    '</body></html>',
].join('');

test('removes Next scripts and script preloads, keeps JSON-LD and other preloads', () => {
    const out = stripRuntime(page, '');
    assert.ok(!out.includes('_next/static/chunks'));
    assert.ok(!out.includes('__next_f') && !out.includes('TURBOPACK'));
    assert.ok(out.includes('application/ld+json') && out.includes('/f.woff2'));
});

test('adds one deferred script tag before </body>', () => {
    const out = stripRuntime(page, '/_next/static/runtime-abc.js');
    assert.equal(out.match(/<script src="\/_next\/static\/runtime-abc\.js" defer><\/script><\/body>/g).length, 1);
});

test('fails loudly on an inline script it does not recognise', () => {
    assert.throws(() => stripRuntime('<body><script>alert(1)</script></body>', ''), /unexpected inline script/);
});
