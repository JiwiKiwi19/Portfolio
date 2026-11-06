import { useEffect, useState } from "react";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Ask AI", href: "#ask" },
  { name: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Github, href: "https://github.com/JiwiKiwi19", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/jiwon-lee-7614362ab", label: "LinkedIn" },
  { icon: Mail, href: "mailto:ousfame5@gmail.com", label: "Email" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    if (window.scrollY < 200) setActive("");
    const onScroll = () => { if (window.scrollY < 200) setActive(""); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); }); },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07]"
      style={{ background: '#142e1e' }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-[52px] items-center justify-between">
          <a
            href="#top"
            className="font-display text-[17px] font-bold italic leading-none transition-opacity hover:opacity-70"
            style={{ color: '#f2ece0' }}
          >
            Jiwon Lee
            <span className="sr-only"> — back to top</span>
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
                      "px-3 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.08em] transition-colors",
                      isActive
                        ? "text-[#f2ece0]"
                        : "text-[rgba(242,236,224,0.42)] hover:text-[rgba(242,236,224,0.8)]",
                    )}
                  >
                    {item.name}
                  </a>
                </li>
              );
            })}
            <li>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 inline-flex items-center px-4 py-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.07em] transition-opacity hover:opacity-80"
                style={{ background: '#c47a0a', color: '#142e1e', borderRadius: '2px' }}
              >
                Résumé ↗
              </a>
            </li>
          </ul>

          <div className="hidden items-center gap-1 md:flex">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-70"
                style={{ color: 'rgba(242,236,224,0.5)' }}
              >
                <Icon size={16} />
              </a>
            ))}
            <span aria-hidden className="mx-1 h-4 w-px" style={{ background: 'rgba(242,236,224,0.12)' }} />
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70"
              style={{ color: '#f2ece0' }}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div id="mobile-menu" className="animate-fade-in pb-6 md:hidden" style={{ borderTop: '1px solid rgba(242,236,224,0.1)' }}>
            <ul>
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-baseline justify-between py-3 font-display text-2xl font-bold italic transition-opacity hover:opacity-70"
                    style={{ color: '#f2ece0', borderBottom: '1px solid rgba(242,236,224,0.08)' }}
                  >
                    {item.name}
                    <span className="font-sans text-[11px] not-italic" style={{ color: 'rgba(242,236,224,0.35)' }}>
                      {item.href.slice(1)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70"
                  style={{ color: 'rgba(242,236,224,0.5)' }}
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
