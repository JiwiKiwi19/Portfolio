import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import TorontoSkyline from "@/components/TorontoSkyline";
import LiveClock from "@/components/LiveClock";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/JiwiKiwi19" },
  { label: "LinkedIn", href: "https://linkedin.com/in/jiwon-lee-7614362ab" },
  { label: "Email", href: "mailto:ousfame5@gmail.com" },
];

const jumpLinks = [
  { label: "Selected work", href: "#projects", external: false },
  { label: "Experience", href: "#experience", external: false },
  { label: "Résumé (PDF)", href: "/resume.pdf", external: true },
];

// The front page: a dateline, the name set like a masthead, and the skyline as the cover plate.
const Hero = () => {
  return (
    <header id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div className="relative z-10 flex-1 px-4 pt-24 sm:px-6 md:pt-28">
        <div className="mx-auto w-full max-w-7xl">
        {/* Dateline */}
        <div className="slug flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-y border-foreground/70 py-2.5 animate-fade-in">
          <span>Toronto, Ontario · 43.65° N 79.38° W</span>
          <span className="flex items-center gap-3">
            <span className="dark:hidden">Morning edition</span>
            <span className="hidden dark:inline">Night edition</span>
            <span aria-hidden className="h-3 w-px bg-border" />
            <span className="text-foreground/80">
              TOR <LiveClock seconds={false} />
            </span>
          </span>
        </div>

        <div className="grid gap-10 pb-10 pt-10 md:grid-cols-12 md:gap-8 md:pt-14">
          <h1 className="font-display font-normal leading-[0.8] tracking-[-0.02em] text-foreground md:col-span-8 animate-fade-in">
            <span className="block text-[clamp(5.5rem,24vw,8rem)] md:text-[clamp(5rem,15vw,13.5rem)]">Jiwon</span>
            <span className="block pl-[0.9em] text-[clamp(5.5rem,24vw,8rem)] italic md:pl-[1.4em] md:text-[clamp(5rem,15vw,13.5rem)]">
              Lee<span className="not-italic text-primary">.</span>
            </span>
          </h1>

          <div className="flex flex-col justify-end gap-8 md:col-span-4 md:pb-3">
            <div>
              <p className="slug mb-3 flex items-center gap-2.5">
                <span className="lit" aria-hidden />
                Currently
              </p>
              <p className="text-lg leading-snug text-foreground">
                Software Engineering Intern at INVENTIS Korea, Seoul.
              </p>
            </div>

            <p className="text-base leading-relaxed text-muted-foreground">
              Computer Science student at Western University. I build full-stack web apps,
              GPU-accelerated simulations, and machine learning pipelines, and I'm currently
              working in a C#/ASP.NET codebase in Seoul.
            </p>

            <ul className="border-t border-border">
              {jumpLinks.map(({ label, href, external }) => (
                <li key={label} className="border-b border-border">
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="group flex items-center justify-between py-3 text-[15px] font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {label}
                    {external ? (
                      <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    ) : (
                      <ArrowDownRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                    )}
                  </a>
                </li>
              ))}
            </ul>

            <ul className="slug flex flex-wrap gap-x-5 gap-y-2">
              {socialLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-foreground/80 transition-colors hover:text-primary"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="slug pb-6 text-primary/90">Software Engineering · Machine Learning · Full-Stack</p>
        </div>
      </div>

      <figure className="relative">
        <TorontoSkyline className="pointer-events-none relative block h-[200px] w-full overflow-visible sm:h-[260px] lg:h-[340px]" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background"
        />
        {/* Plate caption, set over the lake */}
        <figcaption className="absolute inset-x-0 bottom-3 hidden px-4 sm:block sm:px-6">
          <p className="slug mx-auto max-w-7xl text-right text-[10px] text-muted-foreground/80">
            Fig. 1 — The waterfront from the islands,{" "}
            <span className="dark:hidden">morning</span>
            <span className="hidden dark:inline">after dark</span>
          </p>
        </figcaption>
      </figure>
    </header>
  );
};

export default Hero;
