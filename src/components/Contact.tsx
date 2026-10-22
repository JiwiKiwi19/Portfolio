import { ArrowUpRight, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const rowClass =
  "group flex w-full items-baseline justify-between gap-4 border-b border-border py-4 text-left transition-colors hover:text-primary";

const Contact = () => {
  const openMap = (query: string) => {
    const encodedQuery = encodeURIComponent(query);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <>
      <section id="contact" aria-labelledby="contact-title" className="relative px-4 pb-24 pt-16 sm:px-6 md:pb-32 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            id="contact-title"
            index="07"
            eyebrow="Contact"
            title={
              <>
                Let's <em>connect.</em>
              </>
            }
            description="I'm always interested in internship opportunities, hackathon teams, and collaborations. The fastest way to reach me is email."
          />

          <Reveal className="grid gap-12 md:grid-cols-12 md:gap-8">
            {/* Email is the call to action, so it gets set at headline size */}
            <div className="md:col-span-7">
              <p className="slug mb-3">Email</p>
              <a
                href="mailto:ousfame5@gmail.com"
                className="font-display text-[clamp(2rem,5.4vw,4.5rem)] leading-none text-foreground underline decoration-primary decoration-2 underline-offset-[0.18em] transition-colors hover:text-primary"
              >
                ousfame5@gmail.com
              </a>
            </div>

            <ul className="border-t border-foreground/70 md:col-span-4 md:col-start-9">
              <li>
                <a href="tel:+16478893822" className={rowClass}>
                  <span className="slug">Phone</span>
                  <span className="font-medium">(647) 889-3822</span>
                </a>
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={rowClass}>
                      <span className="slug">Location</span>
                      <span className="flex items-center gap-1.5 font-medium">
                        London / Aurora
                        <ChevronDown size={16} className="text-muted-foreground" aria-hidden />
                      </span>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem onSelect={() => openMap("London, Ontario")}>London, ON</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => openMap("Aurora, Ontario")}>Aurora, ON</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              {[
                { label: "GitHub", value: "JiwiKiwi19", href: "https://github.com/JiwiKiwi19" },
                { label: "LinkedIn", value: "jiwon-lee", href: "https://linkedin.com/in/jiwon-lee-7614362ab" },
                { label: "Résumé (PDF)", value: "Download", href: "/resume.pdf" },
              ].map(({ label, value, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className={rowClass}>
                    <span className="slug">{label}</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      {value}
                      <ArrowUpRight size={15} className="text-muted-foreground transition-colors group-hover:text-primary" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <footer className="px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t-2 border-foreground py-6 text-sm text-muted-foreground sm:flex-row sm:items-baseline sm:justify-between">
          <p>© {new Date().getFullYear()} Jiwon Lee</p>
          <p>Built with React, TypeScript, and Tailwind CSS.</p>
          <p className="slug">43.65° N 79.38° W</p>
        </div>
      </footer>
    </>
  );
};

export default Contact;
