# Site-wide SVG background

`SiteBackground` is mounted once in the root layout, outside page content. It replaces the earlier hero-only Canvas implementation. A fixed, viewport-sized SVG field continues behind all sections and routes, with scroll-dependent depth, local pointer displacement, fading pointer wakes and short-lived request echoes.

## Source and budgets

- `src/components/site-background.tsx`: input, navigation, visibility, reduced motion and resize lifecycle. No per-frame React state.
- `src/lib/site-fabric.ts`: deterministic simulation, geometric layout and shared limits.
- `src/lib/site-fabric-svg.ts`: bounded SVG node pool, SVG paths/shapes, local connection lines and soft text masks. No Canvas, filters, raster buffers or third-party animation runtime is needed for this layer.
- `src/app/site-fabric.css`: brand colors, theme variants, shared section washes and stacking. Cards and code panels retain their opaque backgrounds. Text, lists, tables and footer navigation receive quieter background regions.

There are 12 geometric motifs on mobile, 38 on desktop and 58 on wide screens, plus 7/14 routes. Interactions are capped at 6 echoes, 72 particles and 18 wakes. Echoes last 2.1 seconds and have a bounded radius. Existing nodes are reused during animation; offscreen motifs stop receiving transform updates. Only viewport geometry is maintained, regardless of document length.

The SVG is `aria-hidden`, unfocusable and has `pointer-events: none`. Controls and links, including nested SVG icons, are excluded from background pulses using the event's composed path. A tap must stay within a small movement/time threshold; scrolling cancels it. All pointer/scroll listeners are passive. Reduced motion renders a static field and ignores interactions. Hidden documents cancel animation requests and resume with a reset clock. Navigation disposes listeners, observers and nodes before rebuilding the field for the new content. The old server diagram's CSS animation pauses offscreen.

`data-background-quiet` extends text masking to a foreground group. `data-background-no-pulse` excludes non-interactive foreground illustrations from echoes. Colors follow the existing light/dark UWAS palette. Density, speed, radius and lifetime limits live in `FABRIC`.

## Verification

`npm test` covers interaction budgets/expiry, pointer locality, tap/drag discrimination, frame-rate independence, geometric distribution, bounded parallax, static reduced-motion SVG output, stable node allocation under sustained clicking, and offscreen transform culling. Browser findings for the current revision are recorded in `VALIDATION.md`. Screenshots and measurement files are retained locally under ignored `.qa/`.
