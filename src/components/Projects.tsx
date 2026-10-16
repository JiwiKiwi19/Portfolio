import { ExternalLink, Github, Users } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { ArrowUpRight } from "lucide-react";

type Project = {
  title: string;
  tagline: string;
  period?: string;
  team?: boolean;
  result?: string;
  built: string[];
  challenge: string;
  stack: string[];
  githubUrl?: string;
  liveUrl?: string;
  linkNote?: string;
  website?: { href: string; label: string };
};

const featured: Project[] = [
  {
    title: "ROCsim",
    tagline:
      "Real-time GPU physics engine that runs on both AMD and NVIDIA hardware.",
    period: "Sep 2025 – Nov 2025",
    result: "60 FPS at 500–1,000 particles · RTX 3070 & RX 6800",
    built: [
      "Wrote CUDA and HIP/ROCm compute kernels for a real-time N-body and collision physics engine.",
      "Implemented 3 physics models (gravity, collision, spring) and 2 integrators (Verlet, RK4) behind Strategy and Factory patterns, with runtime model switching and adaptive timesteps.",
      "Built a Qt 6.5/OpenGL interface that renders up to 5,000 particles through shared GPU buffers, with live controls, energy-based color coding, and an FPS readout.",
    ],
    challenge:
      "Supporting two GPU vendors (CUDA and HIP/ROCm) behind one simulation core.",
    stack: ["C++17", "CUDA", "HIP/ROCm", "Qt 6", "OpenGL", "CMake"],
    website: {
      href: "https://rock-sim2-d38fmr76a-jiwons-projects-b2d4314d.vercel.app/",
      label: "ROCsim2",
    },
    githubUrl: "https://github.com/JiwiKiwi19/RockSim",
  },
  {
    title: "Sentimentrix",
    tagline: "Sentiment classification pipeline for Reddit comments.",
    period: "Oct 2025 – Dec 2025",
    team: true,
    result: "78.4% test accuracy · 0.77 weighted F1 · 0.83 ROC AUC",
    built: [
      "Labeled 150,000 Reddit comments as positive, neutral, or negative with VADER, then trained an SVM on BERT embeddings of 20,000 comments to predict those labels.",
      "Benchmarked a linear SVM on TF-IDF (unigrams and bigrams) against an RBF SVM on PCA-reduced BERT embeddings, tuning both with GridSearchCV and 3–5 fold cross-validation.",
    ],
    challenge:
      "Comparing sparse TF-IDF features against dense BERT embeddings under the same tuning protocol.",
    stack: ["Python", "BERT", "scikit-learn", "pandas", "Jupyter"],
    githubUrl: "https://github.com/patelMaharshii/Sentimentrix",
  },
  {
    title: "Pong RL",
    tagline:
      "Curriculum learning vs. direct training for a PPO agent in Atari Pong.",
    period: "Feb 2026 – Apr 2026",
    built: [
      "Engineered a Proximal Policy Optimization (PPO) reinforcement learning pipeline in Atari Pong.",
      "Analyzed the bias–efficiency trade-offs between multi-stage curriculum gating and direct training over a 25-million-timestep budget.",
    ],
    challenge:
      "Running a fair comparison of two training strategies under a fixed 25M-timestep compute budget.",
    stack: ["Python", "PPO", "Gymnasium", "RunPod"],
    githubUrl: "https://github.com/JiwiKiwi19/PongRL",
  },
  {
    title: "THOTH",
    tagline: "Web platform for a Wi-Fi motion-tracking research project.",
    team: true,
    built: [
      "Owned the entire Next.js frontend, integrating a FastAPI backend and Supabase.",
      "Built the chat interface for the site's AI assistant, letting visitors get answers about the project without contacting the research team.",
    ],
    challenge:
      "Bringing a research backend and an AI assistant together in one approachable frontend.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Supabase"],
    linkNote: "Team project no longer active · no public link",
  },
];

const more: Project[] = [
  {
    title: "SPOT Restaurant Management",
    tagline:
      "Full-stack restaurant order management system with real-time order tracking, table arrangement, and live queue management.",
    period: "Jan 2025 – May 2025",
    built: [],
    challenge: "",
    stack: [
      "React Native",
      "Node.js",
      "Express.js",
      "TypeScript",
      "PostgreSQL",
      "Supabase",
    ],
    githubUrl: "https://github.com/JiwiKiwi19/NewSpot",
  },
  {
    title: "MLB Player Performance Predictor",
    tagline:
      "Machine learning models that forecast MLB player performance (including OPS) from historical stats and sabermetric features, with visualizations and player comparisons.",
    period: "Sep 2024 – Dec 2024",
    built: [],
    challenge: "",
    stack: [
      "Python",
      "scikit-learn",
      "pandas",
      "statsmodels",
      "Matplotlib",
      "Seaborn",
    ],
    githubUrl: "https://github.com/JiwiKiwi19/Baseball-Prediction",
  },
];

const ProjectLinks = ({ project }: { project: Project }) => (
  <div className="flex flex-wrap items-center gap-4">
    {project.githubUrl && (
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <Github size={16} />
        Code<span className="sr-only"> for {project.title}</span>
      </a>
    )}
    {project.liveUrl && (
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ExternalLink size={16} />
        Live demo<span className="sr-only"> of {project.title}</span>
      </a>
    )}
    {project.linkNote && (
      <span className="text-sm text-muted-foreground">{project.linkNote}</span>
    )}
  </div>
);

const Projects = () => {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative px-4 py-24 sm:px-6 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="projects-title"
          index="03"
          eyebrow="Projects"
          title="Selected engineering work."
          description="Academic, team, and personal projects across GPU computing, machine learning, and full-stack development."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {featured.map((project, index) => (
            <Reveal
              key={project.title}
              delay={(index % 2) * 100}
              className="h-full"
            >
              <article className="glass-panel glass-panel-interactive flex h-full flex-col rounded-2xl p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
                  <span className="text-primary/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-2">
                    {project.team && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-2.5 py-1 text-[11px] uppercase tracking-wider text-foreground/85">
                        <Users size={12} aria-hidden />
                        Team project
                      </span>
                    )}
                    {project.period && <span>{project.period}</span>}
                  </div>
                </div>

                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {project.title}
                </h3>
                <p className="mt-2 text-muted-foreground">{project.tagline}</p>

                {project.result && (
                  <p className="mt-5 rounded-lg border border-primary/20 bg-primary/[0.06] px-3.5 py-2.5 font-mono text-[13px] text-primary">
                    {project.result}
                  </p>
                )}

                <ul className="mt-5 space-y-2.5">
                  {project.built.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-5 border-l-2 border-city-violet/60 pl-3 text-sm leading-relaxed text-foreground/85">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-city-violet">
                    Key challenge
                  </span>
                  <br />
                  {project.challenge}
                </p>

                <div className="mt-auto pt-6">
                  <ul
                    className="mb-5 flex flex-wrap gap-2"
                    aria-label="Technologies"
                  >
                    {project.stack.map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <ProjectLinks project={project} />
                    {project.website && (
                      <a
                        href={project.website.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        Visit {project.website.label}
                        <ArrowUpRight
                          size={16}
                          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            More projects
          </h3>
          <ul className="divide-y divide-border/80 rounded-2xl border border-border/80">
            {more.map((project) => (
              <li
                key={project.title}
                className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-start md:p-6"
              >
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="font-display text-lg font-semibold text-foreground">
                      {project.title}
                    </p>
                    {project.period && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {project.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {project.tagline}
                  </p>
                  <ul
                    className="mt-3 flex flex-wrap gap-2"
                    aria-label="Technologies"
                  >
                    {project.stack.map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
                <ProjectLinks project={project} />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};

export default Projects;
