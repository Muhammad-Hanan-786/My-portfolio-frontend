import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { hash: "work", label: "Work" },
  { hash: "about", label: "About" },
  { hash: "skills", label: "Skills" },
  { hash: "services", label: "Services" },
  { hash: "contact", label: "Contact" },
];


export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="container-page">
        <div
          className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${
            scrolled ? "glass-panel shadow-md" : "bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 pl-20 sm:pl-24 text-sm font-semibold tracking-tight">
            <span className="inline">Muhammad Hanan</span>
          </Link>


          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.hash}
                to="/"
                hash={l.hash}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/resume"
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              Resume
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              hash="contact"
              className="hidden md:inline-flex items-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
            >
              Let&apos;s talk
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="md:hidden grid size-10 place-items-center rounded-xl border border-border bg-surface"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute inset-x-4 top-4 rounded-2xl border border-border bg-surface p-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between">
                <span className="text-eyebrow">Menu</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid size-10 place-items-center rounded-xl border border-border"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="mt-6 flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.hash}
                    to="/"
                    hash={l.hash}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-lg hover:bg-surface-2"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  to="/resume"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-lg hover:bg-surface-2"
                >
                  Resume
                </Link>
                <Link
                  to="/"
                  hash="contact"
                  onClick={() => setOpen(false)}
                  className="mt-3 rounded-xl bg-foreground px-3 py-3 text-center text-background"
                >
                  Let&apos;s talk
                </Link>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
