import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function CinematicLoader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), reduced ? 100 : 500);
    return () => clearTimeout(t);
  }, [reduced]);
  if (done) return null;
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          className="text-eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Muhammad Hanan
        </motion.div>
        <div className="relative h-px w-40 overflow-hidden bg-border">
          <motion.div
            className="absolute inset-y-0 left-0 bg-accent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}
