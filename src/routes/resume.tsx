import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Printer, Download, ArrowLeft, Mail, Globe, Github, Linkedin, MapPin } from "lucide-react";
import { motion } from "framer-motion";

import { getSiteContent } from "@/lib/public-content.functions";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume — Muhammad Hanan" },
      { name: "description", content: "Resume of Muhammad Hanan — Full Stack & 3D Web Developer. Skills, education, experience and certifications." },
      { property: "og:title", content: "Resume — Muhammad Hanan" },
      { property: "og:description", content: "Full Stack & 3D Web Developer — skills, experience and education." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.muhammadhanan.tech/resume" }],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["site-content"],
      queryFn: () => getSiteContent(),
      staleTime: 5 * 60 * 1000,
    });
  },
  component: ResumePage,
  pendingComponent: ResumePending,
});

function ResumePending() {
  return (
    <main className="min-h-screen bg-muted/30 py-8 md:py-14">
      <div className="container-page mx-auto max-w-[900px] rounded-2xl bg-background p-8 md:p-14 shadow-xl ring-1 ring-border animate-pulse space-y-6">
        <div className="h-10 w-1/3 bg-surface rounded-lg" />
        <div className="h-4 w-1/4 bg-surface rounded" />
        <div className="h-32 w-full bg-surface rounded-xl mt-8" />
      </div>
    </main>
  );
}

function fmtDate(d?: string | null) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

function ResumePage() {
  const { data } = useQuery({
    queryKey: ["site-content"],
    queryFn: () => getSiteContent(),
    staleTime: 60_000,
  });

  const d = (data ?? { hero: null, about: null, resume: null, projects: [], skills: [], technologies: [], services: [], experience: [], education: [], certificates: [], social: [], seo: null, settings: {} }) as any;
  const r = d.resume ?? {};

  const name = r.full_name || d.hero?.name || "Muhammad Hanan";
  const roles: string[] = (r.title_roles && r.title_roles.length > 0) ? r.title_roles : (d.hero?.roles?.length ? d.hero.roles : ["Full Stack Developer", "3D Web Developer"]);
  const summary = r.summary || d.about?.biography || d.hero?.description || "";
  const email = r.email || d.settings?.email || "muhammadhanan1069@gmail.com";
  const phone = r.phone || d.settings?.phone || "+92 318 7300630";
  const location = r.location || d.settings?.location || "Pakistan";
  const website = r.website_url || d.settings?.website || "https://www.muhammadhanan.tech";
  const pdfUrl = r.pdf_url || d.settings?.resume_url;

  const social: Array<{ platform: string; url: string }> = d.social ?? [];
  const github = r.github_url || social.find((s) => s.platform?.toLowerCase() === "github")?.url;
  const linkedin = r.linkedin_url || social.find((s) => s.platform?.toLowerCase() === "linkedin")?.url;

  const showSummary = r.show_summary ?? true;
  const showSkills = r.show_skills ?? true;
  const showTechStack = r.show_tech_stack ?? true;
  const showExperience = r.show_experience ?? true;
  const showProjects = r.show_projects ?? true;
  const showEducation = r.show_education ?? true;
  const showCertificates = r.show_certificates ?? true;

  // Read section content directly from Resume Controls (r.resume_*) or fallback to site content
  const rawSkills: any[] = (r.resume_skills && r.resume_skills.length > 0) ? r.resume_skills : (d.skills ?? []);
  const skillsByCategory = rawSkills.reduce((acc: Record<string, any[]>, s: any) => {
    const c = s.category || "Other";
    (acc[c] ||= []).push(s);
    return acc;
  }, {});

  const technologies: any[] = (r.resume_tech_stack && r.resume_tech_stack.length > 0)
    ? r.resume_tech_stack.map((t: string, i: number) => ({ id: i, name: t }))
    : (d.technologies ?? []);
  const experience: any[] = (r.resume_experience && r.resume_experience.length > 0) ? r.resume_experience : (d.experience ?? []);
  const education: any[] = (r.resume_education && r.resume_education.length > 0) ? r.resume_education : (d.education ?? []);
  const certificates: any[] = (r.resume_certificates && r.resume_certificates.length > 0) ? r.resume_certificates : (d.certificates ?? []);
  const projects: any[] = (r.resume_projects && r.resume_projects.length > 0) ? r.resume_projects : (d.projects ?? []).filter((p: any) => p.is_active !== false);

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      window.print();
    }
  };

  const summaryTitle = r.summary_title || "Summary";
  const skillsTitle = r.skills_title || "Skills";
  const techStackTitle = r.tech_stack_title || "Tech Stack";
  const experienceTitle = r.experience_title || "Experience";
  const projectsTitle = r.projects_title || "Selected Projects";
  const educationTitle = r.education_title || "Education";
  const certificatesTitle = r.certificates_title || "Certifications";

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-page { box-shadow: none !important; margin: 0 !important; max-width: none !important; }
          body { background: white !important; }
          .print-break-inside-avoid { break-inside: avoid; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="container-page flex items-center justify-between py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to portfolio
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm hover:bg-surface-2"
            >
              <Printer className="size-4" /> Print
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:scale-[1.02] transition-transform"
            >
              <Download className="size-4" /> Save as PDF
            </button>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-muted/30 py-8 md:py-14">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="print-page container-page mx-auto max-w-[900px] rounded-2xl bg-background p-8 md:p-14 shadow-xl ring-1 ring-border"
        >
          {/* Header */}
          <header className="border-b border-border pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">{name}</h1>
                <p className="mt-2 text-lg text-muted-foreground">{roles.join(" · ")}</p>
              </div>
              <div className="text-sm text-muted-foreground space-y-1 md:text-right">
                {email && (
                  <div className="flex items-center gap-2 md:justify-end">
                    <Mail className="size-3.5" /> <a href={`mailto:${email}`} className="hover:text-foreground">{email}</a>
                  </div>
                )}
                {phone && <div className="md:text-right">{phone}</div>}
                {location && (
                  <div className="flex items-center gap-2 md:justify-end">
                    <MapPin className="size-3.5" /> {location}
                  </div>
                )}
                {website && (
                  <div className="flex items-center gap-2 md:justify-end">
                    <Globe className="size-3.5" /> <a href={website} target="_blank" rel="noreferrer" className="hover:text-foreground">{website.replace(/^https?:\/\//, "")}</a>
                  </div>
                )}
                <div className="flex items-center gap-3 md:justify-end pt-1">
                  {github && (
                    <a href={github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
                      <Github className="size-3.5" /> GitHub
                    </a>
                  )}
                  {linkedin && (
                    <a href={linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
                      <Linkedin className="size-3.5" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Summary */}
          {showSummary && summary && (
            <Section title={summaryTitle}>
              <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
            </Section>
          )}

          {/* Skills */}
          {showSkills && Object.keys(skillsByCategory).length > 0 && (
            <Section title={skillsTitle}>
              <div className="space-y-3">
                {Object.entries(skillsByCategory).map(([cat, list]) => (
                  <div key={cat} className="print-break-inside-avoid grid grid-cols-[140px_1fr] gap-4 items-start">
                    <div className="text-xs font-semibold uppercase tracking-wider text-foreground/70">{cat}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(list as any[]).map((s: any) => (
                        <span
                          key={s.id}
                          className="rounded-md border border-border bg-surface px-2 py-0.5 text-xs"
                        >
                          {s.name}
                          {s.experience_level ? <span className="text-muted-foreground"> · {s.experience_level}</span> : null}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Tech Stack */}
          {showTechStack && technologies.length > 0 && (
            <Section title={techStackTitle}>
              <div className="flex flex-wrap gap-1.5">
                {technologies.map((t) => (
                  <span key={t.id} className="rounded-md bg-surface px-2 py-0.5 text-xs border border-border">
                    {t.name}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Experience */}
          {showExperience && experience.length > 0 && (
            <Section title={experienceTitle}>
              <div className="space-y-5">
                {experience.map((e) => (
                  <div key={e.id} className="print-break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold">{e.role}</h3>
                        <div className="text-sm text-muted-foreground">{e.company}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {fmtDate(e.start_date)} — {e.current ? "Present" : fmtDate(e.end_date)}
                      </div>
                    </div>
                    {e.description && <p className="mt-1.5 text-sm text-muted-foreground">{e.description}</p>}
                    {Array.isArray(e.achievements) && e.achievements.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {e.achievements.map((a: string, i: number) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    )}
                    {Array.isArray(e.skills_used) && e.skills_used.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {e.skills_used.map((s: string) => (
                          <span key={s} className="rounded bg-surface px-1.5 py-0.5 text-[11px] text-muted-foreground border border-border">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Projects */}
          {showProjects && projects.length > 0 && (
            <Section title={projectsTitle}>
              <div className="space-y-4">
                {projects.map((p) => (
                  <div key={p.id} className="print-break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-base font-semibold">{p.title}</h3>
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground">
                          {p.live_url.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                    </div>
                    {p.short_description && (
                      <p className="mt-1 text-sm text-muted-foreground">{p.short_description}</p>
                    )}
                    {Array.isArray(p.technologies) && p.technologies.length > 0 && (
                      <div className="mt-1.5 text-xs text-muted-foreground">
                        {p.technologies.join(" · ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Education */}
          {showEducation && education.length > 0 && (
            <Section title={educationTitle}>
              <div className="space-y-4">
                {education.map((e) => (
                  <div key={e.id} className="print-break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold">{e.degree || e.institution}</h3>
                        {e.degree && <div className="text-sm text-muted-foreground">{e.institution}</div>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {fmtDate(e.start_date)} — {fmtDate(e.end_date) || "Present"}
                      </div>
                    </div>
                    {e.description && <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>}
                    {Array.isArray(e.achievements) && e.achievements.length > 0 && (
                      <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-sm text-muted-foreground">
                        {e.achievements.map((a: string, i: number) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Certifications */}
          {showCertificates && certificates.length > 0 && (
            <Section title={certificatesTitle}>
              <ul className="space-y-2">
                {certificates.map((c) => (
                  <li key={c.id} className="print-break-inside-avoid flex flex-wrap items-baseline justify-between gap-2 text-sm">
                    <div>
                      <span className="font-medium">{c.name}</span>
                      {c.organization && <span className="text-muted-foreground"> — {c.organization}</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {fmtDate(c.issue_date)}
                      {c.credential_url && (
                        <>
                          {" · "}
                          <a href={c.credential_url} target="_blank" rel="noreferrer" className="hover:text-foreground">Credential</a>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </motion.article>
      </main>

      <div className="no-print">
        <Footer social={d.social ?? []} settings={d.settings ?? {}} />
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 print-break-inside-avoid">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70 pb-2 border-b border-border mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}
