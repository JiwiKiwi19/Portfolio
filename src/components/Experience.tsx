import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

type Role = {
  title: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  website?: { href: string; label: string };
  responsibilities: string[];
  stack: string[];
};

const roles: Role[] = [
  {
    title: "Software Engineering Intern",
    company: "INVENTIS Korea",
    location: "Seoul, South Korea",
    period: "Sep 2026 – Feb 2027",
    current: true,
    responsibilities: [
      "Traced 36 REST API flows across the multi-layer C#/ASP.NET backend of a dealer management SaaS platform, and documented each as a Mermaid sequence diagram to map end-to-end request flow for the team.",
      "Configured a Unity development environment (Unity Hub, VR Builder) and evaluated VR Builder's tooling for upcoming AR/VR product work.",
    ],
    stack: ["C#", "ASP.NET", "REST APIs", "Mermaid", "Unity", "VR Builder"],
  },
  {
    title: "Full-Stack Developer",
    company: "Kingsbridge Rehab Centre",
    location: "Mississauga, ON",
    period: "May 2025 – Aug 2025",
    website: { href: "https://kbrc.ca", label: "kbrc.ca" },
    responsibilities: [
      "Built and shipped the clinic's web application end to end with Next.js 15, React 19, and TypeScript, for a practice handling 1,000+ patient visits.",
      "Developed a timezone-aware availability module with date-fns that computes open and closed status across the 7-day schedule, eliminating manual updates.",
    ],
    stack: ["Next.js 15", "React 19", "TypeScript", "date-fns"],
  },
];

const otherRoles = [
  {
    title: "Personal Training Assistant",
    company: "Private Care",
    location: "Aurora, ON",
    period: "Jul 2024 – Present",
    summary:
      "Coach client mobility with continuous progress tracking and iterative feedback, including step-by-step assistive-device training.",
  },
  {
    title: "Tutor",
    company: "YRDSB School Region",
    location: "Richmond Hill, ON",
    period: "Sep 2022 – Aug 2025",
    summary:
      "Helped 10+ students with custom homework, presentations, and personalized learning strategies.",
  },
];

const Experience = () => {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="relative px-4 py-24 sm:px-6 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="experience-title"
          index="02"
          eyebrow="Experience"
          title="Professional experience."
          description="Industry software roles. Academic, team, and personal projects are listed separately below."
        />

        <ol className="relative space-y-6 before:absolute before:bottom-6 before:left-[5px] before:top-8 before:w-px before:bg-gradient-to-b before:from-city-violet/60 before:via-border before:to-transparent">
          {roles.map((role, index) => (
            <Reveal
              as="li"
              key={role.company}
              delay={index * 100}
              className="relative pl-8 md:pl-12"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 top-8 h-[11px] w-[11px] rounded-full border-2",
                  role.current
                    ? "border-city-violet bg-city-violet shadow-[0_0_14px_hsl(var(--city-violet)/0.7)]"
                    : "border-primary/70 bg-background",
                )}
              />
              <article className="glass-panel glass-panel-interactive rounded-2xl p-6 md:p-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground md:text-2xl">
                      {role.title}
                    </h3>
                    <p className="mt-1 text-base text-foreground/90">
                      {role.company}
                      <span className="text-muted-foreground">
                        {" "}
                        · {role.location}
                      </span>
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {role.current && (
                      <span className="rounded-full border border-city-violet/40 bg-city-violet/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-city-violet">
                        Current
                      </span>
                    )}
                    <span className="font-mono text-sm text-muted-foreground">
                      {role.period}
                    </span>
                  </div>
                </div>

                <ul className="mt-5 space-y-3">
                  {role.responsibilities.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <ul
                    className="flex flex-wrap gap-2"
                    aria-label="Technologies"
                  >
                    {role.stack.map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                  </ul>
                  {role.website && (
                    <a
                      href={role.website.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      Visit {role.website.label}
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-16">
          <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Other experience
          </h3>
          <ul className="grid gap-4 md:grid-cols-2">
            {otherRoles.map((role) => (
              <li
                key={role.title}
                className="rounded-2xl border border-border/80 p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="font-medium text-foreground">{role.title}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {role.period}
                  </p>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {role.company} · {role.location}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {role.summary}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};

export default Experience;
