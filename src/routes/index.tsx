import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { ArrowUpRight, Download, Mail, Sparkles, Github, Linkedin, Instagram, Facebook, Youtube, type LucideIcon } from "lucide-react";
import { useState, useMemo } from "react";

import { getSiteContent } from "@/lib/public-content.functions";
import { submitContact } from "@/lib/contact.functions";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CinematicLoader } from "@/components/site/Loader";
import bannerVideo from "@/assets/banner2.mp4.asset.json";
import { FadeIn, RevealText, Magnetic } from "@/components/motion/primitives";
import { ProjectsCarousel3D } from "@/components/site/ProjectsCarousel3D";
import { ServicesSection } from "@/components/site/ServicesSection";
import portrait from "@/assets/hanan-portrait.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muhammad Hanan — Full Stack & 3D Web Developer" },
      {
        name: "description",
        content:
          "Portfolio of Muhammad Hanan — React, TypeScript, Three.js, MongoDB. Modern 3D portfolio websites, dashboards, and full-stack apps.",
      },
      { property: "og:title", content: "Muhammad Hanan — Full Stack & 3D Web Developer" },
      {
        property: "og:description",
        content: "Modern 3D portfolio websites, dashboards, and full-stack apps.",
      },
      { property: "og:url", content: "https://www.muhammadhanan.tech/" },
    ],
    links: [{ rel: "canonical", href: "https://www.muhammadhanan.tech/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Muhammad Hanan",
          jobTitle: "Full Stack & 3D Web Developer",
          url: "https://www.muhammadhanan.tech",
          sameAs: [
            "https://github.com/muhammadhanan1069",
            "https://www.linkedin.com/in/muhammadhanan1069",
          ],
        }),
      },
    ],
  }),
  loader: async ({ context }: { context: any }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["site-content"],
      queryFn: () => getSiteContent(),
      staleTime: 5 * 60 * 1000,
    });
  },
  component: Home,
});

const socialIcons: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  mail: Mail,
};

function Home() {
  const { data } = useQuery({
    queryKey: ["site-content"],
    queryFn: () => getSiteContent(),
    staleTime: 5 * 60 * 1000,
  });

  const d = data ?? { hero: null, about: null, projects: [], skills: [], technologies: [], services: [], experience: [], education: [], certificates: [], social: [], seo: null, settings: {} };

  return (
    <div className="bg-background text-foreground">
      <CinematicLoader />
      <Nav />
      <main>
        <Hero data={d} />
        <Marquee data={d} />
        <About data={d} />
        <FeaturedProjects data={d} />
        <Services data={d} />
        <Skills data={d} />
        <Experience data={d} />
        <Education data={d} />
        <Certificates data={d} />
        <Contact />
      </main>
      <Footer social={d.social as any} settings={d.settings} />
    </div>
  );
}

function Experience({ data }: { data: any }) {
  const items: any[] = data.experience ?? [];
  if (!items.length) return null;
  return (
    <section id="experience" className="container-page py-20 md:py-32">
      <SectionHeader eyebrow="Experience" title="A timeline of shipped work." />
      <ol className="relative mt-12 md:mt-16 border-l border-border pl-8">
        {items.map((e, i) => (
          <FadeIn key={e.id} delay={i * 0.04} className="relative mb-10 last:mb-0">
            <span className="absolute -left-[33px] top-2 grid size-4 place-items-center rounded-full border border-border-strong bg-background">
              <span className="size-1.5 rounded-full bg-foreground" />
            </span>
            <div className="text-eyebrow">
              {formatDate(e.start_date)} — {e.end_date ? formatDate(e.end_date) : "Present"}
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">{e.role}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {e.company}
              {e.location ? ` · ${e.location}` : ""}
              {e.employment_type ? ` · ${e.employment_type}` : ""}
            </div>
            {e.description ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.description}</p>
            ) : null}
            {(e.achievements ?? []).length ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {e.achievements.map((a: string, idx: number) => <li key={idx}>{a}</li>)}
              </ul>
            ) : null}
            {(e.technologies ?? []).length ? (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {e.technologies.map((t: string) => (
                  <li key={t} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted-foreground">{t}</li>
                ))}
              </ul>
            ) : null}
          </FadeIn>
        ))}
      </ol>
    </section>
  );
}

function Education({ data }: { data: any }) {
  const items: any[] = data.education ?? [];
  if (!items.length) return null;
  return (
    <section id="education" className="container-page py-20 md:py-32">
      <SectionHeader eyebrow="Education" title="Academic foundation." />
      <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-2">
        {items.map((e, i) => (
          <FadeIn key={e.id} delay={i * 0.05}>
            <div className="h-full rounded-3xl border border-border bg-surface p-7">
              <div className="flex items-start gap-4">
                {e.logo_url ? (
                  <img
                    src={e.logo_url}
                    alt={`${e.institution} logo`}
                    loading="lazy"
                    className="h-14 w-14 flex-shrink-0 rounded-xl border border-border bg-background object-contain p-1.5"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="text-eyebrow">
                    {formatDate(e.start_date)} — {e.end_date ? formatDate(e.end_date) : "Present"}
                  </div>
                  <div className="mt-2 text-xl font-semibold tracking-tight">{e.degree}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {e.institution}{e.field_of_study ? ` · ${e.field_of_study}` : ""}
                  </div>
                </div>
              </div>
              {e.description ? (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{e.description}</p>
              ) : null}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function Certificates({ data }: { data: any }) {
  const items: any[] = data.certificates ?? [];
  if (!items.length) return null;
  return (
    <section id="certificates" className="container-page py-20 md:py-32">
      <SectionHeader eyebrow="Certifications" title="Verified credentials." />
      <div className="mt-12 md:mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c, i) => (
          <FadeIn key={c.id} delay={i * 0.03}>
            <div className="h-full rounded-2xl border border-border bg-surface p-6">
              <div className="text-eyebrow">{c.issuer ?? "Issuer"}</div>
              <div className="mt-2 text-lg font-medium">{c.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {c.issue_date ? formatDate(c.issue_date) : ""}
              </div>
              {c.credential_url ? (
                <a
                  href={c.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  Verify <ArrowUpRight className="size-3" />
                </a>
              ) : null}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function formatDate(d?: string | null) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function Hero({ data }: { data: any }) {
  const hero = data.hero ?? {};
  const about = data.about ?? {};
  const settings = data.settings ?? {};
  const roles: string[] = hero.roles ?? [];
  const stats: { label: string; value: string }[] = hero.stats ?? [];
  const availability = settings.availability_status ?? hero.availability_status ?? "Available for work";
  const resumeUrl = settings.resume_url ?? hero.secondary_cta_url ?? "#contact";

  const isImageBanner = about.banner_media_type === "image" || (about.banner_image_url && !about.banner_video_url);
  const bannerImgSrc = about.banner_image_url;
  const bannerVideoSrc = about.banner_video_url || bannerVideo.url;

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden pt-28 md:pt-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/80 via-background/40 to-background">
        {isImageBanner && bannerImgSrc ? (
          <img
            src={bannerImgSrc}
            alt="Banner"
            className="absolute inset-0 h-full w-full object-cover [object-position:85%_center] md:[object-position:center]"
          />
        ) : (
          <video
            src={bannerVideoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
            onError={(e) => {
              (e.currentTarget as HTMLVideoElement).style.display = "none";
            }}
            className="absolute inset-0 h-full w-full object-cover [object-position:85%_center] md:[object-position:center]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />
      </div>

      <div className="container-page">
        <div className="max-w-4xl">
          <FadeIn delay={0.2}>
            <div className="text-eyebrow flex items-center gap-2">
              <Sparkles className="size-3" />
              <span>{availability}</span>
            </div>
          </FadeIn>

          <h1 className="text-display text-gradient mt-6 max-w-[14ch]">
            <RevealText text={hero.name || "Muhammad Hanan"} delay={0.3} />
          </h1>

          <FadeIn delay={0.7} className="mt-8 max-w-2xl">
            <p className="text-lg leading-relaxed text-muted-foreground">{hero.headline || hero.description}</p>
          </FadeIn>

          <FadeIn delay={0.85} className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
              >
                {hero.primary_cta_label ?? "Explore My Work"}
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
            <a
              href={resumeUrl}
              className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-medium transition-colors hover:bg-surface"
            >
              <Download className="size-4" />
              {hero.secondary_cta_label ?? "Download Resume"}
            </a>
          </FadeIn>

          <FadeIn delay={1} className="mt-12 flex flex-wrap items-center gap-3">
            {roles.map((r) => (
              <span
                key={r}
                className="rounded-full border border-border bg-glass px-3 py-1 text-xs text-muted-foreground"
              >
                {r}
              </span>
            ))}
          </FadeIn>
        </div>
      </div>

      <div className="container-page">
        <FadeIn delay={1.1} className="mt-12 md:mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface px-4 py-5 md:px-5 md:py-6">
              <div className="text-2xl md:text-3xl font-semibold tracking-tight">{s.value}</div>
              <div className="mt-1 text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}

function PortraitCard({ profileImageUrl }: { profileImageUrl?: string | null }) {
  const imgSrc = profileImageUrl || portrait.url;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[360px] sm:max-w-[420px]"
    >
      {/* Animated gradient aura */}
      <motion.div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] opacity-70 blur-3xl"
        style={{
          background:
            "conic-gradient(from 0deg, oklch(0.7 0.18 30), oklch(0.65 0.2 300), oklch(0.75 0.15 200), oklch(0.7 0.18 30))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      />

      {/* Gradient border frame */}
      <div className="relative rounded-[1.75rem] p-[1.5px] bg-[linear-gradient(135deg,oklch(0.75_0.18_30_/_0.9),oklch(0.6_0.2_290_/_0.7),oklch(0.7_0.15_200_/_0.9))]">
        <div className="relative overflow-hidden rounded-[1.7rem] bg-surface">
          {/* Portrait */}
          <motion.img
            src={imgSrc}
            alt="Muhammad Hanan"
            className="block aspect-[4/5] w-full object-cover object-[50%_30%]"
            initial={{ scale: 1.15, filter: "grayscale(100%) brightness(0.7) contrast(1.1)" }}
            animate={{ scale: 1, filter: "grayscale(0%) brightness(1) contrast(1)" }}
            transition={{ duration: 1.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            draggable={false}
          />

          {/* Sweeping color-grade overlay (before → after) */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-color"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.2 30 / 0.55), oklch(0.55 0.22 290 / 0.35) 55%, transparent 80%)",
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.6, delay: 1.2, ease: "easeOut" }}
          />

          {/* Shine sweep */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/25 to-transparent"
            initial={{ x: "-40%" }}
            animate={{ x: "420%" }}
            transition={{ duration: 1.4, delay: 1.4, ease: "easeInOut" }}
          />

          {/* Bottom fade for readability */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/70 to-transparent" />

          {/* Signature chip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.9 }}
            className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-full border border-border/60 bg-background/40 px-4 py-2 backdrop-blur-md"
          >
            <span className="text-xs font-medium tracking-wide">Muhammad Hanan</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{"\n"}</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function Marquee({ data }: { data: any }) {
  const defaultTechs = [
    { id: "1", name: "CSS" },
    { id: "2", name: "Three.js" },
    { id: "3", name: "React Three Fiber" },
    { id: "4", name: "Framer Motion" },
    { id: "5", name: "GSAP" },
    { id: "6", name: "Vite" },
    { id: "7", name: "GitHub" },
    { id: "8", name: "PostgreSQL" },
  ];
  const techs: any[] = data.technologies?.length ? data.technologies : defaultTechs;
  const items = [...techs, ...techs];
  return (
    <section className="relative border-y border-border bg-surface/60 py-6">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <motion.div
          className="flex w-max gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 38, ease: "linear", repeat: Infinity }}
        >
          {items.map((t, i) => (
            <span key={`${t.id || t.name}-${i}`} className="text-2xl font-medium text-muted-foreground">
              {t.name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="max-w-3xl">
      <FadeIn>
        <div className="text-eyebrow">{eyebrow}</div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h2 className="text-display-lg text-gradient mt-4">{title}</h2>
      </FadeIn>
      {intro ? (
        <FadeIn delay={0.2}>
          <p className="mt-6 text-lg text-muted-foreground">{intro}</p>
        </FadeIn>
      ) : null}
    </div>
  );
}

function About({ data }: { data: any }) {
  const a = data.about ?? {};
  return (
    <section id="about" className="container-page py-20 md:py-32">
      <div className="grid gap-10 md:gap-12 md:grid-cols-[1.4fr_1fr] md:items-start">
        <div className="order-2 md:order-1">
          <SectionHeader eyebrow="About" title="A developer who treats craft like engineering." intro={a.biography} />
          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            <FadeIn>
              <div className="text-eyebrow">Story</div>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{a.story}</p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="text-eyebrow">Mission</div>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{a.mission}</p>
              <div className="mt-8 text-eyebrow">Vision</div>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{a.vision}</p>
            </FadeIn>
          </div>
        </div>
        <div className="order-1 md:order-2 md:sticky md:top-28">
          <PortraitCard profileImageUrl={a.profile_image_url} />
        </div>
      </div>
    </section>
  );
}

function FeaturedProjects({ data }: { data: any }) {
  const projects: any[] = (data.projects ?? []).filter((p: any) => p.featured);
  return (
    <section id="work" className="container-page py-20 md:py-32">
      <SectionHeader eyebrow="Selected Work" title="Featured projects." intro="Production systems shipped with care — swipe, click, or use arrow keys to explore." />
      <ProjectsCarousel3D projects={projects} />
    </section>
  );
}

function Skills({ data }: { data: any }) {
  const skills: any[] = data.skills ?? [];
  const grouped = useMemo(() => {
    const m = new Map<string, any[]>();
    skills.forEach((s) => {
      if (!m.has(s.category)) m.set(s.category, []);
      m.get(s.category)!.push(s);
    });
    return Array.from(m.entries());
  }, [skills]);

  return (
    <section id="skills" className="container-page py-20 md:py-32">
      <SectionHeader eyebrow="Capabilities" title="Skills, grouped honestly." />
      <div className="mt-12 md:mt-16 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
        {grouped.map(([cat, items]: [string, any[]]) => (
          <FadeIn key={cat} className="bg-surface p-7">
            <div className="text-eyebrow">{cat}</div>
            <ul className="mt-4 space-y-2">
              {items.map((s: any) => (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <span>{s.name}</span>
                  <span className="text-muted-foreground">{s.experience_level ?? ""}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function Services({ data }: { data: any }) {
  return <ServicesSection data={data} />;
}

const EMAILJS_SERVICE_ID = "service_ix0glgq";
const EMAILJS_TEMPLATE_ID = "template_8nn3a4y";
const EMAILJS_PUBLIC_KEY = "QxsQi6kuxvsdpnTk5";

function Contact() {
  const submit = useServerFn(submitContact);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const m = useMutation({
    mutationFn: async (vars: typeof form) => {
      // Save to DB (source of truth for admin inbox)
      await submit({ data: vars });
      // Fire off EmailJS notification to owner's Gmail (best-effort)
      if (!vars.website) {
        const emailjs = (await import("@emailjs/browser")).default;
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: vars.name,
            from_email: vars.email,
            reply_to: vars.email,
            subject: vars.subject || "New message from portfolio",
            message: vars.message,
          },
          { publicKey: EMAILJS_PUBLIC_KEY },
        ).catch((err: unknown) => {
          console.error("EmailJS send failed", err);
        });
      }
      return { ok: true };
    },
  });


  return (
    <section id="contact" className="container-page py-20 md:py-32">
      <div className="grid gap-10 md:gap-16 md:grid-cols-[1.1fr_1fr]">
        <div>
          <SectionHeader eyebrow="Contact" title="Got a project? Let's make it." intro="Tell me a little about what you're building. I read every message." />
        </div>
        <FadeIn delay={0.1}>
          {m.isSuccess ? (
            <div className="rounded-3xl border border-border bg-surface p-8">
              <div className="text-eyebrow">Sent</div>
              <div className="mt-3 text-2xl font-semibold">Thanks — I&apos;ll be in touch shortly.</div>
            </div>
          ) : (
            <form
              className="space-y-4 rounded-3xl border border-border bg-surface p-8"
              onSubmit={(e) => {
                e.preventDefault();
                m.mutate(form);
              }}
            >
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
              />
              <Field label="Name">
                <input
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-ring"
                />
              </Field>
              <Field label="Email">
                <input
                  required
                  type="email"
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-ring"
                />
              </Field>
              <Field label="Subject">
                <input
                  maxLength={200}
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-ring"
                />
              </Field>
              <Field label="Message">
                <textarea
                  required
                  maxLength={5000}
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-ring"
                />
              </Field>
              {m.isError ? (
                <div className="text-sm text-destructive">Could not send. Try again.</div>
              ) : null}
              <button
                disabled={m.isPending}
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background disabled:opacity-60"
              >
                {m.isPending ? "Sending…" : "Send message"}
                <ArrowUpRight className="size-4" />
              </button>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-eyebrow">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
