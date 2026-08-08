import { useEffect, useState } from "react";
import { getTheme, themeCss } from "@/lib/themes";

const STYLE_ID = "portfolio-theme-vars";
const STORAGE_KEY = "portfolio.theme";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function injectStyle(id: string) {
  const css = themeCss(getTheme(id));
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
  // Toggle light/dark class on <html> so tailwind dark-variant tokens behave.
  const theme = getTheme(id);
  document.documentElement.classList.toggle("dark", theme.mode === "dark");
}

export function ThemeApplier() {
  const [_, setReady] = useState(false);
  useEffect(() => {
    // 1. Instant apply from localStorage to avoid flash on repeat visits.
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) injectStyle(cached);
    } catch {}

    // 2. Fetch canonical value from public API and reconcile.
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/public/settings`);
        if (res.ok) {
          const data = await res.json();
          const id = data?.value?.theme ?? "default";
          injectStyle(id);
          try {
            localStorage.setItem(STORAGE_KEY, id);
          } catch {}
        }
      } catch (err) {
        console.error("Failed to load canonical theme settings:", err);
      } finally {
        setReady(true);
      }
    })();

    // 3. Listen for admin panel updates in the same tab.
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id) injectStyle(id);
    };
    window.addEventListener("portfolio:theme-changed", handler as EventListener);
    return () => window.removeEventListener("portfolio:theme-changed", handler as EventListener);
  }, []);
  return null;
}
