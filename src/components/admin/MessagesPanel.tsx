import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminList, adminUpsert, adminDelete } from "@/lib/admin-crud.functions";
import { getAdminToken } from "@/lib/auth-token";
import { Archive, CheckCircle2, Trash2, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

export function MessagesPanel() {
  const qc = useQueryClient();
  const list = adminList;
  const upsert = adminUpsert;
  const del = adminDelete;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-list", "contact_messages"],
    queryFn: () => list({ data: { table: "contact_messages", token: getAdminToken() || "" } }),
  });

  const update = useMutation({
    mutationFn: (row: any) => upsert({ data: { table: "contact_messages", row, token: getAdminToken() || "" } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-list", "contact_messages"] });
      toast.success("Updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { table: "contact_messages", id, hard: true, token: getAdminToken() || "" } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-list", "contact_messages"] });
      toast.success("Deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading)
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Loading messages…
      </div>
    );

  const rows = data ?? [];
  const unread = rows.filter((r: any) => r.status !== "read").length;

  return (
    <div>
      <div className="mb-6">
        <div className="text-eyebrow">Inbox</div>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Contact Messages</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {rows.length} total · {unread} unread
        </p>
      </div>
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-10 text-center text-sm text-muted-foreground">
          <Mail className="mx-auto mb-3 size-6 opacity-60" />
          No messages yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((m: any) => (
            <li
              key={m.id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-medium">
                    {m.name}{" "}
                    <a
                      href={`mailto:${m.email}`}
                      className="ml-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {m.email}
                    </a>
                  </div>
                  {m.subject ? (
                    <div className="mt-0.5 text-sm text-muted-foreground">{m.subject}</div>
                  ) : null}
                  <div className="mt-1 text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  {m.status === "read" ? (
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-muted-foreground">read</span>
                  ) : (
                    <span className="rounded-full bg-foreground/10 px-2 py-0.5">new</span>
                  )}
                  {m.replied ? (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-500">replied</span>
                  ) : null}
                  {m.archived ? (
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-muted-foreground">archived</span>
                  ) : null}
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {m.message}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                <button
                  onClick={() => update.mutate({ ...m, status: m.status === "read" ? "new" : "read" })}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:border-border-strong"
                >
                  <CheckCircle2 className="size-3.5" />
                  Mark {m.status === "read" ? "unread" : "read"}
                </button>
                <button
                  onClick={() => update.mutate({ ...m, replied: !m.replied })}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:border-border-strong"
                >
                  {m.replied ? "Unmark replied" : "Mark replied"}
                </button>
                <button
                  onClick={() => update.mutate({ ...m, archived: !m.archived })}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:border-border-strong"
                >
                  <Archive className="size-3.5" />
                  {m.archived ? "Unarchive" : "Archive"}
                </button>
                <a
                  href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject ?? "your message")}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background"
                >
                  Reply
                </a>
                <button
                  onClick={() => {
                    if (confirm("Delete this message permanently?")) remove.mutate(m.id);
                  }}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full p-1.5 text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
