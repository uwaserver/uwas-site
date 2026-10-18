/** Shared budgets and palette for the UWAS request fabric. No browser state. */
export const FABRIC = {
  maxDpr: 1.5,
  maxPixels: 4_000_000,
  mobileBreakpoint: 650,
  routes: { mobile: 7, desktop: 14 },
  packets: { mobile: 2, desktop: 3 },
  fps: { active: 60, idle: 24, mobile: 30 },
  idleAfter: 3.5,
  speed: 0.028,
  pointerRadius: { mobile: 95, desktop: 180 },
  pulseRadius: { mobile: 110, desktop: 210 },
  pulseLife: 2.1,
  maxPulses: 6,
  maxSparks: 72,
  maxWakes: 18,
  wakeLife: 0.85,
  edgeFade: 48,
  maxStep: 0.05,
  tapDistance: 9,
  tapDuration: 650,
  palettes: {
    light: {
      line: "59, 111, 218",
      bright: "37, 99, 235",
      accent: "22, 128, 110",
      opacity: 0.9,
    },
    dark: {
      line: "93, 142, 246",
      bright: "119, 166, 255",
      accent: "85, 213, 180",
      opacity: 1,
    },
  },
} as const;

export type Point = { x: number; y: number };
export type QuietZone = Point & { width: number; height: number };
export type Route = {
  points: Point[];
  depth: number;
  speed: number;
  phase: number;
};
export type Pulse = Point & { age: number; variant: number; radius: number };
type Spark = Point & {
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
};
type Wake = Point & { age: number };
const TAU = Math.PI * 2;
const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));
const ease = (n: number) => n * n * (3 - 2 * n);

export function isFabricTap(
  start: Point & { time: number },
  end: Point & { time: number },
) {
  return (
    end.time - start.time <= FABRIC.tapDuration &&
    end.time >= start.time &&
    Math.hypot(end.x - start.x, end.y - start.y) < FABRIC.tapDistance
  );
}

export function fabricPixelRatio(width: number, height: number, dpr: number) {
  return Math.min(
    Math.max(1, dpr),
    FABRIC.maxDpr,
    Math.sqrt(FABRIC.maxPixels / Math.max(1, width * height)),
  );
}

/** Deterministic, time-based simulation. Ephemeral objects have strict budgets. */
export class RequestFabric {
  width = 1;
  height = 1;
  mobile = false;
  time = 0;
  lastInput = -100;
  sequence = 0;
  routes: Route[] = [];
  pulses: Pulse[] = [];
  sparks: Spark[] = [];
  wakes: Wake[] = [];
  pointer = { x: -1000, y: -1000, strength: 0, inside: false };
  zones: QuietZone[] = [];
  private lastWake = -100;

  constructor(width: number, height: number) {
    this.resize(width, height);
  }

  resize(width: number, height: number) {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.mobile = width <= FABRIC.mobileBreakpoint;
    this.clearInteraction();
    const count = this.mobile ? FABRIC.routes.mobile : FABRIC.routes.desktop;
    this.routes = Array.from({ length: count }, (_, i) => {
      const band = i / (count - 1);
      // Five incoming lanes bend toward one trunk, then fan out again.
      const start = (0.06 + band * 0.88) * this.height;
      const end = (0.1 + (((i * 5) % count) / count) * 0.82) * this.height;
      const trunk = (i % 2 === 0 ? 0.16 : 0.86) * this.height;
      const points = Array.from({ length: 41 }, (_, j) => {
        const t = j / 40,
          u = 1 - t;
        return {
          x: -40 + t * (this.width + 80),
          y:
            u ** 3 * start +
            3 * u ** 2 * t * trunk +
            3 * u * t ** 2 * trunk +
            t ** 3 * end,
        };
      });
      return {
        points,
        depth: 0.4 + (i % 3) * 0.3,
        speed: FABRIC.speed * (0.65 + (i % 4) * 0.2),
        phase: (i * 0.618) % 1,
      };
    });
  }

  get active() {
    return this.time - this.lastInput < FABRIC.idleAfter;
  }

  move(x: number, y: number) {
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.inside = true;
    this.lastInput = this.time;
    const previous = this.wakes.at(-1);
    if (
      this.time - this.lastWake > 0.045 &&
      (!previous || Math.hypot(x - previous.x, y - previous.y) > 22)
    ) {
      this.wakes.push({ x, y, age: 0 });
      if (this.wakes.length > FABRIC.maxWakes) this.wakes.shift();
      this.lastWake = this.time;
    }
  }

  leave() {
    this.pointer.inside = false;
  }

  pulse(x: number, y: number) {
    if (x < 0 || y < 0 || x > this.width || y > this.height) return;
    this.lastInput = this.time;
    const radius = this.mobile
      ? FABRIC.pulseRadius.mobile
      : FABRIC.pulseRadius.desktop;
    const variant = this.sequence++ % 3;
    this.pulses.push({ x, y, age: 0, radius, variant });
    if (this.pulses.length > FABRIC.maxPulses) this.pulses.shift();
    const count = this.mobile ? 6 : 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * TAU + variant * 0.24;
      const speed = 28 + (i % 4) * 13;
      this.sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        age: 0,
        life: 0.8 + (i % 3) * 0.23,
        size: i % 3 === 0 ? 3 : 1.5,
      });
    }
    this.sparks.splice(0, Math.max(0, this.sparks.length - FABRIC.maxSparks));
  }

  clearInteraction() {
    this.pulses = [];
    this.sparks = [];
    this.wakes = [];
    this.pointer.inside = false;
    this.pointer.strength = 0;
    this.lastInput = -100;
    this.lastWake = -100;
  }

  tick(seconds: number) {
    const dt = clamp(seconds, 0, FABRIC.maxStep);
    this.time += dt;
    const target = this.pointer.inside && this.active ? 1 : 0;
    this.pointer.strength +=
      (target - this.pointer.strength) * (1 - Math.exp(-dt * 5));
    this.pulses = this.pulses.filter((p) => (p.age += dt) < FABRIC.pulseLife);
    this.wakes = this.wakes.filter((p) => (p.age += dt) < FABRIC.wakeLife);
    this.sparks = this.sparks.filter((p) => {
      p.age += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.exp(-dt * 1.8);
      p.vy *= Math.exp(-dt * 1.8);
      return p.age < p.life;
    });
    for (const route of this.routes)
      route.phase =
        (route.phase + route.speed * dt * (this.active ? 1 : 0.55)) % 1;
  }

  /** Local interaction only: distant objects keep their original position. */
  displace(point: Point, depth: number): Point {
    let { x, y } = point;
    const radius = this.mobile
      ? FABRIC.pointerRadius.mobile
      : FABRIC.pointerRadius.desktop;
    const dx = x - this.pointer.x,
      dy = y - this.pointer.y,
      distance = Math.hypot(dx, dy);
    if (distance < radius && distance > 0) {
      const influence =
        (1 - distance / radius) ** 2 * this.pointer.strength * depth * 18;
      x += (dx / distance) * influence;
      y += (dy / distance) * influence;
    }
    for (const pulse of this.pulses) {
      const px = x - pulse.x,
        py = y - pulse.y,
        d = Math.hypot(px, py);
      const progress = pulse.age / FABRIC.pulseLife;
      const ring = pulse.radius * (1 - (1 - progress) ** 3);
      const force =
        clamp(1 - Math.abs(d - ring) / 36) * (1 - progress) * 13 * depth;
      if (d > 0 && d < pulse.radius + 36) {
        x += (px / d) * force;
        y += (py / d) * force;
      }
    }
    return { x, y };
  }

  point(route: Route, progress: number, moving = true): Point {
    const t = clamp(progress) * (route.points.length - 1),
      index = Math.min(Math.floor(t), route.points.length - 2);
    const a = route.points[index],
      b = route.points[index + 1],
      fraction = t - index;
    const point = {
      x: a.x + (b.x - a.x) * fraction,
      y: a.y + (b.y - a.y) * fraction,
    };
    if (!moving) return point;
    point.y +=
      Math.sin(progress * TAU + this.time * 0.22 + route.phase) *
      5 *
      route.depth;
    return this.displace(point, route.depth);
  }

  opacity(x: number, y: number) {
    const edge = ease(
      clamp(Math.min(x, y, this.width - x, this.height - y) / FABRIC.edgeFade),
    );
    let quiet = 1;
    for (const zone of this.zones) {
      const dx = Math.max(zone.x - x, 0, x - zone.x - zone.width);
      const dy = Math.max(zone.y - y, 0, y - zone.y - zone.height);
      quiet = Math.min(
        quiet,
        0.12 + ease(clamp(Math.hypot(dx, dy) / 90)) * 0.88,
      );
    }
    return edge * quiet;
  }
}

export function drawFabric(
  context: CanvasRenderingContext2D,
  scene: RequestFabric,
  theme: "light" | "dark",
  reduced = false,
) {
  const { width, height, time } = scene;
  const palette = FABRIC.palettes[theme];
  const color = (rgb: string, opacity: number) =>
    `rgba(${rgb},${clamp(opacity * palette.opacity)})`;
  context.clearRect(0, 0, width, height);
  context.lineWidth = 1;
  // Quiet registration marks evoke a network blueprint rather than a star field.
  const spacing = scene.mobile ? 72 : 84;
  for (let x = 24; x < width; x += spacing) {
    for (let y = 30; y < height; y += spacing) {
      const alpha = scene.opacity(x, y);
      context.strokeStyle = color(palette.line, alpha * 0.14);
      context.beginPath();
      context.moveTo(x - 2, y);
      context.lineTo(x + 2, y);
      context.moveTo(x, y - 2);
      context.lineTo(x, y + 2);
      context.stroke();
    }
  }
  const packetCount = scene.mobile
    ? FABRIC.packets.mobile
    : FABRIC.packets.desktop;
  for (const [index, route] of scene.routes.entries()) {
    // Short segments let content masks and edge fades vary smoothly along a path.
    let previous = scene.point(route, 0, !reduced);
    for (let j = 1; j <= 40; j++) {
      const point = scene.point(route, j / 40, !reduced);
      const alpha = scene.opacity(
        (point.x + previous.x) / 2,
        (point.y + previous.y) / 2,
      );
      context.strokeStyle = color(
        palette.line,
        alpha * (0.12 + route.depth * 0.12),
      );
      context.beginPath();
      context.moveTo(previous.x, previous.y);
      context.lineTo(point.x, point.y);
      context.stroke();
      previous = point;
    }
    for (let j = 0; j < packetCount; j++) {
      const progress = (route.phase + j / packetCount) % 1;
      const point = scene.point(route, progress, !reduced);
      const alpha =
        scene.opacity(point.x, point.y) * (0.35 + route.depth * 0.3);
      const accent = (index + j) % 7 === 0 ? palette.accent : palette.bright;
      const tail = scene.point(route, clamp(progress - 0.014), !reduced);
      context.strokeStyle = color(accent, alpha * 0.45);
      context.lineWidth = 1.4;
      context.beginPath();
      context.moveTo(tail.x, tail.y);
      context.lineTo(point.x, point.y);
      context.stroke();
      context.fillStyle = color(accent, alpha);
      const size = 1.5 + route.depth;
      context.fillRect(
        point.x - size / 2,
        point.y - size / 2,
        size + 1.5,
        size,
      );
      context.lineWidth = 1;
      if (!reduced && scene.pointer.strength > 0.05) {
        const distance = Math.hypot(
          point.x - scene.pointer.x,
          point.y - scene.pointer.y,
        );
        const radius = scene.mobile
          ? FABRIC.pointerRadius.mobile
          : FABRIC.pointerRadius.desktop;
        if (distance < radius) {
          context.strokeStyle = color(
            palette.bright,
            alpha *
              (1 - distance / radius) ** 2 *
              scene.pointer.strength *
              0.65,
          );
          context.setLineDash([2, 5]);
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(scene.pointer.x, scene.pointer.y);
          context.stroke();
          context.setLineDash([]);
        }
      }
    }
    // Small open junctions, with separate depth and a restrained parallax drift.
    const port = scene.point(route, 0.13 + (index % 5) * 0.17, !reduced);
    const alpha = scene.opacity(port.x, port.y);
    context.strokeStyle = color(palette.line, alpha * 0.36);
    context.strokeRect(port.x - 3, port.y - 3, 6, 6);
    if (index % 3 === 0 && !scene.mobile) {
      context.fillStyle = color(palette.line, alpha * 0.33);
      context.font = '9px "JetBrains Mono", monospace';
      context.fillText(
        ["TLS", "HTTP", "CACHE", "PHP", "PROXY"][index % 5],
        port.x + 11,
        port.y + 3,
      );
    }
  }
  if (reduced) return;
  for (const wake of scene.wakes) {
    const progress = wake.age / FABRIC.wakeLife;
    context.strokeStyle = color(
      palette.bright,
      scene.opacity(wake.x, wake.y) * (1 - progress) ** 2 * 0.3,
    );
    const size = 3 + progress * 12;
    context.beginPath();
    context.moveTo(wake.x - size, wake.y);
    context.lineTo(wake.x + size, wake.y);
    context.moveTo(wake.x, wake.y - size);
    context.lineTo(wake.x, wake.y + size);
    context.stroke();
  }
  for (const pulse of scene.pulses) {
    const progress = pulse.age / FABRIC.pulseLife;
    const radius = 5 + pulse.radius * (1 - (1 - progress) ** 3);
    const alpha = Math.min(1, progress * 12) * (1 - progress) ** 2;
    context.save();
    // A spatial mask clips the signal smoothly at scene edges and behind copy.
    const mask = context.createRadialGradient(
      pulse.x,
      pulse.y,
      0,
      pulse.x,
      pulse.y,
      radius + 40,
    );
    mask.addColorStop(0, color(palette.bright, alpha * 0.075));
    mask.addColorStop(1, color(palette.bright, 0));
    context.fillStyle = mask;
    context.fillRect(
      pulse.x - radius - 40,
      pulse.y - radius - 40,
      (radius + 40) * 2,
      (radius + 40) * 2,
    );
    context.lineWidth = 1.25;
    // Segmented circular or diamond-shaped request echoes share the same palette.
    for (let j = 0; j < 64; j++) {
      const angle = (j / 64) * TAU;
      const next = ((j + 0.85) / 64) * TAU;
      const shape = (a: number) =>
        pulse.variant === 1
          ? radius / (Math.abs(Math.cos(a)) + Math.abs(Math.sin(a)))
          : radius;
      const a = {
        x: pulse.x + Math.cos(angle) * shape(angle),
        y: pulse.y + Math.sin(angle) * shape(angle),
      };
      const b = {
        x: pulse.x + Math.cos(next) * shape(next),
        y: pulse.y + Math.sin(next) * shape(next),
      };
      context.strokeStyle = color(
        palette.bright,
        alpha *
          scene.opacity(a.x, a.y) *
          (pulse.variant === 2 && j % 3 === 0 ? 0.2 : 0.75),
      );
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
    }
    context.restore();
  }
  for (const spark of scene.sparks) {
    const alpha =
      (1 - spark.age / spark.life) ** 2 * scene.opacity(spark.x, spark.y);
    context.fillStyle = color(palette.bright, alpha * 0.9);
    context.fillRect(
      spark.x - spark.size / 2,
      spark.y - spark.size / 2,
      spark.size,
      spark.size,
    );
  }
  // One slowly breathing acknowledgement on the trunk, not a global cursor glow.
  const x = width * 0.51,
    y = height * 0.86;
  context.strokeStyle = color(
    palette.accent,
    scene.opacity(x, y) * (0.12 + Math.sin(time * 0.8) * 0.035),
  );
  context.strokeRect(x - 6, y - 6, 12, 12);
}
