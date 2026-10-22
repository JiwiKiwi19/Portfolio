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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Navigation />
      <Hero />
      <main>
        <About />
        <Experience />
        <Projects />
        <SkillsSection />
        <WesternWebring />
        <AskSection />
        <Contact />
      </main>
      <ScrollToTop />
      <BatCursor />
    </div>
  );
};

export default Index;
