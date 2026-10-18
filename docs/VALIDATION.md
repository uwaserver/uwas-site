# Website validation

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
