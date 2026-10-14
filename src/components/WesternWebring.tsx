import { useCallback, useEffect, useRef, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { AlertCircle, ExternalLink, Loader2, Newspaper, Pause, Play, RefreshCw, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SectionHeading from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

type Headline = {
  title: string;
  link: string;
  topic: "MLB" | "AI";
  source: string;
  timestamp: number;
};

// Ticks on its own so the whole widget doesn't re-render every second.
const LiveClock = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <time dateTime={now.toISOString()}>
      {now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "America/Toronto",
      })}
    </time>
  );
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
    <section id="live" aria-labelledby="live-title" className="relative px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="live-title"
          index="05"
          eyebrow="Live Wire"
          title="Off the clock."
          description="Live MLB and AI headlines pulled from public feeds, plus the Western Webring of student portfolios."
        />

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-5">
          {/* Live News Feed */}
          <div className="min-w-0 md:col-span-3">
            <div className="glass-panel relative h-full overflow-hidden rounded-2xl p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.14),transparent_70%)]"
              />

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Newspaper className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Live Wire
                    </p>
                    <h3 className="font-display text-base font-semibold text-foreground">MLB · AI &amp; ML News</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-xs text-muted-foreground">
                  {loading ? (
                    <Loader2 className="h-3 w-3 animate-spin text-primary" aria-label="Updating" />
                  ) : (
                    <span className="relative flex h-2 w-2" aria-hidden>
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                    </span>
                  )}
                  <span className="text-foreground/70">TOR</span>
                  <LiveClock />
                </div>
              </div>

              {/* Rotating headline */}
              <div
                role="region"
                aria-roledescription="carousel"
                aria-label="Headlines"
                className="relative h-28 overflow-hidden rounded-xl border border-border bg-background/70"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                onFocus={() => setHovering(true)}
                onBlur={() => setHovering(false)}
              >
                {!hasHeadlines && loading && (
                  <div className="flex h-full flex-col justify-center gap-2.5 px-5" role="status">
                    <span className="sr-only">Loading headlines…</span>
                    <div className="h-3.5 w-11/12 animate-pulse rounded bg-muted" />
                    <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="h-2.5 w-24 animate-pulse rounded bg-muted/70" />
                  </div>
                )}

                {!hasHeadlines && !loading && (
                  <div className="flex h-full items-center justify-between gap-4 px-5" role="status">
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
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
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
                        "group/item absolute inset-0 flex items-center gap-3 px-5 transition-all duration-500",
                        isActive ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
                      )}
                    >
                      <span
                        className={cn(
                          "shrink-0 rounded-md px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider",
                          h.topic === "MLB" ? "bg-red-500/15 text-red-300" : "bg-city-violet/15 text-city-violet",
                        )}
                      >
                        {h.topic}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-foreground group-hover/item:text-primary md:text-base">
                          {h.title}
                        </p>
                        <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          {h.source}
                          {ago && <span className="normal-case tracking-normal"> · {ago}</span>}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/item:opacity-100 group-focus-visible/item:opacity-100" />
                    </a>
                  );
                })}
              </div>

              {/* Controls */}
              {hasHeadlines && (
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <button
                    type="button"
                    onClick={() => setPaused((p) => !p)}
                    aria-label={paused ? "Resume headline rotation" : "Pause headline rotation"}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                  </button>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {headlines.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Headline ${i + 1}`}
                        aria-current={i === safeIndex ? "true" : undefined}
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          i === safeIndex ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-primary/40",
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
                <div aria-hidden className="mt-5 overflow-hidden rounded-lg border border-border bg-secondary/50">
                  <div
                    className="flex animate-marquee whitespace-nowrap py-2 font-mono text-xs text-muted-foreground hover:[animation-play-state:paused]"
                    style={paused ? { animationPlayState: "paused" } : undefined}
                  >
                    {[...headlines, ...headlines].map((h, i) => (
                      <span key={i} className="mx-6 inline-flex items-center gap-2">
                        <span className={h.topic === "MLB" ? "text-red-400" : "text-city-violet"}>◆</span>
                        <span className="font-semibold text-foreground">{h.topic}</span>
                        <span className="max-w-[60ch] truncate">{h.title}</span>
                        <span className="text-muted-foreground/60">· {h.source}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Webring Card */}
          <div className="min-w-0 md:col-span-2">
            <div className="webring-card glass-panel relative h-full overflow-hidden rounded-2xl p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,hsl(var(--city-violet)/0.18),transparent_70%)]"
              />

              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-city-violet/15 text-city-violet">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Western Webring
                    </p>
                    <h3 className="font-display text-base font-semibold text-foreground">Explore student sites</h3>
                  </div>
                </div>
                <span className="rounded-full border border-primary/25 bg-primary/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                  Member
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

              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Hop between portfolios from fellow Western students. Click{" "}
                <span className="font-semibold text-foreground">[ ? ]</span> for a random adventure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WesternWebring;
