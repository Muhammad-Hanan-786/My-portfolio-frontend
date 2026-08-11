import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  LogOut,
  ExternalLink,
  User,
  FolderGit2,
  Sparkles,
  Layers,
  Briefcase,
  GraduationCap,
  Award,
  Link2,
  Inbox,
  Settings as SettingsIcon,
  Search,
  Menu,
  X,
  Palette,
  FileText,
} from "lucide-react";

import { removeAdminToken } from "@/lib/auth-token";
import { verifyAdminToken } from "@/lib/admin.functions";
import { TableEditor } from "@/components/admin/TableEditor";
import { MessagesPanel } from "@/components/admin/MessagesPanel";
import { ThemePanel } from "@/components/admin/ThemePanel";
import { adminSchemas } from "@/lib/admin-schemas";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminHome,
});

type TabKey =
  | "hero"
  | "about"
  | "resume"
  | "projects"
  | "skills"
  | "technologies"
  | "services"
  | "experience"
  | "education"
  | "certificates"
  | "social_links"
  | "messages"
  | "settings"
  | "seo"
  | "theme";

const NAV: { key: TabKey; label: string; icon: any; group: string }[] = [
  { key: "hero", label: "Hero & Roles", icon: Sparkles, group: "Site" },
  { key: "about", label: "About", icon: User, group: "Site" },
  { key: "resume", label: "Resume Controls", icon: FileText, group: "Site" },
  { key: "theme", label: "Theme", icon: Palette, group: "Site" },
  { key: "settings", label: "Settings", icon: SettingsIcon, group: "Site" },
  { key: "seo", label: "SEO", icon: Search, group: "Site" },
  { key: "projects", label: "Projects", icon: FolderGit2, group: "Content" },
  { key: "skills", label: "Skills", icon: Layers, group: "Content" },
  { key: "technologies", label: "Tech Stack / Ticker", icon: Layers, group: "Content" },
  { key: "services", label: "Services", icon: Briefcase, group: "Content" },
  { key: "experience", label: "Experience", icon: Briefcase, group: "Journey" },
  { key: "education", label: "Education", icon: GraduationCap, group: "Journey" },
  { key: "certificates", label: "Certificates", icon: Award, group: "Journey" },
  { key: "social_links", label: "Social Links", icon: Link2, group: "Contact" },
  { key: "messages", label: "Messages", icon: Inbox, group: "Contact" },
];

function AdminHome() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-check"],
    queryFn: verifyAdminToken,
    staleTime: 60_000,
  });

  const [tab, setTab] = useState<TabKey>("hero");
  const [mobileOpen, setMobileOpen] = useState(false);

  function signOut() {
    removeAdminToken();
    navigate({ to: "/auth", replace: true });
  }

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-foreground">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!data?.isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
        <div className="max-w-sm text-center">
          <div className="text-eyebrow">Forbidden</div>
          <h1 className="mt-3 text-2xl font-semibold">Admin access required</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This account isn&apos;t authorized for the admin portal.
          </p>
          <button
            onClick={signOut}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            Sign out <LogOut className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  const groups = Array.from(new Set(NAV.map((n) => n.group)));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 hover:bg-surface md:hidden"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">Content Studio</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">
                {NAV.find((n) => n.key === tab)?.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:border-border-strong"
            >
              View site <ExternalLink className="size-3" />
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:border-border-strong"
            >
              <LogOut className="size-3" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            mobileOpen ? "block" : "hidden"
          } fixed inset-x-0 top-14 z-20 border-b border-border bg-background md:sticky md:top-14 md:block md:h-[calc(100vh-3.5rem)] md:w-64 md:border-b-0 md:border-r`}
        >
          <nav className="max-h-[calc(100vh-3.5rem)] space-y-6 overflow-y-auto p-4">
            {groups.map((g) => (
              <div key={g}>
                <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {g}
                </div>
                <ul className="space-y-0.5">
                  {NAV.filter((n) => n.group === g).map((n) => {
                    const Icon = n.icon;
                    const active = tab === n.key;
                    return (
                      <li key={n.key}>
                        <button
                          onClick={() => {
                            setTab(n.key);
                            setMobileOpen(false);
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                            active
                              ? "bg-surface text-foreground"
                              : "text-muted-foreground hover:bg-surface/60 hover:text-foreground"
                          }`}
                        >
                          <Icon className="size-4" />
                          {n.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-3xl">
            {tab === "messages" ? (
              <MessagesPanel />
            ) : tab === "theme" ? (
              <ThemePanel />
            ) : (
              <TableEditor schema={adminSchemas[tab]} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
