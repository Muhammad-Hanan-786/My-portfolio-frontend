// Color themes selectable from the admin dashboard.
// Palette order in `colors`: [darkest, deep, accent, light]
export type ThemePalette = {
  id: string;
  label: string;
  mode: "dark" | "light";
  colors: [string, string, string, string];
};

export const THEMES: ThemePalette[] = [
  {
    id: "default",
    label: "Noir & Gold (Default)",
    mode: "dark",
    colors: ["#0d0d0d", "#1a1a1a", "#c9a84c", "#f0d78c"],
  },
  {
    id: "crimson-ember",
    label: "Crimson Ember",
    mode: "dark",
    colors: ["#5e0006", "#9b0f06", "#d53e0f", "#eed9b9"],
  },
  {
    id: "peach-cream",
    label: "Peach Cream",
    mode: "light",
    colors: ["#fff0be", "#ffd6a6", "#ff9a86", "#3a1a12"],
  },
  {
    id: "forest-mint",
    label: "Forest Mint",
    mode: "dark",
    colors: ["#1a312c", "#428475", "#89d7b7", "#fff4e1"],
  },
  {
    id: "midnight-orange",
    label: "Midnight Orange",
    mode: "dark",
    colors: ["#000000", "#233d4d", "#fe7f2d", "#eaecf0"],
  },
  {
    id: "royal-indigo",
    label: "Royal Indigo",
    mode: "dark",
    colors: ["#111844", "#4b5694", "#7288ae", "#eae0cf"],
  },
  {
    id: "azure-sky",
    label: "Azure Sky",
    mode: "light",
    colors: ["#d0e7e6", "#95ccdd", "#4274d9", "#293681"],
  },
  {
    id: "ivory-scarlet",
    label: "Ivory Scarlet",
    mode: "light",
    colors: ["#fffaf3", "#ffe5bf", "#f62440", "#2a0a10"],
  },
  {
    id: "rouge-gold",
    label: "Rouge & Gold",
    mode: "light",
    colors: ["#f8ebab", "#f7d87f", "#d0311e", "#3a0a0a"],
  },
];

export function getTheme(id?: string | null): ThemePalette {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

/**
 * Build a CSS block that overrides the design tokens for the selected palette.
 * We keep the shadcn token names but map them to the palette's four colors so
 * every semantic utility (bg-background, text-foreground, bg-primary, etc.)
 * follows the admin's selection across the whole site.
 */
export function themeCss(theme: ThemePalette): string {
  const [c1, c2, c3, c4] = theme.colors;
  const isDark = theme.mode === "dark";
  const bg = isDark ? c1 : c1;
  const surface = isDark ? c2 : c2;
  const surface2 = isDark ? mix(c2, c3, 0.15) : mix(c2, c4, 0.1);
  const surface3 = isDark ? mix(c2, c3, 0.3) : mix(c2, c4, 0.2);
  const fg = isDark ? c4 : c4;
  const muted = isDark ? "#ffffff" : mix(c4, c1, 0.35);
  const primary = c3;
  const primaryFg = isDark ? c1 : c1;
  const border = isDark ? mix(c2, c4, 0.15) : mix(c4, c1, 0.15);
  const borderStrong = isDark ? mix(c2, c4, 0.3) : mix(c4, c1, 0.3);

  return `:root, .dark {
  --background: ${bg};
  --foreground: ${fg};
  --surface: ${surface};
  --surface-2: ${surface2};
  --surface-3: ${surface3};
  --glass: ${withAlpha(surface, 0.65)};
  --card: ${surface};
  --card-foreground: ${fg};
  --popover: ${surface};
  --popover-foreground: ${fg};
  --primary: ${primary};
  --primary-foreground: ${primaryFg};
  --secondary: ${surface2};
  --secondary-foreground: ${fg};
  --muted: ${surface2};
  --muted-foreground: ${muted};
  --accent: ${primary};
  --accent-foreground: ${primaryFg};
  --border: ${border};
  --border-strong: ${borderStrong};
  --input: ${border};
  --ring: ${primary};
  --sidebar: ${surface};
  --sidebar-foreground: ${fg};
  --sidebar-primary: ${primary};
  --sidebar-primary-foreground: ${primaryFg};
  --sidebar-accent: ${surface2};
  --sidebar-accent-foreground: ${fg};
  --sidebar-border: ${border};
  --sidebar-ring: ${primary};
}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}
function toHex(r: number, g: number, b: number): string {
  const p = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${p(r)}${p(g)}${p(b)}`;
}
function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return toHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}
function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}
