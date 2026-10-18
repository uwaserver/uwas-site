# Hero request fabric

The full-width hero background follows UWAS's converging request paths, blue/ink palette, open junctions and small data packets. It is a decorative Canvas 2D client component; the existing copy, CTA controls and SVG server diagram retain their normal layout and interaction.

## Maintenance

- `src/components/hero-background.tsx`: lifecycle, input handling, theme updates and observers. The canvas never captures input and is hidden from assistive technology.
- `src/lib/hero-fabric.ts`: centralized `FABRIC` configuration, deterministic simulation and renderer. Animation values are kept outside React state.
- `src/app/hero-fabric.css`: full-bleed layer, entrance, edge mask and the existing diagram's offscreen pause.
- `data-hero-quiet` marks content that needs lower background contrast. `data-hero-no-pulse` excludes foreground visuals from background click effects. Native controls, headings, paragraphs and code are also excluded.

Budgets: 7 routes / 14 packets on mobile, 14 routes / 42 packets on desktop; at most 6 pulses, 72 sparks and 18 pointer wakes. A pulse lasts 2.1 seconds and reaches at most about 210px on desktop or 110px on mobile. Effects fade near boundaries and prose. Pointer displacement depends on local distance and depth; leaving the hero fades it back to zero.

The animation caps active desktop draws at 60fps, idle at 24fps, and mobile at 30fps. Pixel ratio is capped at 1.5 and approximately 4 million backing pixels. Timing uses elapsed seconds with a 50ms step cap. Hidden/offscreen scenes cancel their animation request; resuming resets the clock and clears transient effects. Reduced motion draws a static network once, without click/hover effects. All listeners and observers are removed on unmount. No new runtime dependencies were added.

## Verification, October 18, 2026

- `npm test`: 11 behavior tests, including rapid-click budgets, effect expiry, local pointer influence, idle recovery, touch tap/drag discrimination, frame-rate independence, pause-step clamping, pixel budget, readable zones and reduced-motion rendering.
- Actual production page rendered in local iframe viewports at 375, 768, 1024, 1440, 1920, 2560 and 3840 CSS pixels in both light and dark themes. All 14 checks had no document overflow and the canvas width matched the full hero width. Mobile selected the compact budget. Maximum observed backing area at DPR 1 was 3,748,500 pixels.
- Native mouse click produced a visible request echo. Native scrolling paused/resumed both the canvas and SVG flow lines when leaving/returning to the hero.
- A temporary browser fixture mocked the media preference and document visibility before app initialization. Reduced motion held at frame 103 with zero pending animation requests; hidden mode held at frame 111 with zero pending requests. After CTA navigation/unmount, frame 390 remained unchanged and pending requests stayed at zero.
- The same fixture replayed touch PointerEvents: a tap added an echo (737 to 801 stroke operations); a scroll gesture stayed at the 737-operation baseline. Copying the install command succeeded without a click echo (only the small normal pointer wake). Physical touchscreen hardware was not tested.
- Main-page console checks found no application errors. The temporary iframe instrumentation logged one MutationObserver error that was absent from the normal page; the scene's measured lifecycle checks continued normally.

Screenshots and viewport measurements are retained locally in ignored `.qa/hero-frame-*.jpg` and `.qa/hero-viewport-checks.json`. Browser fixtures are excluded from the final build and deployment.
