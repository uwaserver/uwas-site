"use client";

import { useSyncExternalStore } from "react";
import { Mouse, MouseOff } from "lucide-react";
import {
  mouseEffectsSnapshot,
  subscribeMouseEffects,
  setMouseEffects,
} from "@/lib/background-animations";

function useMouseEffects() {
  return useSyncExternalStore(
    subscribeMouseEffects,
    mouseEffectsSnapshot,
    () => false,
  );
}

export function AnimationToggle() {
  const enabled = useMouseEffects();
  const label = enabled ? "Disable mouse effects" : "Enable mouse effects";
  const Icon = enabled ? Mouse : MouseOff;
  return (
    <button
      type="button"
      className="animation-toggle"
      aria-label={label}
      title={label}
      aria-pressed={enabled}
      onClick={() => setMouseEffects(!enabled)}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
}
