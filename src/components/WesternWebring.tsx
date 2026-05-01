import React, { useEffect, useMemo, useState } from "react";
import { Newspaper, Sparkles, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Headline = {
  title: string;
  link: string;
  topic: "MLB" | "AI";
  source: string;
  timestamp: number;
};

const FALLBACK: Headline[] = [
  {
    title: "Loading the latest MLB and AI headlines…",
    link: "#",
    topic: "AI",
    source: "Live Wire",
    timestamp: Date.now(),
  },
];

const WesternWebring = () => {
  // Webring script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://jacobl04.github.io/Western-Webrings/webring.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      try {
        document.body.removeChild(script);
      } catch {}
    };
  }, []);

  const [headlines, setHeadlines] = useState<Headline[]>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [tick, setTick] = useState(0);

  // Fetch real news
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("news-feed");
        if (!active) return;
        if (error) throw error;
        if (data?.headlines?.length) {
          setHeadlines(data.headlines);
          setError(null);
        } else {
          setError("No headlines available");
        }
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Failed to load news");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    const refresh = setInterval(load, 5 * 60 * 1000); // refresh every 5 min
    return () => {
      active = false;
      clearInterval(refresh);
    };
  }, []);

  // Rotation
  useEffect(() => {
    if (headlines.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % headlines.length),
      5000,
    );
    return () => clearInterval(id);
  }, [headlines.length]);

  // Clock
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const time = useMemo(() => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const safeIndex = headlines.length ? index % headlines.length : 0;

  return (
    <section className="w-full border-t border-border bg-gradient-to-b from-background to-secondary/40 py-10">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-5 items-stretch">
          {/* Webring Card */}
          <div className="md:col-span-2">
            <div className="webring-card group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-elegant)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.18),transparent_70%)]" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/5" />

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Western Webring
                    </p>
                    <h3 className="text-base font-bold text-foreground">
                      Explore student sites
                    </h3>
                  </div>
                </div>
                <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                  Connected
                </span>
              </div>

              <div className="webring-mount rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-5">
                <div
                  id="western-webring"
                  data-style="default"
                  data-color="blue"
                  data-show-list="true"
                  data-show-random="true"
                  data-random-text="[ ? ]"
                  data-arrow-prev="◀ Prev"
                  data-arrow-next="Next ▶"
                ></div>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Hop between portfolios from fellow Western students. Click{" "}
                <span className="font-semibold text-foreground">[ ? ]</span> for
                a random adventure.
              </p>
            </div>
          </div>

          {/* Live News Feed */}
          <div className="md:col-span-3">
            <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-secondary/60 p-6 shadow-[var(--shadow-card)]">
              <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.12),transparent_70%)]" />

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Newspaper className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Live Wire
                    </p>
                    <h3 className="text-base font-bold text-foreground">
                      MLB · AI &amp; ML News
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-xs text-muted-foreground">
                  {loading ? (
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  ) : (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                    </span>
                  )}
                  {time}
                </div>
              </div>

              {/* Rotating headline */}
              <div className="relative h-24 overflow-hidden rounded-xl border border-border bg-background/70">
                {headlines.map((h, i) => {
                  const tone = h.topic === "MLB" ? "mlb" : "ai";
                  return (
                    <a
                      key={`${h.link}-${i}`}
                      href={h.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`absolute inset-0 flex items-center gap-3 px-5 transition-all duration-500 group/item ${
                        i === safeIndex
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0 pointer-events-none"
                      }`}
                    >
                      <span
                        className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          tone === "mlb"
                            ? "bg-red-500/10 text-red-600"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {h.topic}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-foreground group-hover/item:text-primary md:text-base">
                          {h.title}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {h.source}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/item:opacity-100" />
                    </a>
                  );
                })}
              </div>

              {/* Dots */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {headlines.slice(0, 12).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Headline ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === safeIndex
                        ? "w-6 bg-primary"
                        : "w-1.5 bg-border hover:bg-primary/40"
                    }`}
                  />
                ))}
                {error && (
                  <span className="ml-2 text-[10px] text-muted-foreground">
                    Using fallback
                  </span>
                )}
              </div>

              {/* Marquee strip */}
              {headlines.length > 1 && (
                <div className="mt-5 overflow-hidden rounded-lg border border-border bg-secondary/50">
                  <div className="flex animate-marquee whitespace-nowrap py-2 text-xs font-mono text-muted-foreground">
                    {[...headlines, ...headlines].map((h, i) => (
                      <span
                        key={i}
                        className="mx-6 inline-flex items-center gap-2"
                      >
                        <span
                          className={
                            h.topic === "MLB" ? "text-red-500" : "text-primary"
                          }
                        >
                          ◆
                        </span>
                        <span className="font-semibold text-foreground">
                          {h.topic}
                        </span>
                        <span className="max-w-[60ch] truncate">{h.title}</span>
                        <span className="text-muted-foreground/60">
                          · {h.source}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WesternWebring;
