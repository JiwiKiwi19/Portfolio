import { useState, useEffect } from "react";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Statistical & Data Analyst";

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <header
      className="relative min-h-[400px] hero-bg overflow-hidden transition-all duration-500 ease-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background overlay that appears on hover */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: "url('/baseball-hero.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[400px] px-6 text-center">
        <div className="animate-fade-in">
          <h1 className="text-primary text-xl font-medium mb-2 tracking-wide">
            Hello, I'm
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 font-serif">
            Jiwon Lee
          </h2>
          <div className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-8 leading-relaxed min-h-[2rem]">
            <span className="border-r-2 border-primary animate-pulse">
              {displayedText}
            </span>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex gap-6 mt-4">
          {[
            {
              icon: Github,
              label: "GitHub",
              href: "https://github.com/JiwiKiwi19",
            },
            {
              icon: Linkedin,
              label: "LinkedIn",
              href: "https://linkedin.com/in/jiwon-lee-7614362ab",
            },
            { icon: Mail, label: "Email", href: "mailto:ousfame5@gmail.com" },
            { icon: ExternalLink, label: "Portfolio", href: "#projects" },
          ].map(({ icon: Icon, label, href }, index) => (
            <a
              key={label}
              href={href}
              className="text-foreground hover:text-primary transition-colors duration-300 transform hover:scale-110"
              style={{ animationDelay: `${index * 0.1}s` }}
              aria-label={label}
            >
              <Icon size={28} className="animate-fade-in" />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Hero;
