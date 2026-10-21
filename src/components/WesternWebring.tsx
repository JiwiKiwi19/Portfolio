import { useCallback, useEffect, useRef, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { AlertCircle, ArrowUpRight, Loader2, Pause, Play, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import LiveClock from "@/components/LiveClock";
import { cn } from "@/lib/utils";

type Headline = {
  title: string;
  link: string;
  topic: "MLB" | "AI";
  source: string;
  timestamp: number;
};

function relativeTime(timestamp: number) {
  if (!Number.isFinite(timestamp)) return null;
  try {
    return `${formatDistanceToNowStrict(timestamp)} ago`;
  } catch {
    return null;
  }
}

const WesternWebring = () => {
  // Webring script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://jacobl04.github.io/Western-Webrings/webring.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const activeRef = useRef(true);

  // Fetch real news
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("news-feed");
      if (!activeRef.current) return;
      if (error) throw error;
      // An empty response keeps whatever headlines are already showing.
      if (data?.headlines?.length) setHeadlines(data.headlines);
      setError(null);
    } catch (e) {
      if (!activeRef.current) return;
      setError(e instanceof Error ? e.message : "Failed to load news");
    } finally {
      if (activeRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    activeRef.current = true;
    load();
    const refresh = setInterval(load, 5 * 60 * 1000); // refresh every 5 min
    return () => {
      activeRef.current = false;
      clearInterval(refresh);
    };
  }, [load]);

  // Rotation (pauses on hover/focus or when the visitor pauses it)
  useEffect(() => {
    if (headlines.length <= 1 || paused || hovering) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % headlines.length), 5000);
    return () => clearInterval(id);
  }, [headlines.length, paused, hovering]);

  const safeIndex = headlines.length ? index % headlines.length : 0;
  const hasHeadlines = headlines.length > 0;

  return (
    <section id="live" aria-labelledby="live-title" className="relative px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="live-title"
          index="05"
          eyebrow="Live Wire"
          title={
            <>
              Off the <em>clock.</em>
            </>
          }
          description="Live MLB and AI headlines pulled from public feeds, plus the Western Webring of student portfolios."
        />

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          {/* Live News Feed — set like a wire-service desk */}
          <div className="min-w-0 md:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-y-2 border-foreground py-2.5">
              <h3 className="slug text-foreground">The late wire · MLB / AI &amp; ML</h3>
              <div className="slug flex items-center gap-2.5">
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin text-primary" aria-label="Updating" />
                ) : (
                  <span className="relative flex h-2 w-2" aria-hidden>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-city-beacon opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-city-beacon" />
                  </span>
                )}
                <span className="text-foreground/70">TOR</span>
                <span className="text-foreground">
                  <LiveClock />
                </span>
              </div>
            </div>

            {/* Rotating headline */}
            <div
              role="region"
              aria-roledescription="carousel"
              aria-label="Headlines"
              className="relative h-44 overflow-hidden border-b border-border sm:h-40"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              onFocus={() => setHovering(true)}
              onBlur={() => setHovering(false)}
            >
              {!hasHeadlines && loading && (
                <div className="flex h-full flex-col justify-center gap-3" role="status">
                  <span className="sr-only">Loading headlines…</span>
                  <div className="h-6 w-11/12 animate-pulse bg-muted" />
                  <div className="h-6 w-2/3 animate-pulse bg-muted" />
                  <div className="h-2.5 w-24 animate-pulse bg-muted/70" />
                </div>
              )}

              {!hasHeadlines && !loading && (
                <div className="flex h-full items-center justify-between gap-4" role="status">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    {error ? (
                      <>
                        <AlertCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden />
                        Couldn't load headlines right now.
                      </>
                    ) : (
                      "No headlines available right now."
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={load}
                    className="inline-flex shrink-0 items-center gap-1.5 border border-border px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                    Retry
                  </button>
                </div>
              )}

              {headlines.map((h, i) => {
                const isActive = i === safeIndex;
                const ago = relativeTime(h.timestamp);
                return (
                  <a
                    key={`${h.link}-${i}`}
                    href={h.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={isActive ? 0 : -1}
                    aria-hidden={!isActive}
                    className={cn(
                      "group/item absolute inset-0 flex flex-col justify-center gap-3 transition-all duration-500",
                      isActive ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
                    )}
                  >
                    <p className="slug flex items-center gap-3">
                      <span className={h.topic === "MLB" ? "text-city-beacon" : "text-primary"}>{h.topic}</span>
                      <span aria-hidden>·</span>
                      <span>{h.source}</span>
                      {ago && <span className="normal-case tracking-normal">· {ago}</span>}
                    </p>
                    <p className="flex items-start gap-3 font-display text-[1.6rem] leading-[1.1] text-foreground group-hover/item:text-primary md:text-[2.1rem]">
                      <span className="line-clamp-2">{h.title}</span>
                      <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/item:opacity-100 group-focus-visible/item:opacity-100" />
                    </p>
                  </a>
                );
              })}
            </div>

            {/* Controls */}
            {hasHeadlines && (
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused ? "Resume headline rotation" : "Pause headline rotation"}
                  className="inline-flex h-7 w-7 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                </button>
                <div className="flex flex-wrap items-center gap-1">
                  {headlines.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Headline ${i + 1}`}
                      aria-current={i === safeIndex ? "true" : undefined}
                      className={cn(
                        "h-[9px] w-[7px] transition-colors",
                        i === safeIndex ? "bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]" : "bg-border hover:bg-primary/50",
                      )}
                    />
                  ))}
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {String(safeIndex + 1).padStart(2, "0")}/{String(headlines.length).padStart(2, "0")}
                </span>
                {error && (
                  <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <AlertCircle className="h-3 w-3 text-destructive" aria-hidden />
                    Couldn't refresh, showing the last update
                  </span>
                )}
              </div>
            )}

            {/* Marquee strip (decorative duplicate of the headlines above) */}
            {headlines.length > 1 && (
              <div aria-hidden className="mt-6 overflow-hidden border-y border-border">
                <div
                  className="flex animate-marquee whitespace-nowrap py-2 font-mono text-xs text-muted-foreground hover:[animation-play-state:paused]"
                  style={paused ? { animationPlayState: "paused" } : undefined}
                >
                  {[...headlines, ...headlines].map((h, i) => (
                    <span key={i} className="mx-6 inline-flex items-center gap-2">
                      <span className={h.topic === "MLB" ? "text-city-beacon" : "text-primary"}>■</span>
                      <span className="font-medium text-foreground">{h.topic}</span>
                      <span className="max-w-[60ch] truncate">{h.title}</span>
                      <span className="text-muted-foreground/60">· {h.source}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Webring */}
          <div className="min-w-0 md:col-span-4">
            <div className="webring-card flex h-full flex-col border-t-2 border-foreground pt-2.5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="slug text-foreground">Western Webring</h3>
                <span className="slug text-primary">
                  Member
                </span>
              </div>

              <p className="font-display text-3xl leading-tight text-foreground">
                Explore <em>student sites.</em>
              </p>

              <div className="webring-mount mt-5 border-y border-dashed border-border py-5">
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

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Hop between portfolios from fellow Western students. Click{" "}
                <span className="whitespace-nowrap font-mono font-medium text-foreground">[ ? ]</span> for a random adventure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WesternWebring;
