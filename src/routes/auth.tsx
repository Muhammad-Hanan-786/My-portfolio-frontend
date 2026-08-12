import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { getAdminToken, setAdminToken } from "@/lib/auth-token";

function getApiUrl(): string {
  const envUrl = (import.meta.env.VITE_API_URL || "")?.replace(/\/$/, "");
  if (envUrl) return envUrl;
  if (typeof window !== "undefined" && !window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1")) {
    return "";
  }
  return "http://localhost:5000";
}
const API_URL = getApiUrl();

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const token = getAdminToken();
    if (token) {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          throw redirect({ to: "/admin" });
        }
      } catch (err) {
        if ((err as any)?.to) throw err;
      }
    }
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      setBusy(false);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }
      setAdminToken(data.token);
      navigate({ to: "/admin", replace: true });
    } catch (err: any) {
      setBusy(false);
      setError(err.message || "Failed to sign in");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8"
      >
        <div className="text-eyebrow">Admin</div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Restricted portal. Sign-ups are disabled.
        </p>

        <label className="mt-6 block">
          <span className="text-eyebrow">Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-ring"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-eyebrow">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-ring"
          />
        </label>

        {error ? (
          <div className="mt-4 text-sm text-destructive">{error}</div>
        ) : null}

        <button
          disabled={busy}
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
