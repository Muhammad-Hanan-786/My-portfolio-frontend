import { getAdminToken } from "@/lib/auth-token";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
