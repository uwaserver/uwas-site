# Design and interaction review — October 20, 2026

The review covered the 27 canonical routes and the custom 404, shared navigation, home-page controls, documentation layouts/code, feature catalog, download/brand/legal pages, themes, search, SVG decoration and the OXOG footer. The starting tree was clean at `88b308d`.

## Design decisions

The existing blue/ink palette, SVG geometry, 1728px maximum container, responsive grids and OXOG signature were retained. Layout measurements did not justify a redesign or wider paragraphs. Fixes address observed access, contrast, focus and viewport problems. Text-bearing reveals and the appearance panel retain their movement while keeping full text contrast throughout entry.

Space Grotesk is now the default UI font through `--font-space-grotesk`; `--font-jetbrains` supplies technical/monospace text. Latin and Latin-ext files are self-hosted, and the Space Grotesk fallback uses the installed Next.js metric data. `ÇĞİÖŞÜçğıöşü` were checked directly against the font glyph maps. The existing UWAS wordmark and the previously requested OXOG brand typography remain explicit brand exceptions. Quicksand is declared but is not unnecessarily loaded. No dependency was added.

## Repairs

| Finding | Observed problem                                                                                                                                            | Result                                                                                                                                                                                                                                                              |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F001    | Text-bearing opacity reduced contrast; serial numbers were too faint; names, headings, announcement landmark and scrolling code had access inconsistencies. | Reveals retain their movement without fading text. Only decorative stack symbols dim. Native names, catalog/footer heading levels, a release landmark and keyboard-focusable code/lifecycle areas are consistent. Search has a native label and live result status. |
| F002    | Navigation ended at y437.56 in a 390px-high viewport; appearance ended at y366.19 in a 320px viewport.                                                      | Both surfaces have bounded height and independent scrolling. Tab reaches the final navigation action inside the short viewport.                                                                                                                                     |
| F003    | Navigation Escape left BODY focused.                                                                                                                        | Focus returns to the persistent navigation button.                                                                                                                                                                                                                  |
| F004    | An invalid saved theme produced `data-theme="invalid-old-value"` on a dark OS, disagreeing with the picker.                                                 | Bootstrap and picker normalize the same choices. Invalid/missing/blocked storage follows the OS before hydration. Three permanent tests cover the actual bootstrap.                                                                                                 |
| F005    | Removing the search dialog lost focus after Escape.                                                                                                         | Cleanup restores the connected, visible original control, or the visible header fallback when the mobile trigger was removed or a resize hid the desktop trigger.                                                                                                   |
| F006    | The focused dark skip link had 2.844:1 text contrast.                                                                                                       | Filled-action tokens preserve the brand color and give 5.169:1 contrast in both themes.                                                                                                                                                                             |

## Browser verification

- Two layout passes each measured **684 combinations**: all 28 routes at 320, 375, 390, 768, 1024, 1280, 1440, 1920 and 2560 CSS px, in both themes; plus representative pages around the 520/650/768/800/1100/1440 breakpoints, 844x390 landscape and 1280x540 short screens. Neither pass found document overflow or escaping content.
- The second layout pass included 56 axe scans. A fresh all-page pass after the access changes also reported zero rule violations. A final 12-sample pass, repeated three times with search/appearance open, covered 320x568, 768x540 and 1440x900 in both themes. WCAG A/AA through 2.2 and best-practice rules were enabled; these results are not full WCAG certification.
- Later focus/bootstrap/label refinements were rechecked in their affected flows. Native keyboard checks covered menu and search Escape/return focus, close-button and shortcut dismissal, the removed mobile-trigger fallback, skip-to-main sequential focus, documentation navigation, configuration tab arrows and FAQ expansion.
- Feature filtering returned the two Security cards. Dashboard selection changed to Applications. The actual clipboard matched the install command; a separate simulated clipboard denial produced the fallback alert in both themes. Search handled an unmatched Turkish query and announced zero results. Long code scrolled horizontally by keyboard (0 to 40px) without scrolling the page sideways.
- Light/dark visuals were inspected on representative home, docs, feature, download and brand screens. Existing background interaction and reduced-motion simulation tests remain green. The OXOG artwork, colors and drawing timing were retained.
- Buffered local layout-shift observations during the second matrix peaked at **0.05058**. This is preview evidence, not a field Core Web Vitals measurement.

## Checks and limits

`npm test` passed **29 tests**. Lint, TypeScript, production static generation, export validation and `git diff --check` passed. Six focused before/after proofs and their edge-case verifiers are retained locally; the verifiers passed three consecutive runs.

The initial local build hit a host allocation error. A serial retry with `NODE_OPTIONS=--max-old-space-size=768` completed; product build configuration was not changed. The existing Node `MODULE_TYPELESS_PACKAGE_JSON` warning remains.

Native 200% zoom could not be established through this webview's keyboard interface; **320 CSS px reflow was checked separately**. Physical touch devices, soft keyboards, Safari/Firefox and NVDA/VoiceOver were not available for this run. The site has no account/payment form or server-side loading flow to validate. Upstream server behavior and availability of third-party destinations are outside this design review.

Local screenshots and browser measurements are in ignored `.qa/design-*`. Proofs, baseline identity and the audit ledger remain in ignored `.temp_files/`. Temporary browser fixtures are removed from the export before publication.
