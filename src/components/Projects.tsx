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
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const projects = [
    {
      title: "Pong",
      description:
        "Engineered a Proximal Policy Optimization (PPO) reinforcement learning pipeline in Atari Pong to analyze the bias-efficiency tradeoffs between multi-stage curriculum gating and direct training over a 25-million-timestep budget.",
      technologies: ["Python", "Atari Pong", "Gymnasium API", "RunPod"],
      githubUrl: "https://github.com/JiwiKiwi19/PongRL",
      liveUrl: "#",
      period: "Feb 2026 – Apr 2026",
    },
    {
      title: "Sentimentrix",
      description:
        "Designed and implemented a scalable multimodal sentiment analysis system that leverages Reddit data (posts, comments, and images) using NLP techniques, TF-IDF, and transformer models (BERT) to accurately classify and interpret community sentiment.",
      technologies: [
        "Python",
        "scikit-learn",
        "Hugging Face Transformers",
        "NumPy & Pandas",
        "PyTorch",
        "Matplotlib / Seaborn",
      ],
      githubUrl: "https://github.com/patelMaharshii/Sentimentrix",
      liveUrl: "#",
      period: "Oct 2025 – Dec 2025",
    },
    {
      title: "ROCsim",
      description:
        "Open-source, GPU-accelerated physics simulation engine optimized for AMD Radeon GPUs using ROCm/HIP, with full support for NVIDIA GPUs. Real-time visualization of complex physics simulations including gravitational systems, collision dynamics, and spring networks.",
      technologies: ["C++", "CMake", "C", "Qt", "OpenGL", "CUDA"],
      githubUrl: "https://github.com/JiwiKiwi19/RockSim",
      liveUrl: "#",
      period: "Sep 2025 – Nov 2025",
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
      githubUrl: "https://github.com/JiwiKiwi19/NewSpot",
      liveUrl: "#",
      period: "Jan 2025 – May 2025",
    },
    {
      title: "MLB Player Performance Predictor",
      description:
        "Advanced machine learning model predicting baseball player performance using historical stats, OPS calculations, and sabermetrics. Features interactive visualizations and player comparison tools.",
      technologies: [
        "Python",
        "scikit-learn",
        "pandas",
        "Matplotlib",
        "Seaborn",
        "statsmodels",
      ],
      githubUrl: "https://github.com/JiwiKiwi19/Baseball-Prediction",
      liveUrl: "#",
      period: "Sep 2024 – Dec 2024",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
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
                  backgroundImage:
                    index === 2
                      ? "url('/physics.jpg')"
                      : index === 3
                        ? "url('/fullstack.jpg')"
                        : index === 4
                          ? "url('/baseball-stats.jpg')"
                          : "url('/project.jpg')",
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
