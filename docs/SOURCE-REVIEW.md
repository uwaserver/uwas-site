# Product and content source review

Initial product review on October 17, 2026; release content refreshed on October 22, 2026 against:

- Live site: https://uwaserver.com/
- Upstream repository: https://github.com/uwaserver/uwas
- Reviewed release revision: `3f9c6e71e21ef5ad89006cb10a75e39c54b9f8e2` (`v0.11.31`)
- VERSION and latest published release: `v0.11.31`, October 21, 2026
- Supplied product overview and logo JPEG references

## October 22 release refresh

- Checked the published [v0.11.31 release](https://github.com/uwaserver/uwas/releases/tag/v0.11.31), its tag revision, `VERSION`, `CHANGELOG.md`, `UPGRADING.md`, `README.md` and `go.mod` at that tag. The release summaries cover v0.11.31 and v0.11.29; changes under main’s `Unreleased` section are excluded.
- Updated the shared version and reviewed revision, published-release summaries, documentation reference links and download sizes. GitHub’s release API reports 18,735,266 bytes for Linux amd64, 17,432,738 for Linux arm64, 19,104,592 for macOS amd64, 17,849,810 for macOS arm64 and 19,104,768 for Windows amd64. Display sizes use decimal MB rounded to one decimal place; all five binaries and `SHA256SUMS` are published assets.
- Added the PHP 8.2+ support floor and the v0.11.31 upgrade requirement to update host PHP separately or rebuild PHP/WordPress images. Recorded the patched PHP versions from the tagged upgrade notes without claiming that replacing UWAS patches external runtimes.
- Updated caching and auto-block guidance for the v0.11.29 behavior changes, and source-build requirements from the v0.11.31 `go.mod` (`go 1.26.10`).
- v0.11.30 was tagged without published binaries and is superseded by v0.11.31. Earlier unpublished-tag notes remain in the changelog.

## Sources inspected

- `README.md`: product scope, workflows, runtimes, install and update commands, requirements, administration, migration and container usage.
- `LICENSE`: dual AGPL-3.0 and commercial licensing, official licensing contact.
- `CHANGELOG.md` and GitHub Releases API: published releases versus tags that failed to publish binaries, recent fixes, asset names and byte sizes.
- `ARCHITECTURE.md`: listeners, request lifecycle, cache layers, handlers and separate workload processes.
- `uwas.example.yaml`: actual field names, per-domain includes, ACME, cache, HTTP/3, private management listeners, rate limits and auto-block configuration.
- `docs/BRANDING.md` and supplied logo: product identity, typography, primary blue and converging-path concept.
- Existing `docs/site/` metadata and product components: current content, comparison and performance claims, layout and information gaps.
- `cmd/uwas/main.go` and `internal/cli/config.go`: command registration and validation flags.
- `internal/admin/routes.go`: actual management endpoint registrations.
- `internal/mcp/server.go`: structured management tool interface and representative operations.
- `docker-compose.yml`, `docker/uwas.yaml`, Docker README sections: required secrets, private admin mapping and persistence.
- Existing Pages settings, domain DNS A records and `docs.yml` workflow: deployment migration requirements.

## Corrections and editorial decisions

1. **License:** supplied artwork says Apache 2.0. The current authoritative LICENSE defines AGPL-3.0 and a commercial option. The new site uses the current license.
2. **External processes:** the single Go binary contains server functionality and management interfaces. PHP-FPM, native application runtimes, databases and Docker remain separate when needed. The site says so explicitly.
3. **Performance claims:** “300× faster,” p99 overhead, startup time and numerical security scores are not republished as independently verified measurements. No invented benchmark chart, testimonials, customers or star counts were added.
4. **Changing counts:** existing website and README disagree on some route counts and binary sizes. The new site avoids an exact route count, labels downloads with actual release sizes and uses the documented 42 dashboard pages.
5. **Published releases:** v0.11.30, v0.11.27 and v0.11.24 did not publish binaries. The changelog points to v0.11.31, v0.11.28 and v0.11.25 respectively.
6. **Docker networking:** the upstream Compose file publishes TCP 443, but HTTP/3 requires an explicit UDP mapping too. The Docker guide explains this.
7. **Management access:** examples keep administration and MCP on loopback and describe SSH forwarding. No real credential is shipped.
8. **Product illustrations:** dashboard data and the MCP conversation are marked as illustrative. They are not a live demo or an AI execution endpoint.

## Website architecture

Next.js App Router uses static export and trailing-slash directories. Route-specific pages and documentation are rendered ahead of time. Small client components provide interaction; server features, cookies and dynamic API routes are unnecessary for this site. Fonts and brand assets are served from the same origin.

Framework versions were verified from the npm registry and the current Next.js static-export documentation. GitHub Actions versions were verified against official action release tags and pinned by commit SHA.

The review does not claim to have executed, benchmarked, security-audited or certified every UWAS server subsystem. It grounds the public site's content in the current sources.
