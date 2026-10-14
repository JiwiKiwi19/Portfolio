import { BarChart3, Brain, Code2, Cpu, Layers } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

const groups = [
  {
    name: "Languages",
    icon: Code2,
    skills: ["C#", "C/C++", "Python", "TypeScript", "JavaScript", "SQL (PostgreSQL)", "Java", "HTML/CSS"],
    className: "lg:col-span-2",
  },
  {
    name: "Frameworks",
    icon: Layers,
    skills: ["ASP.NET", "React", "React Native", "Next.js", "Node.js", "Express.js", "FastAPI", "Qt"],
  },
  {
    name: "ML & Data",
    icon: Brain,
    skills: ["PyTorch", "scikit-learn", "pandas", "NumPy", "Matplotlib", "Jupyter"],
  },
  {
    name: "Systems & Platforms",
    icon: Cpu,
    skills: ["CUDA", "HIP/ROCm", "OpenGL", "Linux", "Git", "Supabase", "Google Cloud Platform"],
  },
  {
    name: "Baseball Analytics",
    icon: BarChart3,
    skills: ["Sabermetrics", "MLB-StatsAPI", "pybaseball"],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="skills-title"
          index="04"
          eyebrow="Skills"
          title="Technical toolkit."
          description="The languages, frameworks, and platforms I've used in the work and projects above."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map(({ name, icon: Icon, skills, className }, index) => (
            <Reveal key={name} delay={(index % 3) * 80} className={cn("h-full", className)}>
              <div className="glass-panel h-full rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{name}</h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <li key={skill} className="chip">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
