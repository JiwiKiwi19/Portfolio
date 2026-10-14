import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

interface SectionHeadingProps {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
}

const SectionHeading = ({ id, index, eyebrow, title, description }: SectionHeadingProps) => (
  <Reveal className="mb-12 max-w-2xl md:mb-16">
    <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-primary">
      <span className="text-muted-foreground">{index}</span>
      <span aria-hidden className="h-px w-8 bg-primary/50" />
      {eyebrow}
    </p>
    <h2
      id={id}
      className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
    >
      {title}
    </h2>
    {description && (
      <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
    )}
  </Reveal>
);

export default SectionHeading;
