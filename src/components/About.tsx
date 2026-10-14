import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const facts = [
  {
    icon: GraduationCap,
    label: "Education",
    title: "BSc Computer Science, Western University",
    detail: "Sep 2023 – May 2028 · GPA 3.5/4.0",
  },
  {
    icon: Briefcase,
    label: "Currently",
    title: "Software Engineering Intern, INVENTIS Korea",
    detail: "Seoul, South Korea · Sep 2026 – Feb 2027",
  },
  {
    icon: MapPin,
    label: "Based in",
    title: "London, ON · Aurora, ON",
    detail: "Open to internships and hackathon teams",
  },
];

const coursework = ["Operating Systems", "Databases", "Machine Learning", "Reinforcement Learning", "Data Science"];

const About = () => {
  return (
    <section id="about" aria-labelledby="about-title" className="relative px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="about-title" index="01" eyebrow="About" title="Building across the stack." />

        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Reveal className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              I'm a Computer Science student at Western University who likes building software end to
              end, from <span className="text-foreground">GPU compute kernels</span> and{" "}
              <span className="text-foreground">machine learning pipelines</span> to the{" "}
              <span className="text-foreground">web apps</span> people actually use.
            </p>
            <p>
              Right now I'm a Software Engineering Intern at INVENTIS Korea in Seoul, working in a
              multi-layer C#/ASP.NET backend. Before that, I shipped a production web application for a
              rehabilitation clinic in Mississauga.
            </p>
            <p>
              Outside of class I follow baseball closely, which is why there's a bat following your
              cursor and live MLB headlines further down the page.
            </p>

            <div className="pt-2">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Relevant coursework
              </p>
              <ul className="flex flex-wrap gap-2">
                {coursework.map((course) => (
                  <li key={course} className="chip">
                    {course}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <ul className="space-y-4">
            {facts.map(({ icon: Icon, label, title, detail }, index) => (
              <Reveal as="li" key={label} delay={index * 90}>
                <div className="glass-panel flex gap-4 rounded-2xl p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={19} />
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-1 font-medium text-foreground">{title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;
