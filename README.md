This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Scroll guides

[Guide](./components/guide/Guide.tsx) wraps the page's guided sections. It draws
one SVG overlay: an (invisible) track and a teal fill masked by connected, branching
routes. Line tips have a short alpha fade, not a luminous leading edge.
Only junction dots glow. There are no independent CSS line animation ranges.

- The hero's `data-guide-origin` marks the start (top on desktop, the dot below
  the content below `60rem`). CSS also sets `--guide-mobile`, so measured
  routing follows the same non-overlapping breakpoint as the layout. On mobile,
  the scroll window starts 15vh (at least 96px) before the origin reaches the
  midpoint, bounded by the top of the page. This gives its dot and short stem
  more travel without delaying the handoff into the next section.
- `data-guide-section="frame"` contains a centred `data-guide-frame`. Routes
  split at its top, trace both sides, reunite at its bottom, then continue.
- `data-guide-section="projects"` contains four `data-guide-card` boxes.
  Desktop has one junction near the top of each row, with a separate measured
  scroll interval for each pair. The cards begin filling while the row is coming
  into view, rather than waiting for a junction between all four cards. Mobile
  retains its left rail with a junction and connector for each stacked card.
  Desktop perimeter branches meet opposite their entrance, with equal lengths,
  so neither tip stops and turns into a hard edge before the other arrives.
- `data-guide-section="testimonials"` contains two `data-guide-testimonial`
  boxes. Mobile stacks their outlines along the centre stem; desktop connects
  the side-by-side boxes through a central glowing junction.
- `data-guide-section="icons"` contains square `data-guide-circle` boxes, each
  holding one SVG icon. Branches feed the circles from above; circles fill in
  both directions. Mobile uses two columns, fed from a central dot halfway down
  the grid through an inner rail on each side.
  On mobile, the shared timeline gradually advances through the preceding
  viewport of content. All circles, including their fade tails, finish when the
  bottom row enters the viewport; the central dot still animates before its
  branches. Desktop timing is unchanged. The footer leaves enough scroll space
  for the final circles to finish.
- The viewport midpoint is a shared scroll cursor. Actual section heights map
  linearly to cumulative route distance, including horizontal edges. This gives
  wide borders proportionally more scrolling time without section handoff pauses.
  The desktop hero maps scroll zero to zero fill and keeps the same midpoint
  handoff into the next section. There is no hero easing.
- At a dot, the incoming route finishes, the dot scales/fades in, then its
  outgoing branches start. `DOT_TRAVEL` sets the scroll-driven animation budget;
  it is not a time delay. Branches can run in parallel, and the next stage waits
  for the longest branch. Scrolling backwards reverses this same sequence.
- `TIP_FADE` and `FADE_STEPS` define the non-glowing fade along each route,
  including turns and circle arcs. Each alpha layer uses the shared travel
  distance before clamping to a route's length: the fade therefore spans both
  sides of a join, instead of shrinking to zero at its endpoint. Completed routes
  continue updating until the fade's tail has passed them. A final fade-length
  budget lets the terminal circles become fully filled. The mobile origin and
  all junction dots use the same `.guide-dot` style.
- `ResizeObserver` rebuilds the geometry after content/font/size changes.
  Scroll updates are batched in `requestAnimationFrame`, with no layout reads
  or React renders on ordinary scroll events.
- Reduced motion shows all routes and dots immediately and statically.
  The overlay is decorative and cannot intercept clicks. The measured
  decoration requires JavaScript; page content does not.

Keep frames centred inside the wrapper so both routes have equal lengths.
The geometry and progress mapping live in
[geometry.ts](./components/guide/geometry.ts).
The section markup and responsive layout live in
[components/sections](./components/sections), each with its own CSS file.
Run `npm test` with Node 22.6+ for route continuity, dot sequencing, hero-start,
reverse-scroll, resize, and fade regressions.

## Deploying

The site is a static export (`output: 'export'`), so any web server can host it.

1. `npm run package` builds the site and writes `dist/arpadhegedus-site-<date>.zip`.
2. Unzip it into the web root (the folder served as `https://arpadhegedus.com/`).
   The zip includes an Apache `.htaccess` (compression, caching, security headers,
   404 page); nginx ignores it and needs the equivalent in its own config.

Notes:

- `npm run package` strips the Next/React client runtime from the export
  (`scripts/finalize-export.mjs`) and inlines one small script built from
  `runtime/main.ts` (scroll guide and stat counters, shared with the React components
  in `next dev`). This removes Lighthouse's "legacy" and "unused JavaScript" warnings.
  Pages are plain HTML; links between pages are normal navigations. Set
  `KEEP_NEXT_RUNTIME=1` to ship the full Next runtime instead (needed if you add
  client-only features that depend on React, such as forms with state).
- The portrait sizes in `public/arpad-<width>.webp` are generated from
  `assets/arpad.webp` by `npm run images`; `image-loader.ts` picks between them
  because a static export has no image optimiser.
- Case-study pages are left out of the zip (they would answer 200 with a 404 page)
  until `caseStudiesLive` in `content/projects.ts` is `true`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
