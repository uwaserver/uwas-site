# Site-wide SVG background

`SiteBackground` is mounted once in the root layout, outside page content. Two fixed, viewport-sized SVG siblings share one simulation and animation loop: a quiet ambient field behind content and a low-opacity interaction field above it. Section overflow and opaque cards cannot clip the interactive field. It includes scroll-dependent depth, local repulsion/attraction, a tangential current, fading light trails and short-lived click waves.

## Source and budgets

- `src/components/site-background.tsx`: input, navigation, visibility, reduced motion and resize lifecycle. No per-frame React state.
- `src/lib/site-fabric.ts`: deterministic simulation, geometric layout and shared limits.
- `src/lib/site-fabric-svg.ts`: bounded SVG node pools, SVG paths/shapes and local connection lines. Soft text masks apply only to the ambient field. A separate radial influence mask reveals foreground geometry around the pointer and click waves; it never follows section or card rectangles. No Canvas, filters, raster buffers or third-party animation runtime is needed for this layer.
- `src/app/site-fabric.css`: brand colors, theme variants, shared section washes and stacking. Cards and code panels retain their opaque backgrounds. Text, lists, tables and footer navigation receive quieter background regions.

There are 12 geometric motifs on mobile, 38 on desktop and 58 on wide screens, plus 7/14 routes. Foreground echoes reuse their geometry. Interactions are capped at 6 click waves, 72 particles and 18 trail points. Waves last 2.1 seconds with a maximum radius of 165px on mobile / 310px on desktop; trails expire in 1.1 seconds. The pointer influences a 135px / 280px radius, with smoothly vanishing forces at its edge. Existing nodes are reused during animation; offscreen motifs stop receiving transform updates. Only viewport geometry is maintained, regardless of document length.

Both SVGs are `aria-hidden`, unfocusable and have `pointer-events: none`. Document-level pointer tracking continues over prose, cards and controls. Coordinates remain in client/viewport space during scrolling: only text masks and parallax move; the pointer anchor and existing click waves are retained. Controls and links, including nested SVG icons, are excluded from pulses using the event's composed path. A tap must stay within a small movement/time threshold; scrolling cancels the pending tap and text selections suppress pulses. All pointer/scroll listeners are passive. Reduced motion renders a static ambient field, hides interactions and schedules no animation frames. Hidden documents cancel animation requests and resume with a reset clock. Navigation disposes listeners, observers and nodes before rebuilding the field for the new content. The server diagram's CSS animation pauses offscreen.

`data-background-quiet` extends text masking to a foreground group. `data-background-no-pulse` excludes non-interactive foreground illustrations from echoes. Colors follow the existing light/dark UWAS palette. Density, speed, radius and lifetime limits live in `FABRIC`.

## Verification

`npm test` covers interaction budgets/expiry, stronger local forces, separation of prose masks and foreground effects, client-space ripple anchoring during scroll, tap/drag discrimination, frame-rate independence, geometric distribution, bounded parallax, static reduced-motion SVG output, stable node allocation under sustained clicking, and offscreen transform culling. Browser findings are recorded in `VALIDATION.md`. Screenshots and measurement files are retained locally under ignored `.qa/`.
