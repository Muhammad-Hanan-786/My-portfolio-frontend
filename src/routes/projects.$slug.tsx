import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

import { getSiteContent } from "@/lib/public-content.functions";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { FadeIn } from "@/components/motion/primitives";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData({
      queryKey: ["site-content"],
      queryFn: () => getSiteContent(),
      staleTime: 5 * 60 * 1000,
    });
    const project = (data.projects as any[])?.find((p) => p.slug === params.slug) ?? null;
    if (!project) throw notFound();
    return { project, social: data.social, settings: data.settings };
  },
  head: ({ params, loaderData }) => {
    const p = (loaderData as any)?.project;
    const title = p ? `${p.title} — Muhammad Hanan` : "Project — Muhammad Hanan";
    const description = (p?.short_description || p?.description || "Case study by Muhammad Hanan — full stack and 3D web development.").slice(0, 158);
    const url = `https://muhammadhanan.tech/projects/${params.slug}`;
    const image = p?.cover_url || p?.thumbnail_url || null;
    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
    ];
    if (image) {
      meta.push({ property: "og:image", content: image });
      meta.push({ name: "twitter:image", content: image });
    }
    const scripts = p
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: p.title,
              description: p.description || p.short_description || undefined,
              url,
              image: image || undefined,
              keywords: Array.isArray(p.technologies) ? p.technologies.join(", ") : undefined,
              author: { "@type": "Person", name: "Muhammad Hanan" },
            }),
          },
        ]
      : undefined;
    return {
      meta,
      links: [{ rel: "canonical", href: url }],
      ...(scripts ? { scripts } : {}),
    };
  },
  component: ProjectDetail,
  pendingComponent: ProjectPending,
  notFoundComponent: ProjectMissing,
  errorComponent: ProjectMissing,
});

function ProjectPending() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col justify-between">
      <Nav />
      <main className="container-page pt-32 pb-24 flex-1">
        <div className="h-4 w-20 bg-surface rounded animate-pulse" />
        <div className="mt-8 h-10 w-2/3 bg-surface rounded-lg animate-pulse" />
        <div className="mt-4 h-6 w-1/2 bg-surface rounded animate-pulse" />
        <div className="mt-16 aspect-[16/9] w-full bg-surface rounded-3xl animate-pulse" />
      </main>
      <Footer social={[]} settings={{}} />
    </div>
  );
}

function ProjectMissing() {
  return (
    <div className="bg-background text-foreground">
      <Nav />
      <main className="container-page grid min-h-[60vh] place-items-center pt-32 pb-24 text-center">
        <div>
          <div className="text-eyebrow">404</div>
          <h1 className="mt-3 text-3xl font-semibold">Project not found</h1>
          <p className="mt-3 text-muted-foreground">
            This case study doesn&apos;t exist or was unpublished.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:border-border-strong"
          >
            <ArrowLeft className="size-4" /> Back home
          </Link>
        </div>
      </main>
    </div>
  );
}

function ProjectDetail() {
  const { project, social, settings } = Route.useLoaderData();



  return (
    <div className="bg-background text-foreground">
      <Nav />
      <main className="container-page pt-32 pb-24">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <FadeIn>
          <div className="mt-8 text-eyebrow">{project.category}</div>
          <h1 className="text-display text-gradient mt-4 max-w-[18ch]">{project.title}</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{project.description}</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-10 flex flex-wrap gap-3">
            {project.live_url ? (
              <a href={project.live_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">
                <ExternalLink className="size-4" /> Live
              </a>
            ) : null}
            {project.github_url ? (
              <a href={project.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium">
                <Github className="size-4" /> Source
              </a>
            ) : null}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="relative mt-16 aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/20 via-surface to-foreground/5">
            {project.cover_url || project.thumbnail_url ? (
              <>
                <img
                  src={project.cover_url || project.thumbnail_url}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
                />
                <img
                  src={project.cover_url || project.thumbnail_url}
                  alt={project.title}
                  className="absolute inset-0 h-full w-full object-contain"
                  loading="lazy"
                />
              </>
            ) : null}
          </div>
        </FadeIn>


        <div className="mt-16 grid gap-12 md:grid-cols-3">
          <FadeIn>
            <div className="text-eyebrow">Technologies</div>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {(project.technologies ?? []).map((t: string) => (
                <li key={t} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted-foreground">{t}</li>
              ))}
            </ul>
          </FadeIn>
          {project.problem ? (
            <FadeIn delay={0.05}>
              <div className="text-eyebrow">Problem</div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{project.problem}</p>
            </FadeIn>
          ) : null}
          {project.solution ? (
            <FadeIn delay={0.1}>
              <div className="text-eyebrow">Solution</div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{project.solution}</p>
            </FadeIn>
          ) : null}
        </div>
      </main>
      <Footer social={social as any} settings={settings} />
    </div>
  );
}
