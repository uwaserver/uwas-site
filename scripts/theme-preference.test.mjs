import test from "node:test";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import { normalizeTheme, themeScript } from "../src/lib/theme-preference.ts";

function boot(stored, dark, blocked = false) {
  const dataset = {};
  runInNewContext(themeScript, {
    document: { documentElement: { dataset } },
    localStorage: {
      getItem() {
        if (blocked) throw Error("Storage blocked");
        return stored;
      },
    },
    matchMedia: () => ({ matches: dark }),
  });
  return dataset;
}

test("invalid or missing theme preferences normalize to system", () => {
  for (const value of [null, undefined, "", "invalid", "system", "DARK"])
    assert.equal(normalizeTheme(value), "system");
  for (const value of ["light", "dark"])
    assert.equal(normalizeTheme(value), value);
});

test("the actual first-paint script agrees with the picker for every palette", () => {
  for (const dark of [false, true])
    for (const value of [null, "", "invalid", "light", "dark", "system"]) {
      const preference = normalizeTheme(value);
      const result = boot(value, dark);
      assert.equal(result.themePreference, preference);
      assert.equal(
        result.theme,
        preference === "system" ? (dark ? "dark" : "light") : preference,
      );
    }
});

test("blocked storage still initializes the correct system palette and preference", () => {
  assert.deepEqual(boot("light", true, true), {
    themePreference: "system",
    theme: "dark",
  });
  assert.deepEqual(boot("dark", false, true), {
    themePreference: "system",
    theme: "light",
  });
});
