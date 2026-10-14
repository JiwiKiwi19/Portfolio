import { ChevronDown, FileText, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const cardClass =
  "glass-panel glass-panel-interactive group flex w-full items-center gap-4 rounded-2xl p-5 text-left";

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
      <section id="contact" aria-labelledby="contact-title" className="relative px-4 py-24 sm:px-6 md:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            id="contact-title"
            index="06"
            eyebrow="Contact"
            title="Let's connect."
            description="I'm always interested in internship opportunities, hackathon teams, and collaborations. The fastest way to reach me is email."
          />

          <Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "ousfame5@gmail.com",
                  href: "mailto:ousfame5@gmail.com",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "(647) 889-3822",
                  href: "tel:+16478893822",
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} className={cardClass}>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                    <p className="mt-0.5 truncate font-medium text-foreground transition-colors group-hover:text-primary">
                      {value}
                    </p>
                  </div>
                </a>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className={cardClass}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MapPin size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        Location
                      </p>
                      <p className="mt-0.5 font-medium text-foreground transition-colors group-hover:text-primary">
                        London / Aurora
                      </p>
                    </div>
                    <ChevronDown size={18} className="shrink-0 text-muted-foreground" aria-hidden />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="center">
                  <DropdownMenuItem onSelect={() => openMap("London, Ontario")}>London, ON</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => openMap("Aurora, Ontario")}>Aurora, ON</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: Github, label: "GitHub", href: "https://github.com/JiwiKiwi19" },
                { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/jiwon-lee-7614362ab" },
                { icon: FileText, label: "Résumé (PDF)", href: "/resume.pdf" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Icon size={16} />
                  {label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border/70 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Jiwon Lee</p>
          <p>Built with React, TypeScript, and Tailwind CSS.</p>
        </div>
      </footer>
    </>
  );
};

export default Contact;
