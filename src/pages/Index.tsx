import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import SkillsSection from "@/components/SkillsSection";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import ScrollToTop from "@/components/ScrollToTop";
import WesternWebring from "@/components/WesternWebring";
import BatCursor from "@/components/BatCursor";
import AskSection from "@/components/chat/AskSection";
import TorontoSkyline from "@/components/TorontoSkyline";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Navigation />
      <Hero />
      {/* Hard rule between hero and body — mirrors V5's 3px green border-top */}
      <div className="h-[3px] bg-primary" aria-hidden />
      <main>
        <About />
        <Experience />
        <Projects />
        <SkillsSection />
        <WesternWebring />
        <AskSection />
        <Contact />
      </main>

      {/* Toronto skyline footer */}
      <footer className="relative border-t border-border bg-background">
        {/* aspect-ratio wrapper ensures full SVG is visible at any viewport width */}
        <div style={{ aspectRatio: '1440 / 320', width: '100%' }}>
          <TorontoSkyline
            className="pointer-events-none block h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          />
        </div>
        <div className="pb-8 pt-1 text-center">
          <p className="slug text-muted-foreground/60">
            Toronto · Western University · {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      <ScrollToTop />
      <BatCursor />
    </div>
  );
};

export default Index;
