import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

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

// A ledger: dates in the left gutter, the role on the right, hairline rules between entries.
const Experience = () => {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="relative px-4 py-16 sm:px-6 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="experience-title"
          index="02"
          eyebrow="Experience"
          title={
            <>
              Professional <em>experience.</em>
            </>
          }
          description="Industry software roles. Academic, team, and personal projects are listed separately below."
        />

        <ol className="border-b border-border">
          {roles.map((role, index) => (
            <Reveal
              as="li"
              key={role.company}
              delay={index * 100}
              className="grid gap-4 border-t border-border py-10 md:grid-cols-12 md:gap-8 md:py-12"
            >
              <div className="md:col-span-3">
                <p className="font-mono text-sm text-foreground/85">{role.period}</p>
                <p className="mt-1 text-sm text-muted-foreground">{role.location}</p>
                {role.current && (
                  <p className="slug mt-4 flex items-center gap-2.5 text-primary">
                    <span className="lit" aria-hidden />
                    Current
                  </p>
                )}
              </div>

              <article className="md:col-span-9">
                <h3 className="font-display text-[clamp(2rem,3.6vw,3rem)] font-normal leading-[1] text-foreground">
                  {role.title}
                </h3>
                <p className="mt-2 text-lg text-foreground/90">{role.company}</p>

                <ul className="mt-6 max-w-3xl space-y-3">
                  {role.responsibilities.map((item) => (
                    <li
                      key={item}
                      className="flex gap-4 leading-relaxed text-muted-foreground"
                    >
                      <span aria-hidden className="mt-[0.7rem] h-px w-4 shrink-0 bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
                  <ul className="stack-line flex flex-wrap" aria-label="Technologies">
                    {role.stack.map((tech, i) => (
                      <li key={tech}>
                        {tech}
                        {i < role.stack.length - 1 && <span aria-hidden className="px-2 text-border">/</span>}
                      </li>
                    ))}
                  </ul>
                  {role.website && (
                    <a
                      href={role.website.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                    >
                      <span className="ink-link">Visit {role.website.label}</span>
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

        <Reveal className="mt-16 grid gap-6 md:grid-cols-12 md:gap-8">
          <h3 className="slug md:col-span-3">
            Other experience
          </h3>
          <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 md:col-span-9">
            {otherRoles.map((role) => (
              <li key={role.title} className="border-t border-border pt-4">
                <p className="font-display text-2xl leading-tight text-foreground">{role.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {role.company} · {role.location}
                </p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {role.period}
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
