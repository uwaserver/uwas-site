"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Check, ChevronDown, Monitor, Moon, Sun } from "lucide-react";

type Theme = "light" | "dark" | "system";
const THEME_KEY = "uwas-theme";
const choices = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;
const normalize = (value: string | null | undefined): Theme =>
  value === "light" || value === "dark" ? value : "system";

function snapshot(): Theme {
  const preference = document.documentElement.dataset.themePreference;
  if (preference) return normalize(preference);
  try {
    return normalize(localStorage.getItem(THEME_KEY));
  } catch {
    return "system";
  }
}

function applyPalette(theme: Theme) {
  document.documentElement.dataset.theme =
    theme === "system"
      ? matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
}

function subscribe(callback: () => void) {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const systemChanged = () => {
    applyPalette(snapshot());
    callback();
  };
  const storageChanged = (event: StorageEvent) => {
    if (event.key !== THEME_KEY && event.key !== null) return;
    const theme = normalize(event.newValue);
    document.documentElement.dataset.themePreference = theme;
    applyPalette(theme);
    callback();
  };
  window.addEventListener("uwas:theme-change", callback);
  window.addEventListener("storage", storageChanged);
  media.addEventListener("change", systemChanged);
  return () => {
    window.removeEventListener("uwas:theme-change", callback);
    window.removeEventListener("storage", storageChanged);
    media.removeEventListener("change", systemChanged);
  };
}

function changeTheme(next: Theme) {
  document.documentElement.dataset.themePreference = next;
  applyPalette(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    /* The in-memory preference still works when storage is blocked. */
  }
  window.dispatchEvent(new Event("uwas:theme-change"));
}

export function ThemePicker() {
  const [open, setOpen] = useState(false);
  const picker = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const theme = useSyncExternalStore(
    subscribe,
    snapshot,
    () => "system" as const,
  );
  const current =
    choices.find((choice) => choice.value === theme) ?? choices[2];
  const Icon = current.icon;

  useEffect(() => {
    if (!open) return;
    picker.current?.querySelector<HTMLInputElement>("input:checked")?.focus();
    function dismiss(event: PointerEvent | FocusEvent) {
      if (
        event.target instanceof Node &&
        !picker.current?.contains(event.target)
      )
        setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div className="theme-picker" ref={picker}>
      <button
        type="button"
        ref={trigger}
        className="theme-trigger"
        aria-label={`Color theme: ${current.label}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        <Icon aria-hidden="true" />
        <span>{current.label}</span>
        <ChevronDown className="theme-chevron" aria-hidden="true" />
      </button>
      {open && (
        <div
          className="theme-panel"
          id={id}
          role="dialog"
          aria-label="Appearance"
        >
          <div className="theme-panel-heading">
            <span>Appearance</span>
            <span className="theme-panel-hint">Your space, your style.</span>
          </div>
          <fieldset className="theme-options">
            <legend className="sr-only">Color theme</legend>
            {choices.map(({ value, label, icon: ChoiceIcon }) => (
              <label className="theme-option" key={value}>
                <input
                  type="radio"
                  name={`${id}-theme`}
                  value={value}
                  checked={theme === value}
                  onChange={() => changeTheme(value)}
                />
                <span
                  className={`theme-preview theme-preview-${value}`}
                  aria-hidden="true"
                >
                  <span className="theme-preview-window">
                    <span className="theme-preview-sidebar" />
                    <span className="theme-preview-content">
                      <i />
                      <i />
                      <i />
                    </span>
                  </span>
                  <span className="theme-choice-icon">
                    <ChoiceIcon />
                  </span>
                  <span className="theme-choice-check">
                    <Check />
                  </span>
                </span>
                <span className="theme-option-label">{label}</span>
              </label>
            ))}
          </fieldset>
          <p className="theme-panel-status" aria-live="polite">
            <Icon aria-hidden="true" />
            {theme === "system"
              ? "Matches your device’s appearance."
              : `${current.label} mode, just how you like it.`}
          </p>
        </div>
      )}
    </div>
  );
}
