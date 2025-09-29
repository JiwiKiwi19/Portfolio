import { useEffect, useRef, useState } from "react";

const Experience = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const experiences = [
    {
      title: "WIFI Sensing ML Analyst",
      company: "Western University",
      location: "London, ON",
      period: "Apr 2025 – Present",
      responsibilities: [
        "Processed and analyzed Channel State Information (CSI) data using Wi-Fi signals to detect human presence",
        "Configured Wi-Fi sensing hardware, including access points and antennas, to collect high-quality CSI data",
        "Worked with Python and MATLAB to preprocess data and develop machine learning models",
      ],
    },
    {
      title: "Personal Training Assistant",
      company: "Private Care",
      location: "Aurora, ON",
      period: "Jul 2024 – Present",
      responsibilities: [
        "Assisted with walking exercises, providing support and encouragement for mobility improvement",
        "Spent 200+ hours on specialized care activities to ensure comfort and accessibility",
        "Conducted balance practice sessions, helping to improve stability and coordination",
        "Encouraged progressive independence while ensuring safety throughout all activities",
      ],
    },
    {
      title: "Tutor",
      company: "YRDSB School Region",
      location: "Richmond Hill, ON",
      period: "Sep 2022 – Aug 2025",
      responsibilities: [
        "Helped 10+ students with academic success by creating custom homework and presentations",
        "Emphasized reinforcement techniques in reviewing and mastering challenging course material",
        "Initiated communication with parents to establish strong support systems for academic success",
        "Developed personalized learning strategies to accommodate different learning styles",
      ],
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center mb-16 ${
            isVisible ? "animate-fade-in" : "opacity-0"
          }`}
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={exp.title}
              className={`portfolio-card rounded-xl p-8 transform hover:scale-[1.02] transition-all duration-300 ${
                isVisible ? "animate-fade-in" : "opacity-0"
              }`}
              style={{
                animationDelay: `${index * 0.2}s`,
                backgroundImage: "url('/experience.jpg')",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-card/95 to-card/85 rounded-xl" />

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      {exp.title}
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      {exp.company}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {exp.location}
                    </p>
                  </div>
                  <span className="text-primary/80 font-medium mt-2 md:mt-0 bg-primary/10 px-3 py-1 rounded-full text-sm">
                    {exp.period}
                  </span>
                </div>

                <div className="space-y-3">
                  {exp.responsibilities.map((responsibility, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3"
                      style={{ animationDelay: `${index * 0.2 + idx * 0.1}s` }}
                    >
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-foreground leading-relaxed">
                        {responsibility}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
