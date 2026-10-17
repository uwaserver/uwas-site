# Responsive layout

The shared `.container` uses the `--layout-max` and `--page-gutter` tokens in `src/app/globals.css`. Header, page headings, content sections and footer all share that boundary. Avoid adding a second maximum width to an outer container.

- Maximum content width: 1728px.
- Desktop side gutters: `clamp(32px, 3vw, 64px)`; tablet 32px, mobile 20px, smallest screens 15px.
- Section spacing, layout gaps, grid gaps and panel/card padding have shared, bounded fluid tokens.
- Prose uses `--prose-width: 48rem` and `--prose-measure: 72ch`. Apply these to text inside the layout, leaving code, diagrams and data panels free to use the available space.
- The feature catalog uses one, two, three or four columns. The six-card homepage keeps three desktop columns. Filtered catalog cards retain their column width.
- Documentation overview uses up to four columns; article pages retain navigation, a flexible main column and a bounded table of contents.
- OXOG project links use two columns on wide screens. Existing logo animation and theme controls are preserved.
- Large viewport rules add columns and distribute space; text, icons and controls no longer keep growing at 2600px.

## Browser measurements, October 18, 2026

Measured against the production static export with a 15px browser scrollbar. Widths below are CSS pixels, rounded to one decimal.

| Viewport | Shared container | Feature columns | Documentation overview columns |
| --- | --- | --- | --- |
| 375 | 320 | 1 | 1 |
| 768 | 689 | 2 | 1 |
| 1024 | 945 | 3 | 2 |
| 1440 | 1338.6 | 3 | 3 |
| 1920 | 1728 | 4 | 4 |
| 2560 | 1728 | 4 | 4 |

All 27 canonical routes were measured at all six widths: no document-level horizontal overflow and no differences in shared container alignment. Scrollable code and request-flow panels intentionally retain local scrolling when their contents require it.

Visual checks covered every requested width across home, features, architecture, documentation and footer views. Light/dark themes, the 375px appearance panel and mobile navigation, and the two-card Security filter were exercised. The final four-column filter adjustment was rechecked at all six widths. Browser console errors: zero during these checks.

Local evidence is retained under ignored `.qa/`: `layout-before.json`, `layout-after.json`, `responsive-final-feature-checks.json` and `responsive-*.jpg`. These are excluded from the deployed website.
