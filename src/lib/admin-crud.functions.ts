import { getAdminToken } from "@/lib/auth-token";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TABLES = [
  "hero",
  "about",
  "projects",
  "skills",
  "technologies",
  "services",
  "experience",
  "education",
  "certificates",
  "social_links",
  "contact_messages",
  "settings",
  "seo",
] as const;

export type AdminTable = (typeof TABLES)[number];

function getAuthHeader(dataToken?: string): string {
  const token = dataToken || getAdminToken();
  if (!token) throw new Error("Unauthorized: Missing token");
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
}

export async function adminList({ data }: { data: { table: string; token?: string } }) {
  const authHeader = getAuthHeader(data.token);
  const res = await fetch(`${API_URL}/api/admin/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({ table: data.table }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch list");
  }
  return await res.json();
}

export async function adminUpsert({ data }: { data: { table: string; row: Record<string, any>; token?: string } }) {
  const authHeader = getAuthHeader(data.token);
  const res = await fetch(`${API_URL}/api/admin/upsert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({ table: data.table, row: data.row }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to save record");
  }
  return await res.json();
}

export async function adminDelete({ data }: { data: { table: string; id: string; hard?: boolean; token?: string } }) {
  const authHeader = getAuthHeader(data.token);
  const res = await fetch(`${API_URL}/api/admin/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({ table: data.table, id: data.id, hard: data.hard }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete record");
  }
  return await res.json();
}
