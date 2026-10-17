import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, join, extname } from "node:path";
const root = resolve("out");
async function walk(path) {
  const items = await readdir(path, { withFileTypes: true });
  return (
    await Promise.all(
      items.map((d) =>
        d.isDirectory() ? walk(join(path, d.name)) : join(path, d.name),
      ),
    )
  ).flat();
}
const files = await walk(root);
const pages = files.filter((p) => extname(p) === ".html");
const broken = [];
for (const file of pages) {
  const html = await readFile(file, "utf8");
  assert.match(html, /<h1\b/, `${file}: missing H1`);
  assert.match(html, /<title>[^<]+<\/title>/, `${file}: missing title`);
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(html.includes(`id="${id}"`), `${file}: broken anchor #${id}`);
  }
  for (const match of html.matchAll(
    /(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g,
  )) {
    const target = resolve(
      root,
      "." + decodeURIComponent(match[1]).replaceAll("&amp;", "&"),
    );
    try {
      const info = await stat(target);
      if (info.isDirectory()) await stat(join(target, "index.html"));
    } catch {
      broken.push(`${file.replace(root, "")} → ${match[1]}`);
    }
  }
}
assert.deepEqual(broken, [], "Broken internal links or assets");
assert.equal(
  (await readFile(join(root, "CNAME"), "utf8")).trim(),
  "uwaserver.com",
);
assert.ok(files.some((p) => p.endsWith(".nojekyll")));
assert.ok(
  pages.length >= 30,
  `Expected complete site, got ${pages.length} pages`,
);
const robots = await readFile(join(root, "robots.txt"), "utf8");
assert.match(robots, /https:\/\/uwaserver.com\/sitemap.xml/);
const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]));
assert.ok(urls.length >= 27, "Missing public routes in sitemap");
for (const url of urls) {
  assert.equal(url.origin, "https://uwaserver.com");
  const html = await readFile(join(root, url.pathname, "index.html"), "utf8");
  assert.ok(html.includes(`rel="canonical" href="${url.href}"`), `Wrong canonical: ${url.href}`);
}
console.log(
  `PASS: ${pages.length} exported HTML pages; ${urls.length} canonical public routes; all internal links, anchors and assets resolve; CNAME, .nojekyll, robots and sitemap present.`,
);
