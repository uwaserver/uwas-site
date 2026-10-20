export type Theme = "light" | "dark" | "system";

export function normalizeTheme(value: string | null | undefined): Theme {
  return value === "light" || value === "dark" ? value : "system";
}

/** Apply a validated preference before paint, including blocked/legacy storage. */
export const themeScript = `(()=>{let p='system';try{const s=localStorage.getItem('uwas-theme');if(s==='light'||s==='dark')p=s}catch{}const r=document.documentElement;r.dataset.themePreference=p;r.dataset.theme=p==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p})()`;
