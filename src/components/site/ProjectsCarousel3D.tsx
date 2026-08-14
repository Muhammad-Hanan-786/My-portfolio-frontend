import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type Project = {
  id: string;
  slug: string;
  title: string;
  category?: string;
  short_description?: string;
  technologies?: string[];
  cover_image_url?: string;
  cover_url?: string;
  thumbnail_url?: string;
  live_url?: string;
  status?: string;
  in_progress?: boolean;
};


export function ProjectsCarousel3D({ projects }: { projects: Project[] }) {
  const [index, setIndex] = useState(0);
  const total = projects.length;
  const reduce = useReducedMotion();
  const dragging = useRef(false);
  const startX = useRef(0);

  const go = useCallback(
    (delta: number) => {
      if (!total) return;
      setIndex((i) => (i + delta + total) % total);
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const items = useMemo(() => projects, [projects]);

  if (!total) return null;

  return (
    <div className="relative mt-10 md:mt-16 select-none">
      <div
        className="relative mx-auto flex h-[340px] w-full items-center justify-center sm:h-[440px] md:h-[520px]"
        style={{ perspective: "1600px" }}
        onPointerDown={(e) => {
          dragging.current = true;
          startX.current = e.clientX;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        }}
        onPointerUp={(e) => {
          if (!dragging.current) return;
          dragging.current = false;
          const dx = e.clientX - startX.current;
          if (dx > 40) go(-1);
          else if (dx < -40) go(1);
        }}
        onPointerCancel={() => (dragging.current = false)}
      >
        {items.map((p, i) => {
          // shortest signed offset (wrap around)
          let offset = i - index;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const abs = Math.abs(offset);
          const visible = abs <= 2;
          const isActive = offset === 0;

          const translateX = offset * 58; // percent of card width
          const translateZ = -abs * 220;
          const rotateY = offset * -22;
          const scale = isActive ? 1 : Math.max(0.72, 1 - abs * 0.12);
          const opacity = visible ? (isActive ? 1 : 0.55) : 0;

          return (
            <motion.div
              key={p.id}
              className="absolute left-1/2 top-1/2 w-[88%] max-w-[560px] sm:w-[70%] md:w-[62%]"
              style={{
                transformStyle: "preserve-3d",
                pointerEvents: visible ? "auto" : "none",
                zIndex: 100 - abs,
              }}
              animate={{
                x: `calc(-50% + ${translateX}%)`,
                y: "-50%",
                z: translateZ,
                rotateY,
                scale,
                opacity,
                filter: isActive ? "blur(0px)" : `blur(${abs * 1.5}px)`,
              }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 160, damping: 24, mass: 0.6 }
              }
              onClick={() => {
                if (!isActive) go(offset > 0 ? 1 : -1);
              }}
            >
              <ProjectCard project={p} active={isActive} />
            </motion.div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous project"
          onClick={() => go(-1)}
          className="grid size-11 place-items-center rounded-full border border-border bg-surface transition-colors hover:border-border-strong hover:bg-surface-2"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to project ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-foreground" : "w-1.5 bg-border-strong"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next project"
          onClick={() => go(1)}
          className="grid size-11 place-items-center rounded-full border border-border bg-surface transition-colors hover:border-border-strong hover:bg-surface-2"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}

function ProjectCard({ project: p, active }: { project: Project; active: boolean }) {
  const navigate = useNavigate();
  const go = () => {
    if (!active) return;
    navigate({ to: "/projects/$slug", params: { slug: p.slug } });
  };
  return (
    <div
      role="link"
      tabIndex={active ? 0 : -1}
      onClick={go}
      onKeyDown={(e) => {
        if (active && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          go();
        }
      }}
      className={`group block overflow-hidden rounded-3xl border border-border bg-surface p-1 shadow-2xl shadow-black/40 ${
        active ? "cursor-pointer" : ""
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-surface-2">
        {(() => {
          const img = p.cover_url || p.thumbnail_url || p.cover_image_url;
          return (
            <div className="relative h-full w-full bg-gradient-to-br from-surface to-background flex items-center justify-center">
              {img ? (
                <>
                  <img
                    src={img}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
                  />
                  <img
                    src={img}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </>
              ) : (
                <div className="p-6 text-center">
                  <div className="text-eyebrow">{p.category || "Project"}</div>
                  <div className="mt-2 text-xl font-semibold">{p.title}</div>
                </div>
              )}
            </div>
          );
        })()}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background via-background/85 to-transparent" />
        <div className="absolute left-5 top-5 flex flex-wrap items-center gap-2">
          {p.category ? (
            <div className="rounded-full bg-background/70 px-2.5 py-1 text-eyebrow backdrop-blur-md">
              {p.category}
            </div>
          ) : null}
          {(p.in_progress || p.status?.toLowerCase().includes("progress")) && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              In Progress
            </div>
          )}
        </div>
        <div className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-foreground text-background opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </div>
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/75 p-4 backdrop-blur-md">
          <div className="text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-xl md:text-2xl">{p.title}</div>
          {p.short_description ? (
            <div className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
              {p.short_description}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 p-5">
        {(p.technologies ?? []).slice(0, 5).map((t) => (
          <span
            key={t}
            className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted-foreground"
          >
            {t}
          </span>
        ))}
        {p.live_url ? (
          <a
            href={p.live_url}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            onClick={(e) => {
              if (!active) {
                e.preventDefault();
                return;
              }
              e.stopPropagation();
            }}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
          >
            <ExternalLink className="size-3.5" />
            View website
          </a>
        ) : null}
      </div>
    </div>
  );
}
