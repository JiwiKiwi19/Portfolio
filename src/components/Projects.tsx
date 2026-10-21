import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

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

const StackLine = ({ stack }: { stack: string[] }) => (
  <ul className="stack-line flex flex-wrap" aria-label="Technologies">
    {stack.map((tech, i) => (
      <li key={tech}>
        {tech}
        {i < stack.length - 1 && <span aria-hidden className="px-2 text-border">/</span>}
      </li>
    ))}
  </ul>
);

const ProjectLinks = ({ project }: { project: Project }) => (
  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
    {project.githubUrl && (
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary"
      >
        <Github size={15} />
        <span className="ink-link">Code</span>
        <span className="sr-only"> for {project.title}</span>
      </a>
    )}
    {project.liveUrl && (
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary"
      >
        <ExternalLink size={15} />
        <span className="ink-link">Live demo</span>
        <span className="sr-only"> of {project.title}</span>
      </a>
    )}
    {project.linkNote && (
      <span className="text-sm text-muted-foreground">{project.linkNote}</span>
    )}
  </div>
);

// An index of work: big folio numbers in the gutter, serif titles, the key challenge as a pull quote.
const Projects = () => {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative px-4 py-16 sm:px-6 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="projects-title"
          index="03"
          eyebrow="Projects"
          title={
            <>
              Selected <em>engineering</em> work.
            </>
          }
          description="Academic, team, and personal projects across GPU computing, machine learning, and full-stack development."
        />

        <ol className="border-b border-border">
          {featured.map((project, index) => (
            <Reveal
              as="li"
              key={project.title}
              className="grid gap-6 border-t border-border py-12 md:grid-cols-12 md:gap-8 md:py-16"
            >
              <p
                aria-hidden
                className="font-display text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.8] text-primary md:col-span-3"
              >
                {String(index + 1).padStart(2, "0")}
              </p>

              <article className="md:col-span-9">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="font-display text-[clamp(2.5rem,5vw,4.25rem)] font-normal leading-[0.95] text-foreground">
                    {project.title}
                  </h3>
                  <p className="slug flex items-center gap-3">
                    {project.team && <span className="text-foreground/80">Team project</span>}
                    {project.team && project.period && <span aria-hidden>·</span>}
                    {project.period && <span>{project.period}</span>}
                  </p>
                </div>
                <p className="mt-3 max-w-2xl text-lg text-muted-foreground md:text-xl">{project.tagline}</p>

                {project.result && (
                  <p className="mt-5 inline-flex items-center gap-3 font-mono text-[13px] text-primary">
                    <span className="lit" aria-hidden />
                    {project.result}
                  </p>
                )}

                <div className="mt-8 grid gap-8 lg:grid-cols-10">
                  <ul className="space-y-3 lg:col-span-6">
                    {project.built.map((item) => (
                      <li
                        key={item}
                        className="flex gap-4 text-[15px] leading-relaxed text-muted-foreground"
                      >
                        <span aria-hidden className="mt-[0.7rem] h-px w-4 shrink-0 bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <blockquote className="border-l border-foreground/60 pl-5 lg:col-span-4">
                    <p className="slug mb-2">Key challenge</p>
                    <p className="font-display text-2xl italic leading-snug text-foreground">
                      {project.challenge}
                    </p>
                  </blockquote>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-border pt-4">
                  <StackLine stack={project.stack} />
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <ProjectLinks project={project} />
                    {project.website && (
                      <a
                        href={project.website.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                      >
                        <span className="ink-link">Visit {project.website.label}</span>
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
        </ol>

        <Reveal className="mt-16 grid gap-6 md:grid-cols-12 md:gap-8">
          <h3 className="slug md:col-span-3">
            More projects
          </h3>
          <ul className="md:col-span-9">
            {more.map((project) => (
              <li
                key={project.title}
                className="grid gap-4 border-t border-border py-6 last:border-b md:grid-cols-[1fr_auto] md:items-start"
              >
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <p className="font-display text-3xl leading-tight text-foreground">
                      {project.title}
                    </p>
                    {project.period && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {project.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
                    {project.tagline}
                  </p>
                  <div className="mt-3">
                    <StackLine stack={project.stack} />
                  </div>
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
