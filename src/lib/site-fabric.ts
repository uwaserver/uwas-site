/** Shared motion and object budgets for the UWAS request fabric. */
export const FABRIC = {
  mobileBreakpoint: 650,
  routes: { mobile: 7, desktop: 14 },
  packets: { mobile: 2, desktop: 3 },
  fps: { active: 60, idle: 24, mobile: 30 },
  idleAfter: 3.5,
  speed: 0.028,
  pointerRadius: { mobile: 135, desktop: 280 },
  pointerForce: { mobile: 38, desktop: 68 },
  pulseRadius: { mobile: 165, desktop: 310 },
  pulseForce: 52,
  orbitTravel: { mobile: 44, desktop: 88 },
  maxRelays: { mobile: 4, desktop: 10 },
  relayRadius: { mobile: 110, desktop: 180 },
  relayLife: 0.8,
  relayHops: 2,
  pulseLife: 2.1,
  maxPulses: 6,
  maxSparks: 72,
  maxWakes: 18,
  wakeLife: 1.1,
  edgeFade: 48,
  maxStep: 0.05,
  tapDistance: 9,
  tapDuration: 650,
  motifs: { mobile: 12, desktop: 38, wide: 58 },
} as const;

export type Point = { x: number; y: number };
export type Motif = Point & {
  depth: number;
  phase: number;
  size: number;
  kind: number;
};

/** Stable, stratified placement prevents random clumps and hydration randomness. */
export function createMotifs(width: number, height: number): Motif[] {
  const count =
    width <= FABRIC.mobileBreakpoint
      ? FABRIC.motifs.mobile
      : width >= 1900
        ? FABRIC.motifs.wide
        : FABRIC.motifs.desktop;
  const columns = Math.ceil(Math.sqrt((count * width) / Math.max(height, 1)));
  const rows = Math.ceil(count / columns);
  return Array.from({ length: count }, (_, i) => ({
    x: (((i % columns) + 0.25 + ((i * 0.618) % 1) * 0.5) / columns) * width,
    y:
      ((Math.floor(i / columns) + 0.25 + ((i * 0.414) % 1) * 0.5) / rows) *
      height,
    depth: 0.4 + (i % 3) * 0.3,
    phase: i * 2.399,
    size: 0.6 + (i % 4) * 0.17,
    kind: i % 5,
  }));
}

export function motifPosition(
  motif: Motif,
  time: number,
  scroll: number,
  height: number,
  reduced = false,
) {
  const span = height + 160;
  const drift = reduced
    ? 0
    : Math.sin(time * (0.14 + motif.depth * 0.1) + motif.phase) *
      12 *
      motif.depth;
  return {
    x:
      motif.x +
      (reduced ? 0 : Math.cos(time * 0.14 + motif.phase) * 9 * motif.depth),
    y:
      ((((motif.y - (reduced ? 0 : scroll * motif.depth * 0.12) + drift + 80) %
        span) +
        span) %
        span) -
      80,
  };
}
export type QuietZone = Point & { width: number; height: number };
export type Route = {
  points: Point[];
  depth: number;
  speed: number;
  phase: number;
};
export type Pulse = Point & {
  age: number;
  variant: number;
  radius: number;
  root: number;
  generation: number;
  children: number;
  energy: number;
};
export type Relay = Pulse & { source: number; from: Point };
type Cascade = { id: number; born: number; seen: Uint8Array };
type MotifMotion = Point & {
  vx: number;
  vy: number;
  orbit: number;
  spin: number;
  energy: number;
};
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
  motifs: Motif[] = [];
  motions: MotifMotion[] = [];
  relays: Relay[] = [];
  scroll = 0;
  private cascades: Cascade[] = [];
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
    this.motifs = createMotifs(this.width, this.height);
    this.motions = this.motifs.map(() => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      orbit: 0,
      spin: 0,
      energy: 0,
    }));
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
    const root = this.sequence++;
    const variant = root % 3;
    this.cascades.push({
      id: root,
      born: this.time,
      seen: new Uint8Array(this.motifs.length),
    });
    if (this.cascades.length > FABRIC.maxPulses) {
      const expired = this.cascades.shift()!;
      this.relays = this.relays.filter((relay) => relay.root !== expired.id);
    }
    this.pulses.push({
      x,
      y,
      age: 0,
      radius,
      variant,
      root,
      generation: 0,
      children: 0,
      energy: 1,
    });
    if (this.pulses.length > FABRIC.maxPulses) this.pulses.shift();
    const count = this.mobile ? 6 : 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * TAU + variant * 0.24;
      const speed = 75 + (i % 4) * 24;
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
    this.relays = [];
    this.cascades = [];
    for (const motion of this.motions)
      Object.assign(motion, {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        orbit: 0,
        spin: 0,
        energy: 0,
      });
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
    this.relays = this.relays.filter((p) => (p.age += dt) < FABRIC.relayLife);
    this.cascades = this.cascades.filter(
      (c) =>
        this.time - c.born <
        FABRIC.pulseLife + FABRIC.relayLife * FABRIC.relayHops,
    );
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
    this.flowMotifs(dt);
  }

  motifPoint(index: number, reduced = false) {
    const motif = this.motifs[index],
      motion = this.motions[index];
    const base = motifPosition(
      motif,
      this.time,
      this.scroll,
      this.height,
      reduced,
    );
    return {
      x: base.x + (reduced ? 0 : motion.x),
      y: base.y + (reduced ? 0 : motion.y),
      rotation: reduced
        ? 0
        : Math.sin(this.time * 0.1 + motif.phase) * 12 +
          Math.sin(motion.orbit) * this.pointer.strength * 18 +
          motion.spin,
      energy: reduced ? 0 : motion.energy,
    };
  }

  private flowMotifs(dt: number) {
    const radius = this.mobile
      ? FABRIC.pointerRadius.mobile
      : FABRIC.pointerRadius.desktop;
    const travel = this.mobile
      ? FABRIC.orbitTravel.mobile
      : FABRIC.orbitTravel.desktop;
    for (let i = 0; i < this.motifs.length; i++) {
      const motif = this.motifs[i],
        motion = this.motions[i];
      const base = motifPosition(motif, this.time, this.scroll, this.height);
      motion.energy *= Math.exp(-dt * 4.5);
      motion.spin *= Math.exp(-dt * 5);
      // Offscreen shapes have no spring/orbit work and cannot relay a wave.
      if (
        base.y < -60 ||
        base.y > this.height + 60 ||
        base.x < -60 ||
        base.x > this.width + 60
      ) {
        motion.x =
          motion.y =
          motion.vx =
          motion.vy =
          motion.energy =
          motion.spin =
            0;
        continue;
      }
      const dx = base.x - this.pointer.x,
        dy = base.y - this.pointer.y;
      const distance = Math.hypot(dx, dy);
      const influence =
        ease(clamp(1 - distance / radius)) * this.pointer.strength;
      motion.orbit += dt * (0.85 + motif.depth * 0.25) * influence;
      const angle = motion.orbit;
      const displaced = this.displace(base, motif.depth);
      let tx =
        displaced.x -
        base.x +
        ((Math.cos(angle) - 1) * dx - Math.sin(angle) * dy) * influence;
      let ty =
        displaced.y -
        base.y +
        (Math.sin(angle) * dx + (Math.cos(angle) - 1) * dy) * influence;
      const length = Math.hypot(tx, ty);
      if (length > travel) {
        tx *= travel / length;
        ty *= travel / length;
      }
      // Exact critically damped spring: the cursor can move abruptly, shapes cannot.
      const omega = 7 + motif.depth * 2,
        decay = Math.exp(-omega * dt);
      const ax = motion.x - tx,
        ay = motion.y - ty;
      const bx = motion.vx + omega * ax,
        by = motion.vy + omega * ay;
      motion.x = tx + (ax + bx * dt) * decay;
      motion.y = ty + (ay + by * dt) * decay;
      motion.vx = (motion.vx - omega * bx * dt) * decay;
      motion.vy = (motion.vy - omega * by * dt) * decay;
    }
    // A newly struck shape starts its wave on the next tick. Each cascade can
    // visit a shape once, branch twice, and travel at most two hops.
    if (!this.pulses.length && !this.relays.length) return;
    const positions = this.motifs.map((_, i) => this.motifPoint(i));
    const waves = [...this.pulses, ...this.relays];
    for (const wave of waves) {
      const cascade = this.cascades.find((c) => c.id === wave.root);
      if (!cascade) continue;
      const life = wave.generation ? FABRIC.relayLife : FABRIC.pulseLife;
      const front = wave.radius * (1 - (1 - wave.age / life) ** 3);
      for (let i = 0; i < this.motifs.length; i++) {
        if (cascade.seen[i]) continue;
        const point = positions[i];
        if (
          point.x < 0 ||
          point.x > this.width ||
          point.y < 0 ||
          point.y > this.height
        )
          continue;
        const dx = point.x - wave.x,
          dy = point.y - wave.y,
          distance = Math.hypot(dx, dy);
        if (distance > front || distance > wave.radius) continue;
        cascade.seen[i] = 1;
        const motion = this.motions[i];
        motion.energy = Math.min(1, motion.energy + wave.energy);
        motion.spin = clamp(
          motion.spin + (i % 2 ? 1 : -1) * 32 * wave.energy,
          -48,
          48,
        );
        if (distance > 0) {
          motion.vx = clamp(
            motion.vx + ((dx - dy * 0.35) / distance) * 65 * wave.energy,
            -180,
            180,
          );
          motion.vy = clamp(
            motion.vy + ((dy + dx * 0.35) / distance) * 65 * wave.energy,
            -180,
            180,
          );
        }
        const limit = this.mobile
          ? FABRIC.maxRelays.mobile
          : FABRIC.maxRelays.desktop;
        if (
          wave.generation < FABRIC.relayHops &&
          wave.children < 2 &&
          this.relays.length < limit
        ) {
          wave.children++;
          this.relays.push({
            ...point,
            age: 0,
            radius: this.mobile
              ? FABRIC.relayRadius.mobile
              : FABRIC.relayRadius.desktop,
            root: wave.root,
            variant: wave.variant,
            generation: wave.generation + 1,
            children: 0,
            energy: wave.energy * 0.58,
            source: i,
            from: { x: wave.x, y: wave.y },
          });
        }
      }
    }
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
      const t = distance / radius;
      const falloff = (1 - t) ** 2 * this.pointer.strength * depth;
      const force = this.mobile
        ? FABRIC.pointerForce.mobile
        : FABRIC.pointerForce.desktop;
      // Inner repulsion, a gentle outer attraction and a tangential current.
      // Every term approaches zero at the radius, without a hard boundary.
      const radial = (1 - t * 2.6) * falloff * force;
      const swirl = Math.sin(t * Math.PI) * falloff * force * 0.38;
      x += (dx * radial - dy * swirl) / distance;
      y += (dy * radial + dx * swirl) / distance;
    }
    for (const pulse of this.pulses) {
      const px = x - pulse.x,
        py = y - pulse.y,
        d = Math.hypot(px, py);
      const progress = pulse.age / FABRIC.pulseLife;
      const ring = pulse.radius * (1 - (1 - progress) ** 3);
      const force =
        ease(clamp(1 - Math.abs(d - ring) / 72)) *
        (1 - progress) ** 2 *
        FABRIC.pulseForce *
        depth;
      if (d > 0 && d < pulse.radius + 72) {
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
