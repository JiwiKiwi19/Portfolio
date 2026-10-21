import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

interface SectionHeadingProps {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
}

// Newspaper section head: heavy rule, slug in the left gutter, serif headline on the right.
const SectionHeading = ({ id, index, eyebrow, title, description }: SectionHeadingProps) => (
  <Reveal className="mb-12 md:mb-16">
    <div className="grid gap-4 border-t-2 border-foreground pt-4 md:grid-cols-12 md:gap-8">
      <p className="slug flex items-baseline gap-3 md:col-span-3">
        <span className="text-primary">§{index}</span>
        <span>{eyebrow}</span>
      </p>
      <div className="md:col-span-9">
        <h2
          id={id}
          className="font-display text-[clamp(2.75rem,6.5vw,5.5rem)] font-normal leading-[0.92] tracking-[-0.01em] text-foreground"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
        )}
      </div>
    </div>
  </Reveal>
);

export default SectionHeading;
