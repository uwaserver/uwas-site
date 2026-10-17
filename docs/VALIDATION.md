# Website validation

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
- Theme cycle, persistence after reload and CSS theme application.
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
