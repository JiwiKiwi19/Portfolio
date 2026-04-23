import { useEffect, useRef, useState } from "react";
import { Code2, Database, Brain, Server, Coffee, Cpu, BarChart3, GitBranch } from "lucide-react";

interface SkillCardProps {
  skill: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const SkillCard = ({ skill, description, icon, delay }: SkillCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`group relative p-5 rounded-lg border border-border bg-card/50 backdrop-blur-sm
        transition-all duration-500 ease-out cursor-pointer overflow-hidden
        hover:border-primary hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-transparent transition-all duration-500" />

      <div className="relative flex items-center gap-3 mb-3">
        <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          {icon}
        </div>
        <h4 className="font-semibold text-foreground">{skill}</h4>
      </div>

      <p className="relative text-sm text-muted-foreground max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
        {description}
      </p>
    </div>
  );
};

const SkillsSection = () => {
  const programmingSkills = [
    {
      name: "React/TypeScript",
      level: "Expert",
      description: "Building scalable web apps with modern hooks, state management, and type safety.",
      icon: <Code2 className="w-5 h-5" />,
    },
    {
      name: "Python/ML",
      level: "Advanced",
      description: "Data analysis, machine learning models, and statistical computing with pandas & scikit-learn.",
      icon: <Brain className="w-5 h-5" />,
    },
    {
      name: "Node.js",
      level: "Advanced",
      description: "RESTful APIs, real-time apps, and backend services with Express and modern tooling.",
      icon: <Server className="w-5 h-5" />,
    },
    {
      name: "Java",
      level: "Proficient",
      description: "Object-oriented programming and backend development with Spring Boot.",
      icon: <Coffee className="w-5 h-5" />,
    },
  ];

  const toolsSkills = [
    {
      name: "PostgreSQL",
      level: "Advanced",
      description: "Complex queries, schema design, indexing, and database optimization.",
      icon: <Database className="w-5 h-5" />,
    },
    {
      name: "C/C++",
      level: "Proficient",
      description: "Systems programming, memory management, and performance-critical applications.",
      icon: <Cpu className="w-5 h-5" />,
    },
    {
      name: "Data Analytics",
      level: "Advanced",
      description: "Statistical analysis, MLB sabermetrics, and turning raw data into insights.",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      name: "Git/GitHub",
      level: "Expert",
      description: "Version control, collaborative workflows, CI/CD, and open-source contributions.",
      icon: <GitBranch className="w-5 h-5" />,
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="portfolio-card rounded-xl p-8 md:p-12 relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-t-xl" />

          <h2 className="text-4xl font-bold text-primary text-center mb-3">
            Skills & Proficiency
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Hover over each skill to learn more
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Programming & Development
              </h3>
              <div className="space-y-3">
                {programmingSkills.map((skill, index) => (
                  <SkillCard
                    key={skill.name}
                    skill={skill.name}
                    description={skill.description}
                    icon={skill.icon}
                    delay={index * 100}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Tools & Technologies
              </h3>
              <div className="space-y-3">
                {toolsSkills.map((skill, index) => (
                  <SkillCard
                    key={skill.name}
                    skill={skill.name}
                    
                    description={skill.description}
                    icon={skill.icon}
                    delay={(index + 4) * 100}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
