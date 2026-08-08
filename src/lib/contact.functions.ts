import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  (typeof process !== "undefined" && process.env?.VITE_API_URL) ||
  (typeof process !== "undefined" && process.env?.API_URL) ||
  "http://localhost:5000";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(5000),
  // honeypot
  website: z.string().max(0).optional().or(z.literal("")),
});

export const submitContact = createServerFn({ method: "POST" })
  .validator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true };
    const res = await fetch(`${API_URL}/api/public/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Could not send message right now");
    }
    return { ok: true };
  });
