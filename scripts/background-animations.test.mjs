import test from "node:test";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import {
  BACKGROUND_ANIMATIONS_KEY,
  resolveBackgroundAnimations,
  backgroundAnimationsSnapshot,
  subscribeBackgroundAnimations,
  setBackgroundAnimations,
  backgroundAnimationsScript,
} from "../src/lib/background-animations.ts";

function browserBoundary(
  { stored = null, reduced = false, blocked = false } = {},
  run,
) {
  const window = new EventTarget(),
    media = new EventTarget();
  media.matches = reduced;
  const document = { documentElement: { dataset: {} } };
  const values = new Map(
    stored === null ? [] : [[BACKGROUND_ANIMATIONS_KEY, stored]],
  );
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
    assert.equal(resolveBackgroundAnimations(stored, reduced), expected);
    browserBoundary({ stored, reduced }, (boundary) => {
      runInNewContext(backgroundAnimationsScript, boundary);
      assert.equal(
        boundary.document.documentElement.dataset.backgroundAnimations,
        expected ? "on" : "off",
      );
      assert.equal(backgroundAnimationsSnapshot(), expected);
    });
  }
});

test("the toggle persists its choice and notifies subscribers; unsubscribe removes notifications", () => {
  browserBoundary({}, ({ values }) => {
    let updates = 0;
    const unsubscribe = subscribeBackgroundAnimations(() => updates++);
    assert.equal(backgroundAnimationsSnapshot(), true);
    setBackgroundAnimations(false);
    assert.equal(backgroundAnimationsSnapshot(), false);
    assert.equal(values.get(BACKGROUND_ANIMATIONS_KEY), "off");
    setBackgroundAnimations(true);
    assert.equal(backgroundAnimationsSnapshot(), true);
    assert.equal(values.get(BACKGROUND_ANIMATIONS_KEY), "on");
    assert.equal(updates, 2);
    unsubscribe();
    setBackgroundAnimations(false);
    assert.equal(updates, 2);
  });
});

test("system changes follow the default until the user makes an explicit choice", () => {
  browserBoundary({}, ({ media }) => {
    const unsubscribe = subscribeBackgroundAnimations(() => {});
    media.matches = true;
    media.dispatchEvent(new Event("change"));
    assert.equal(backgroundAnimationsSnapshot(), false);
    setBackgroundAnimations(true);
    media.dispatchEvent(new Event("change"));
    assert.equal(backgroundAnimationsSnapshot(), true);
    unsubscribe();
  });
});

test("cross-tab preferences synchronize and clearing storage restores the system default", () => {
  browserBoundary({ reduced: true }, ({ window }) => {
    const unsubscribe = subscribeBackgroundAnimations(() => {});
    const storage = (key, newValue) =>
      window.dispatchEvent(
        Object.assign(new Event("storage"), { key, newValue }),
      );
    storage(BACKGROUND_ANIMATIONS_KEY, "on");
    assert.equal(backgroundAnimationsSnapshot(), true);
    storage("uwas-theme", "light");
    assert.equal(backgroundAnimationsSnapshot(), true);
    storage(null, null);
    assert.equal(backgroundAnimationsSnapshot(), false);
    unsubscribe();
  });
});

test("blocked storage still respects reduced motion and allows an in-memory toggle", () => {
  browserBoundary({ reduced: true, blocked: true }, (boundary) => {
    runInNewContext(backgroundAnimationsScript, boundary);
    const unsubscribe = subscribeBackgroundAnimations(() => {});
    assert.equal(backgroundAnimationsSnapshot(), false);
    setBackgroundAnimations(true);
    assert.equal(backgroundAnimationsSnapshot(), true);
    boundary.media.dispatchEvent(new Event("change"));
    assert.equal(backgroundAnimationsSnapshot(), true);
    unsubscribe();
  });
});
