import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const STEP_COUNT = 6;
const customEase = [0.16, 1, 0.3, 1] as const;

export function CinematicLoader() {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<"text" | "wipe" | "done">("text");

  useEffect(() => {
    // Session storage check to only run once per session
    try {
      if (sessionStorage.getItem("hasSeenIntro") === "true") {
        setStage("done");
        return;
      }
    } catch {
      // Fallback if sessionStorage is disabled
    }

    if (reduced) {
      const timer = setTimeout(() => {
        setStage("done");
        try {
          sessionStorage.setItem("hasSeenIntro", "true");
        } catch {}
      }, 300);
      return () => clearTimeout(timer);
    }

    // Timeline phases:
    // 0.0s - 1.2s: Text reveal & pause
    // 1.2s - 2.8s: Stepped geometric mask wipe
    // 2.8s - 3.2s: Fade out and unmount
    const wipeTimer = setTimeout(() => {
      setStage("wipe");
    }, 1300);

    const doneTimer = setTimeout(() => {
      setStage("done");
      try {
        sessionStorage.setItem("hasSeenIntro", "true");
      } catch {}
    }, 3200);

    return () => {
      clearTimeout(wipeTimer);
      clearTimeout(doneTimer);
    };
  }, [reduced]);

  if (stage === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="loader-container"
        className="fixed inset-0 z-[100] pointer-events-none select-none overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === "wipe" ? 1 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Stepped Geometric Mask Bars - Top Half */}
        <div className="absolute inset-x-0 top-0 h-1/2 flex flex-col justify-start">
          {Array.from({ length: STEP_COUNT }).map((_, i) => {
            // Stepped offset: each bar has a different staircase width/delay
            const stepDelay = i * 0.06;
            // Odd/even alternating wipe direction for dynamic stepped opening
            const isLeft = i % 2 === 0;

            return (
              <motion.div
                key={`top-bar-${i}`}
                className="w-full bg-[#0b0d10] border-b border-white/[0.03]"
                style={{ height: `${100 / STEP_COUNT}%` }}
                initial={{ x: "0%" }}
                animate={{
                  x: stage === "wipe" ? (isLeft ? "-100%" : "100%") : "0%",
                }}
                transition={{
                  duration: 1.1,
                  delay: stepDelay,
                  ease: customEase,
                }}
              />
            );
          })}
        </div>

        {/* Stepped Geometric Mask Bars - Bottom Half */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 flex flex-col justify-end">
          {Array.from({ length: STEP_COUNT }).map((_, i) => {
            const stepDelay = (STEP_COUNT - 1 - i) * 0.06;
            const isLeft = i % 2 !== 0;

            return (
              <motion.div
                key={`bottom-bar-${i}`}
                className="w-full bg-[#0b0d10] border-t border-white/[0.03]"
                style={{ height: `${100 / STEP_COUNT}%` }}
                initial={{ x: "0%" }}
                animate={{
                  x: stage === "wipe" ? (isLeft ? "-100%" : "100%") : "0%",
                }}
                transition={{
                  duration: 1.1,
                  delay: stepDelay,
                  ease: customEase,
                }}
              />
            );
          })}
        </div>

        {/* Central Brand Typography Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <motion.div
            className="flex flex-col items-center text-center max-w-xl"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{
              opacity: stage === "wipe" ? 0 : 1,
              y: stage === "wipe" ? -24 : 0,
              scale: stage === "wipe" ? 1.04 : 1,
            }}
            transition={{
              duration: stage === "wipe" ? 0.6 : 0.8,
              ease: customEase,
            }}
          >
            {/* Eyebrow Label */}
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: customEase }}
              className="text-eyebrow font-mono text-xs font-semibold tracking-widest text-muted-foreground uppercase"
            >
              Portfolio Experience
            </motion.span>

            {/* Main Name Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.25, ease: customEase }}
              className="mt-3 text-4xl sm:text-6xl font-bold tracking-tight text-gradient font-sans"
            >
              Muhammad Hanan
            </motion.h1>

            {/* Subtitle / Role */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: customEase }}
              className="mt-3 text-xs sm:text-sm font-medium tracking-wide text-muted-foreground"
            >
              Full Stack & 3D Web Developer
            </motion.p>

            {/* Minimal Progress Line Accent */}
            <div className="mt-8 relative h-0.5 w-32 sm:w-48 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 bg-foreground"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.1, delay: 0.2, ease: customEase }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
