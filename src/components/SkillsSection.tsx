import { useEffect, useRef, useState } from "react";

interface SkillBarProps {
  skill: string;
  percentage: number;
  delay: number;
}

const SkillBar = ({ skill, percentage, delay }: SkillBarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const skillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (skillRef.current) {
      observer.observe(skillRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        let progress = 0;
        const increment = percentage / 50; // 50 steps for smooth animation
        const progressTimer = setInterval(() => {
          progress += increment;
          if (progress >= percentage) {
            progress = percentage;
            clearInterval(progressTimer);
          }
          setCurrentPercentage(Math.round(progress));
        }, 20);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, percentage, delay]);

  return (
    <div ref={skillRef} className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-foreground font-medium">{skill}</span>
        <span className="text-primary text-sm">{currentPercentage}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${currentPercentage}%` }}
        />
      </div>
    </div>
  );
};

const SkillsSection = () => {
  const skills = [
    { name: "React/TypeScript", level: 90 },
    { name: "Python/ML", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "PostgreSQL", level: 75 },
    { name: "Java", level: 70 },
    { name: "C/C++", level: 65 },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="portfolio-card rounded-xl p-8 md:p-12">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-t-xl" />

          <h2 className="text-4xl font-bold text-primary text-center mb-12">
            Skills & Proficiency
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Programming & Development
              </h3>
              {skills.slice(0, 3).map((skill, index) => (
                <SkillBar
                  key={skill.name}
                  skill={skill.name}
                  percentage={skill.level}
                  delay={index * 200}
                />
              ))}
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Tools & Technologies
              </h3>
              {skills.slice(3).map((skill, index) => (
                <SkillBar
                  key={skill.name}
                  skill={skill.name}
                  percentage={skill.level}
                  delay={(index + 3) * 200}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
