import { createFileRoute } from "@tanstack/react-router";

const BASE_URL =
  (typeof process !== "undefined" && process.env.VITE_SITE_URL) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
  "https://www.muhammadhanan.tech";

const API_URL =
  (typeof process !== "undefined" && process.env.VITE_API_URL) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "http://127.0.0.1:5000";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
        ];

        try {
          const res = await fetch(`${API_URL}/api/public/projects`);
          if (res.ok) {
            const data: { slug: string; updated_at?: string }[] = await res.json();
            for (const row of data ?? []) {
              entries.push({
                path: `/projects/${row.slug}`,
                lastmod: row.updated_at ? new Date(row.updated_at).toISOString().slice(0, 10) : undefined,
                changefreq: "monthly",
                priority: "0.8",
              });
            }
          }
        } catch {
          // fall through with static entries
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
