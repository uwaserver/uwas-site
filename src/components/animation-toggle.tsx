"use client";

import { useSyncExternalStore } from "react";
import { Mouse, MouseOff } from "lucide-react";
import {
  backgroundAnimationsSnapshot,
  subscribeBackgroundAnimations,
  setBackgroundAnimations,
} from "@/lib/background-animations";

export function useBackgroundAnimations() {
  return useSyncExternalStore(
    subscribeBackgroundAnimations,
    backgroundAnimationsSnapshot,
    () => false,
  );
}

export function AnimationToggle() {
  const enabled = useBackgroundAnimations();
  const label = enabled ? "Animasyonları kapat" : "Animasyonları aç";
  const Icon = enabled ? Mouse : MouseOff;
  return (
    <button
      type="button"
      className="animation-toggle"
      aria-label={label}
      title={label}
      aria-pressed={enabled}
      onClick={() => setBackgroundAnimations(!enabled)}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
}
