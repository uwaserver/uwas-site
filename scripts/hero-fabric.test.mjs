import test from "node:test";
import assert from "node:assert/strict";
import {
  FABRIC,
  RequestFabric,
  drawFabric,
  fabricPixelRatio,
  isFabricTap,
} from "../src/lib/hero-fabric.ts";

const advance = (scene, seconds, hz = 60) => {
  for (let i = 0; i < seconds * hz; i++) scene.tick(1 / hz);
};

test("rapid clicks retain a fixed effect budget and all effects expire", () => {
  const scene = new RequestFabric(1920, 950);
  for (let i = 0; i < 1000; i++) scene.pulse(500 + (i % 100), 100);
  assert.equal(scene.pulses.length, FABRIC.maxPulses);
  assert.equal(scene.sparks.length, FABRIC.maxSparks);
  assert.deepEqual(
    new Set(scene.pulses.map((p) => p.variant)),
    new Set([0, 1, 2]),
  );
  advance(scene, 3);
  assert.equal(scene.pulses.length, 0);
  assert.equal(scene.sparks.length, 0);
});

test("pointer influence is local and fades naturally after leaving", () => {
  const scene = new RequestFabric(1920, 950);
  scene.move(300, 300);
  advance(scene, 1);
  assert.ok(scene.displace({ x: 340, y: 300 }, 1).x > 340);
  assert.deepEqual(scene.displace({ x: 1500, y: 600 }, 1), { x: 1500, y: 600 });
  scene.leave();
  advance(scene, 2);
  assert.ok(Math.abs(scene.displace({ x: 340, y: 300 }, 1).x - 340) < 0.01);
  assert.equal(scene.wakes.length, 0);
});

test("a stationary pointer returns to the lower-intensity idle state", () => {
  const scene = new RequestFabric(1920, 950);
  scene.move(300, 300);
  assert.ok(scene.active);
  advance(scene, 6);
  assert.equal(scene.active, false);
  assert.ok(scene.pointer.strength < 0.001);
  scene.move(301, 300);
  assert.equal(scene.active, true);
});

test("pointer wakes stay bounded and clear on resize or suspension", () => {
  const scene = new RequestFabric(1920, 950);
  for (let i = 0; i < 200; i++) {
    scene.tick(0.05);
    scene.move(100 + (i % 20) * 24, 150);
  }
  assert.ok(scene.wakes.length <= FABRIC.maxWakes);
  scene.pulse(200, 150);
  scene.clearInteraction();
  assert.equal(
    scene.wakes.length + scene.pulses.length + scene.sparks.length,
    0,
  );
  assert.equal(scene.pointer.strength, 0);
  scene.pulse(200, 150);
  scene.resize(375, 1200);
  assert.equal(scene.pulses.length, 0);
  assert.equal(scene.routes.length, FABRIC.routes.mobile);
});

test("packet speed is independent of common display refresh rates", () => {
  const a = new RequestFabric(1920, 950),
    b = new RequestFabric(1920, 950);
  advance(a, 2, 30);
  advance(b, 2, 144);
  for (let i = 0; i < a.routes.length; i++)
    assert.ok(Math.abs(a.routes[i].phase - b.routes[i].phase) < 1e-10);
});

test("a large suspended frame cannot jump the scene forward", () => {
  const scene = new RequestFabric(1920, 950);
  scene.pulse(500, 400);
  scene.tick(3600);
  assert.equal(scene.time, FABRIC.maxStep);
  assert.ok(scene.pulses.length > 0);
});

test("touch scrolling, long presses and drags are not treated as taps", () => {
  const start = { x: 20, y: 30, time: 100 };
  assert.equal(isFabricTap(start, { x: 22, y: 32, time: 300 }), true);
  assert.equal(isFabricTap(start, { x: 20, y: 55, time: 300 }), false);
  assert.equal(isFabricTap(start, { x: 20, y: 30, time: 900 }), false);
  assert.equal(isFabricTap(start, { x: 20, y: 30, time: 90 }), false);
});

test("high-DPI and 4K canvases remain within the backing-pixel budget", () => {
  for (const [w, h, dpr] of [
    [375, 1300, 3],
    [1920, 980, 2],
    [3840, 2160, 3],
  ]) {
    const ratio = fabricPixelRatio(w, h, dpr);
    assert.ok(ratio <= FABRIC.maxDpr);
    assert.ok(w * h * ratio ** 2 <= FABRIC.maxPixels + 0.001);
  }
});

test("routes span the whole field while edges and prose are quiet", () => {
  const scene = new RequestFabric(2560, 980);
  assert.ok(
    scene.routes.every(
      (r) => r.points[0].x < 0 && r.points.at(-1).x > scene.width,
    ),
  );
  assert.equal(scene.opacity(0, 300), 0);
  assert.equal(scene.opacity(400, scene.height), 0);
  assert.equal(scene.opacity(500, 400), 1);
  scene.zones = [{ x: 400, y: 200, width: 400, height: 400 }];
  assert.equal(scene.opacity(500, 400), 0.12);
  assert.equal(scene.opacity(1000, 400), 1);
});

test("out-of-bounds clicks produce no effects", () => {
  const scene = new RequestFabric(375, 1200);
  for (const [x, y] of [
    [-1, 30],
    [376, 30],
    [20, 1201],
  ])
    scene.pulse(x, y);
  assert.equal(scene.pulses.length + scene.sparks.length, 0);
});

test("the reduced-motion drawing stays static even after an interaction", () => {
  const scene = new RequestFabric(1440, 800);
  const render = () => {
    const commands = [];
    const context = new Proxy(
      {},
      {
        get: (_, key) => (...args) => commands.push([key, ...args]),
        set: (_, key, value) => {
          commands.push([key, value]);
          return true;
        },
      },
    );
    drawFabric(context, scene, "dark", true);
    return commands;
  };
  const before = render();
  scene.move(500, 100);
  scene.pulse(500, 100);
  assert.deepEqual(render(), before);
});
