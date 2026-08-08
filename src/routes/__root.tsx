import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode, type ComponentType } from "react";

import appCss from "../styles.css?url";
import { WhatsAppButton } from "../components/site/WhatsAppButton";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="text-eyebrow">404</div>
        <h1 className="mt-4 text-heading text-gradient">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-heading">This page didn&apos;t load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try again or head home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#1d2128" },
      { name: "author", content: "Muhammad Hanan" },
      { name: "keywords", content: "Muhammad Hanan, Full Stack Developer, 3D Web Developer, React, TypeScript, Three.js, Node.js, Portfolio" },
      { title: "Muhammad Hanan — Full Stack & 3D Web Developer" },
      { name: "description", content: "Portfolio of Muhammad Hanan, Full Stack Developer specializing in React, Node.js, TypeScript, and interactive 3D web experiences." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Muhammad Hanan" },
      { property: "og:title", content: "Muhammad Hanan — Full Stack & 3D Web Developer" },
      { property: "og:description", content: "Portfolio of Muhammad Hanan, Full Stack Developer specializing in React, Node.js, TypeScript, and interactive 3D web experiences." },
      { property: "og:url", content: "https://muhammadhanan.tech" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Muhammad Hanan — Full Stack & 3D Web Developer" },
      { name: "twitter:description", content: "Portfolio of Muhammad Hanan, Full Stack Developer specializing in React, Node.js, TypeScript, and interactive 3D web experiences." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Muhammad Hanan",
          url: "https://muhammadhanan.tech",
          author: {
            "@type": "Person",
            name: "Muhammad Hanan",
            jobTitle: "Full Stack & 3D Web Developer",
          },
        }),
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ClientTheme />
      <ClientMascot />
      <Outlet />
      <WhatsAppButton />
    </QueryClientProvider>
  );
}

function ClientTheme() {
  const [Comp, setComp] = useState<ComponentType | null>(null);
  useEffect(() => {
    let mounted = true;
    import("@/components/site/ThemeApplier").then((m) => {
      if (mounted) setComp(() => m.ThemeApplier);
    });
    return () => {
      mounted = false;
    };
  }, []);
  if (!Comp) return null;
  return <Comp />;
}

function ClientMascot() {
  const [Comp, setComp] = useState<ComponentType | null>(null);
  useEffect(() => {
    let mounted = true;
    import("@/components/site/CuteAvatar").then((m) => {
      if (mounted) setComp(() => m.CuteAvatar);
    });
    return () => {
      mounted = false;
    };
  }, []);
  if (!Comp) return null;
  return <Comp />;
}

