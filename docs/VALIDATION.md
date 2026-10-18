# Website validation

## Header background-animation control, October 18, 2026

- Added a 44×44px mouse toggle beside the appearance control, with pressed state, slashed inactive icon, state-specific Turkish tooltip/accessible label and native keyboard activation. Preference is initialized before hydration, stored under `uwas-background-animations`, and defaults to the system reduced-motion setting until explicitly chosen.
- `npm test`: 25 passed, including new preference/bootstrap, storage failure, subscription cleanup, cross-tab synchronization and system-default/explicit-choice coverage. Lint, TypeScript, production build and static export validation passed (30 HTML files / 27 canonical routes).
- A temporary production-page fixture proved real lifecycle cleanup. Switching off removed the background pointer listeners (document counts 3→2, leaving React's delegation), scroll/leave/visibility listeners (1→0), and the pending scene frame (1→0). Active effects cleared, hero animation became `none`, and subsequent pointer replay left the scene callback count and SVG mutation count unchanged. Enter restarted one scene request and one listener set; ten toggles retained those counts.
- A simulated first visit with reduced motion started off with no scene callbacks. Space explicitly enabled it. On the normal site, an off choice survived reload and navigation to Features. The appearance menu still used `theme-panel-in` and changed the palette while background animation remained off. Mobile navigation and reactivation worked.
- Header geometry checked in dark mode at 320, 375, 650, 651, 700, 768, 1024, 1440 and 2560px and in light mode at 320, 375, 768 and 1440px: no overflow; button target remained 44×44px. Local evidence: `.qa/animation-toggle-lifecycle.json`, `animation-toggle-layout.json`, and the desktop/mobile toggle screenshots. Temporary probe files are excluded from publication.

## Organic orbits and chained reactions, October 18, 2026

- Added damped orbital motion and depth-dependent turning without changing text masks or foreground layer opacity. A click can relay through two shape-to-shape hops, with two branches per wave and one visit per shape per cascade. Relay pools are capped at 4 mobile / 10 desktop; each hop loses 42% of its energy and lasts 0.8s. Rapid clicks also cap spin, velocity and response brightness.
- `npm test`: 20 passed. Added coverage for smooth orbit onset, no teleporting after an abrupt cursor move, return to rest, comparable motion at 30Hz/144Hz, and two-hop propagation to a shape outside the initial click radius on desktop and mobile. Existing static reduced-motion, offscreen culling, node allocation, input and scroll tests passed.
- Production browser checks covered 375, 768, 1440 and 2560px in both themes: no overflow; combined SVG pools stayed at 301 / 507 / 571 nodes. A 100-touch replay reached the mobile four-relay limit without growing the pool. A desktop click produced visible relay arcs; card-hover samples followed changing curved positions and rotations while prose stayed readable.
- A temporary production-page fixture measured JavaScript animation callbacks: the 34-frame orbit sample had median 1.9ms / p95 5.6ms; the 73-frame click sample had median 2.2ms / p95 4.9ms. These measure callback execution, not paint time or achieved FPS. Reduced motion switched to `still`, with zero pending animation requests.
- Lint, TypeScript, production build and static export validation passed (30 HTML files / 27 canonical routes). Local browser evidence is retained in `.qa/organic-motion-checks.json` and `organic-motion-final-dark.jpg`; temporary probe files were removed before export validation and publication.

## Continuous interaction overlay, October 18, 2026

- Reproduced the occlusion: the original SVG used z-index 0 below content at 1, opaque cards hid its effects, and click waves shared the prose mask. Scrolling also cleared the entire interaction state. Two regression tests failed before the layer/force changes; their locality control passed.
- Ambient geometry and foreground interactions now use two body-level SVG siblings with one animation loop. The overlay is at z-index 2, has no prose/viewport CSS mask, uses only soft radial influence for local geometry, and has `pointer-events: none`. Content clipping and card backgrounds remain intact.
- Production export measured at 375, 768, 1024, 1440, 1920, 2560 and 3840px in both themes: 14 passing combinations, no document overflow, both SVGs cover the usable viewport. Combined node count: 285 mobile, 467 desktop, 531 wide.
- Browser replays over headings, linked cards and the feature/configuration boundary retained pointer tracking. A live native click on prose produced a foreground wave at exactly `translate(290.00 580.00)`. A scroll from 0 to 300 preserved pointer and pulse origin at `(89.20, 325.27)`. Native text selection succeeded with zero pulses.
- Desktop and mobile 100-click replays stayed at six waves with unchanged node counts. Mobile touch scrolling and nested control clicks produced zero waves. Native mobile navigation opened and reached `/docs/` with two SVG layers and no overflow. Physical touchscreen hardware was not tested.
- A temporary fixture mocked media preference and document visibility before loading the production HTML. Reduced motion held at 683 callbacks / 284,180 mutations with zero pending frames and a hidden interaction group. Hidden state held at 1,257 callbacks / 511,269 mutations with zero pending frames; resuming restored one loop.
- `npm test`: 17 passed, including layer separation, stronger local forces and scroll anchoring. Lint, TypeScript, production build and static export validation passed. Export validation: 30 HTML files / 27 canonical routes, all internal links, anchors and assets resolved. Temporary fixture files were removed before publication.
- Local evidence: `.qa/fabric-overlay-checks.json`, `fabric-overlay-heading-dark.jpg`, `fabric-overlay-card-dark.jpg`, `fabric-overlay-boundary-light.jpg`, and `fabric-overlay-final-dark.jpg`.

## Site-wide SVG background, October 18, 2026

- Replaced the hero-only Canvas layer with one SVG background in the shared root layout. Root, content, header and footer interactions retain their normal stacking and keyboard behavior.
- All 27 canonical routes checked at 375, 768, 1024, 1440, 1920, 2560 and 3840px in dark mode: 189 passing route/viewport combinations. Exactly one background SVG, zero Canvas elements, no document overflow, and correct viewport coverage. Largest observed SVG tree: 438 nodes; mobile: 245 nodes / 12 motifs.
- Home, features and configuration guide checked at the same seven widths in light mode: 21 passing combinations. Visual inspection included the hero, feature/configuration section boundary, docs and footer.
- A temporary browser fixture mocked media preference and document visibility before loading the production page. Reduced motion held at 215 animation callbacks / 53,791 SVG mutations with zero pending requests. Hidden mode held at 240 callbacks / 62,117 mutations with zero pending requests. Resuming restored one loop.
- 100 synchronous touch replays stayed at 6 active echoes and 394 SVG nodes. Touch scrolling produced zero echoes; copying succeeded without an echo. A 375px touch replay produced one echo with the compact 245-node pool. Physical touchscreen hardware was not tested.
- Features → Use cases → Documentation navigation returned to one pending animation request, one SVG and the same bounded node pool. No console errors observed during the checks.
- `npm test`: 14 passing tests. Lint, TypeScript, production build and static export validation passed on the final implementation.
- Local evidence: `.qa/site-svg-dark-checks.json`, `site-svg-light-checks.json`, `site-svg-interactions.json`, and `site-svg-*.jpg`. Temporary probe pages are removed from the production export before deployment. See [Site-wide SVG background](SITE-BACKGROUND.md) for maintenance.

## Interactive hero, October 18, 2026

Full-width request-path canvas added with bounded interactions, theme-aware palettes, compact mobile budgets and static reduced-motion rendering. See [Hero request fabric](HERO-FABRIC.md) for lifecycle, input and viewport evidence, including the scope of simulated browser checks.

`npm test` (11 passed), `npm run lint`, `npm run typecheck`, `npm run build` and `npm run check:export` passed. The final export contains 30 HTML pages / 27 canonical public routes and excludes temporary browser fixtures.

## Responsive layout, October 18, 2026

- Production static export checked on all 27 canonical routes at 375, 768, 1024, 1440, 1920 and 2560px: 162 route/viewport combinations, no document-level horizontal overflow, and consistent shared container alignment.
- Shared maximum width is 1728px. Wide feature and documentation grids use four columns; text retains a separate readable measure.
- Visual inspection at each requested width, light/dark theme checks, mobile appearance/navigation menus and catalog filtering. No browser console errors observed.
- Final catalog column adjustment rechecked at all six widths, including two filtered cards at 2560px.
- `npm run lint`, `npm run typecheck`, `npm run build` and `npm run check:export` passed on the final source changes.
- See [Responsive layout](RESPONSIVE-LAYOUT.md) for tokens, measured widths and evidence locations.

## Local production build, October 17, 2026

The website was tested using its actual static export, served by `npm run preview`, not only a development server.

### Automated checks

- `npm run build`: Next.js static generation and production compilation.
- `npm run typecheck`: TypeScript without emitting files.
- `npm run lint`: ESLint, TypeScript and React Hooks rules.
- `npm run check:export`: every exported HTML file, internal route and asset; CNAME, `.nojekyll`, titles, H1s and crawler metadata.
- `npm audit`: dependency advisory check. Check the current command output when updating dependencies; this is a dated verification record.

### Browser checks

- Desktop light and dark themes, 1440-pixel layout.
- 390×844 mobile layout and navigation, including the long-command overflow regression.
- 3840×2160 layout with constrained content width and larger typography.
- Main, configuration guide, features, downloads and brand pages measured at 320, 390, 768, 1024, 1440 and 3840 pixels: all 30 combinations had no document-level horizontal overflow.
- All 27 linked public routes checked at 390 pixels: H1 present, no document-level horizontal overflow and no visible unnamed buttons.
- Appearance menu with Light/Dark/System preview cards, arrow-key selection, Escape/outside-click/Tab dismissal, and persistence after reload.
- Theme changes synchronized across two open tabs; System selected the current operating-system palette.
- Appearance panel and radio-card touch targets fit 320, 390, 768, 1024, 1440 and 3840 pixels.
- Mobile hamburger open/close and documentation navigation.
- Local search with “cache,” successful navigation to Caching, and an unmatched-query empty state and clear action.
- Configuration tabs: WordPress content and keyboard ArrowRight transition to Reverse proxy.
- Install command copying: clipboard contents exactly matched the displayed upstream command.
- Dashboard preview switched from Domains to Applications.
- FAQ expansion.
- Security feature filter returned the two expected cards.
- Download page exposed five real published release assets.
- Unknown route rendered the custom 404 page.
- Browser console checked for errors during these flows.

Additional breakpoint, route and deployment results should be read with the final command output or deployment run. Build success does not certify the UWAS server itself.

### Evidence

Local screenshots are stored under ignored `.qa/`, including mobile light, desktop dark and 4K light examples. They are excluded from the production artifact and repository.
