import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import portrait from "@/assets/hanan-portrait.png.asset.json";

const SLICE_COUNT = 7;
const customEase = [0.16, 1, 0.3, 1] as const;

export function CinematicLoader({ data }: { data?: any }) {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<"name" | "image" | "exit" | "done">("name");

  const name = data?.hero?.name || "Muhammad Hanan";
  const avatarUrl =
    data?.about?.profile_image_url ||
    data?.hero?.avatar_url ||
    portrait?.url ||
    "/apple-touch-icon.png";

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

    // Timeline Sequence:
    // 0.0s – 1.4s: Name Entrance & Hold
    // 1.4s – 1.6s: Name Mask Away
    // 1.6s – 3.0s: Horizontal Image Slices Reveal & Assemble
    // 3.0s – 3.8s: Slices Expand Outward & Reveal Homepage
    // 3.8s+: Unmount Loader

    const imageTimer = setTimeout(() => {
      setStage("image");
    }, 1400);

    const exitTimer = setTimeout(() => {
      setStage("exit");
    }, 3000);

    const doneTimer = setTimeout(() => {
      setStage("done");
      try {
        sessionStorage.setItem("hasSeenIntro", "true");
      } catch {}
    }, 3800);

    return () => {
      clearTimeout(imageTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [reduced]);

  if (stage === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="profile-loader"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b0d10] text-foreground pointer-events-none select-none overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === "exit" ? 1 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Grid Lines Accent */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
        />

        {/* STAGE 1: Name Reveal */}
        {stage === "name" && (
          <motion.div
            key="name-stage"
            className="flex flex-col items-center text-center px-4 max-w-xl z-10"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 1.02 }}
            transition={{ duration: 0.9, ease: customEase }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: customEase }}
              className="text-eyebrow font-mono text-xs font-semibold tracking-widest text-muted-foreground uppercase"
            >
              Portfolio Opening
            </motion.span>

            <h1 className="mt-3 text-4xl sm:text-6xl font-bold tracking-tight text-gradient font-sans">
              {name}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: customEase }}
              className="mt-3 text-xs sm:text-sm font-medium tracking-wide text-muted-foreground"
            >
              Full Stack & 3D Web Developer
            </motion.p>
          </motion.div>
        )}

        {/* STAGE 2 & 3: Horizontal Sliced Profile Picture Reveal */}
        {(stage === "image" || stage === "exit") && (
          <div className="relative flex flex-col items-center justify-center z-10">
            {/* Background Accent Block */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ duration: 0.6, ease: customEase }}
              className="absolute -inset-4 rounded-3xl bg-surface-2/40 border border-border/40 blur-sm -z-10"
            />

            {/* Editorial Top Technical Indicators */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: stage === "exit" ? 0 : 0.7, y: 0 }}
              transition={{ duration: 0.4, ease: customEase }}
              className="w-full max-w-[320px] sm:max-w-[400px] mb-2 flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase tracking-widest px-1"
            >
              <span>[MH-01]</span>
              <span>001 // PORTRAIT</span>
              <span>ASPECT 4:5</span>
            </motion.div>

            {/* Sliced Portrait Container */}
            <div className="relative w-[280px] h-[350px] sm:w-[360px] sm:h-[450px] rounded-2xl overflow-hidden shadow-2xl border border-border/60 bg-surface">
              {Array.from({ length: SLICE_COUNT }).map((_, i) => {
                // Calculate percentage bounds for inset clipping
                const topPercent = (i * 100) / SLICE_COUNT;
                const bottomPercent = 100 - ((i + 1) * 100) / SLICE_COUNT;
                const isLeft = i % 2 === 0;

                // Entry animation (Stage 2) & Exit wipe (Stage 3)
                let targetX = "0%";
                if (stage === "image") {
                  targetX = "0%";
                } else if (stage === "exit") {
                  targetX = isLeft ? "-120vw" : "120vw";
                }

                const initialX = isLeft ? "-70px" : "70px";
                const sliceDelay = stage === "exit" ? i * 0.04 : i * 0.05;

                return (
                  <motion.div
                    key={`slice-${i}`}
                    className="absolute inset-0 w-full h-full overflow-hidden"
                    style={{
                      clipPath: `inset(${topPercent}% 0% ${bottomPercent}% 0%)`,
                    }}
                    initial={{ x: initialX, opacity: 0 }}
                    animate={{ x: targetX, opacity: 1 }}
                    transition={{
                      duration: stage === "exit" ? 0.75 : 0.65,
                      delay: sliceDelay,
                      ease: customEase,
                    }}
                  >
                    <motion.img
                      src={avatarUrl}
                      alt={name}
                      className="absolute inset-0 w-full h-full object-cover object-[50%_30%]"
                      initial={{ filter: "grayscale(80%) brightness(0.9)" }}
                      animate={{
                        filter: stage === "image" ? "grayscale(0%) brightness(1)" : "grayscale(0%)",
                      }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      draggable={false}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Editorial Bottom Line Accent */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: stage === "exit" ? 0 : 0.7, y: 0 }}
              transition={{ duration: 0.4, ease: customEase }}
              className="w-full max-w-[320px] sm:max-w-[400px] mt-3 flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase tracking-widest px-1"
            >
              <div className="h-px bg-border flex-1 mr-4" />
              <span>{name}</span>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
