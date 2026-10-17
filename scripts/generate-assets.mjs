import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

await mkdir("public/brand", { recursive: true });
const mark = (ink, blue) =>
  `<g fill="none"><path d="M57 18v18m0 24v8c0 14 9 23 22 23s22-9 22-23V18" stroke="${ink}" stroke-width="16"/><g stroke="${blue}" stroke-width="5"><path d="M2 48h70M8 9l25 26c8 9 16 13 29 13M8 87l25-26c8-9 16-13 29-13M31 1c5 16 10 25 20 31M31 95c5-16 10-25 20-31"/></g><path d="m69 35 17 13-17 13zM47 24l9 13-16-3zM47 72l9-13-16 3z" fill="${blue}"/></g>`;
// All letters are vector paths. No font is required to display the downloads.
const letters = (ink) =>
  `<g fill="${ink}" transform="translate(128 24)"><path d="M0 3h12l9 35 9-35h10l9 35 9-35h12L55 64H43L35 32l-8 32H15Z"/><path d="M75 64 97 3h16l22 61h-14l-4-13H92l-4 13Zm21-25h17l-8-24Z" fill-rule="evenodd"/><path d="M142 47h13c0 6 4 8 12 8 7 0 11-2 11-6 0-4-3-5-16-8-14-3-20-8-20-19 0-12 10-20 25-20 16 0 25 7 25 21h-13c0-6-4-9-12-9-7 0-11 2-11 6s4 6 16 8c15 3 21 8 21 19 0 13-10 20-27 20-16 0-25-7-25-20Z"/></g>`;
for (const [name, ink, blue] of [
  ["uwas-logo", "#101c33", "#2563eb"],
  ["uwas-logo-dark", "#eaf0fb", "#6796ff"],
  ["uwas-logo-mono", "#101c33", "#101c33"],
]) {
  await writeFile(
    `public/brand/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 100" role="img" aria-label="UWAS">${mark(ink, blue)}${letters(ink)}</svg>\n`,
  );
}
await writeFile(
  "public/brand/uwas-mark.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" role="img" aria-label="UWAS symbol">${mark("#101c33", "#2563eb")}</svg>\n`,
);
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="25" fill="#101c33"/><g transform="translate(7 15) scale(.9)">${mark("#ffffff", "#6796ff")}</g></svg>`;
await writeFile("public/favicon.svg", favicon);
await sharp(Buffer.from(favicon))
  .resize(180, 180)
  .png()
  .toFile("public/apple-touch-icon.png");
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#e4e9f1" stroke-width="1"/></pattern></defs><rect width="1200" height="630" fill="#f7f9fc"/><rect x="650" width="550" height="630" fill="url(#grid)"/><g transform="translate(72 46) scale(.46)">${mark("#101c33", "#2563eb")}${letters("#101c33")}</g><text x="72" y="195" fill="#2563eb" font-family="monospace" font-size="13" letter-spacing="3">UNIFIED WEB APPLICATION SERVER</text><g font-family="Arial, sans-serif" font-size="85" font-weight="700" letter-spacing="-5"><text x="66" y="302" fill="#101c33">One binary.</text><text x="66" y="402" fill="#101c33">Your entire</text><text x="66" y="502" fill="#2563eb">web stack.</text></g><g transform="translate(820 215) scale(2.5)">${mark("#101c33", "#2563eb")}</g><text x="73" y="575" fill="#647086" font-family="monospace" font-size="16">BUILT IN GO.  MADE FOR THE WEB.                                 uwaserver.com</text></svg>`;
await sharp(Buffer.from(og)).png().toFile("public/og.png");
console.log(
  "Generated four vector logos, favicon, Apple icon and 1200×630 social image.",
);
