# UWAS website

The UWAS product website, built with Next.js 16.4.2, React 19.3.1, TypeScript and Motion 14.3.0. It exports ordinary HTML/CSS/JS for GitHub Pages and the custom domain `uwaserver.com`.

## Develop

Requires Node.js 24 and npm. Fonts are bundled locally.

```sh
npm ci
npm run dev
```

For the actual static production output:

```sh
npm run lint
npm run typecheck
npm run build
npm run check:export
npm run preview
```

The static preview runs at `http://127.0.0.1:4317`. This deliberately avoids port 3000, which may belong to another local project. Stop it with Ctrl+C.

## What is included

- Home with animated SVG request-flow diagram, interactive stack comparison, configuration examples and illustrative dashboard explorer.
- Features with category filtering, use cases, architecture, downloads, changelog, licensing, enterprise contact, brand assets and privacy pages.
- Documentation overview and 16 guides, with navigation, code copying, section anchors and adjacent-guide links.
- Local documentation search (Ctrl/Cmd+K), including an empty state, keyboard focus and native modal behavior.
- Light, dark and system themes; saved theme preference; system-change handling.
- Mobile navigation and layouts tested from 320 pixels through 3840×2160.
- Reduced-motion support, keyboard-operated tabs, skip link and labelled icon controls.
- Four downloadable, font-independent vector logo variants, SVG favicon, Apple touch icon and a 1200×630 social image.
- Page metadata, canonical URLs, Open Graph, structured data, sitemap, robots.txt, CNAME and `.nojekyll`.
- GitHub Actions checks, static build, export validation and deployment.

The dashboard and MCP examples are explicitly illustrative. They never connect to a user's server or present sample metrics as production measurements. The website has no backend, account system or analytics SDK.

## Content maintenance

`src/lib/content.ts` is the central source for the reviewed UWAS version, installation command, documentation, feature descriptions and recent release summaries. `src/app/download/page.tsx` holds the reviewed release asset names and sizes. Update these together when UWAS publishes a release. Read `docs/SOURCE-REVIEW.md` for the source snapshot and important corrections.

The source review is a product/content review, not a security certification or a complete code audit of the UWAS server.

## Branding

Downloadable files live in `public/brand/`. The logo text is vector paths, not a font reference. The inline logo component lives in `src/components/brand.tsx`. Its converging arrows and U shape follow the supplied brand references.

To regenerate the vector downloads, favicon, Apple icon and social image:

```sh
node scripts/generate-assets.mjs
```

This uses the Sharp dependency supplied by Next.js. Generated files are checked in, so deployment does not need to regenerate them.

## GitHub Pages

The repository is intended to be `uwaserver/uwas-site`. In **Settings → Pages**, use **GitHub Actions** as the publishing source. The workflow builds `out/` and deploys it; pull requests build and validate without deploying. Production is served at the custom domain root, so no `/uwas-site` base path is configured.

`public/CNAME` contains `uwaserver.com`. The custom domain must also be assigned in Pages settings; an artifact's CNAME file alone does not move an existing domain assignment.

The domain was previously assigned to `uwaserver/uwas`. When migrating, build the new site first, remove the old repository's domain assignment, assign it to this repository, and deploy the new artifact. Review the old `Deploy Docs` workflow so future server releases do not attempt to publish the retired product website. No DNS change is required when the domain's existing GitHub Pages A records remain valid. Enable **Enforce HTTPS** after GitHub reports its certificate ready.

For a future rollback, restore the custom-domain assignment to the previous repository and redeploy its existing docs workflow. The server repository and its history are independent of this website repository.

## Validation

`check:export` walks every exported HTML file, verifies that local links and static assets exist, checks H1/title presence and confirms CNAME, `.nojekyll` and crawler metadata. It supplements TypeScript, ESLint and a real Next production build. Browser interaction and visual checks are recorded in `docs/VALIDATION.md`.

Local `.reference/` upstream sources and `.qa/` screenshots are ignored and never published.
