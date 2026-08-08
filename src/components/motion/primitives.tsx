import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

type FadeProps = HTMLMotionProps<"div"> & { delay?: number; y?: number; children?: ReactNode };

export const FadeIn = forwardRef<HTMLDivElement, FadeProps>(function FadeIn(
  { delay = 0, y = 24, children, ...rest },
  ref,
) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
});

export function RevealText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-baseline pb-[0.15em] leading-[1.15]" aria-hidden>
          <motion.span
            className="inline-block"
            initial={reduced ? false : { y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: false, margin: "-10% 0px" }}
            transition={{ duration: 0.9, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <motion.span
      className="inline-block"
      onMouseMove={(e) => {
        const el = e.currentTarget as HTMLElement;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "";
      }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      {children}
    </motion.span>
  );
}
