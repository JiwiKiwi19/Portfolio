import { useEffect, useRef, useState } from "react";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="portfolio-card rounded-xl p-8 md:p-12 relative">
          {/* Accent border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-t-xl" />

          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <h2 className="text-4xl font-bold text-primary text-center mb-8">
              About Me
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div
                className={`space-y-6 ${
                  isVisible ? "animate-slide-in-left" : ""
                }`}
              >
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    Background
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Computer Science student at Western University with a
                    passion for full-stack development and machine learning.
                    Currently working as a WiFi Sensing ML Analyst, analyzing
                    Channel State Information data to detect human presence
                    using Python and MATLAB.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-medium text-primary mb-3">
                    Education
                  </h4>
                  <p className="text-muted-foreground">
                    Bachelor of Science in Computer Science
                    <br />
                    <span className="text-sm">
                      Western University • Sep 2023 – May 2027
                    </span>
                  </p>
                </div>
              </div>

              <div className={`${isVisible ? "animate-slide-in-right" : ""}`}>
                <h4 className="text-xl font-medium text-primary mb-4">
                  Technical Skills
                </h4>
                <div className="space-y-4">
                  {[
                    {
                      category: "Languages",
                      skills: [
                        "Python",
                        "JavaScript/TypeScript",
                        "Java",
                        "C/C++",
                        "SQL",
                      ],
                    },
                    {
                      category: "Frameworks",
                      skills: ["React", "Node.js", "Next.js", "FastAPI"],
                    },
                    {
                      category: "Tools",
                      skills: ["Git", "Supabase", "Google Cloud", "VS Code"],
                    },
                    {
                      category: "Libraries",
                      skills: ["pandas", "scikit-learn", "NumPy", "Matplotlib"],
                    },
                  ].map(({ category, skills }, categoryIndex) => (
                    <div key={category} className="mb-4">
                      <h5 className="text-primary font-medium mb-2">
                        {category}
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, skillIndex) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-primary/10 text-primary text-sm rounded border border-primary/20 hover:bg-primary/20 transition-colors cursor-default"
                            style={{
                              animationDelay: `${
                                categoryIndex * 0.1 + skillIndex * 0.05
                              }s`,
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
