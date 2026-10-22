import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

// The chat UI (and its speech code) loads only when the section nears the viewport,
// so it never delays the first paint of the portfolio.
const ChatPanel = lazy(() => import("./ChatPanel"));

const notes = [
  { label: "Grounded", text: "Answers about Jiwon come from his verified portfolio and résumé. If it isn't there, J.AI says so." },
  { label: "Live", text: "Weather from Open-Meteo, headlines from publisher feeds, repos from GitHub, each with its source." },
  { label: "Talkable", text: "Dictate a message, or open voice mode for a hands-free conversation." },
  { label: "Private", text: "Nothing is saved. The conversation disappears when you leave the page." },
];

const PanelPlaceholder = () => (
  <div className="flex h-[min(62vh,640px)] min-h-[520px] items-center justify-center border-t-2 border-foreground" role="status">
    <span className="jai-dots inline-flex gap-1" aria-hidden>
      <span />
      <span />
      <span />
    </span>
    <span className="sr-only">Loading the assistant…</span>
  </div>
);

const AskSection = () => {
  const ref = useRef<HTMLElement>(null);
  const [load, setLoad] = useState(() => typeof window !== "undefined" && window.location.hash === "#ask");

  useEffect(() => {
    if (load) return;
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) return setLoad(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    const onHash = () => window.location.hash === "#ask" && setLoad(true);
    window.addEventListener("hashchange", onHash);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onHash);
    };
  }, [load]);

  return (
    <section ref={ref} id="ask" aria-labelledby="ask-title" className="relative px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="ask-title"
          index="06"
          eyebrow="Ask"
          title={
            <>
              Ask my <em>AI.</em>
            </>
          }
          description="Questions about my work, my projects, or what I'm up to, answered in conversation. Or just chat."
        />

        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <Reveal as="div" className="order-2 md:order-1 md:col-span-3">
            <dl className="border-t border-foreground/70">
              {notes.map(({ label, text }) => (
                <div key={label} className="border-b border-border py-4">
                  <dt className="slug">{label}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="order-1 min-w-0 md:order-2 md:col-span-9">
            {load ? (
              <Suspense fallback={<PanelPlaceholder />}>
                <ChatPanel />
              </Suspense>
            ) : (
              <PanelPlaceholder />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AskSection;
