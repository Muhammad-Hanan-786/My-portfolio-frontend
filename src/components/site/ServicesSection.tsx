import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const customEase = [0.16, 1, 0.3, 1] as const;

interface ServiceItem {
  id: string | number;
  title: string;
  description: string;
  features?: string[];
}

export function ServicesSection({ data }: { data: any }) {
  const services: ServiceItem[] = data?.services ?? [];
  const reduced = useReducedMotion();

  // Screen width state for dynamic grid column stagger calculation
  const [columns, setColumns] = useState<number>(3);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) {
        setColumns(1);
      } else if (window.innerWidth < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  return (
    <section id="services" className="container-page py-20 md:py-32 overflow-hidden">
      <div className="max-w-3xl">
        <div className="text-eyebrow">Services</div>
        <h2 className="text-display-lg text-gradient mt-4">What I build for clients.</h2>
      </div>

      <div className="mt-12 md:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          // Calculate row & col for wave choreography
          const row = Math.floor(i / columns);
          const col = i % columns;
          const cardDelay = reduced ? 0 : row * 0.14 + col * 0.08;

          return (
            <ServiceCard
              key={s.id ?? i}
              service={s}
              index={i}
              delay={cardDelay}
              reduced={!!reduced}
            />
          );
        })}
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
  delay,
  reduced,
}: {
  service: ServiceItem;
  index: number;
  delay: number;
  reduced: boolean;
}) {
  const formattedNumber = (index + 1).toString().padStart(3, "0");

  const cardVariants = {
    hidden: reduced
      ? { opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0% round 24px)" }
      : {
          opacity: 0,
          y: 50,
          scale: 0.95,
          clipPath: "inset(14% 0% 14% 0% round 24px)",
        },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      clipPath: "inset(0% 0% 0% 0% round 24px)",
      transition: {
        duration: 0.7,
        delay,
        ease: customEase,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={cardVariants}
      whileHover={reduced ? {} : { y: -6 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="group relative flex h-full flex-col justify-between rounded-3xl border border-border bg-surface p-7 shadow-sm transition-all duration-300 hover:border-border-strong hover:shadow-md"
    >
      <div>
        {/* Editorial Index Number Reveal */}
        <div className="overflow-hidden">
          <motion.div
            initial={reduced ? false : { y: "100%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: delay + 0.05,
              ease: customEase,
            }}
            className="text-eyebrow font-mono text-xs font-semibold tracking-wider text-muted-foreground/80 group-hover:text-primary transition-colors duration-300"
          >
            {formattedNumber}
          </motion.div>
        </div>

        {/* Typography Choreography Sliced Heading */}
        <div className="mt-3">
          <SlicedHeading title={service.title} delay={delay} reduced={reduced} />
        </div>

        {/* Description Fade & Slide */}
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: delay + 0.22,
            ease: customEase,
          }}
          className="mt-3 text-sm leading-relaxed text-muted-foreground"
        >
          {service.description}
        </motion.p>
      </div>

      {/* Sequenced Feature Tags Assembly */}
      {service.features && service.features.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-1.5">
          {service.features.map((feature, fIdx) => (
            <motion.li
              key={feature}
              initial={reduced ? false : { opacity: 0, y: 12, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: delay + 0.3 + fIdx * 0.04,
                ease: customEase,
              }}
              className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-all duration-300 group-hover:bg-surface-2/80 group-hover:text-foreground"
            >
              {feature}
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

/**
 * Precision Typography Sliced Heading Choreography
 * Splits the title into top and bottom horizontal slices that slide from opposite directions
 * before aligning perfectly into place.
 */
function SlicedHeading({
  title,
  delay,
  reduced,
}: {
  title: string;
  delay: number;
  reduced: boolean;
}) {
  if (reduced) {
    return <h3 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h3>;
  }

  return (
    <div className="relative overflow-hidden py-1">
      {/* Invisible spacer heading to define exact container dimensions */}
      <h3 className="invisible text-2xl font-semibold tracking-tight leading-snug" aria-hidden="true">
        {title}
      </h3>

      {/* Top Sliced Layer (upper 50%) */}
      <motion.h3
        initial={{ opacity: 0, x: -12, y: -10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.65,
          delay: delay + 0.12,
          ease: customEase,
        }}
        style={{ clipPath: "inset(0% 0% 49% 0%)" }}
        className="absolute inset-0 top-1 text-2xl font-semibold tracking-tight leading-snug text-foreground"
      >
        {title}
      </motion.h3>

      {/* Bottom Sliced Layer (lower 50%) */}
      <motion.h3
        initial={{ opacity: 0, x: 12, y: 10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.65,
          delay: delay + 0.15,
          ease: customEase,
        }}
        style={{ clipPath: "inset(50% 0% 0% 0%)" }}
        className="absolute inset-0 top-1 text-2xl font-semibold tracking-tight leading-snug text-foreground"
      >
        {title}
      </motion.h3>
    </div>
  );
}
