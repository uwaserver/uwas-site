export const BACKGROUND_ANIMATIONS_KEY = "uwas-background-animations";
const CHANGE_EVENT = "uwas:background-animations-change";
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function resolveBackgroundAnimations(
  stored: string | null,
  reduced: boolean,
) {
  return stored === "on" ? true : stored === "off" ? false : !reduced;
}

function readPreference() {
  try {
    return localStorage.getItem(BACKGROUND_ANIMATIONS_KEY);
  } catch {
    return null;
  }
}

function applyPreference(preference: string | null) {
  const root = document.documentElement;
  root.dataset.backgroundAnimationPreference =
    preference === "on" || preference === "off" ? preference : "system";
  root.dataset.backgroundAnimations = resolveBackgroundAnimations(
    preference,
    matchMedia(MOTION_QUERY).matches,
  )
    ? "on"
    : "off";
}

export function backgroundAnimationsSnapshot() {
  const current = document.documentElement.dataset.backgroundAnimations;
  return current === "on" || current === "off"
    ? current === "on"
    : resolveBackgroundAnimations(
        readPreference(),
        matchMedia(MOTION_QUERY).matches,
      );
}

export function subscribeBackgroundAnimations(callback: () => void) {
  const media = matchMedia(MOTION_QUERY);
  // The head script normally initializes this before the first paint.
  if (!document.documentElement.dataset.backgroundAnimations)
    applyPreference(readPreference());
  const systemChanged = () => {
    const preference =
      document.documentElement.dataset.backgroundAnimationPreference;
    if (preference !== "on" && preference !== "off") applyPreference(null);
    callback();
  };
  const storageChanged = (event: StorageEvent) => {
    if (event.key !== BACKGROUND_ANIMATIONS_KEY && event.key !== null) return;
    applyPreference(event.key === null ? null : event.newValue);
    callback();
  };
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", storageChanged);
  media.addEventListener("change", systemChanged);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", storageChanged);
    media.removeEventListener("change", systemChanged);
  };
}

export function setBackgroundAnimations(enabled: boolean) {
  const preference = enabled ? "on" : "off";
  applyPreference(preference);
  try {
    localStorage.setItem(BACKGROUND_ANIMATIONS_KEY, preference);
  } catch {
    /* Keep the current choice in memory when storage is unavailable. */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Runs before hydration so saved/reduced-motion preferences cannot flash motion. */
export const backgroundAnimationsScript = `(()=>{let p=null;try{p=localStorage.getItem('${BACKGROUND_ANIMATIONS_KEY}')}catch{}const r=document.documentElement;r.dataset.backgroundAnimationPreference=p==='on'||p==='off'?p:'system';r.dataset.backgroundAnimations=(p==='on'||(p!=='off'&&!matchMedia('${MOTION_QUERY}').matches))?'on':'off'})()`;
