import test from "node:test";
import assert from "node:assert/strict";
import { createSvgFabric } from "../src/lib/site-fabric-svg.ts";
import {
  FABRIC,
  RequestFabric,
  createMotifs,
  motifPosition,
  isFabricTap,
} from "../src/lib/site-fabric.ts";

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

test("motifs are evenly stratified, deterministic and bounded at every screen size", () => {
  for (const [width, height] of [
    [375, 844],
    [1440, 1000],
    [3840, 2160],
  ]) {
    const motifs = createMotifs(width, height);
    assert.deepEqual(motifs, createMotifs(width, height));
    assert.ok(motifs.length <= FABRIC.motifs.wide);
    assert.ok(
      motifs.every((m) => m.x >= 0 && m.x < width && m.y >= 0 && m.y < height),
    );
    assert.ok(motifs.some((m) => m.x < width / 3));
    assert.ok(motifs.some((m) => m.x > (width * 2) / 3));
  }
  assert.equal(createMotifs(375, 844).length, FABRIC.motifs.mobile);
});

test("parallax stays bounded after long scrolling and reduced motion ignores scroll/time", () => {
  for (const motif of createMotifs(1920, 1080)) {
    const a = motifPosition(motif, 0, 0, 1080, true);
    assert.deepEqual(motifPosition(motif, 600, 250000, 1080, true), a);
    const moving = motifPosition(motif, 600, 250000, 1080);
    assert.ok(moving.y >= -80 && moving.y < 1160);
    assert.ok(Math.abs(moving.x - motif.x) <= 9);
  }
});

// Minimal SVG boundary: the real scene and renderer run without a browser dependency.
function svgBoundary() {
  let allocated = 0;
  const doc = {
    createElementNS: (_, tag) => node(tag),
    querySelectorAll: () => [],
  };
  function node(tag) {
    allocated++;
    return {
      tag,
      ownerDocument: doc,
      attributes: {},
      children: [],
      setAttribute(key, value) {
        this.attributes[key] = String(value);
      },
      getAttribute(key) {
        return this.attributes[key] ?? null;
      },
      append(...children) {
        this.children.push(...children);
      },
      replaceChildren(...children) {
        this.children = children;
      },
    };
  }
  return { root: node("svg"), count: () => allocated };
}

test("SVG node allocation stays fixed under sustained interaction and expires back to baseline", () => {
  const scene = new RequestFabric(1920, 1080);
  const boundary = svgBoundary();
  const renderer = createSvgFabric(boundary.root, scene, "test");
  renderer.draw(0, false);
  const allocated = boundary.count();
  assert.ok(allocated < 600);
  for (let i = 0; i < 200; i++) {
    scene.pulse(700, 500);
    scene.move(700, 500);
    scene.tick(1 / 60);
    renderer.draw(i * 20, false);
  }
  assert.equal(boundary.count(), allocated);
  advance(scene, 4);
  renderer.draw(0, false);
  const field = boundary.root.children[1];
  const pulses = field.children.filter(
    (n) => n.attributes.class === "fabric-pulse",
  );
  assert.ok(pulses.every((n) => n.attributes.opacity === "0"));
});

test("reduced-motion SVG output stays static even after clicks and long scrolling", () => {
  const scene = new RequestFabric(1440, 800),
    boundary = svgBoundary();
  const renderer = createSvgFabric(boundary.root, scene, "static");
  const snapshot = (node) => ({
    tag: node.tag,
    attributes: { ...node.attributes },
    children: node.children.map(snapshot),
  });
  renderer.draw(0, true);
  const before = snapshot(boundary.root);
  scene.move(500, 100);
  scene.pulse(500, 100);
  renderer.draw(5000, true);
  assert.deepEqual(snapshot(boundary.root), before);
});

test("offscreen motifs stop updating their transforms until visible again", () => {
  const scene = new RequestFabric(1440, 1000),
    boundary = svgBoundary();
  const renderer = createSvgFabric(boundary.root, scene, "offscreen");
  const motif = createMotifs(1440, 1000)[0];
  const scroll = (motif.y + 40) / (motif.depth * 0.12);
  renderer.draw(scroll, false);
  const node = boundary.root.children[1].children[0];
  assert.equal(node.attributes.opacity, "0");
  const transform = node.attributes.transform;
  advance(scene, 1);
  renderer.draw(scroll, false);
  assert.equal(node.attributes.transform, transform);
  renderer.draw(0, false);
  assert.ok(node.attributes.transform);
});
