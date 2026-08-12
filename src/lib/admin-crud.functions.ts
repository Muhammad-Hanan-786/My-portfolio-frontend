import { getAdminToken } from "@/lib/auth-token";

export function getApiUrl(): string {
  const envUrl = (import.meta.env.VITE_API_URL || "")?.replace(/\/$/, "");
  if (envUrl) return envUrl;
  if (typeof window !== "undefined" && !window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1")) {
    return "";
  }
  return "http://localhost:5000";
}

function getAuthHeader(dataToken?: string): string {
  const token = dataToken || getAdminToken();
  if (!token) throw new Error("Unauthorized: Missing admin session token");
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
}

export async function adminList({ data }: { data: { table: string; token?: string } }) {
  const authHeader = getAuthHeader(data.token);
  const url = `${getApiUrl()}/api/admin/list`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ table: data.table }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let json: any = {};
      try { json = JSON.parse(text); } catch {}
      throw new Error(json.error || `HTTP ${res.status}: Failed to fetch list`);
    }
    return await res.json();
  } catch (err: any) {
    console.error("[adminList error]", err);
    throw new Error(err.message || "Failed to fetch list");
  }
}

export async function adminUpsert({ data }: { data: { table: string; row: Record<string, any>; token?: string } }) {
  const authHeader = getAuthHeader(data.token);
  const url = `${getApiUrl()}/api/admin/upsert`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ table: data.table, row: data.row }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let json: any = {};
      try { json = JSON.parse(text); } catch {}
      throw new Error(json.error || `HTTP ${res.status}: Failed to save record`);
    }
    return await res.json();
  } catch (err: any) {
    console.error("[adminUpsert error]", err);
    throw new Error(err.message || "Failed to save record");
  }
}

export async function adminDelete({ data }: { data: { table: string; id: string; hard?: boolean; token?: string } }) {
  const authHeader = getAuthHeader(data.token);
  const url = `${getApiUrl()}/api/admin/delete`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ table: data.table, id: data.id, hard: data.hard }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let json: any = {};
      try { json = JSON.parse(text); } catch {}
      throw new Error(json.error || `HTTP ${res.status}: Failed to delete record`);
    }
    return await res.json();
  } catch (err: any) {
    console.error("[adminDelete error]", err);
    throw new Error(err.message || "Failed to delete record");
  }
}
