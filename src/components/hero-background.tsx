"use client";

import { useEffect, useRef } from "react";
import {
  FABRIC,
  RequestFabric,
  drawFabric,
  fabricPixelRatio,
  isFabricTap,
} from "@/lib/hero-fabric";

/** Decorative canvas; events are observed on its host without capturing input. */
export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !host || !context) return;
    const scene = new RequestFabric(host.clientWidth, host.clientHeight);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = media.matches;
    let theme: "light" | "dark" =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    let visible = false,
      disposed = false,
      frame = 0,
      previous = 0,
      lastDraw = 0;
    let tap: {
      x: number;
      y: number;
      time: number;
      id: number;
      scroll: number;
    } | null = null;
    const excluded =
      'a, button, input, select, textarea, summary, [role="button"], [data-hero-no-pulse], h1, p, code, .hero-trust';

    function paint() {
      drawFabric(context!, scene, theme, reduced);
    }
    function state(value: "paused" | "still" | "running") {
      canvas!.dataset.sceneState = value;
      host!.dataset.sceneState = value;
    }
    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      lastDraw = 0;
      tap = null;
      scene.clearInteraction();
      state("paused");
    }
    function animate(now: number) {
      frame = 0;
      if (disposed || !visible || document.hidden || reduced) return;
      const interval =
        1000 /
        (scene.mobile
          ? FABRIC.fps.mobile
          : scene.active
            ? FABRIC.fps.active
            : FABRIC.fps.idle);
      if (!lastDraw || now - lastDraw >= interval - 1) {
        scene.tick(previous ? (now - previous) / 1000 : 0);
        previous = now;
        lastDraw = now;
        paint();
      }
      frame = requestAnimationFrame(animate);
    }
    function sync() {
      stop();
      if (disposed || !visible || document.hidden) return;
      state(reduced ? "still" : "running");
      paint();
      if (!reduced) frame = requestAnimationFrame(animate);
    }
    function resize() {
      const bounds = host!.getBoundingClientRect();
      scene.resize(bounds.width, bounds.height);
      const dpr = fabricPixelRatio(
        bounds.width,
        bounds.height,
        window.devicePixelRatio || 1,
      );
      canvas!.width = Math.round(bounds.width * dpr);
      canvas!.height = Math.round(bounds.height * dpr);
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene.zones = [...host!.querySelectorAll("[data-hero-quiet]")].map(
        (element) => {
          const rect = element.getBoundingClientRect();
          return {
            x: rect.left - bounds.left - 10,
            y: rect.top - bounds.top - 10,
            width: rect.width + 20,
            height: rect.height + 20,
          };
        },
      );
      canvas!.dataset.quality = scene.mobile ? "compact" : "full";
      sync();
    }
    function point(event: PointerEvent) {
      const bounds = host!.getBoundingClientRect();
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    }
    function move(event: PointerEvent) {
      if (
        reduced ||
        !visible ||
        document.hidden ||
        event.pointerType === "touch"
      )
        return;
      const { x, y } = point(event);
      scene.move(x, y);
    }
    function down(event: PointerEvent) {
      tap = null;
      if (
        reduced ||
        !visible ||
        document.hidden ||
        !event.isPrimary ||
        event.button !== 0 ||
        (event.target instanceof Element && event.target.closest(excluded))
      )
        return;
      tap = {
        ...point(event),
        time: event.timeStamp,
        id: event.pointerId,
        scroll: window.scrollY,
      };
    }
    function up(event: PointerEvent) {
      const start = tap;
      tap = null;
      if (
        !start ||
        reduced ||
        start.id !== event.pointerId ||
        Math.abs(window.scrollY - start.scroll) > 2 ||
        (event.target instanceof Element && event.target.closest(excluded)) ||
        !window.getSelection()?.isCollapsed
      )
        return;
      const end = { ...point(event), time: event.timeStamp };
      if (isFabricTap(start, end)) scene.pulse(end.x, end.y);
    }
    function leave() {
      tap = null;
      scene.leave();
    }
    function motionChanged() {
      reduced = media.matches;
      sync();
    }
    function paletteChanged() {
      const next =
        document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      if (next !== theme) {
        theme = next;
        if (visible && !document.hidden) paint();
      }
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    const resizeObserver = new ResizeObserver(resize);
    const paletteObserver = new MutationObserver(paletteChanged);
    observer.observe(host);
    resizeObserver.observe(host);
    for (const element of host.querySelectorAll("[data-hero-quiet]"))
      resizeObserver.observe(element);
    paletteObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerdown", down, { passive: true });
    host.addEventListener("pointerup", up, { passive: true });
    host.addEventListener("pointerleave", leave, { passive: true });
    host.addEventListener("pointercancel", leave, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", sync);
    media.addEventListener("change", motionChanged);
    resize();

    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      paletteObserver.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointerup", up);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointercancel", leave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", motionChanged);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-fabric"
      aria-hidden="true"
      data-scene-state="loading"
    />
  );
}
