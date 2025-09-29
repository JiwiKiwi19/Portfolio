import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  return (
    <footer className="bg-secondary py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-primary mb-8">Let's Connect</h2>

        <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          I'm always interested in new opportunities and collaborations.
          Currently studying at Western University and actively seeking
          internships and projects!
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
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
            {
              icon: MapPin,
              label: "Location",
              value: "London, ON / Aurora, ON",
              href: "#",
            },
          ].map(({ icon: Icon, label, value, href }, index) => (
            <a
              key={label}
              href={href}
              className="portfolio-card rounded-xl p-6 block group hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Icon className="w-8 h-8 text-primary mx-auto mb-4 group-hover:animate-float" />
              <h3 className="font-semibold text-foreground mb-2">{label}</h3>
              <p className="text-muted-foreground group-hover:text-primary transition-colors">
                {value}
              </p>
            </a>
          ))}
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-muted-foreground">
            © 2024 Jiwon Lee. Built with React, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
