// Entry for the production script that replaces the Next/React runtime in the static
// export (see scripts/finalize-export.mjs). `next dev` runs the same two functions from
// the React components instead.
import { initGuide } from '../components/guide/runtime';
import { initStat } from '../components/ui/stat-runtime';

for (const root of document.querySelectorAll<HTMLElement>('.guide-system')) initGuide(root);
for (const stat of document.querySelectorAll<HTMLElement>('[data-stat]')) initStat(stat);
