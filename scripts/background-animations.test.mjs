import test from "node:test";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import {
  MOUSE_EFFECTS_KEY,
  resolveMouseEffects,
  mouseEffectsSnapshot,
  subscribeMouseEffects,
  setMouseEffects,
  mouseEffectsScript,
} from "../src/lib/background-animations.ts";

function browserBoundary(
  { stored = null, reduced = false, blocked = false } = {},
  run,
) {
  const window = new EventTarget(),
    media = new EventTarget();
  media.matches = reduced;
  const document = { documentElement: { dataset: {} } };
  const values = new Map(stored === null ? [] : [[MOUSE_EFFECTS_KEY, stored]]);
  const localStorage = {
    getItem(key) {
      if (blocked) throw new Error("Storage unavailable");
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      if (blocked) throw new Error("Storage unavailable");
      values.set(key, value);
    },
  };
  const boundary = { window, document, localStorage, matchMedia: () => media };
  const originals = new Map(
    Object.keys(boundary).map((key) => [
      key,
      Object.getOwnPropertyDescriptor(globalThis, key),
    ]),
  );
  for (const [key, value] of Object.entries(boundary))
    Object.defineProperty(globalThis, key, { value, configurable: true });
  try {
    run({ ...boundary, media, values });
  } finally {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
}

test("first-paint defaults follow reduced motion and explicit choices survive it", () => {
  for (const [stored, reduced, expected] of [
    [null, false, true],
    [null, true, false],
    ["on", true, true],
    ["off", false, false],
    ["invalid", true, false],
    ["invalid", false, true],
  ]) {
    assert.equal(resolveMouseEffects(stored, reduced), expected);
    browserBoundary({ stored, reduced }, (boundary) => {
      runInNewContext(mouseEffectsScript, boundary);
      assert.equal(
        boundary.document.documentElement.dataset.mouseEffects,
        expected ? "on" : "off",
      );
      assert.equal(mouseEffectsSnapshot(), expected);
    });
  }
});

test("the toggle persists its choice and notifies subscribers; unsubscribe removes notifications", () => {
  browserBoundary({}, ({ values }) => {
    let updates = 0;
    const unsubscribe = subscribeMouseEffects(() => updates++);
    assert.equal(mouseEffectsSnapshot(), true);
    setMouseEffects(false);
    assert.equal(mouseEffectsSnapshot(), false);
    assert.equal(values.get(MOUSE_EFFECTS_KEY), "off");
    setMouseEffects(true);
    assert.equal(mouseEffectsSnapshot(), true);
    assert.equal(values.get(MOUSE_EFFECTS_KEY), "on");
    assert.equal(updates, 2);
    unsubscribe();
    setMouseEffects(false);
    assert.equal(updates, 2);
  });
});

test("system changes follow the default until the user makes an explicit choice", () => {
  browserBoundary({}, ({ media }) => {
    const unsubscribe = subscribeMouseEffects(() => {});
    media.matches = true;
    media.dispatchEvent(new Event("change"));
    assert.equal(mouseEffectsSnapshot(), false);
    setMouseEffects(true);
    media.dispatchEvent(new Event("change"));
    assert.equal(mouseEffectsSnapshot(), true);
    unsubscribe();
  });
});

test("cross-tab preferences synchronize and clearing storage restores the system default", () => {
  browserBoundary({ reduced: true }, ({ window }) => {
    const unsubscribe = subscribeMouseEffects(() => {});
    const storage = (key, newValue) =>
      window.dispatchEvent(
        Object.assign(new Event("storage"), { key, newValue }),
      );
    storage(MOUSE_EFFECTS_KEY, "on");
    assert.equal(mouseEffectsSnapshot(), true);
    storage("uwas-theme", "light");
    assert.equal(mouseEffectsSnapshot(), true);
    storage(null, null);
    assert.equal(mouseEffectsSnapshot(), false);
    unsubscribe();
  });
});

test("blocked storage still respects reduced motion and allows an in-memory toggle", () => {
  browserBoundary({ reduced: true, blocked: true }, (boundary) => {
    runInNewContext(mouseEffectsScript, boundary);
    const unsubscribe = subscribeMouseEffects(() => {});
    assert.equal(mouseEffectsSnapshot(), false);
    setMouseEffects(true);
    assert.equal(mouseEffectsSnapshot(), true);
    boundary.media.dispatchEvent(new Event("change"));
    assert.equal(mouseEffectsSnapshot(), true);
    unsubscribe();
  });
});
