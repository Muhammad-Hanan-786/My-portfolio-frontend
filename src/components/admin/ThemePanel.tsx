import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { THEMES, getTheme } from "@/lib/themes";
import { adminList, adminUpsert } from "@/lib/admin-crud.functions";
import { getAdminToken } from "@/lib/auth-token";

export function ThemePanel() {
  const [current, setCurrent] = useState<string>("default");
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchList = adminList;
  const saveSetting = adminUpsert;

  useEffect(() => {
    (async () => {
      try {
        const rows: any[] = await fetchList({ data: { table: "settings", token: getAdminToken() || "" } });
        const pub = rows.find((r) => r.key === "public");
        const id = pub?.value?.theme ?? "default";
        setCurrent(id);
      } catch (err) {
        console.error("Theme load error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function apply(id: string) {
    if (id === current) return;
    setSaving(id);
    try {
      const rows: any[] = await fetchList({ data: { table: "settings", token: getAdminToken() || "" } });
      const pub = rows.find((r) => r.key === "public");
      const newValue = { ...(pub?.value || {}), theme: id };

      await saveSetting({
        data: {
          table: "settings",
          row: {
            id: pub?.id,
            key: "public",
            value: newValue,
          },
          token: getAdminToken() || "",
        },
      });

      setCurrent(id);
      try {
        localStorage.setItem("portfolio.theme", id);
      } catch {}
      window.dispatchEvent(new CustomEvent("portfolio:theme-changed", { detail: id }));
      toast.success(`Applied "${getTheme(id).label}"`);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update theme");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Color Theme</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a palette. It applies instantly across the whole site for every visitor.
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading current theme…</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((t) => {
            const active = current === t.id;
            const isSaving = saving === t.id;
            return (
              <button
                key={t.id}
                onClick={() => apply(t.id)}
                disabled={isSaving}
                className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
                  active
                    ? "border-primary ring-2 ring-primary/40"
                    : "border-border hover:border-border-strong"
                }`}
              >
                <div className="flex h-16 overflow-hidden rounded-lg">
                  {t.colors.map((c, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{t.label}</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {t.mode}
                    </div>
                  </div>
                  {isSaving ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  ) : active ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                      <Check className="size-3" /> Active
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
