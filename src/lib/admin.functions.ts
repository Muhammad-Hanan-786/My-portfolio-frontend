import { getAdminToken } from "@/lib/auth-token";

function getApiUrl(): string {
  const envUrl = (import.meta.env.VITE_API_URL || "")?.replace(/\/$/, "");
  if (envUrl) return envUrl;
  if (typeof window !== "undefined" && !window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1")) {
    return "";
  }
  return "http://localhost:5000";
}
const API_URL = getApiUrl();

export async function verifyAdminToken(): Promise<{ isAdmin: boolean; email?: string }> {
  const token = getAdminToken();
  if (!token) return { isAdmin: false };
  try {
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: authHeader },
    });
    if (!res.ok) return { isAdmin: false };
    const data = await res.json();
    return { isAdmin: !!data.isAdmin, email: data.email };
  } catch {
    return { isAdmin: false };
  }
}
