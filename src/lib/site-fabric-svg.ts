import { FABRIC, RequestFabric } from "./site-fabric.ts";

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
  effects: SVGSVGElement,
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
  effects.replaceChildren();
  svg.setAttribute("viewBox", `0 0 ${scene.width} ${scene.height}`);
  effects.setAttribute("viewBox", `0 0 ${scene.width} ${scene.height}`);
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
  const effectDefs = element("defs");
  const localGradient = element("radialGradient", { id: `${id}-local` });
  localGradient.append(
    element("stop", { offset: "0%", "stop-color": "white" }),
    element("stop", {
      offset: "35%",
      "stop-color": "white",
      "stop-opacity": 0.75,
    }),
    element("stop", {
      offset: "100%",
      "stop-color": "white",
      "stop-opacity": 0,
    }),
  );
  const glowGradient = element("radialGradient", { id: `${id}-glow` });
  glowGradient.append(
    element("stop", {
      offset: "0%",
      "stop-color": "currentColor",
      "stop-opacity": 0.14,
    }),
    element("stop", {
      offset: "35%",
      "stop-color": "currentColor",
      "stop-opacity": 0.045,
    }),
    element("stop", {
      offset: "100%",
      "stop-color": "currentColor",
      "stop-opacity": 0,
    }),
  );
  const localMask = element("mask", {
    id: `${id}-interaction`,
    maskUnits: "userSpaceOnUse",
    x: 0,
    y: 0,
    width: scene.width,
    height: scene.height,
    "mask-type": "luminance",
  });
  const relayBudget = scene.mobile
    ? FABRIC.maxRelays.mobile
    : FABRIC.maxRelays.desktop;
  const influenceNodes = Array.from(
    { length: FABRIC.maxPulses + relayBudget + 1 },
    () => {
      const node = element("circle", { r: 0, fill: `url(#${id}-local)` });
      localMask.append(node);
      return node;
    },
  );
  effectDefs.append(localGradient, glowGradient, localMask);
  const foreground = element("g", {
    fill: "none",
    "stroke-width": 1,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  });
  const glow = element("circle", {
    class: "fabric-glow",
    r: 1,
    fill: `url(#${id}-glow)`,
    opacity: 0,
  });
  const orbit = element("circle", { class: "fabric-orbit", r: 1, opacity: 0 });
  const local = element("g", { mask: `url(#${id}-interaction)` });
  foreground.append(glow, local, orbit);
  effects.append(effectDefs, foreground);
  const motifs = scene.motifs;
  const motifNodes = motifs.map((motif) => {
    const group = element("g", { class: "fabric-motif", opacity: 0 });
    group.append(element("path", { d: glyphs[motif.kind] }));
    if (motif.kind === 2)
      group.append(element("circle", { r: 10, "stroke-dasharray": "2 6" }));
    field.append(group);
    return group;
  });
  const echoes = motifs.map((motif) => {
    const node = element("path", {
      d: glyphs[motif.kind],
      class: "fabric-echo",
      opacity: 0,
    });
    local.append(node);
    return node;
  });
  const routeEchoes = scene.routes.map(() => {
    const node = element("path", { class: "fabric-echo", opacity: 0 });
    local.append(node);
    return node;
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
      group.append(dot);
      field.append(group);
      foreground.append(line);
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
    foreground.append(group);
    return { group, circle, diamond, core };
  });
  const relayNodes = Array.from({ length: relayBudget }, () => {
    const group = element("g", { class: "fabric-relay", opacity: 0 });
    const arc = element("path");
    const ring = element("circle", { r: 0 });
    group.append(arc, ring);
    foreground.append(group);
    return { group, arc, ring };
  });
  const sparks = Array.from({ length: FABRIC.maxSparks }, () => {
    const node = element("rect", {
      class: "fabric-packet",
      opacity: 0,
      width: 2,
      height: 2,
    });
    foreground.append(node);
    return node;
  });
  const wakes = Array.from({ length: FABRIC.maxWakes }, () => {
    const node = element("path", {
      d: "M-3 0H3M0-3V3",
      class: "fabric-wake",
      opacity: 0,
    });
    foreground.append(node);
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
    scene.scroll = scroll;
    let visible = 0;
    const radius = scene.mobile
      ? FABRIC.pointerRadius.mobile
      : FABRIC.pointerRadius.desktop;
    const strength = reduced ? 0 : scene.pointer.strength;
    foreground.setAttribute("display", reduced ? "none" : "inline");
    if (!reduced) {
      const pointerInfluence = influenceNodes[0];
      pointerInfluence.setAttribute("cx", n(scene.pointer.x));
      pointerInfluence.setAttribute("cy", n(scene.pointer.y));
      pointerInfluence.setAttribute("r", n(radius));
      pointerInfluence.setAttribute("opacity", n(strength));
      influenceNodes.slice(1).forEach((node, i) => {
        const relay = i >= FABRIC.maxPulses;
        const pulse = relay
          ? scene.relays[i - FABRIC.maxPulses]
          : scene.pulses[i];
        const life = relay ? FABRIC.relayLife : FABRIC.pulseLife;
        node.setAttribute(
          "r",
          pulse
            ? n(pulse.radius * (1 - (1 - pulse.age / life) ** 3) + 72)
            : "0",
        );
        if (pulse) {
          node.setAttribute("cx", n(pulse.x));
          node.setAttribute("cy", n(pulse.y));
          node.setAttribute(
            "opacity",
            n((1 - pulse.age / life) ** 2 * pulse.energy),
          );
        }
      });
      glow.setAttribute("cx", n(scene.pointer.x));
      glow.setAttribute("cy", n(scene.pointer.y));
      glow.setAttribute("r", n(radius * 0.85));
      glow.setAttribute("opacity", n(strength));
      orbit.setAttribute("cx", n(scene.pointer.x));
      orbit.setAttribute("cy", n(scene.pointer.y));
      orbit.setAttribute("r", n(24 + Math.sin(scene.time * 2) * 4));
      orbit.setAttribute("opacity", n(strength * 0.18));
    }
    motifs.forEach((motif, i) => {
      const point = scene.motifPoint(i, reduced);
      const alpha = scene.opacity(point.x, point.y);
      const node = motifNodes[i];
      const echo = echoes[i];
      if (alpha <= 0.001) {
        if (node.getAttribute("opacity") !== "0")
          node.setAttribute("opacity", "0");
        echo.setAttribute("opacity", "0");
        return;
      }
      visible++;
      node.setAttribute(
        "transform",
        `translate(${n(point.x)} ${n(point.y)}) rotate(${n(point.rotation)}) scale(${n(motif.size * (1 + point.energy * 0.12))})`,
      );
      node.setAttribute("opacity", n(alpha * (0.16 + motif.depth * 0.14)));
      // Echo the same geometry above cards, revealed only by soft radial influence.
      // It shares no text mask and has no section-sized clipping rectangle.
      if (
        !reduced &&
        (strength > 0.001 || scene.pulses.length || scene.relays.length)
      ) {
        echo.setAttribute("transform", node.getAttribute("transform")!);
        echo.setAttribute("opacity", n(alpha * (0.58 + point.energy * 0.16)));
      } else echo.setAttribute("opacity", "0");
    });
    scene.routes.forEach((route, i) => {
      const offset = reduced ? 0 : Math.sin(scroll * 0.0008) * route.depth * 14;
      const points = Array.from({ length: 25 }, (_, j) => {
        const p = scene.point(route, j / 24, !reduced);
        return `${j ? "L" : "M"}${n(p.x)} ${n(p.y + offset)}`;
      });
      routeNodes[i].setAttribute("d", points.join(" "));
      routeNodes[i].setAttribute("opacity", n(0.055 + route.depth * 0.055));
      if (
        !reduced &&
        (strength > 0.001 || scene.pulses.length || scene.relays.length)
      ) {
        routeEchoes[i].setAttribute("d", points.join(" "));
        routeEchoes[i].setAttribute("opacity", "0.26");
      } else routeEchoes[i].setAttribute("opacity", "0");
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
            n((1 - distance / radius) ** 2 * strength * 0.52),
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
        n(Math.min(1, progress * 15) * (1 - progress) ** 2 * 0.7),
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
    relayNodes.forEach(({ group, arc, ring }, i) => {
      const relay = !reduced && scene.relays[i];
      if (!relay) {
        group.setAttribute("opacity", "0");
        return;
      }
      const progress = relay.age / FABRIC.relayLife;
      const dx = relay.x - relay.from.x,
        dy = relay.y - relay.from.y;
      arc.setAttribute(
        "d",
        `M${n(relay.from.x)} ${n(relay.from.y)}Q${n((relay.x + relay.from.x) / 2 - dy * 0.18)} ${n((relay.y + relay.from.y) / 2 + dx * 0.18)} ${n(relay.x)} ${n(relay.y)}`,
      );
      ring.setAttribute("cx", n(relay.x));
      ring.setAttribute("cy", n(relay.y));
      ring.setAttribute("r", n(6 + relay.radius * (1 - (1 - progress) ** 3)));
      ring.setAttribute("opacity", "0.45");
      group.setAttribute(
        "opacity",
        n(
          Math.min(1, progress * 12) * (1 - progress) ** 2 * relay.energy * 0.5,
        ),
      );
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
      const previous = scene.wakes[i - 1];
      const connected =
        previous && Math.hypot(previous.x - wake.x, previous.y - wake.y) < 150;
      node.setAttribute(
        "d",
        connected
          ? `M${n(previous.x - wake.x)} ${n(previous.y - wake.y)}Q0 0 0 0M-2 0H2M0-2V2`
          : "M-3 0H3M0-3V3",
      );
      node.setAttribute("transform", `translate(${n(wake.x)} ${n(wake.y)})`);
      node.setAttribute(
        "opacity",
        n((1 - progress) ** 2 * scene.opacity(wake.x, wake.y) * 0.62),
      );
    });
    return visible;
  }
  return { draw, updateQuietZones };
}
