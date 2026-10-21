import { useEffect, useState } from "react";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Live Wire", href: "#live" },
  { name: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Github, href: "https://github.com/JiwiKiwi19", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/jiwon-lee-7614362ab", label: "LinkedIn" },
  { icon: Mail, href: "mailto:ousfame5@gmail.com", label: "Email" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  // Solid background once the page leaves the hero; clear the active link at the top.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      if (window.scrollY < 200) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled || isOpen
          ? "border-border bg-background/95"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <a
            href="#top"
            className="font-display text-2xl italic leading-none text-foreground transition-colors hover:text-primary"
          >
            J. Lee<span className="not-italic text-primary">.</span>
            <span className="sr-only"> Back to top</span>
          </a>

          <ul className="hidden items-center gap-0.5 md:flex">
            {navItems.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {/* A window lights up for the section you're in */}
                    <span
                      aria-hidden
                      className={cn("lit transition-opacity duration-300", isActive ? "opacity-100" : "opacity-0")}
                    />
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-1 md:flex">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon size={17} />
              </a>
            ))}
            <span aria-hidden className="mx-1 h-5 w-px bg-border" />
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:text-primary"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div id="mobile-menu" className="animate-fade-in pb-5 md:hidden">
            <ul className="border-t border-border">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-baseline justify-between border-b border-border py-3 font-display text-2xl text-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                    <span className="slug">{item.href.slice(1)}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
