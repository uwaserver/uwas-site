"use client";

import { useEffect, useId, useRef } from "react";
import { usePathname } from "next/navigation";
import { FABRIC, RequestFabric, isFabricTap } from "@/lib/site-fabric";
import { createSvgFabric } from "@/lib/site-fabric-svg";

/** One persistent, decorative SVG field shared by every route. */
export function SiteBackground() {
  const ref = useRef<SVGSVGElement>(null);
  const id = useId().replaceAll(":", "");
  const pathname = usePathname();

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const scene = new RequestFabric(1, 1);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = media.matches,
      visible = false,
      disposed = false;
    let frame = 0,
      previous = 0,
      lastDraw = 0,
      lastMask = -1000;
    let dirty = true;
    let renderer: ReturnType<typeof createSvgFabric>;
    let tap: {
      x: number;
      y: number;
      time: number;
      id: number;
      scroll: number;
    } | null = null;
    const excluded =
      'a, button, input, select, textarea, summary, label, nav, header, [role="button"], [role="dialog"], [data-background-no-pulse], h1, h2, h3, p, pre, code, .hero-trust';

    function state(value: string) {
      svg!.dataset.sceneState = value;
      document.documentElement.dataset.fabricState = value;
    }
    function paint() {
      if (dirty) {
        renderer.updateQuietZones();
        dirty = false;
      }
      renderer.draw(window.scrollY, reduced);
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
        if (dirty && now - lastMask < 80) {
          renderer.draw(window.scrollY, reduced);
        } else {
          if (dirty) lastMask = now;
          paint();
        }
      }
      frame = requestAnimationFrame(animate);
    }
    function sync() {
      stop();
      if (disposed || !visible || document.hidden || !renderer) return;
      dirty = true;
      state(reduced ? "still" : "running");
      paint();
      if (!reduced) frame = requestAnimationFrame(animate);
    }
    function resize() {
      const rect = svg!.getBoundingClientRect();
      scene.resize(rect.width, rect.height);
      renderer = createSvgFabric(svg!, scene, id);
      svg!.dataset.quality = scene.mobile ? "compact" : "full";
      sync();
    }
    function move(event: PointerEvent) {
      if (
        reduced ||
        !visible ||
        document.hidden ||
        event.pointerType === "touch"
      )
        return;
      scene.move(event.clientX, event.clientY);
    }
    function isExcluded(event: PointerEvent) {
      return event
        .composedPath()
        .some(
          (target) => target instanceof Element && target.matches(excluded),
        );
    }
    function down(event: PointerEvent) {
      tap = null;
      if (
        reduced ||
        !visible ||
        document.hidden ||
        !event.isPrimary ||
        event.button !== 0 ||
        isExcluded(event)
      )
        return;
      tap = {
        x: event.clientX,
        y: event.clientY,
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
        isExcluded(event) ||
        !window.getSelection()?.isCollapsed
      )
        return;
      const end = { x: event.clientX, y: event.clientY, time: event.timeStamp };
      if (isFabricTap(start, end)) scene.pulse(end.x, end.y);
    }
    function leave() {
      tap = null;
      scene.leave();
    }
    function scroll() {
      tap = null;
      scene.leave();
      scene.clearInteraction();
      dirty = true;
      if (reduced && visible && !document.hidden) paint();
    }
    function motionChanged() {
      reduced = media.matches;
      sync();
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === svg) {
          visible = entry.isIntersecting;
          sync();
        } else
          (entry.target as HTMLElement).dataset.fabricVisible = String(
            entry.isIntersecting,
          );
      }
    });
    observer.observe(svg);
    for (const element of document.querySelectorAll(".server-diagram"))
      observer.observe(element);
    const resizeObserver = new ResizeObserver(() => {
      dirty = true;
      if (reduced && visible && !document.hidden) paint();
    });
    const main = document.getElementById("main-content");
    if (main) resizeObserver.observe(main);
    const viewportObserver = new ResizeObserver(resize);
    viewportObserver.observe(svg);
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("pointerleave", leave, { passive: true });
    document.addEventListener("pointercancel", leave, { passive: true });
    document.addEventListener("visibilitychange", sync);
    media.addEventListener("change", motionChanged);
    resize();
    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      viewportObserver.disconnect();
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointercancel", leave);
      document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", motionChanged);
      svg.replaceChildren();
      delete document.documentElement.dataset.fabricState;
    };
  }, [id, pathname]);

  return (
    <svg
      ref={ref}
      className="site-fabric"
      aria-hidden="true"
      focusable="false"
      data-scene-state="loading"
    />
  );
}
