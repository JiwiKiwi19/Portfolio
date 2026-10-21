import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const groups = [
  {
    name: "Languages",
    skills: ["C#", "C/C++", "Python", "TypeScript", "JavaScript", "SQL (PostgreSQL)", "Java", "HTML/CSS"],
  },
  {
    name: "Frameworks",
    skills: ["ASP.NET", "React", "React Native", "Next.js", "Node.js", "Express.js", "FastAPI", "Qt"],
  },
  {
    name: "ML & Data",
    skills: ["PyTorch", "scikit-learn", "pandas", "NumPy", "Matplotlib", "Jupyter"],
  },
  {
    name: "Systems & Platforms",
    skills: ["CUDA", "HIP/ROCm", "OpenGL", "Linux", "Git", "Supabase", "Google Cloud Platform"],
  },
  {
    name: "Baseball Analytics",
    skills: ["Sabermetrics", "MLB-StatsAPI", "pybaseball"],
  },
];

// Set like a printed index: category in serif italic, entries run in as text.
const SkillsSection = () => {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="skills-title"
          index="04"
          eyebrow="Skills"
          title={
            <>
              Technical <em>toolkit.</em>
            </>
          }
          description="The languages, frameworks, and platforms I've used in the work and projects above."
        />

        <dl className="border-b border-border">
          {groups.map(({ name, skills }, index) => (
            <Reveal
              key={name}
              delay={index * 60}
              className="grid gap-2 border-t border-border py-6 md:grid-cols-12 md:gap-8"
            >
              <dt className="font-display text-2xl italic text-foreground md:col-span-3 md:text-3xl">{name}</dt>
              <dd className="md:col-span-9 md:pt-1.5">
                <ul className="flex flex-wrap text-lg leading-relaxed text-foreground/85">
                  {skills.map((skill, i) => (
                    <li key={skill}>
                      {skill}
                      {i < skills.length - 1 && <span aria-hidden className="px-2.5 text-primary">·</span>}
                    </li>
                  ))}
                </ul>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default SkillsSection;
