import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github } from "lucide-react";

const Projects = () => {
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

  const projects = [
    {
      title: "Thoth",
      description:
        "Modern authentication system with secure login, sign-up, and JWT-based token storage. Built with responsive design and real-time data capabilities.",
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "PostgreSQL",
        "Supabase",
        "TailwindCSS",
      ],
      githubUrl: "https://github.com/JiwiKiwi19",
      liveUrl: "#",
      period: "May 2025 – Aug 2025",
    },
    {
      title: "SPOT Restaurant Management",
      description:
        "Full-stack restaurant order management system with real-time order tracking, table arrangement, and live queue management for streamlined operations.",
      technologies: [
        "React Native",
        "Node.js",
        "TypeScript",
        "PostgreSQL",
        "Supabase",
        "Express.js",
      ],
      githubUrl: "https://github.com/JiwiKiwi19",
      liveUrl: "#",
      period: "Jan 2025 – May 2025",
    },
    {
      title: "Baseball Analytics ML",
      description:
        "Machine learning project predicting MLB players' future stats using OPS prediction. Features data preprocessing, model evaluation, and performance visualization.",
      technologies: [
        "Python",
        "Jupyter",
        "scikit-learn",
        "pandas",
        "NumPy",
        "Matplotlib",
      ],
      githubUrl: "https://github.com/JiwiKiwi19",
      liveUrl: "#",
      period: "Sep 2024 – Dec 2024",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 ${
            isVisible ? "animate-fade-in" : "opacity-0"
          }`}
        >
          <h2 className="text-4xl font-bold text-primary mb-4">
            Featured Projects
          </h2>
          <p className="text-muted-foreground text-lg">
            Some of my recent work and side projects
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`portfolio-card rounded-xl p-6 group ${
                isVisible ? "animate-fade-in" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Project header with background image */}
              <div
                className="h-48 rounded-lg mb-6 bg-gradient-to-br from-primary/20 to-primary/5 flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300"
                style={{
                  backgroundImage: "url('/project.jpg')",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/40 group-hover:from-primary/70 group-hover:to-primary/30 transition-all duration-300" />
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-white/80 text-sm">{project.period}</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <a
                    href={project.githubUrl}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github size={18} />
                    <span className="text-sm">Code</span>
                  </a>
                  <a
                    href={project.liveUrl}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span className="text-sm">Live Demo</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
