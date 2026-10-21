import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const facts = [
  {
    label: "Education",
    title: "BSc Computer Science, Western University",
    detail: "Sep 2023 – May 2028 · GPA 3.5/4.0",
  },
  {
    label: "Currently",
    title: "Software Engineering Intern, INVENTIS Korea",
    detail: "Seoul, South Korea · Sep 2026 – Feb 2027",
  },
  {
    label: "Based in",
    title: "London, ON · Aurora, ON",
    detail: "Open to internships and hackathon teams",
  },
];

const coursework = ["Operating Systems", "Databases", "Machine Learning", "Reinforcement Learning", "Data Science"];

const About = () => {
  return (
    <section id="about" aria-labelledby="about-title" className="relative px-4 pb-16 pt-20 sm:px-6 md:pb-20 md:pt-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="about-title"
          index="01"
          eyebrow="About"
          title={
            <>
              Building across <em>the stack.</em>
            </>
          }
        />

        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {/* Fact box in the left gutter, like a newspaper sidebar */}
          <Reveal as="div" className="order-2 md:order-1 md:col-span-3">
            <dl className="border-t border-foreground/70">
              {facts.map(({ label, title, detail }) => (
                <div key={label} className="border-b border-border py-4">
                  <dt className="slug">{label}</dt>
                  <dd className="mt-1.5 text-[15px] font-medium leading-snug text-foreground">{title}</dd>
                  <dd className="mt-1 text-sm text-muted-foreground">{detail}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="order-1 md:order-2 md:col-span-9 md:col-start-4">
            <p className="max-w-4xl font-display text-[clamp(1.75rem,3.2vw,2.6rem)] leading-[1.15] text-foreground">
              I'm a Computer Science student at Western University who likes building software end to
              end, from <em>GPU compute kernels</em> and <em>machine learning pipelines</em> to the{" "}
              <em>web apps</em> people actually use.
            </p>
            <div className="mt-8 grid max-w-4xl gap-6 text-base leading-relaxed text-muted-foreground sm:grid-cols-2 md:text-[17px]">
              <p>
                Right now I'm a Software Engineering Intern at INVENTIS Korea in Seoul, working in a
                multi-layer C#/ASP.NET backend. Before that, I shipped a production web application for a
                rehabilitation clinic in Mississauga.
              </p>
              <p>
                Outside of class I follow baseball closely, which is why there's a bat following your
                cursor and live MLB headlines further down the page.
              </p>
            </div>

            <div className="mt-10 border-t border-border pt-4">
              <p className="slug mb-2">Relevant coursework</p>
              <ul className="flex flex-wrap gap-x-1 text-[15px] text-foreground/85">
                {coursework.map((course, i) => (
                  <li key={course}>
                    {course}
                    {i < coursework.length - 1 && <span aria-hidden className="px-1.5 text-muted-foreground">/</span>}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default About;
