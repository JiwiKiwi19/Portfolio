import { ArrowRight, FileText, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import TorontoSkyline from "@/components/TorontoSkyline";

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/JiwiKiwi19" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/jiwon-lee-7614362ab" },
  { icon: Mail, label: "Email", href: "mailto:ousfame5@gmail.com" },
];

const Hero = () => {
  return (
    <header id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Ambient city glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55rem 30rem at 72% 95%, hsl(var(--glow-a) / 0.14), transparent 65%), radial-gradient(45rem 28rem at 20% 85%, hsl(var(--glow-b) / 0.10), transparent 65%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-4 pb-10 pt-28 sm:px-6 md:pt-32">
        <div className="max-w-3xl animate-fade-in">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/60 px-3.5 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-city-violet opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-city-violet" />
            </span>
            Now: Software Engineering Intern @ INVENTIS Korea
          </p>

          <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            Jiwon Lee<span className="text-primary">.</span>
          </h1>

          <p className="mt-5 font-mono text-sm uppercase tracking-[0.2em] text-primary/90">
            Software Engineering · Machine Learning · Full-Stack
          </p>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Computer Science student at Western University. I build full-stack web apps,
            GPU-accelerated simulations, and machine learning pipelines, and I'm currently
            working in a C#/ASP.NET codebase in Seoul.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="group rounded-full px-6 font-semibold shadow-[var(--shadow-elegant)]">
              <a href="#projects">
                View projects
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-border bg-card/40 px-6 backdrop-blur hover:border-primary/40"
            >
              <a href="#experience">Experience</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="rounded-full px-5 text-muted-foreground hover:text-foreground"
            >
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                <FileText />
                Résumé
              </a>
            </Button>
          </div>

          <ul className="mt-8 flex items-center gap-2">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                >
                  <Icon size={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <TorontoSkyline className="pointer-events-none relative block h-[190px] w-full overflow-visible sm:h-[230px] lg:h-[270px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background"
      />
    </header>
  );
};

export default Hero;
