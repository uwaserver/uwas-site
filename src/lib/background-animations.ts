// Retain the original storage key so existing mouse-button choices survive.
export const MOUSE_EFFECTS_KEY = "uwas-background-animations";
const CHANGE_EVENT = "uwas:background-animations-change";
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function resolveMouseEffects(stored: string | null, reduced: boolean) {
  return stored === "on" ? true : stored === "off" ? false : !reduced;
}

function readPreference() {
  try {
    return localStorage.getItem(MOUSE_EFFECTS_KEY);
  } catch {
    return null;
  }
}

function applyPreference(preference: string | null) {
  const root = document.documentElement;
  root.dataset.mouseEffectPreference =
    preference === "on" || preference === "off" ? preference : "system";
  root.dataset.mouseEffects = resolveMouseEffects(
    preference,
    matchMedia(MOTION_QUERY).matches,
  )
    ? "on"
    : "off";
}

export function mouseEffectsSnapshot() {
  const current = document.documentElement.dataset.mouseEffects;
  return current === "on" || current === "off"
    ? current === "on"
    : resolveMouseEffects(readPreference(), matchMedia(MOTION_QUERY).matches);
}

export function subscribeMouseEffects(callback: () => void) {
  const media = matchMedia(MOTION_QUERY);
  // The head script normally initializes this before the first paint.
  if (!document.documentElement.dataset.mouseEffects)
    applyPreference(readPreference());
  const systemChanged = () => {
    const preference = document.documentElement.dataset.mouseEffectPreference;
    if (preference !== "on" && preference !== "off") applyPreference(null);
    callback();
  };
  const storageChanged = (event: StorageEvent) => {
    if (event.key !== MOUSE_EFFECTS_KEY && event.key !== null) return;
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

export function setMouseEffects(enabled: boolean) {
  const preference = enabled ? "on" : "off";
  applyPreference(preference);
  try {
    localStorage.setItem(MOUSE_EFFECTS_KEY, preference);
  } catch {
    /* Keep the current choice in memory when storage is unavailable. */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Initialize only mouse effects; ambient motion independently follows the OS. */
export const mouseEffectsScript = `(()=>{let p=null;try{p=localStorage.getItem('${MOUSE_EFFECTS_KEY}')}catch{}const r=document.documentElement;r.dataset.mouseEffectPreference=p==='on'||p==='off'?p:'system';r.dataset.mouseEffects=(p==='on'||(p!=='off'&&!matchMedia('${MOTION_QUERY}').matches))?'on':'off'})()`;
