import { createServerFn } from "@tanstack/react-start";

function getApiUrl(): string {
  const envUrl = (
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
    (typeof process !== "undefined" && process.env?.VITE_API_URL) ||
    (typeof process !== "undefined" && process.env?.API_URL) ||
    ""
  ).replace(/\/$/, "");
  if (envUrl) return envUrl;
  if (typeof window !== "undefined" && !window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1")) {
    return "";
  }
  return "http://localhost:5000";
}

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const apiUrl = getApiUrl();
  try {
    const res = await fetch(`${apiUrl}/api/public/content`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch content: ${res.statusText}`);
    }
    const data = await res.json();
    return {
      hero: data.hero ?? null,
      about: data.about ?? null,
      projects: data.projects ?? [],
      skills: data.skills ?? [],
      technologies: data.technologies ?? [],
      services: data.services ?? [],
      experience: data.experience ?? [],
      education: data.education ?? [],
      certificates: data.certificates ?? [],
      social: data.social ?? [],
      seo: data.seo ?? null,
      settings: data.settings ?? {},
      resume: data.resume ?? null,
    };
  } catch (err) {
    console.error("Error fetching site content:", err);
    return {
      hero: null,
      about: null,
      projects: [],
      skills: [],
      technologies: [],
      services: [],
      experience: [],
      education: [],
      certificates: [],
      social: [],
      seo: null,
      settings: {},
      resume: null,
    };
  }
});

export type SiteContent = Awaited<ReturnType<typeof getSiteContent>>;
