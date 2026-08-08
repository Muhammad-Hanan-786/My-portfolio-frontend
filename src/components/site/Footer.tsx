type SocialItem = { id: string; platform: string; url: string };

export function Footer({ social, settings }: { social: SocialItem[]; settings: Record<string, any> | null | undefined }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border mt-32">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="text-display-lg text-gradient">Let&apos;s build something great.</div>
            <p className="mt-4 max-w-md text-muted-foreground">
              {settings?.tagline ?? "Full Stack & 3D Web Developer"} — open for select projects.
            </p>
            <a
              href={`mailto:${settings?.email ?? "muhammadhanan1069@gmail.com"}`}
              className="mt-6 inline-flex items-center rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
            >
              {settings?.email ?? "muhammadhanan1069@gmail.com"}
            </a>
          </div>
          <div>
            <div className="text-eyebrow">Sitemap</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#work" className="hover:text-foreground text-muted-foreground">Work</a></li>
              <li><a href="#about" className="hover:text-foreground text-muted-foreground">About</a></li>
              <li><a href="#skills" className="hover:text-foreground text-muted-foreground">Skills</a></li>
              <li><a href="#services" className="hover:text-foreground text-muted-foreground">Services</a></li>
              <li><a href="#contact" className="hover:text-foreground text-muted-foreground">Contact</a></li>
            </ul>
          </div>
          <div>
            <div className="text-eyebrow">Social</div>
            <ul className="mt-4 space-y-2 text-sm">
              {social.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="hover:text-foreground text-muted-foreground">
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>{settings?.copyright ?? `© ${year} Muhammad Hanan`}. All rights reserved.</span>
          <span></span>
        </div>
      </div>
    </footer>
  );
}
