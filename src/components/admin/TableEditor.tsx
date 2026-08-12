import { useMemo, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminList, adminUpsert, adminDelete } from "@/lib/admin-crud.functions";
import { getAdminToken } from "@/lib/auth-token";
import { Trash2, Plus, Save, Loader2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "boolean"
  | "date"
  | "url"
  | "image" // uploaded file stored as base64 data URL in a text column
  | "video" // uploaded video or video URL
  | "array" // text[] – comma separated
  | "json"; // jsonb


export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help?: string;
}

export interface TableSchema {
  table: string;
  label: string;
  singleton?: boolean; // one row only (hero, about)
  titleKey: string; // which field to show in the list
  subtitleKey?: string;
  fields: FieldDef[];
  defaults?: Record<string, any>;
  invalidateKeys?: string[][]; // extra query keys to invalidate after save
}

function toFormValue(value: any, type: FieldType): string | boolean {
  if (value === null || value === undefined) return type === "boolean" ? false : "";
  if (type === "boolean") return !!value;
  if (type === "array") return Array.isArray(value) ? value.join(", ") : String(value);
  if (type === "json") return typeof value === "string" ? value : JSON.stringify(value, null, 2);
  if (type === "date" && typeof value === "string") return value.slice(0, 10);
  return String(value);
}

function fromFormValue(raw: any, type: FieldType): any {
  if (type === "boolean") return !!raw;
  if (raw === "" || raw === null || raw === undefined) return null;
  if (type === "number") return Number(raw);
  if (type === "array") {
    return String(raw)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (type === "json") {
    try {
      return JSON.parse(String(raw));
    } catch {
      throw new Error(`Invalid JSON`);
    }
  }
  return raw;
}

export function TableEditor({ schema }: { schema: TableSchema }) {
  const qc = useQueryClient();
  const list = adminList;
  const upsert = adminUpsert;
  const del = adminDelete;

  const listQuery = useQuery({
    queryKey: ["admin-list", schema.table],
    queryFn: () => list({ data: { table: schema.table, token: getAdminToken() || "" } }),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });

  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  // Auto-select the single row for singletons
  useEffect(() => {
    if (schema.singleton && listQuery.data) {
      if (listQuery.data.length > 0) setEditingId(listQuery.data[0].id);
      else setEditingId("new");
    }
  }, [schema.singleton, listQuery.data]);

  const current = useMemo(() => {
    if (!editingId) return null;
    if (editingId === "new") return { ...(schema.defaults ?? {}) };
    return listQuery.data?.find((r: any) => r.id === editingId) ?? null;
  }, [editingId, listQuery.data, schema.defaults]);

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["admin-list", schema.table] });
    qc.invalidateQueries({ queryKey: ["site-content"] });
    (schema.invalidateKeys ?? []).forEach((k) => qc.invalidateQueries({ queryKey: k }));
  };

  const saveMut = useMutation({
    mutationFn: (row: Record<string, any>) => upsert({ data: { table: schema.table, row, token: getAdminToken() || "" } }),
    onSuccess: (saved: any) => {
      toast.success("Saved");
      invalidateAll();
      if (editingId === "new") setEditingId(saved?.id ?? null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => del({ data: { table: schema.table, id, token: getAdminToken() || "" } }),
    onSuccess: () => {
      toast.success("Deleted");
      setEditingId(null);
      invalidateAll();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (listQuery.isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Loading {schema.label}…
      </div>
    );
  }

  // Singleton view: just show the form
  if (schema.singleton) {
    if (!current) return null;
    return (
      <div>
        <SectionHead
          title={schema.label}
          description={`Edit the single ${schema.label.toLowerCase()} record.`}
        />
        <RowForm
          key={editingId ?? "new"}
          schema={schema}
          initial={current}
          saving={saveMut.isPending}
          onSubmit={(row) => saveMut.mutate(row)}
        />
      </div>
    );
  }

  // Multi-record list view
  if (editingId !== null) {
    return (
      <div>
        <button
          onClick={() => setEditingId(null)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" /> Back to {schema.label}
        </button>
        <SectionHead
          title={editingId === "new" ? `New ${schema.label}` : `Edit ${schema.label}`}
        />
        <RowForm
          key={editingId}
          schema={schema}
          initial={current ?? {}}
          saving={saveMut.isPending}
          onSubmit={(row) => saveMut.mutate(row)}
          onDelete={
            editingId !== "new"
              ? () => {
                  if (confirm("Delete this record?")) deleteMut.mutate(editingId as string);
                }
              : undefined
          }
          deleting={deleteMut.isPending}
        />
      </div>
    );
  }

  const rows = listQuery.data ?? [];
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <SectionHead title={schema.label} inline description={`${rows.length} item${rows.length === 1 ? "" : "s"}`} />
        <button
          onClick={() => setEditingId("new")}
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background"
        >
          <Plus className="size-3.5" /> New
        </button>
      </div>
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-10 text-center text-sm text-muted-foreground">
          Nothing here yet. Add your first {schema.label.toLowerCase().replace(/s$/, "")}.
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {rows.map((r: any) => (
            <li key={r.id} className="flex items-center justify-between gap-4 p-4 hover:bg-surface-2">
              <button
                onClick={() => setEditingId(r.id)}
                className="flex-1 text-left"
              >
                <div className="font-medium">{r[schema.titleKey] ?? "(untitled)"}</div>
                {schema.subtitleKey && r[schema.subtitleKey] ? (
                  <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{r[schema.subtitleKey]}</div>
                ) : null}
              </button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {r.is_active === false ? <span className="rounded-full bg-surface-2 px-2 py-0.5">draft</span> : null}
                {r.featured ? <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-foreground">featured</span> : null}
                <button
                  onClick={() => {
                    if (confirm("Delete this record?")) deleteMut.mutate(r.id);
                  }}
                  className="rounded-full p-1.5 hover:bg-surface-2 hover:text-foreground"
                  aria-label="Delete"
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

function SectionHead({ title, description, inline }: { title: string; description?: string; inline?: boolean }) {
  return (
    <div className={inline ? "" : "mb-6"}>
      <div className="text-eyebrow">CMS</div>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}

function RowForm({
  schema,
  initial,
  onSubmit,
  onDelete,
  saving,
  deleting,
}: {
  schema: TableSchema;
  initial: Record<string, any>;
  onSubmit: (row: Record<string, any>) => void;
  onDelete?: () => void;
  saving?: boolean;
  deleting?: boolean;
}) {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const v: Record<string, any> = { id: initial.id };
    schema.fields.forEach((f) => {
      v[f.key] = toFormValue(initial[f.key], f.type);
    });
    return v;
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const row: Record<string, any> = { id: initial.id };
      schema.fields.forEach((f) => {
        row[f.key] = fromFormValue(values[f.key], f.type);
      });
      onSubmit(row);
    } catch (err: any) {
      toast.error(err.message ?? "Invalid input");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {schema.fields.map((f) => (
        <div key={f.key}>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {f.label}
          </label>
          <FieldInput
            field={f}
            value={values[f.key]}
            onChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))}
          />
          {f.help ? <p className="mt-1 text-xs text-muted-foreground">{f.help}</p> : null}
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-border pt-5">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background disabled:opacity-60"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save
        </button>
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs text-muted-foreground hover:border-red-500/50 hover:text-red-500"
          >
            <Trash2 className="size-3.5" />
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: any;
  onChange: (v: any) => void;
}) {
  const base =
    "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border-strong";

  if (field.type === "boolean") {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={!!value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-foreground" : "bg-surface-2"}`}
      >
        <span
          className={`inline-block size-4 transform rounded-full bg-background transition-transform ${value ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    );
  }
  if (field.type === "textarea") {
    return (
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={4}
        className={base}
      />
    );
  }
  if (field.type === "json") {
    return (
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? "{}"}
        rows={8}
        spellCheck={false}
        className={`${base} font-mono text-xs`}
      />
    );
  }
  if (field.type === "image") {
    return <ImageUpload value={value} onChange={onChange} placeholder={field.placeholder} />;
  }
  if (field.type === "video") {
    return <VideoUpload value={value} onChange={onChange} placeholder={field.placeholder} />;
  }
  const inputType =
    field.type === "number"
      ? "number"
      : field.type === "date"
        ? "date"
        : field.type === "url"
          ? "url"
          : "text";
  return (
    <input
      type={inputType}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      className={base}
    />
  );
}

function ImageUpload({
  value,
  onChange,
  placeholder,
}: {
  value: any;
  onChange: (v: any) => void;
  placeholder?: string;
}) {
  const [busy, setBusy] = useState(false);
  const src = typeof value === "string" ? value : "";

  async function handleFile(file: File) {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image too large — max 3 MB. Try compressing it first.");
      return;
    }
    setBusy(true);
    try {
      // Downscale + convert to JPEG/webp data URL to keep DB rows small
      const dataUrl = await compressImage(file, 1600, 0.85);
      onChange(dataUrl);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to read image");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      {src ? (
        <div className="relative overflow-hidden rounded-xl border border-border bg-surface">
          <img src={src} alt="Preview" className="max-h-56 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur hover:bg-background"
          >
            Remove
          </button>
        </div>
      ) : null}
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface/60 px-4 py-6 text-sm text-muted-foreground hover:border-border-strong hover:text-foreground">
        {busy ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Processing…
          </>
        ) : (
          <>
            <Plus className="size-4" /> {src ? "Replace image" : "Upload image"}
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </label>
      <p className="text-xs text-muted-foreground">
        {placeholder ?? "PNG, JPG or WebP up to 3 MB. Auto-compressed."}
      </p>
    </div>
  );
}

async function compressImage(file: File, maxDim = 800, quality = 0.75): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");
  // Fill white background for JPEGs if PNG has transparency
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

function VideoUpload({
  value,
  onChange,
  placeholder,
}: {
  value: any;
  onChange: (v: any) => void;
  placeholder?: string;
}) {
  const [busy, setBusy] = useState(false);
  const src = typeof value === "string" ? value : "";

  function handleFile(file: File) {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Video file is too large — max 15 MB. For larger videos, paste a video URL below.");
      return;
    }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
      setBusy(false);
    };
    reader.onerror = () => {
      toast.error("Failed to read video file");
      setBusy(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-3">
      {src ? (
        <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-2">
          <video src={src} controls className="max-h-56 w-full rounded-lg object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur hover:bg-background"
          >
            Remove
          </button>
        </div>
      ) : null}
      
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface/60 px-4 py-4 text-sm text-muted-foreground hover:border-border-strong hover:text-foreground">
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Uploading video…
            </>
          ) : (
            <>
              <Plus className="size-4" /> {src ? "Replace video file" : "Upload video file"}
            </>
          )}
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">Or enter video URL directly:</span>
        <input
          type="text"
          value={src}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "https://example.com/video.mp4"}
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border-strong"
        />
      </div>
    </div>
  );
}

