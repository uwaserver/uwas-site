import {
  FABRIC,
  RequestFabric,
  createMotifs,
  motifPosition,
} from "./site-fabric.ts";

const NS = "http://www.w3.org/2000/svg";
const n = (value: number) => value.toFixed(2);
const glyphs = [
  "M-27 8H-7V-10H26M-27 4v8M22-14v8",
  "M0-17 17 0 0 17-17 0ZM-25 0h8M17 0h8",
  "M-19-8v-11h11M8-19h11v11M19 8v11H8M-8 19h-11V8M-6 0H6M0-6V6",
  "M-18-12H18V12H-18ZM-11-4H0M-11 4H8M-11-18v6M0-18v6M11-18v6M-11 12v6M0 12v6M11 12v6",
  "M-25-19Q-12 0 3 0H23M-25 19Q-12 0 3 0M-30 0H23M15-7 23 0 15 7",
];

/** A small SVG node pool; frame updates never create nodes or rerender React. */
export function createSvgFabric(
  svg: SVGSVGElement,
  scene: RequestFabric,
  id: string,
) {
  function element<K extends keyof SVGElementTagNameMap>(
    tag: K,
    attrs: Record<string, string | number> = {},
  ) {
    const node = svg.ownerDocument.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs))
      node.setAttribute(key, String(value));
    return node;
  }
  svg.replaceChildren();
  svg.setAttribute("viewBox", `0 0 ${scene.width} ${scene.height}`);
  const defs = element("defs");
  const gradient = element("radialGradient", { id: `${id}-quiet` });
  gradient.append(
    element("stop", {
      offset: "45%",
      "stop-color": "black",
      "stop-opacity": 0.94,
    }),
    element("stop", {
      offset: "100%",
      "stop-color": "black",
      "stop-opacity": 0,
    }),
  );
  const mask = element("mask", {
    id: `${id}-mask`,
    maskUnits: "userSpaceOnUse",
    x: 0,
    y: 0,
    width: scene.width,
    height: scene.height,
  });
  mask.append(
    element("rect", {
      width: scene.width,
      height: scene.height,
      fill: "white",
    }),
  );
  const quiet = element("g");
  mask.append(quiet);
  defs.append(gradient, mask);
  const field = element("g", {
    mask: `url(#${id}-mask)`,
    fill: "none",
    "stroke-width": 1,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  });
  svg.append(defs, field);
  const motifs = createMotifs(scene.width, scene.height);
  const motifNodes = motifs.map((motif) => {
    const group = element("g", { class: "fabric-motif", opacity: 0 });
    group.append(element("path", { d: glyphs[motif.kind] }));
    if (motif.kind === 2)
      group.append(element("circle", { r: 10, "stroke-dasharray": "2 6" }));
    field.append(group);
    return group;
  });
  const routeNodes = scene.routes.map(() => {
    const node = element("path", { class: "fabric-route", opacity: 0 });
    field.append(node);
    return node;
  });
  const count = scene.mobile ? FABRIC.packets.mobile : FABRIC.packets.desktop;
  const packets = scene.routes.flatMap(() =>
    Array.from({ length: count }, () => {
      const group = element("g");
      const line = element("path", { class: "fabric-connection" });
      const dot = element("rect", {
        width: 4,
        height: 2,
        rx: 0.5,
        class: "fabric-packet",
      });
      group.append(line, dot);
      field.append(group);
      return { line, dot };
    }),
  );
  const pulseNodes = Array.from({ length: FABRIC.maxPulses }, () => {
    const group = element("g", { class: "fabric-pulse", opacity: 0 });
    const circle = element("circle", { r: 1 });
    const diamond = element("path", { d: "M0-1 1 0 0 1-1 0Z" });
    const core = element("path", {
      d: "M-4 0H4M0-4V4",
      "vector-effect": "non-scaling-stroke",
    });
    circle.setAttribute("vector-effect", "non-scaling-stroke");
    diamond.setAttribute("vector-effect", "non-scaling-stroke");
    group.append(circle, diamond, core);
    field.append(group);
    return { group, circle, diamond, core };
  });
  const sparks = Array.from({ length: FABRIC.maxSparks }, () => {
    const node = element("rect", {
      class: "fabric-packet",
      opacity: 0,
      width: 2,
      height: 2,
    });
    field.append(node);
    return node;
  });
  const wakes = Array.from({ length: FABRIC.maxWakes }, () => {
    const node = element("path", {
      d: "M-3 0H3M0-3V3",
      class: "fabric-wake",
      opacity: 0,
    });
    field.append(node);
    return node;
  });
  // Pool the text masks too: scrolling only updates visible geometry.
  const masks = Array.from({ length: 48 }, () => {
    const node = element("ellipse", {
      fill: `url(#${id}-quiet)`,
      rx: 0,
      ry: 0,
    });
    quiet.append(node);
    return node;
  });

  function updateQuietZones() {
    const zones = [
      ...svg.ownerDocument.querySelectorAll(
        "main h1, main h2, main h3, main p, main pre, main li, main table, [data-background-quiet], .footer-grid, .footer-bottom",
      ),
    ]
      .map((e) => e.getBoundingClientRect())
      .filter((r) => r.width > 0 && r.bottom > 0 && r.top < scene.height)
      .slice(0, masks.length);
    masks.forEach((node, i) => {
      const rect = zones[i];
      if (!rect) {
        node.setAttribute("rx", "0");
        return;
      }
      node.setAttribute("cx", n(rect.x + rect.width / 2));
      node.setAttribute("cy", n(rect.y + rect.height / 2));
      node.setAttribute("rx", n(rect.width * 0.7 + 18));
      node.setAttribute("ry", n(rect.height * 0.85 + 18));
    });
  }

  function draw(scroll: number, reduced: boolean) {
    let visible = 0;
    motifs.forEach((motif, i) => {
      const base = motifPosition(
        motif,
        scene.time,
        scroll,
        scene.height,
        reduced,
      );
      const point = reduced ? base : scene.displace(base, motif.depth);
      const alpha = scene.opacity(point.x, point.y);
      const node = motifNodes[i];
      if (alpha <= 0.001) {
        if (node.getAttribute("opacity") !== "0")
          node.setAttribute("opacity", "0");
        return;
      }
      visible++;
      const rotation = reduced
        ? 0
        : Math.sin(scene.time * 0.1 + motif.phase) * 12;
      node.setAttribute(
        "transform",
        `translate(${n(point.x)} ${n(point.y)}) rotate(${n(rotation)}) scale(${n(motif.size)})`,
      );
      node.setAttribute("opacity", n(alpha * (0.16 + motif.depth * 0.14)));
    });
    scene.routes.forEach((route, i) => {
      const offset = reduced ? 0 : Math.sin(scroll * 0.0008) * route.depth * 14;
      const points = Array.from({ length: 25 }, (_, j) => {
        const p = scene.point(route, j / 24, !reduced);
        return `${j ? "L" : "M"}${n(p.x)} ${n(p.y + offset)}`;
      });
      routeNodes[i].setAttribute("d", points.join(" "));
      routeNodes[i].setAttribute("opacity", n(0.055 + route.depth * 0.055));
      for (let j = 0; j < count; j++) {
        const { dot, line } = packets[i * count + j];
        const p = scene.point(route, (route.phase + j / count) % 1, !reduced);
        p.y += offset;
        const packetAlpha = scene.opacity(p.x, p.y) * 0.5;
        if (packetAlpha <= 0.001) {
          dot.setAttribute("opacity", "0");
          line.setAttribute("opacity", "0");
          continue;
        }
        dot.setAttribute("transform", `translate(${n(p.x)} ${n(p.y)})`);
        dot.setAttribute("opacity", n(packetAlpha));
        const radius = scene.mobile
          ? FABRIC.pointerRadius.mobile
          : FABRIC.pointerRadius.desktop;
        const distance = Math.hypot(
          p.x - scene.pointer.x,
          p.y - scene.pointer.y,
        );
        if (!reduced && distance < radius && scene.pointer.strength > 0.01) {
          line.setAttribute(
            "d",
            `M${n(p.x)} ${n(p.y)}L${n(scene.pointer.x)} ${n(scene.pointer.y)}`,
          );
          line.setAttribute(
            "opacity",
            n((1 - distance / radius) ** 2 * scene.pointer.strength * 0.4),
          );
        } else line.setAttribute("opacity", "0");
      }
    });
    pulseNodes.forEach(({ group, circle, diamond, core }, i) => {
      const pulse = !reduced && scene.pulses[i];
      if (!pulse) {
        group.setAttribute("opacity", "0");
        return;
      }
      const progress = pulse.age / FABRIC.pulseLife;
      const radius = 4 + pulse.radius * (1 - (1 - progress) ** 3);
      group.setAttribute("transform", `translate(${n(pulse.x)} ${n(pulse.y)})`);
      group.setAttribute(
        "opacity",
        n(Math.min(1, progress * 15) * (1 - progress) ** 2 * 0.85),
      );
      circle.setAttribute("r", n(radius));
      diamond.setAttribute(
        "d",
        `M0 ${n(-radius)}L${n(radius)} 0 0 ${n(radius)} ${n(-radius)} 0Z`,
      );
      circle.setAttribute("display", pulse.variant === 1 ? "none" : "inline");
      diamond.setAttribute("display", pulse.variant === 1 ? "inline" : "none");
      circle.setAttribute(
        "stroke-dasharray",
        pulse.variant === 2 ? "6 8" : "none",
      );
      core.setAttribute("opacity", n((1 - progress) ** 2));
    });
    sparks.forEach((node, i) => {
      const spark = !reduced && scene.sparks[i];
      if (!spark) {
        node.setAttribute("opacity", "0");
        return;
      }
      node.setAttribute(
        "transform",
        `translate(${n(spark.x)} ${n(spark.y)}) scale(${n(spark.size / 2)})`,
      );
      node.setAttribute(
        "opacity",
        n((1 - spark.age / spark.life) ** 2 * scene.opacity(spark.x, spark.y)),
      );
    });
    wakes.forEach((node, i) => {
      const wake = !reduced && scene.wakes[i];
      if (!wake) {
        node.setAttribute("opacity", "0");
        return;
      }
      const progress = wake.age / FABRIC.wakeLife;
      node.setAttribute(
        "transform",
        `translate(${n(wake.x)} ${n(wake.y)}) scale(${n(1 + progress * 2)})`,
      );
      node.setAttribute(
        "opacity",
        n((1 - progress) ** 2 * scene.opacity(wake.x, wake.y) * 0.3),
      );
    });
    return visible;
  }
  return { draw, updateQuietZones };
}
