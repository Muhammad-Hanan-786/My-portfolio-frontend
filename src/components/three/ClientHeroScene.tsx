import { lazy, Suspense, useEffect, useState } from "react";

const HeroScene = lazy(() => import("./HeroScene"));

export function ClientHeroScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div aria-hidden className="absolute inset-0" />;
  return (
    <Suspense fallback={<div aria-hidden className="absolute inset-0" />}>
      <HeroScene />
    </Suspense>
  );
}
